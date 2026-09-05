import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const response = await fetch('/.auth/me')
    const data = await response.json()

    if (data.clientPrincipal) {
      setUser(data.clientPrincipal)
      loadTodos()
    }
  }

  async function loadTodos() {
    const response = await fetch('/api/todos')
    const data = await response.json()

    if (Array.isArray(data)) {
      setTodos(data)
    }
  }

  async function addTodo() {
    if (todo.trim() === '') return

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: todo
      })
    })

    const newTodo = await response.json()

    setTodos((currentTodos) => [
      ...currentTodos,
      newTodo
    ])

    setTodo('')
  }

  function startEditing(task) {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  async function updateTodo(id) {
    if (editTitle.trim() === '') return

    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: editTitle
      })
    })

    const updatedTodo = await response.json()

    setTodos(
      todos.map((task) =>
        task.id === id ? updatedTodo : task
      )
    )

    setEditingId(null)
    setEditTitle('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditTitle('')
  }

  async function toggleTodo(id, completed) {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: !completed
      })
    })

    const updatedTodo = await response.json()

    setTodos(
      todos.map((task) =>
        task.id === id ? updatedTodo : task
      )
    )
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })

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

  return (
    <div className="app">
      <div className="todo-container">

        <header className="app-header">
          <h1>My Todo App</h1>
          <p>Keep track of your tasks</p>
        </header>

        {user ? (
          <div className="auth-section">
            <div>
              <span className="welcome-label">Welcome</span>
              <span className="username">{user.userDetails}</span>
            </div>

            <a href="/.auth/logout" className="logout-button">
              Logout
            </a>
          </div>
        ) : (
          <div className="login-section">
            <p>Sign in to manage your tasks</p>

            <a href="/.auth/login/google" className="login-button">
              Login with Google
            </a>
          </div>
        )}

        {user && (
          <main className="todo-section">

            <div className="add-todo">
              <input
                type="text"
                value={todo}
                onChange={(event) => setTodo(event.target.value)}
                placeholder="Enter a task..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    addTodo()
                  }
                }}
              />

              <button onClick={addTodo} className="add-button">
                Add
              </button>
            </div>

            <div className="todo-count">
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
            </div>

            <ul className="todo-list">
              {todos.map((task) => (
                <li
                  key={task.id}
                  className={`todo-item ${task.completed ? 'completed' : ''}`}
                >
                  {editingId === task.id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) =>
                          setEditTitle(event.target.value)
                        }
                        autoFocus
                      />

                      <div className="action-buttons">
                        <button
                          onClick={() => updateTodo(task.id)}
                          className="save-button"
                        >
                          Update
                        </button>

                        <button
                          onClick={cancelEditing}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="todo-content">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            toggleTodo(
                              task.id,
                              task.completed
                            )
                          }
                        />

                        <div className="todo-details">
                          <div className="todo-title">
                            {task.title}
                          </div>

                          <div className="todo-date">
                            {formatDate(task.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="action-buttons">
                        <button
                          onClick={() => startEditing(task)}
                          className="edit-button"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTodo(task.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {todos.length === 0 && (
              <div className="empty-state">
                <p>No tasks yet</p>
                <span>Add your first task above.</span>
              </div>
            )}

          </main>
        )}

      </div>
    </div>
  )
}

export default App