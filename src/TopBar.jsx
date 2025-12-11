import { FiArrowLeft, FiArrowRight, FiPlay } from "react-icons/fi";
import "./TopBar.css";

export default function TopBar({ runSimulation, undo, redo }) {
  return (
    <div className="topbar">
      <button className="topbar-btn" onClick={undo} title="Undo (Ctrl+Z)">
        <FiArrowLeft size={18} />
        <span>Undo</span>
      </button>

      <button className="topbar-btn" onClick={redo} title="Redo (Ctrl+Shift+Z)">
        <FiArrowRight size={18} />
        <span>Redo</span>
      </button>

      <button className="topbar-btn run" onClick={runSimulation}>
        <FiPlay size={18} />
        <span>Test Workflow</span>
      </button>
    </div>
  );
}
