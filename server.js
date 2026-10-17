// A tiny MCP server over stdio with one tool, "echo". No dependencies.
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin })
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n")
}
rl.on("line", (line) => {
  let req
  try {
    req = JSON.parse(line)
  } catch {
    return
  }
  if (req.id === undefined) return
  const ok = (result) => send({ jsonrpc: "2.0", id: req.id, result })
  if (req.method === "initialize") {
    ok({ protocolVersion: req.params.protocolVersion, capabilities: { tools: {} }, serverInfo: { name: "echo", version: "1.0.0" } })
  } else if (req.method === "tools/list") {
    ok({ tools: [{ name: "echo", description: "Echo the text back", inputSchema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] } }] })
  } else if (req.method === "tools/call") {
    ok({ content: [{ type: "text", text: "echo: " + ((req.params.arguments || {}).text || "") }] })
  } else if (req.method === "ping") {
    ok({})
  } else if (req.method === "resources/list") {
    ok({ resources: [] })
  } else if (req.method === "resources/templates/list") {
    ok({ resourceTemplates: [] })
  } else if (req.method === "prompts/list") {
    ok({ prompts: [] })
  } else {
    send({ jsonrpc: "2.0", id: req.id, error: { code: -32601, message: "Method not found" } })
  }
})
