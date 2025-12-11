export async function simulateWorkflow(workflow) {
  const { nodes, edges } = workflow;

  // simple mock execution based on order of nodes
  const ordered = nodes.sort((a, b) => a.position.x - b.position.x);

  const steps = ordered.map((node) => {
    switch (node.type) {
      case "start":
        return `Start: ${node.data.title || "Start"}`;
      case "task":
        return `Task: ${node.data.title}`;
      case "approval":
        return `Approval: ${node.data.title} (${node.data.approverRole})`;
      case "automation":
        return `Automation: ${node.data.action}`;
      case "end":
        return `End: ${node.data.endMessage}`;
      default:
        return "Unknown step";
    }
  });

  return { steps };
}
