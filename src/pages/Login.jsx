import { useState } from "react";
import "../App.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("userId", data.id);

        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Server error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">✨</div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">Sign in to manage your tasks</p>
        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            required
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            required
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <div className="forgot-row">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
