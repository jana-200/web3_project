import { useState, SyntheticEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ArticleContextType } from "../../types";
import "./LoginPage.css";

const LoginPage = () => {
  const { loginUser, authenticatedUser, clearUser } = useOutletContext<ArticleContextType>();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await loginUser({ username, password });
      navigate("/");
    } catch (err) {
      console.error("LoginPage::error: ", err);
    }
  };

  const handleUsernameInputChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    setUsername(input.value);
  };

  const handlePasswordChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    setPassword(input.value);
  };

  if (authenticatedUser) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h2>Welcome Back, {authenticatedUser.username}!</h2>
            <p>You are already logged into The Vintage Tech Chronicle.</p>
            <div className="user-actions">
              <button onClick={() => navigate("/")} className="action-btn primary">
                Go to Homepage
              </button>
              <button onClick={() => clearUser()} className="action-btn secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                value={username}
                type="text"
                id="username"
                name="username"
                onChange={handleUsernameInputChange}
                required
                className="form-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                value={password}
                type="password"
                id="password"
                name="password"
                onChange={handlePasswordChange}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="login-footer">
            <p className="demo-credentials">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;