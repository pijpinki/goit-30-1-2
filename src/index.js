const express = require("express");
const morgan = require("morgan");
const path = require("path");
const config = require("../config");

const app = express();
const users = new Map();

app.use(morgan("tiny"));
app.use(express.urlencoded());

app.use("/app", express.static(path.join(__dirname, "public")));

app.get("/users", (req, res) => {
  res.send({
    users: Array.from(users.values())
  });
});

app.post("/users", (req, res) => {
  const { name, surname = "unknown" } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Bad params, missed name" });
  }

  const key = `${name}-${surname}`;

  if (users.has(key)) {
    return res.status(400).send({ message: "Bad params, users already exist" });
  }

  users.set(key, { name, surname });

  res.send("<h1>User was created</h1>");
});

app.use((req, res, next) => {
  res.send({ message: "page not found" });
});

app.listen(config.port, (err) => {
  if (err) {
    return console.error(err);
  }

  console.info("server started at port", config.port);
});
