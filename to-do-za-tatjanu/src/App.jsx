import ToDo from './ToDo.jsx'
import { useEffect } from 'react'
import axios from 'axios'

function App() {

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api")
    console.log(response.data.fruits)
  }

  useEffect(() => {
    fetchAPI();
  }, [])

  return (<>
    <ToDo/>
  </>)
}

export default App
