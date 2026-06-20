import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 4000);
const app = createApp();

app.listen(port, () => {
  console.log("");
  console.log("Project-ready Express API is running.");
  console.log(`Health:   http://localhost:${port}/api/health`);
  console.log(`Projects: http://localhost:${port}/api/projects`);
  console.log("");
  console.log("Protected write routes require this header:");
  console.log(`  x-api-key: ${process.env.DEMO_API_KEY || "week6-demo-key"}`);
  console.log("");
});
