import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  label = "",
  name = "",
  required = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-gray-300 text-sm font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`
            w-full
            bg-[#111] 
            text-gray-200
            border
            border-gray-600
            rounded-2xl
            px-5
            py-3
            outline-none
            transition-all
            duration-300
            placeholder-gray-500
            focus:border-orange-400/80
            focus:ring-4
            focus:ring-orange-500/20
            ${className}
          `}
          {...props}
        />

        {/* Password Toggle Icon */}
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-200 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;