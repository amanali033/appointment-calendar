import React from "react";

const statusStyles = {
  confirmed: { bgColor: "bg-green-500", textColor: "text-white" },
  completed: { bgColor: "bg-blue-500", textColor: "text-white" },
  canceled: { bgColor: "bg-red-500", textColor: "text-white" },
  "voice mail": { bgColor: "bg-gray-500", textColor: "text-white" },
  scheduled: { bgColor: "bg-lime-500", textColor: "text-white" },
};

const StatusBadge = ({ status }) => {
  const lowerCaseStatus = status.toLowerCase();
  const { bgColor, textColor } = statusStyles[lowerCaseStatus] || {
    bgColor: "bg-gray-500",
    textColor: "text-white",
  };

  return (
    <button
      className={`min-w-28 inline-flex items-center justify-center py-[2px] min-h-[24px] px-[10px] rounded-full text-sm font-medium ${bgColor} ${textColor} capitalize`}
    >
      <span style={{ lineHeight: 1 }}>{status}</span>
    </button>
  );
};

export default StatusBadge;
