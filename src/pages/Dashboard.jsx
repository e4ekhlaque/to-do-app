import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = `${import.meta.env.API}/tasks`;

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editId, setEditId] = useState(null);
  const userName = localStorage.getItem("name") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitTask = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });

    setEditId(null);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await fetch(`${API}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    fetchTasks();
  };

  const editTask = (task) => {
    setEditId(task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("newest");
  };

  // Filter + Sort
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    result = result.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()),
    );

    if (status === "pending") {
      result = result.filter((task) => !task.completed);
    }

    if (status === "completed") {
      result = result.filter((task) => task.completed);
    }

    if (sort === "priority") {
      const order = {
        high: 1,
        medium: 2,
        low: 3,
      };

      result.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    if (sort === "dueDate") {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    if (sort === "newest") {
      result.reverse();
    }

    return result;
  }, [tasks, search, status, sort]);

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="app">
      <div className="user-box">
        <span className="welcome-text">Hi, {userName}</span>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="container">
        <div className="top-bar">
          <h1>✨ Todo Manager</h1>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <input
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">All</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>

          <button className="clear-filter" onClick={clearFilters}>
            Clear
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>Done: {stats.done}</span>
          <span>Pending: {stats.pending}</span>
        </div>

        {/* Form */}
        <form className="todo-form" onSubmit={submitTask}>
          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />

          <button>{editId ? "Update Task" : "Add Task"}</button>
        </form>

        {/* Tasks */}
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.priority} ${
                task.completed ? "completed" : ""
              }`}
            >
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <div className="meta">
                <span>{task.priority}</span>

                {task.dueDate && (
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>

              <div className="task-buttons">
                <button
                  className="complete"
                  onClick={() => toggleComplete(task)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>

                <button className="edit" onClick={() => editTask(task)}>
                  Edit
                </button>

                <button className="delete" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
