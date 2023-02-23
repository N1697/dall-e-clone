import React from "react";
import { download } from "../assets";
import { downloadImage } from "../utils";

const Card = ({ _id, name, prompt, photo }) => {
  return (
    <div className="card rounded-xl group relative shadow-card hover:shadow-cardhover">
      <img
        src={photo}
        alt={prompt}
        className="w-full h-auto object-cover rounded-xl"
      />

      <div className="hidden group-hover:flex flex-col max-h-[94.5%] absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p className="text-[#666e75] text-md overflow-y-auto prompt">
          {prompt}
        </p>

        {/* Wrapper for avatar, name and download button */}
        <div className="mt-5 flex justify-between items-center gap-2">
          {/* Wrapper for avatar, name */}
          <div className="flex items-center gap-2">
            {/* Wrapper for avatar
              name[0]: the first letter of name
            */}
            <div className="w-7 h-7 rounded-full object-cover bg-white flex justify-center items-center text-black text-xs font-bold">
              {name[0]}
            </div>

            <p className="text-white text-sm">{name}</p>
          </div>

          <button
            type="button"
            onClick={() => downloadImage(_id, photo)}
            className="outline-none bg-transparent border-none"
          >
            <img
              src={download}
              alt="download"
              className="w-6 h-6 object-contain invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
