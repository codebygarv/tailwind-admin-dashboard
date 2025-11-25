import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const usersJson = localStorage.getItem("users") || "[]";
    const users = JSON.parse(usersJson);
    const found = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (found) {
      localStorage.setItem("auth_token", "fake-token");
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
        <p className="text-gray-400 mb-4 text-xs">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="text-sm py-2"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="text-sm py-2"
          />

          <Button text={"Login"} />
        </form>

        <div className="text-xs text-gray-400 mt-4 text-center">
          No account?{" "}
          <Link
            to="/register"
            className="text-orange-600 hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
