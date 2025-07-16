import React from "react";

const Steps = ({ model }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      {model.map((item, idx) => (
        <React.Fragment key={item.label}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              style={{
                display: "inline-block",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: item.active ? "#17c1e8" : "#f5f5f5",
                color: item.active ? "#fff" : "#aaa",
                lineHeight: "32px",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              {idx + 1}
            </div>
            <div
              style={{
                color: item.active ? "#3a3a3a" : "#aaa",
                fontWeight: item.active ? "bold" : "normal",
              }}
            >
              {item.label}
            </div>
          </div>
          {idx < model.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: "#f5f5f5",
                margin: "0 8px",
                alignSelf: "center",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Steps;