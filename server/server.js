import express from "express";
import cors from "cors";   // ✅ ADD THIS
import universityRoutes from "./routes/university.routes.js";
import abaccoRoutes from "./routes/abacco.routes.js";

const app = express();

// ✅ ENABLE CORS
app.use(
  cors({
    origin: "http://localhost:5174", // your frontend
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is live");
});
app.use("/api/universities", universityRoutes);
app.use("/api/abacco", abaccoRoutes);


app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});