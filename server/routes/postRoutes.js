import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js";

dotenv.config();

//Utilize the keys to configure cloudinary to be able to upload images
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

//CREATE ROUTES
//Get All Posts Route
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({}); //Retrieve an array of all posts from the database

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//Create A Post Route
router.route("/").post(async (req, res) => {
  /*
  This is the best possible approach and the actual practice of
  how you'll be working with databases and file storage and creating
  new documents in your databases in real life applications.
  This approach is considered best practice as it avoids storing images
  in the database and instead uploads them to a cloud-based storage service
  like Cloudinary, which can handle storage and manipulation of images at scale.
  Storing images in the database can cause performance issues as the number of images increases.

  We didn't wanna take a shortcut and store images in base-64 url,
  that would be great for a couple of images but as we scale, we'll
  have to provide storage for all of those images. That's exactly why
  before creating a new instance of a document, we are uploading the image
  to cloudinary that stores it and gives us back a photo URL, based on
  that info, we then create a new post (document) in the collection in the database
  by only sharing the URL
  */
  try {
    //Get all of the data sent from the front-end
    const { name, prompt, photo } = req.body;

    //Upload the photo URL to the cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);
    //photoUrl: contains 'public_id, version, url' of the uploaded photo

    //Create new post in the database
    const newPost = await Post.create({
      //Create a new document in the Post collection in the database
      name,
      prompt,
      photo: photoUrl.url,
    });

    //Set status code to 201 (created successfully) and send it back to front-end
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

export default router;
