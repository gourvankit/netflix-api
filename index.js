const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("../api/Routes/auth");
const userRoute = require("../api/Routes/user");
const movieRoute = require("../api/Routes/movies");
const listRoute = require("../api/Routes/lists");
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname, "/UI/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/UI", "index.html"));
});
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.listen(process.env.PORT || "8800", () => {
  console.log("Backend server running");
});
