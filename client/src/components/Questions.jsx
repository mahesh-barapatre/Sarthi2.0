import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Questions = ({type , id}) => {

  const getQuestion = async () => {
    try {
      const data = await axios.get(`http://localhost:5000/images/${type}`);
      // console.log(data.data[0].url);
      setQues(data.data[0].url);
    } catch (error) {
      console.log('server error:'+ error.message);
    }
  }
  useEffect(()=>{
      getQuestion();
  },[])


  const [ques, setQues] = useState([]);

  const lc = [
    'https://i.pinimg.com/originals/4d/23/55/4d235549611bdc51e15f6e49486986e0.jpg',
    'https://i.pinimg.com/originals/c3/fd/94/c3fd94d3218e668cff25528a54dca319.jpg'
  ];
  const gfg = [
    'https://i.pinimg.com/originals/06/88/0d/06880d86d672bbc0ef65408531ec8d95.jpg',
    'https://i.pinimg.com/originals/d6/04/6c/d6046cfbacbd83261019993c647ee224.jpg'
  ];


  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const changeImg = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % lc.length);
  };

  return (
    <div id={id} className="bg-blue-200 sm:min-h-screen rounded-md shadow-lg w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-900 uppercase my-4">{id} potd</h1>
      <div className="relative w-full bg-blue-300 rounded-md shadow-md">
        <img
          src={
            ques === null ? 
            type === 'lc' ? lc[currentImageIndex] : gfg[currentImageIndex]
            :
            ques[currentImageIndex]
          }
          alt="Question"
          className="mx-auto rounded-md max-h-full object-contain"
        />
        <button
          onClick={changeImg}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Questions;


