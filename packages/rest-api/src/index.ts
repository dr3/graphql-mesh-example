import express from "express";
import cors from "cors";
import swaggerRouter from "./routes/swagger";
import stationsRouter from "./routes/stations";
import journeysRouter from "./routes/journeys";
import basketsRouter from "./routes/baskets";

const port = process.env.PORT || 3001;
const app = express();

app.set("port", port);
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/swagger", swaggerRouter);
app.use("/stations", stationsRouter);
app.use("/search", journeysRouter);
app.use("/baskets", basketsRouter);

app.listen(app.get("port"), () => {
  console.log(`Rest API is running at http://localhost:${app.get("port")}`);
  console.log(`Swagger docs at http://localhost:${app.get("port")}/swagger`);
});
