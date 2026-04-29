import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${import.meta.env.API}/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      },
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🔒</div>
        <h1>Reset Password</h1>

        <form onSubmit={submit}>
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
