import React, { useState } from 'react';

const Questions = ({type , id}) => {
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
   <div id={id} className="bg-gray-100 h-screen p-4 rounded-md shadow-md relative w-full">
  <img
        // src={imageUrls[currentImageIndex]}
        src = {type === 'lc' ? lc[currentImageIndex] : gfg[currentImageIndex]}
    alt="Question"
    className="mx-auto rounded-md"
  />
  <button
    onClick={changeImg}
    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
  >
    {">"}
  </button>
</div>


  );
};

export default Questions;


