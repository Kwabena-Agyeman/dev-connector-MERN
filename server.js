const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`);
});
