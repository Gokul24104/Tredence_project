import React from "react";
import { Handle, Position } from "reactflow";

export default function EndNode({ data }) {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: "#ffcccc",
        border: "1px solid #ff0000",
        minWidth: "100px",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      🔴 End
      <div style={{ fontSize: "12px", marginTop: "5px" }}>
        {data.label || "End Node"}
      </div>

      <Handle type="target" position={Position.Left} />
    </div>
  );
}
