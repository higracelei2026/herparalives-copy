// Mock DashScope OpenAI-compatible endpoint for local E2E verification.
// Usage: node scripts/mock-dashscope.mjs [port]
// The dev server points at it via LLM_BASE_URL=http://127.0.0.1:8787/v1 DASHSCOPE_API_KEY=mock
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.argv[2] || 8787);
const delay = Number(process.env.MOCK_DELAY_MS || 0);
const root = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const fixture = (name) => JSON.parse(readFileSync(join(root, name), "utf8"));

const CHARACTER = fixture("character.json");
const SEASON = fixture("season.json");
const CHAPTER_2 = fixture("chapter-2.json");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const send = (status, body) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if (req.method === "GET" && url.pathname === "/v1/models") {
    return send(200, { object: "list", data: [{ id: "qwen-mock", object: "model" }] });
  }
  if (req.method !== "POST" || url.pathname !== "/v1/chat/completions") {
    return send(404, { error: { message: "not found" } });
  }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw);
  const user = body.messages?.find((message) => message.role === "user")?.content ?? "";
  let fixtureContent;
  if (user.includes("用户的处境原文")) fixtureContent = CHARACTER;
  else if (user.includes("整季大纲")) {
    // Chapter continuation: remap the chapter-2 fixture to the requested chapter
    // number so the same shape serves chapters 2..5. The route itself forces
    // chapterEnd and endsStory on the last node.
    const match = user.match(/第\s*(\d+)\s*章的节点/);
    const chapter = match ? Number(match[1]) : 2;
    fixtureContent = JSON.parse(JSON.stringify(CHAPTER_2), (key, value) => (key === "chapter" ? chapter : value));
  } else fixtureContent = SEASON;
  if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
  send(200, { choices: [{ message: { role: "assistant", content: JSON.stringify(fixtureContent) } }] });
});

server.listen(port, () => console.log(`mock dashscope listening on http://127.0.0.1:${port}/v1`));
