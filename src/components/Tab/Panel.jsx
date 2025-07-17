import React, { useState } from "react";

// header agora aceita ReactNode (ícone + texto)
export const TabPanel = ({ header, children }) => {
  return (
    <div className="custom-tab-panel">
      {children}
    </div>
  );
};

export const TabView = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const panels = React.Children.toArray(children).filter(
    (child) => child.type && child.type.name === "TabPanel"
  );

  return (
    <div className="custom-tabview">
      <div className="custom-tabview-header">
        {panels.map((panel, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`custom-tabview-btn${activeIndex === idx ? " active" : ""}`}
            type="button"
          >
            {panel.props.header}
          </button>
        ))}
      </div>
      <div className="custom-tabview-content">
        {panels[activeIndex]}
      </div>
    </div>
  );
};
