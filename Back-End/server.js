require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);

// Routes (Mounting Routers)

app.use("/api/auth", authRoutes);

// connect to MangoDB

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
