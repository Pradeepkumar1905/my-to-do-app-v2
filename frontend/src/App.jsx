import { useEffect, useState } from 'react'

function App() {
  // -----------------------------
  // State
  // -----------------------------

  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')


  // -----------------------------
  // Load Todos
  // -----------------------------

  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    const response = await fetch('http://localhost:7071/api/todos')
    const data = await response.json()

    setTodos(data)
  }


  // -----------------------------
  // Add Todo
  // -----------------------------

  async function addTodo() {
    if (todo.trim() === '') {
      return
    }

    const response = await fetch('http://localhost:7071/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: todo
      })
    })

    const newTodo = await response.json()

    setTodos([...todos, newTodo])
    setTodo('')
  }


  // -----------------------------
  // Start Editing
  // -----------------------------

  function startEditing(task) {
    setEditingId(task.id)
    setEditTitle(task.title)
  }


  // -----------------------------
  // Update Todo
  // -----------------------------

  async function updateTodo(id) {
    if (editTitle.trim() === '') {
      return
    }

    const response = await fetch(
      `http://localhost:7071/api/todos/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle
        })
      }
    )

    const updatedTodo = await response.json()

    setTodos(
      todos.map((task) =>
        task.id === id ? updatedTodo : task
      )
    )

    setEditingId(null)
    setEditTitle('')
  }


  // -----------------------------
  // Cancel Editing
  // -----------------------------

  function cancelEditing() {
    setEditingId(null)
    setEditTitle('')
  }


  // -----------------------------
  // Toggle Todo
  // -----------------------------

  async function toggleTodo(id, completed) {
    const response = await fetch(
      `http://localhost:7071/api/todos/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !completed
        })
      }
    )

    const updatedTodo = await response.json()

    setTodos(
      todos.map((task) =>
        task.id === id ? updatedTodo : task
      )
    )
  }


  // -----------------------------
  // Delete Todo
  // -----------------------------

  async function deleteTodo(id) {
    await fetch(
      `http://localhost:7071/api/todos/${id}`,
      {
        method: 'DELETE'
      }
    )

    setTodos(
      todos.filter((task) => task.id !== id)
    )
  }
  function formatDate(date) {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div>
      <h1>My Todo App</h1>

      <input
        type="text"
        value={todo}
        onChange={(event) => setTodo(event.target.value)}
        placeholder="Enter a task"
      />

      <button onClick={addTodo}>
        Add
      </button>

      <ul>
        {todos.map((task) => (
          <li key={task.id}>

            {editingId === task.id ? (

              // Editing mode
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(event.target.value)
                  }
                />

                <button onClick={() => updateTodo(task.id)}>
                  Update
                </button>

                <button onClick={cancelEditing}>
                  Cancel
                </button>
              </>

            ) : (

              // Normal mode
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTodo(task.id, task.completed)
                  }
                />

                <div>
                  <div
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </div>

                  <div>
                    {formatDate(task.createdAt)}
                  </div>
                </div>

                <button
                  onClick={() => startEditing(task)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTodo(task.id)}
                >
                  Delete
                </button>
              </>

            )}

          </li>
        ))}
      </ul>
    </div>
  )
}

export default App