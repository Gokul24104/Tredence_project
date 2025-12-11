export function validateWorkflow(nodes, edges) {
  const errors = [];

  // Convert edges into useful maps
  const incoming = {};
  const outgoing = {};

  nodes.forEach((n) => {
    incoming[n.id] = 0;
    outgoing[n.id] = 0;
  });

  edges.forEach((e) => {
    incoming[e.target] = (incoming[e.target] || 0) + 1;
    outgoing[e.source] = (outgoing[e.source] || 0) + 1;
  });

  // 1. Must have exactly one Start node
  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length !== 1) {
    errors.push("Workflow must contain exactly ONE Start Node.");
  }

  // 2. Must have exactly one End node
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length !== 1) {
    errors.push("Workflow must contain exactly ONE End Node.");
  }

  // 3. End node must not have outgoing edges
  endNodes.forEach((end) => {
    if (outgoing[end.id] > 0) {
      errors.push("End Node cannot have outgoing edges.");
    }
  });

  // 4. Every node except Start must have 1 incoming edge
  nodes.forEach((node) => {
    if (node.type !== "start" && incoming[node.id] === 0) {
      errors.push(`Node "${node.data.label}" must have an incoming connection.`);
    }
  });

  // 5. Start node must have outgoing edge
  startNodes.forEach((start) => {
    if (outgoing[start.id] === 0) {
      errors.push("Start Node must have at least one outgoing edge.");
    }
  });

  // 6. Detect cycles — using simple DFS
  function hasCycle() {
    const visited = {};
    const recStack = {};

    function dfs(nodeId) {
      if (!visited[nodeId]) {
        visited[nodeId] = true;
        recStack[nodeId] = true;

        const outgoingEdges = edges.filter((e) => e.source === nodeId);

        for (const edge of outgoingEdges) {
          if (!visited[edge.target] && dfs(edge.target)) return true;
          else if (recStack[edge.target]) return true;
        }
      }

      recStack[nodeId] = false;
      return false;
    }

    return nodes.some((n) => dfs(n.id));
  }

  if (hasCycle()) {
    errors.push("Workflow contains a cycle. Cycles are not allowed.");
  }

  // 7. No isolated nodes
  nodes.forEach((node) => {
    if (incoming[node.id] === 0 && outgoing[node.id] === 0) {
      errors.push(`Node "${node.data.label}" is isolated.`);
    }
  });

  return errors;
}
