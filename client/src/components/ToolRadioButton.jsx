import React from 'react';

const ToolRadioButton = ({ tool, currentTool, setTool, children }) => {
  const isSelected = currentTool === tool;

  return (
    <div className="flex flex-row gap-1 items-center">
      <label
        className={`font-semibold ${isSelected ? 'text-green-500' : ''}`}
      >
        {children}
      </label>
      <input
        type="radio"
        name="tool"
        id={tool}
        value={tool}
        checked={isSelected}
        onChange={() => setTool(tool)}
      />
    </div>
  );
};

export default ToolRadioButton;
