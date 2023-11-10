const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const File = require("./models/File");

const app = express();
const multer = require("multer");
const upload = multer({ dest: "upload" });

app.use(express.urlencoded({ extended: true }));

const conneted = mongoose.connect(process.env.DATABASE_URL);
if (conneted) {
  console.log("DATAbase is Connected");
} else {
  console.log("lol");
}

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async function (req, res) {
  const Filedata = {
    path: req.file.path,
    orignalName: req.file.originalname,
  };
  if (req.body.password != null && req.body.password != "") {
    Filedata.password = await bcrypt.hash(req.body.password, 1); // 21 is just use a salt rounds to encrption it canb be anything and anytype
  }
  const file = await File.create(Filedata);
  res.render("index", { filelink: `${req.headers.origin}/file/${file.id}` });
});

app.route("/file/:id").get(handleDownload).post(handleDownload);

async function handleDownload(req, res) {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send("File not found");
    }

    if (file.password != null) {
      if (req.body.password == null) {
        res.render("password");
        return;
      }
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
    }

    file.download++;
    await file.save();
    console.log(file.download);
    res.download(file.path, file.orignalName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
}

app.listen(3000);
