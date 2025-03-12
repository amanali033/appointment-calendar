// FilterButtons.jsx
import React from "react";

const FilterButtons = ({ filters, selectedFilters, onFilterChange }) => {
  const handleClick = (filter) => {
    let newSelected;
    if (selectedFilters.includes(filter)) {
      // Remove filter if already selected
      newSelected = selectedFilters.filter((item) => item !== filter);
    } else {
      // Add filter if not selected
      newSelected = [filter];
    }
    onFilterChange(newSelected);
  };

  return (
    <div
      className="flex gap-2 sm:flex-wrap flex-nowrap whitespace-nowrap overflow-x-auto py-2.5"
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
      }}
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleClick(filter)}
          className={`capitalize cursor-pointer px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium border transition 
            ${
              selectedFilters.includes(filter)
                ? "bg-[#1D8567] text-white border-primary"
                : "border-[#e4e4e7] text-primary hover:bg-secondary-light"
            }`}
          style={{ scrollSnapAlign: "start" }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
