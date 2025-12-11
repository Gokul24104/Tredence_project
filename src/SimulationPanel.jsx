import React from "react";
import { FiX, FiCheckCircle } from "react-icons/fi";
import "./SimulationPanel.css";

export default function SimulationPanel({ result, close }) {
  return (
    <div className="sim-panel">
      <div className="sim-header">
        <h3>Simulation Result</h3>
        <button className="close-btn" onClick={close}>
          <FiX size={18} />
        </button>
      </div>

      <div className="sim-content">
        {result.length === 0 ? (
          <p className="empty-msg">No steps returned.</p>
        ) : (
          <ul className="timeline">
            {result.map((step, i) => (
              <li key={i} className="timeline-item">
                <FiCheckCircle className="timeline-icon" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
