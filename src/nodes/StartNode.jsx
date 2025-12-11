import React from "react";
import { Handle, Position } from "reactflow";

export default function StartNode({ data }) {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: "#d1ffd6",
        border: "1px solid #3bbf40",
        minWidth: "120px",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      🟢 Start
      <div style={{ fontSize: "12px", marginTop: "5px" }}>
        {data.label || "Start Node"}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#3bbf40" }}
      />
    </div>
  );
}
