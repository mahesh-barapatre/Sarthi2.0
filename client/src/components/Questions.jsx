import axios from "axios";
import React, { useEffect, useState } from "react";
import BlockLoader from "./loader/BlockLoader";
import { Icon } from "@iconify/react/dist/iconify.js";

const Questions = ({ type, id, server }) => {
  const getQuestion = async () => {
    try {
      const data = await axios.get(`http://localhost:5000/images/${type}`);
      // console.log(data.data[0].url);
      setQues(data.data[0].url);
      // setQues(null);
    } catch (error) {
      console.log("server error:" + error.message);
    }
  };
  useEffect(() => {
    getQuestion();
  }, []);

  const [ques, setQues] = useState([]);

  const lc = [
    "https://i.pinimg.com/originals/4d/23/55/4d235549611bdc51e15f6e49486986e0.jpg",
    "https://i.pinimg.com/originals/c3/fd/94/c3fd94d3218e668cff25528a54dca319.jpg",
  ];
  const gfg = [
    "https://i.pinimg.com/originals/06/88/0d/06880d86d672bbc0ef65408531ec8d95.jpg",
    "https://i.pinimg.com/originals/d6/04/6c/d6046cfbacbd83261019993c647ee224.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const changeImg = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % lc.length);
  };

  return (
    <div
      id={id}
      className="bg-blue-200 sm:min-h-screen rounded-md shadow-lg w-full flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold text-blue-900 uppercase my-4">
        {id} potd
      </h1>
      <div className="relative bg-blue-300 w-full rounded-md shadow-md">
        {!ques ? (
          <BlockLoader text={"server is starting! plz wait..."} />
        ) : (
          <>
            <img
              src={
                ques === null
                  ? type === "lc"
                    ? lc[currentImageIndex]
                    : gfg[currentImageIndex]
                  : ques[currentImageIndex]
              }
              alt="Question"
              className="mx-auto rounded-md max-h-full object-contain"
            />
            <button onClick={changeImg} className="absolute top-1/2 right-4">
              <Icon icon="icon-park:next" width={40} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Questions;
