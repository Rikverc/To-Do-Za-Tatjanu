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
app.use(express.json()); // THIS IS CRUCIAL FOR AXIOS

// MongoDB Connection Setup
const uri = "mongodb+srv://stefan:fiser123@clustertatjana.4ovocbe.mongodb.net/Projekat?retryWrites=true&w=majority&appName=ClusterTatjana";
const client = new MongoClient(uri);

let db, collection;

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("Projekat");
    collection = db.collection("Poslici");
    
    // Initial data fetch
    const documents = await collection.find({}).toArray();
    console.log("Initial documents:", documents);
  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
}

// Routes
app.get("/api", (req, res) => {
  res.json({fruits: ['apple', 'banana', 'orange']});
});

app.post("/api/test", (req, res) => {
  console.log("Received test body:", req.body);
  res.json({ received: req.body });
});

app.get("/api/poslici", async (req, res) => {
  try {
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/poslici", async (req, res) => {
  try {
    if (!collection) throw new Error("Database not connected");
    
    console.log("Received task:", req.body); // Debug log
    const result = await collection.insertOne(req.body);
    
    res.json({
      success: true,
      insertedId: result.insertedId,
      data: req.body
    });
  } catch (e) {
    console.error("POST error:", e);
    res.status(500).json({
      success: false,
      error: e.message
    });
  }
});

app.delete("/api/poslici/:id", async (req, res) => {
  try {
    if (!collection) throw new Error("Database not connected");
    
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id) // Convert string ID to MongoDB ObjectId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Document not found" });
    }
    
    res.json({ 
      success: true,
      deletedCount: result.deletedCount
    });
    
  } catch (e) {
    console.error("Delete error:", e);
    res.status(500).json({
      success: false,
      error: e.message
    });
  }
});

// Start server and connect to MongoDB
app.listen(8080, async () => {
  console.log("Server started on port 8080");
  await connectToMongo();
});