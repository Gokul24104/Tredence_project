import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  startTransition,
} from "react";

import StartNode from "./nodes/StartNode";
import TaskNode from "./nodes/TaskNode";
import ApprovalNode from "./nodes/ApprovalNode";
import AutomationNode from "./nodes/AutomationNode";
import EndNode from "./nodes/EndNode";

import NodeEditor from "./NodeEditor";
import TopBar from "./TopBar";
import SimulationPanel from "./SimulationPanel";

import { simulateWorkflow } from "./api/simulate";
import { validateWorkflow } from "./utils/validateWorkflow";

import ReactFlow, {
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import "reactflow/dist/style.css";

// -------------------------
// FIX ERROR 002: memoize
// -------------------------
const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automation: AutomationNode,
  end: EndNode,
};

export default function Canvas() {
  const restoring = useRef(false);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const historyRef = useRef([{ nodes: [], edges: [] }]);
  const historyIndexRef = useRef(0);

  const [, forceUpdate] = useState(0);

  const [selectedNode, setSelectedNode] = useState(null);
  const [showSim, setShowSim] = useState(false);
  const [simResult, setSimResult] = useState([]);

  // -------------------------------
  // PUSH HISTORY (ref-based, safe)
  // -------------------------------
  const pushToHistory = (newNodes, newEdges) => {
    if (restoring.current) return;

    const snap = {
      nodes: JSON.parse(JSON.stringify(newNodes)),
      edges: JSON.parse(JSON.stringify(newEdges)),
    };

    const h = historyRef.current;
    const i = historyIndexRef.current;

    historyRef.current = [...h.slice(0, i + 1), snap];
    historyIndexRef.current = i + 1;
  };

  // -------------------------------
  // UNDO
  // -------------------------------
  const undo = () => {
    const i = historyIndexRef.current;
    if (i <= 0) return;

    const newIndex = i - 1;
    const snap = historyRef.current[newIndex];

    restoring.current = true;

    startTransition(() => {
      setNodes(snap.nodes);
      setEdges(snap.edges);

      historyIndexRef.current = newIndex;
      forceUpdate((x) => x + 1);
    });

    setTimeout(() => (restoring.current = false), 0);
  };

  // -------------------------------
  // REDO
  // -------------------------------
  const redo = () => {
    const h = historyRef.current;
    const i = historyIndexRef.current;

    if (i >= h.length - 1) return;

    const newIndex = i + 1;
    const snap = h[newIndex];

    restoring.current = true;

    startTransition(() => {
      setNodes(snap.nodes);
      setEdges(snap.edges);

      historyIndexRef.current = newIndex;
      forceUpdate((x) => x + 1);
    });

    setTimeout(() => (restoring.current = false), 0);
  };

  // -------------------------------
  // NODE CHANGE
  // -------------------------------
  const handleNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        pushToHistory(updated, edges);
        return updated;
      });
    },
    [edges]
  );

  // -------------------------------
  // EDGE CHANGE
  // -------------------------------
  const handleEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        pushToHistory(nodes, updated);
        return updated;
      });
    },
    [nodes]
  );

  // -------------------------------
  // CONNECT
  // -------------------------------
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updated = addEdge(params, eds);
        pushToHistory(nodes, updated);
        return updated;
      });
    },
    [nodes]
  );

  // -------------------------------
  // DROP NODE
  // -------------------------------
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = {
        x: event.clientX - 220,
        y: event.clientY - 40,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          title: "",
          description: "",
          assignee: "",
        },
      };

      setNodes((nds) => {
        const updated = [...nds, newNode];
        pushToHistory(updated, edges);
        return updated;
      });
    },
    [edges]
  );

  const onDragOver = useCallback((evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }, []);

  // -------------------------------
  // SIMULATION
  // -------------------------------
  const runSimulation = async () => {
    const errors = validateWorkflow(nodes, edges);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const result = await simulateWorkflow({ nodes, edges });
    setSimResult(result.steps);
    setShowSim(true);
  };

  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar undo={undo} redo={redo} runSimulation={runSimulation} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* LEFT: CANVAS */}
        <div style={{ flex: 1, position: "relative" }}>
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>

          {showSim && (
            <SimulationPanel
              result={simResult}
              close={() => setShowSim(false)}
            />
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <NodeEditor
          selectedNode={selectedNode}
          updateNodeData={(newData) => {
            setNodes((nds) => {
              const updated = nds.map((n) =>
                n.id === selectedNode.id
                  ? { ...n, data: { ...n.data, ...newData } }
                  : n
              );

              pushToHistory(updated, edges);
              return updated;
            });

            setSelectedNode((prev) =>
              prev ? { ...prev, data: { ...prev.data, ...newData } } : null
            );
          }}
        />
      </div>
    </div>
  );
}
