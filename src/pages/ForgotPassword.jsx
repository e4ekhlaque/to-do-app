import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_TODO}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await res.json().catch(() => ({
        message: "Server error",
      }));

      alert(data.message);
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Unable to connect to server");
      console.log(error);
    } finally {
      setLoading(false);
    }
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
            id="email"
            name="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
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
