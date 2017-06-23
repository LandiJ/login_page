const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
const app = express();
const port = process.env.PORT || 8000;

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
function checkAuth(req, res, next) {
  if (!req.session.userMaybe) {
    return res.redirect("/login");
  } else {
    next();
  }
}

var users = [{ username: "Alandryia", password: "dancer" }];

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/in", checkAuth, function(req, res) {
  res.render("index", { user: req.session.userMaybe });
});

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

app.post("/login", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    res.redirect("/login");
  }
  var userMaybe = req.body;
  var userIs;

  users.forEach(function(item) {
    if (item.username === userMaybe.username) {
      userIs = item;
    }
  });

  if (!userIs) {
    return res.redirect("/login");
  }

  if (userMaybe.password === userIs.password) {
    req.session.userMaybe = userIs;
    return res.redirect("/in");
  } else {
    return res.redirect("/login");
  }
});

app.listen(port, function() {
  console.log("Server is running on " + port);
});
