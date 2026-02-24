import app from "./app.js";

const PORT = process.env.API_PORT || 3002;

app.listen(PORT,"0.0.0.0", () => {
  console.log("Server running on port", PORT);
});

