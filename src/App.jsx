import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4, validate } from 'uuid';
import { stringify } from 'postcss';
import { data } from 'autoprefixer';

const App = () => {
  //Use States
  const [todo, setTodo] = useState("");
  // const [todos, setTodos] = useState([]);
  const [finished, setFinished] = useState(true);
  const [date, setDate] = useState("");
  const [todos,setTodos]=useState(()=>{
    const savedTasks=localStorage.getItem('todos');
    return savedTasks? 
    JSON.parse(savedTasks):[];
  })

  //Use Effects
  useEffect(() => {
    window.localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos]);

  useEffect(() => {
    const todoString = window.localStorage.getItem("todos");
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  // Functions

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isValidDate(date)) {
      alert("Please enter a valid date");
      return;
    }
    const formattedDate = formatDate(date);
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false, timestamp: formattedDate }]);
    setTodo("");
    setDate("");
  }

  const isValidDate = (dateString) => {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
    return inputDate >= currentDate;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'short', // "Mon", "Tue", etc.
      year: 'numeric',  // "2023"
      month: 'short',   // "Jan", "Feb", etc.
      day: 'numeric'    // "1", "2", etc.
    };
    return date.toLocaleDateString('en-US', options);
  }


  const handleChangeDates = (e) => {
    setDate(e.target.value)
  }

  const handleChange = (e) => {
    setTodo(e.target.value);
  }

  const handleCheckbox = (id) => {
    setTodos(todos.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(item => item.id !== id));
  }

  const handleEdit = (id) => {
    const itemToEdit = todos.find(item => item.id === id);
    setTodo(itemToEdit.todo);
    setDate(itemToEdit.timestamp);
    setTodos(todos.filter(item => item.id !== id));
  }

  return (
    <div>
      <Navbar />
      <div className="container p-5 min-h-[50vh] my-24 rounded-2xl flex flex-col items-center gap-5 opacity-95 bg-violet-100 w-[90%] md:w-[422px] mx-auto">
        <div className='flex flex-col gap-5'>
          <h1 className='text-3xl text-center font-bold'>iTask - Manage your todos at one place</h1>
          <h2 className='text-2xl font-bold'>Add a Task</h2>
          <form onSubmit={handleAdd} className='w-full flex flex-col gap-5'>
            <div className='flex w-full flex-col md:flex-row justify-center items-center gap-2'>
              <input onChange={handleChange} value={todo} className='w-[75%] rounded-full h-8 px-3' type="text" name="" id="" />
              <input onChange={handleChangeDates} value={date} className='w-[45%] rounded-full h-8 px-3' type="date" name="" id="" />
            </div>
            <button disabled={todo.length <= 3} className='bg-blue-800 text-white transition-all duration-200 cursor-pointer disabled:cursor-no-drop hover:bg-blue-700 rounded-3xl text-lg px-5'>Save</button>
          </form>
          <div className='flex gap-2'>
            <input checked={finished} onChange={() => setFinished(!finished)} type="checkbox" name="" id="" />show finished
          </div>
        </div>
        <div className='w-[90%] mx-auto h-[1px] bg-black opacity-50'></div>

        {/* my tasks */}

        <h2 className='text-xl font-bold w-full mb-3 text-left'>Your Tasks</h2>

        <div className='todos w-full'>
          {todos.length === 0 && <div className='mb-5'>No Todos to display</div>}
          {todos.map(item => (
            (finished || !item.isCompleted) && (
              <div key={item.id} className="todo py-1 w-full">
                <div className='flex flex-row  justify-between w-full'>
                  <div className={`flex justify-between w-[60%] ${item.isCompleted ? "line-through" : ""}`}>
                    <div className='flex gap-3'>
                      <input checked={item.isCompleted} onChange={() => handleCheckbox(item.id)} type="checkbox" name={item.id} id="" />
                      <span>{item.todo}</span>
                    </div>
                    <span className='text-sm text-gray-500'>{item.timestamp}</span>
                  </div>
                  <div className="buttons flex gap-3">
                    <button disabled={item.isCompleted} onClick={() => handleEdit(item.id)} className='bg-violet-800 disabled:cursor-no-drop hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                    <button onClick={() => handleDelete(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;
