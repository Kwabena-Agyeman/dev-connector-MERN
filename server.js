const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("Server running");
});

// Defining Routes

app.use("/api/users", require("./routes/api/Users"));
app.use("/api/auth", require("./routes/api/Auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`);
});
