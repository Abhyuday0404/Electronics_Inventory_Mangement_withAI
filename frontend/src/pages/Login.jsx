import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { InventoryBrand } from "../components/Layout";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(!onLogin(form.get("email").trim(), form.get("password")));
  }

  return (
    <main className="login-screen">
      <section className="login-intro">
        <InventoryBrand />
        <div><h1>Stock, orders, and sales in one workspace.</h1><p>Manage electronics inventory from purchase order to invoice.</p></div>
      </section>
      <section className="login-form-wrap" aria-labelledby="sign-in-heading">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 id="sign-in-heading">Sign in</h2>
          <p>Enter your credentials to open your inventory workspace.</p>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required />
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
          </div>
          {error && <p role="alert" className="login-error">The email address or password is incorrect.</p>}
          <button type="submit" className="workspace-button">Sign in</button>
          <p className="demo-hint">Demo access: <code>admin@gmail.com</code> / <code>admin</code></p>
        </form>
      </section>
    </main>
  );
}
