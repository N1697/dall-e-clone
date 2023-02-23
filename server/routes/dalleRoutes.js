import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").get((req, res) => {
  res.send("Hello from DALL-E!");
});

//Add a real DALL-E route, the route that will make a call to the OpenAIapi
//and based on our prompt it will return a real AI generated image
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body; //This comes from the front-end side

    //Generate the image based on the prompt
    const aiResponse = await openai.createImage({
      prompt,
      n: 1, //meaning: 1 image
      size: "1024x1024",
      response_format: "b64_json",
    });

    //Get the image out of aiResponse
    const image = aiResponse.data.data[0].b64_json;

    //Set the status code of the response after having the image
    //and send the image back to the front-end side
    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);
    res.status(500).send(error?.response.data.error.message);
  }
});
export default router;
