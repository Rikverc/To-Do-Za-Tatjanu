import React, {useState, useEffect} from 'react';
import axios from 'axios';

function ToDo() {

  let response;

  const fetchAPI = async () => {
    response = await axios.get("http://localhost:8080/api/poslici")
    setTasks(response.data)
    console.log(response.data)
  }
  useEffect(() => {
    fetchAPI();
  }, [])

  const [tasks, setTasks] = useState([])

  async function handleAdd() {

    const task = {
      name: document.getElementById('task-name').value,
      datum: document.getElementById('task-date').value,
      vreme: document.getElementById('task-time').value
    }

    const odgovor = await axios.post("http://localhost:8080/api/poslici", task)

    setTasks(t => [...t, task])
    document.getElementById('task-name').value = '';

  }

  async function handleRemove(index) {

    const odgovor = await axios.delete(`http://localhost:8080/api/poslici/${index}`);
    console.log(odgovor)

    fetchAPI()

  }

  return (<div>
    <h2>To-Do List</h2>
    <ol> {tasks.map((e, i) => <li key={i} onClick={() => handleRemove(e._id)}>Task: {e.name}<p>Do it by {e.datum}, {e.vreme}</p></li>)} </ol>
    <p>
      <input type='text' placeholder='Enter task' id='task-name'/>
      <input type='date' id='task-date'/>
      <input type='time' id='task-time'/>
      <button onClick={handleAdd}>Add</button>
    </p>
  </div>);
}

export default ToDo