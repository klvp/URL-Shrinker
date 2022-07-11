/** @format */

const express = require("express");
const mongoose = require("mongoose");
const Urlshort = require("./models/urlshortner");
const app = express();

mongoose
  .connect("mongodb://localhost/URLShortner")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("MongoDB connection failure");
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.get("/", async (req, res) => {
  const shorturls = await Urlshort.find();
  res.render("index", { shorturls });
});

app.post("/shorturl", async (req, res) => {
  await Urlshort.create({ full: req.body.fullurl });
  res.redirect("/");
});

app.get("/:url", async (req, res) => {
  const short = await Urlshort.findOne({ short: req.params.url });
  if (short == null) return res.sendStatus(404);
  short.clicks += 1;
  short.save();

  res.redirect(short.full);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started on port 4000");
});
