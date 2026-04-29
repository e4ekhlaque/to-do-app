import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">📩</div>
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to receive reset link</p>

        <form onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p>
          Back to <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
