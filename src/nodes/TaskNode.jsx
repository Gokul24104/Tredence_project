import React from "react";
import { Handle, Position } from "reactflow";

export default function TaskNode({ data }) {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: "#fff9c4",
        border: "1px solid #ffeb3b",
        minWidth: "140px"
      }}
    >
      📝 <strong>{data.label || "Task"}</strong>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
