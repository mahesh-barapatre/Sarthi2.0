import React, { useState } from 'react';

const Questions = () => {
  const imageUrls = [
    'https://wallpapers.com/images/featured/4k-oaax18kaapkokaro.jpg',
    'https://wallpapercave.com/wp/wp4626258.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const changeImg = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  return (
   <div className="bg-gray-100 h-screen p-4 rounded-md shadow-md relative w-full">
  <img
    src={imageUrls[currentImageIndex]}
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


