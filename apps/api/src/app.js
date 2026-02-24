import express from "express";
import routes from "./routes/index.js";
import usersRoutes from "./routes/users.routes.js";
import cors from "cors"

const app = express();
app.use(cors({ origin: 'https://buenex.github.io' }));

app.use(express.json());

// prefixo global da API
app.use("/v1", routes);

// healthcheck opcional
app.get("/", (_, res) => {
  res.send("API is running!");
});

app.use("/users", usersRoutes);

// erro global
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: "Internal server error, please contact the administrator!" });
});

export default app;
