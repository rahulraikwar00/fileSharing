// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the file-sharing API" });
});

module.exports = router;
