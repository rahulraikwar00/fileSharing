// routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const handleDownload = require("../utils/handleDownload"); // Import the handleDownload function

const multer = require("multer");
const upload = multer({ dest: "upload" });
const File = require("../models/File");

router.post("/upload", upload.single("file"), async function (req, res) {
  try {
    const Filedata = {
      path: req.file.path,
      originalName: req.file.originalname,
    };

    if (req.body.password != null && req.body.password !== "") {
      Filedata.password = await bcrypt.hash(req.body.password, 1);
    }

    // Assuming File is a model for working with your database
    const file = await File.create(Filedata);
    console.log(file);
    res.json({ filelink: `${req.headers.origin}/file/${file.id}` });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Internal Server Error");
  }
  // ... (same as before)
});

router.route("/file/:id").get(handleDownload).post(handleDownload);

module.exports = router;
