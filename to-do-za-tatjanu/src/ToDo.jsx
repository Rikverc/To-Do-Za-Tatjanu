import React, {useState} from 'react';

function ToDo() {

  const [tasks, setTasks] = useState([])

  function handleAdd() {

    const task = {
      details: document.getElementById('task-name').value,
      date: document.getElementById('task-date').value
    }

    setTasks(t => [...t, task])
    document.getElementById('task-name').value = '';

  }

  function handleRemove(index) {

    setTasks(tasks.filter((e, i) => i !== index))
  }

  return (<div>
    <h2>To-Do List</h2>
    <ol> {tasks.map((e, i) => <li key={i} onClick={() => handleRemove(i)}>Task: {e.details}<p>Do it by {e.date}</p></li>)} </ol>
    <p>
      <input type='text' placeholder='Enter task' id='task-name'/>
      <input type='date' id='task-date'/>
      <button onClick={handleAdd}>Add</button>
    </p>
  </div>);
}

export default ToDo