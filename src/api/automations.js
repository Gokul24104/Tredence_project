export async function fetchAutomations() {
  // Simulated API delay
  await new Promise((res) => setTimeout(res, 300));

  return [
    {
      id: "send_email",
      label: "Send Email",
      params: ["to", "subject"],
    },
    {
      id: "generate_doc",
      label: "Generate Document",
      params: ["template", "recipient"],
    },
  ];
}
