const mongoose = require("mongoose");
const ListData = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  type: { type: String },
  genre: { type: String },
  content: { type: Array },
});
module.exports = mongoose.model("List", ListData);
