const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./database/db");

// importing router
const userRouter = require("./routes/user");

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use("/", userRouter);

app.listen(app.get("port"), () => {
  sequelize
    .sync({ force: true })
    .then(() => {
      console.log("Conexión a DB establecida");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  console.log(`Server on port ${app.get("port")}`);
});
