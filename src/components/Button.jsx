import React from "react";

const Button = ({text}) => {
  return (
    <button
      onClick={() => navigate("/create")}
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 transition-all duration-200 text-white px-4 py-2 rounded-md shadow-md hover:shadow-orange-500/30 w-[100%]"
    >
      <span className="text-sm font-medium text-center mx-auto">{text}</span>
    </button>
  );
};

export default Button;
