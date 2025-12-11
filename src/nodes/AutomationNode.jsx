import React from "react";
import { Handle, Position } from "reactflow";

export default function AutomationNode({ data }) {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: "#e1bee7",
        border: "1px solid #9c27b0",
        minWidth: "150px"
      }}
    >
      ⚙️ <strong>{data.label || "Automation"}</strong>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
