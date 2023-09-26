const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxlength: 22, required: true },
  password: { type: String, required: true },
  adminkey: {
    type: String,
    enum: ["adminadmin"], // Allow only "adminadmin" as a valid value
    required: true, // Make it required since you want only this value
  },
});

module.exports = mongoose.model("User", UserSchema);
