import { useState, useEffect } from "react";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask.js";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const apiURL = 'http://localhost:5000/tasks'

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch(apiURL)
    const data = await res.json()

    return data
  }

  // Fetch Single Tasks
  const fetchTask = async (id) => {
    const res = await fetch(`${apiURL}/${id}`)
    const data = await res.json()

    return data
  }

  //Add Task
  const addTask = async (task) => {
    const res = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])
    //const id = tasks.length + 1;
    //const newTask = { id, ...task };
    //setTasks([...tasks, newTask]);

  }

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`${apiURL}/${id}`, { method: 'DELETE', })
    setTasks(tasks.filter((task) => task.id !== id));
  }

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToogle = await fetchTask(id)
    const updatedTask = {
      ...taskToToogle,
      reminder: !taskToToogle.reminder
    }

    const res = await fetch(`${apiURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()
    setTasks(tasks.map((task) => task.id === id ? {
      ...task,
      reminder: data.reminder
    } : task))
  }

  //Toggle Add
  const toggleAdd = () => {
    setShowAddTask(!showAddTask);
  }

  return (
    <div className="container">
      <Header onAdd={toggleAdd} showAdd={showAddTask} />
      {showAddTask ? <AddTask onAddTask={addTask} /> : ''}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No more tasks to show'}
    </div>
  );
}

export default App;
