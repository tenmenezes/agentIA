import cors from "@fastify/cors";
import Fastify from "fastify";
import { planRoutes } from "./routes/plan";

// iniciando as rotas
const app = Fastify({
  // pra logar no cmd/bash
  logger: true,
});

await app.register(cors, {
  origin: "*",
  methods: ["GET", "POST"],
});

//  carregando
app.get("/", (req, res) => {
  res.send("hello world");
});

// registrando
app.register(planRoutes);

// inicializando servidor
app
  .listen({ port: Number(process.env.PORT) || 3333, host: "0.0.0.0" })
  .then(() => {
    console.log("Server running on port 3333");
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
