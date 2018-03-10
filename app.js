const $ = require("jquery")
const StitchClientFactory = require("mongodb-stitch").StitchClientFactory
const express = require("express")
const routes = require("./express/routes")
const https = require("http")
const path = require("path")
const bodyParser = require("body-parser")
let app = express()

// APP INITIALIZATION
app.set("port", process.env.PORT || 8080);
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "assests/")));

app.get("/", (req, res) => {
  res.sendFile("./client/login.html") // Login or index page
})
app.get("/my-lists", (req , res) => {
  res.sendFile("./client/dash.html") // Dashboard or my lists page
})
app.post("/add", (req, res) => {
  let entry = {
    title: req.body.title,
    body: req.body.body
  }
  addItem(entry)
})
app.post("/mark", (req, res) => {
  let item = req.body.item;
  markItem(item);
  res.send({
    "item": item
  })
})

http.createServer(app).listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});

