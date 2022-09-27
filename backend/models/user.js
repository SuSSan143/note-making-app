const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notesId: {
    type: ObjectId,
    ref: "Note",
  },
});

module.exports = mongoose.model("User", UserSchema);
