// Minimal runner: import the Express app from app.js and start the server.
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}/lsland.html`)
);
