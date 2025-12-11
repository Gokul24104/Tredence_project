import React from "react";
import { FiPlay, FiCheckSquare, FiUserCheck, FiCpu, FiSquare } from "react-icons/fi";
import "./Sidebar.css";

export default function Sidebar() {
  const nodeTypes = [
    { type: "start", label: "Start", icon: <FiPlay /> },
    { type: "task", label: "Task", icon: <FiCheckSquare /> },
    { type: "approval", label: "Approval", icon: <FiUserCheck /> },
    { type: "automation", label: "Automation", icon: <FiCpu /> },
    { type: "end", label: "End", icon: <FiSquare /> },
  ];

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="left-sidebar">
      <h3 className="sidebar-title">Workflow Nodes</h3>

      <div className="node-list">
        {nodeTypes.map((n) => (
          <div
            key={n.type}
            className="node-item"
            draggable
            onDragStart={(e) => onDragStart(e, n.type)}
          >
            <div className="node-icon">{n.icon}</div>
            <span>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
