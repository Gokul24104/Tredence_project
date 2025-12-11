import React, { useEffect, useState } from "react";
import { fetchAutomations } from "./api/automations";
import "./NodeEditor.css";

export default function NodeEditor({ selectedNode, updateNodeData }) {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    fetchAutomations().then(setAutomations);
  }, []);

  if (!selectedNode) {
    return (
      <div className="node-editor empty">
        <h2>No Node Selected</h2>
        <p>Click a node to edit its configuration.</p>
      </div>
    );
  }

  const { type, data } = selectedNode;

  return (
    <div className="node-editor">
      <div className="editor-header">
        <h2>{type.toUpperCase()} Node</h2>
      </div>

      <div className="editor-content">

        {/* ---------------- START NODE ---------------- */}
        {type === "start" && (
          <>
            <div className="editor-section">
              <label>Start Title</label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => updateNodeData({ title: e.target.value })}
              />
            </div>

            <div className="editor-section">
              <label>Metadata</label>

              {(data.metadata || []).map((pair, index) => (
                <div className="meta-row" key={index}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={pair.key}
                    onChange={(e) => {
                      const updated = [...data.metadata];
                      updated[index].key = e.target.value;
                      updateNodeData({ metadata: updated });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={pair.value}
                    onChange={(e) => {
                      const updated = [...data.metadata];
                      updated[index].value = e.target.value;
                      updateNodeData({ metadata: updated });
                    }}
                  />
                </div>
              ))}

              <button
                className="add-btn"
                onClick={() =>
                  updateNodeData({
                    metadata: [...(data.metadata || []), { key: "", value: "" }],
                  })
                }
              >
                + Add Metadata
              </button>
            </div>
          </>
        )}

        {/* ---------------- TASK NODE ---------------- */}
        {type === "task" && (
          <>
            <div className="editor-section">
              <label>Task Title</label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => updateNodeData({ title: e.target.value })}
              />
            </div>

            <div className="editor-section">
              <label>Description</label>
              <textarea
                value={data.description || ""}
                onChange={(e) => updateNodeData({ description: e.target.value })}
              />
            </div>

            <div className="editor-section">
              <label>Assignee</label>
              <input
                type="text"
                value={data.assignee || ""}
                onChange={(e) => updateNodeData({ assignee: e.target.value })}
              />
            </div>

            <div className="editor-section">
              <label>Due Date</label>
              <input
                type="date"
                value={data.dueDate || ""}
                onChange={(e) => updateNodeData({ dueDate: e.target.value })}
              />
            </div>

            <div className="editor-section">
              <label>Custom Fields</label>

              {(data.customFields || []).map((pair, index) => (
                <div className="meta-row" key={index}>
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={pair.key}
                    onChange={(e) => {
                      const updated = [...data.customFields];
                      updated[index].key = e.target.value;
                      updateNodeData({ customFields: updated });
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Value"
                    value={pair.value}
                    onChange={(e) => {
                      const updated = [...data.customFields];
                      updated[index].value = e.target.value;
                      updateNodeData({ customFields: updated });
                    }}
                  />
                </div>
              ))}

              <button
                className="add-btn"
                onClick={() =>
                  updateNodeData({
                    customFields: [
                      ...(data.customFields || []),
                      { key: "", value: "" },
                    ],
                  })
                }
              >
                + Add Field
              </button>
            </div>
          </>
        )}

        {/* ---------------- APPROVAL NODE ---------------- */}
        {type === "approval" && (
          <>
            <div className="editor-section">
              <label>Approval Title</label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => updateNodeData({ title: e.target.value })}
              />
            </div>

            <div className="editor-section">
              <label>Approver Role</label>
              <select
                value={data.approverRole || ""}
                onChange={(e) => updateNodeData({ approverRole: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>

            <div className="editor-section">
              <label>Auto-Approve Threshold</label>
              <input
                type="number"
                value={data.threshold || ""}
                onChange={(e) => updateNodeData({ threshold: e.target.value })}
              />
            </div>
          </>
        )}

        {/* ---------------- AUTOMATION NODE ---------------- */}
        {type === "automation" && (
          <>
            <div className="editor-section">
              <label>Automation Action</label>
              <select
                value={data.action || ""}
                onChange={(e) => {
                  const selected = automations.find(
                    (a) => a.id === e.target.value
                  );
                  updateNodeData({
                    action: e.target.value,
                    params: selected
                      ? selected.params.reduce((acc, key) => {
                          acc[key] = "";
                          return acc;
                        }, {})
                      : {},
                  });
                }}
              >
                <option value="">Select an action</option>
                {automations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {data.action && (
              <div className="editor-section">
                <label>Action Parameters</label>

                {Object.keys(data.params || {}).map((key) => (
                  <div key={key} className="editor-input-block">
                    <span>{key}</span>
                    <input
                      type="text"
                      value={data.params[key]}
                      onChange={(e) =>
                        updateNodeData({
                          params: {
                            ...data.params,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ---------------- END NODE ---------------- */}
        {type === "end" && (
          <>
            <div className="editor-section">
              <label>End Message</label>
              <input
                type="text"
                value={data.endMessage || ""}
                onChange={(e) => updateNodeData({ endMessage: e.target.value })}
              />
            </div>

            <div className="editor-section checkbox-row">
              <label>Show Summary</label>
              <input
                type="checkbox"
                checked={data.summary || false}
                onChange={(e) => updateNodeData({ summary: e.target.checked })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
