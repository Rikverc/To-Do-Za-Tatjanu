const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// MongoDB Connection Setup
const uri = "mongodb+srv://stefan:fiser123@clustertatjana.4ovocbe.mongodb.net/Projekat?retryWrites=true&w=majority&appName=ClusterTatjana";
const client = new MongoClient(uri);

let db, collection;
let isDBReady = false;

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("Projekat");
    collection = db.collection("Poslici");
    isDBReady = true;
    console.log("✅ MongoDB connected and ready");
    
    // Initial data fetch
    const documents = await collection.find({}).toArray();
    console.log("Initial documents:", documents.length, "items loaded");
  } catch (e) {
    console.error("❌ MongoDB connection error:", e);
    process.exit(1); // Exit if we can't connect to database
  }
}

// Database readiness middleware
app.use((req, res, next) => {
  if (!isDBReady) {
    return res.status(503).json({
      error: "Database is initializing",
      solution: "Please wait a moment and try again"
    });
  }
  next();
});

// Routes
app.get("/api", (req, res) => {
  res.json({ status: "API is working", database: isDBReady ? "connected" : "disconnected" });
});

app.get("/api/poslici", async (req, res) => {
  try {
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (e) {
    console.error("GET error:", e);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/api/poslici", async (req, res) => {
  try {
    console.log("Received task:", req.body);
    const result = await collection.insertOne(req.body);
    const insertedDoc = { ...req.body, _id: result.insertedId };
    
    res.json({
      success: true,
      data: insertedDoc
    });
  } catch (e) {
    console.error("POST error:", e);
    res.status(500).json({
      success: false,
      error: "Failed to create task"
    });
  }
});

app.delete("/api/poslici/:id", async (req, res) => {
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json({ 
      success: true,
      message: "Task deleted"
    });
    
  } catch (e) {
    console.error("DELETE error:", e);
    res.status(500).json({
      success: false,
      error: "Failed to delete task"
    });
  }
});

// Start the server
async function startServer() {
  try {
    await connectToMongo();
    app.listen(8080, () => {
      console.log("🚀 Server fully ready on http://localhost:8080");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});