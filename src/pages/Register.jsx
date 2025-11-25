import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = users.find((u) => u.email === formData.email);
    if (userExists) {
      alert("User already exists! Please login.");
      return;
    }

    users.push({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    navigate("/login");
  }

  return (
    <div className="max-w-sm mx-auto mt-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-white mb-1">Create Account</h2>
        <p className="text-gray-400 mb-4 text-xs">
          Join us by creating a new account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="text-sm py-2"
          />

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
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="text-sm py-2"
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="text-sm py-2"
          />

          <Button text={"Register"} />
        </form>

        <div className="text-xs text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-600 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
