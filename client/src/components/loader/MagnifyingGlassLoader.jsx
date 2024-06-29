import React from "react";
import { MagnifyingGlass } from "react-loader-spinner";

const MagnifyingGlassLoader = ({ text }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <MagnifyingGlass
        visible={true}
        height="120"
        width="120"
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#e15b64"
      />
      <div className=" text-white font-semibold">{text}</div>
    </div>
  );
};

export default MagnifyingGlassLoader;
