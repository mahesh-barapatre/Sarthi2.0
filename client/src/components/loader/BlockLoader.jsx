import React from "react";
import { Blocks } from "react-loader-spinner";

const BlockLoader = ({ text }) => {
  return (
    <div className="flex flex-col items-center space-y-2 p-5 m-10">
      <Blocks
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
      <div className=" text-white font-semibold">{text}</div>
    </div>
  );
};

export default BlockLoader;
