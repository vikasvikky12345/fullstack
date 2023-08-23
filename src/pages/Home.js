import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [form, setForm] = useState({});
  const [title, setTitle] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://localhost:8080/demo', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    setForm({});
    getLists();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://localhost:8080/demo/${editTask._id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    setEditTask(null);
    setForm({});
    getLists();
  };

  const handleDelete = async (taskId) => {
    const response = await fetch(`https://localhost:8080/demo/${taskId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    console.log(data);
    getLists();
  };

  const handleCompleted = (task) => {
    const updatedTitle = title.filter((t) => t._id !== task._id);
    setCompletedTasks([...completedTasks, task]);
    setTitle(updatedTitle);
    setEditTask(null);
  };

  const getLists = async () => {
    const response = await fetch('https://localhost:8080/demo', {
      method: 'GET'
    });
    const data = await response.json();
    setTitle(data);
  };

  useEffect(() => {
    getLists();
  }, []);

  return (
    <div className="home-container">
      <form onSubmit={handleSubmit} className="task-form">
        <label>title</label>
        <input type="text" name="title" value={form.title || ''} onChange={handleForm}></input>
        <label>description</label>
        <input type="text" name="description" value={form.description || ''} onChange={handleForm}></input>
        <input type="submit" value="Add Task"></input>
      </form>
      <div className="tasks-container">
        <div className="active-tasks">
          <h2>Active Tasks</h2>
          <ul>
            {title.map((list) => (
              <li key={list._id} className="task">
                <span>{list.title}</span>
                <span>{list.description}</span>
                <div className="task-buttons">
                  <button onClick={() => handleEdit(list)}>Edit</button>
                  <button onClick={() => handleDelete(list._id)}>Delete</button>
                  <button onClick={() => handleCompleted(list)}>Completed</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="completed-tasks">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((completedTask) => (
              <li key={completedTask._id} className="task completed">
                <span>{completedTask.title}</span>
                <span>{completedTask.description}</span>
                <button onClick={() => handleDelete(completedTask._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {editTask && (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <label>Edit title</label>
          <input type="text" name="title" value={form.title || ''} onChange={handleForm}></input>
          <label>Edit description</label>
          <input type="text" name="description" value={form.description || ''} onChange={handleForm}></input>
          <button type="submit">Save Edit</button>
        </form>
      )}
    </div>
  );
}

export default Home;
