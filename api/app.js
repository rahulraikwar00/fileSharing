const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index"); // Import the index router
const fileRouter = require("./routes/fileRoutes"); // Import the file router

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "jade"); // Set the view engine to "pug"
app.set("views", path.join(__dirname, "views")); //

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database is Connected");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error.message);
  });

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(morgan('dev')); // Logging middleware

app.use("/", indexRouter); // Use the index router
app.use("/", fileRouter); // Use the file router

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] Server is running in ${ENVIRONMENT} mode on port ${PORT}`);
});
