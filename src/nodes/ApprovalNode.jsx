import React from "react";
import { Handle, Position } from "reactflow";

export default function ApprovalNode({ data }) {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: "#bbdefb",
        border: "1px solid #2196f3",
        minWidth: "140px"
      }}
    >
      ✔️ <strong>{data.label || "Approval"}</strong>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
