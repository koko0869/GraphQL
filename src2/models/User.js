import mongoose from "mongoose";

//기본적인 DAO 작성
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  }
});
export default mongoose.model("user", UserSchema);
