require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");


const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Routes  
app.use("/api/auth", require("./routes/authroutes"));

// Home
app.get("/", (req, res) => {
    res.send("API running");
});

// Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
