import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  userId: String,
  completed: Boolean,
  createdAt : Date,
}, {
  timstamps: true
} as any);

const Todo = mongoose.model("todo", TodoSchema);

export default Todo;