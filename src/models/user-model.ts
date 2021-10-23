import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  googleId: String,
  profileImageUrl: String,
  emailId:String,
});

const User = mongoose.model("user", userSchema);

export interface UserInterface {
  name: String,
  googleId: String,
  profileImageUrl: String,
  emailId:String,
}

export default User;