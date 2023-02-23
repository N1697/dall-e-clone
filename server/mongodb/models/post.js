import mongoose from "mongoose";

//Create a schema (a blueprint for how data stored in MongoDB database)
const Post = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});

//Create a model from the schema
const PostSchema = mongoose.model("Post", Post); //model("name", schema)

export default PostSchema;
