import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate(); //Navigate back to the home page once the post is created
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false); //Used when making contact with API and while waiting to get back the image
  const [loading, setLoading] = useState(false);

  //FUNCTIONS
  const generateImage = async () => {
    //Make a call to the back-end by checking if we have a 'prompt'
    if (form.prompt) {
      try {
        //Set the generatingImg state to true 'cuz we have started the generation
        setGeneratingImg(true);

        //Then, get back our response
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });

        //Parse the response data to be able to see it and set it to the state
        const data = await response.json(); //data is 'photo' received back from the back-end
        /*
        The data variable contains the parsed JSON data, which is an object
        that includes a photo property. The value of this photo property is
        a base64 encoded string that represents an image.
        */
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        /*
        Update photo property of the form object to include the base64 encoded image data.
        This allows the image to be displayed in the UI using an <img> tag with a src attribute set to the photo value.
        By including the data:image/jpeg;base64, prefix to the base64 encoded image data, the browser knows that the string
        represents an image and should be rendered as such.
        */
      } catch (error) {
        alert(error);
      } finally {
        //Whatever happens, we set generatingImg state to false
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); //Ensure the broswer doesn't automatically reload the application

    //Check if we have the form and the photo before we submit
    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        //Call the post image route
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        await response.json();
        navigate("/"); //Go back to Home to be able to see the image
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate an image!");
    }
  };

  const handleChange = (event) => {
    setForm((prevForm) => {
      return {
        ...prevForm,
        [event.target.name]: event.target.value,
      };
    });
  };

  //This function calls our utility function to ensure that we always get a new prompt
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm((prevForm) => {
      return {
        ...prevForm,
        prompt: randomPrompt, //Override the value of the prev prompt
      };
    });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Create imaginative and visually stunning images through DALL-E AI and
          share them with the community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="an armchair in the shape of an avocado"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          {/* Create a place where an AI generated image will be shown, but also,
          we will show the preview of the image in case it hasn't been already generated */}
          <div className="relative border bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 h-64 p-3 flex justify-center items-center">
            {form.photo ? (
              //If we have the photo, render it
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              //Else, render a substitute photo
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-contain opacity-40"
              />
            )}

            {generatingImg && (
              //If the image is generating (loading), render the Loader
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-[#0e1111] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can share it with
            others in the community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#0e1111] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
