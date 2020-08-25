const express = require("express");
const morgan = require("morgan");
const path = require("path");
const usersRouter = require("./routers/users");
const config = require("../config");

const app = express();
const users = new Map();

app.use(morgan("tiny"));
app.use(express.urlencoded());

app.use("/app", express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);

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

  users.set(`${name}-${surname}`, { name, surname });

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
