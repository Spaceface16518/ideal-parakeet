const $ = require("jquery")
const StitchClientPromise = require("mongodb-stitch").StitchClientFactory.create(process.env.APP_ID)
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
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "assests/")));

app.get("/", (req, res) => {
  res.sendFile("./client/login.html") // Login or index page
})
app.get("/my-lists", (req, res) => {
  res.sendFile("./client/dash.html") // Dashboard or my lists page
})
app.get("/load", (req, res) => {
  let q = req.query;
  let usr = q.usr;
  // Other fields go here
  let items = getItems(usr)
  res.json({
    items: items
  })
})
app.post("/add", (req, res) => {
  let entry = {
    id: req.query.id,
    title: req.query.title,
    body: req.query.body
  }
  addItem(entry)
})
app.post("/done", (req, res) => {
  let item = req.body.item;
  markItem(item);
  res.json({
    "item": item
  })
})


http.createServer(app).listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});

// FUNCTIONS
function getItems(username) {
  stitchClientPromise.then(stitchClient => {
    let db = stitchClient.service("mongodb", mongodbService).db("Lists");
    let list = db.collection(process.env.COLLECTION);
    list.find({
      owner_id: this.stitchClient.authedId()
    }).execute().then(data => {
      return data;
    })
  })
}

function addItem(item) {
  stitchClientPromise.then(stitchClient => {
    let db = stitchClient.service("mongodb", mongodbService).db("Lists");
    let list = db.collection(process.env.COLLECTION);
    list.insertOne({
      body: item.body,
      timestamp: new Date(),
      owner_id: this.stitchClient.authedId(),
      status: true,
      id: item.id
    })
  })
}

function markItemDone(id) {
  stitchClientPromise.then(stitchClient => {
    let db = stitchClient.service("mongodb", mongodbService).db("Lists");
    let list = db.collection(process.env.COLLECTION);
    list
      .updateOne({id: id}, { $set: {status: false}})
  });
}

function markItemTodo(id) {
    stitchClientPromise.then(stitchClient => {
      let db = stitchClient.service("mongodb", mongodbService).db("Lists");
      let list = db.collection(process.env.COLLECTION);
      list.updateOne({ id: id }, { $set: { status: true } });
    });
}