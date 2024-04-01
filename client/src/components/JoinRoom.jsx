import React, { useState, useRef } from "react";
import WhiteBoard from "./WhiteBoard";

const JoinRoom = ({socket,user,roomId}) => {
  const [tool, setTool] = useState("");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const undo = () => {
    if (elements.length > 1) {
      setHistory((prev) => [...prev, elements[elements.length - 1]]);
      const newitem = elements;
      newitem.pop();
      setElements([...newitem]);
    }
  };

  const Redo = () => {
    console.log(history);

    if (history.length >= 1) {
        console.log('Entered');
      setElements((prev) => [...prev, history[history.length - 1]]);
      const newitem = history;
      newitem.pop();
      if(newitem.length){
          setHistory([...newitem]);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
  };

  return (
    <div className="w-full h-screen max-h-[100%]">
      <div className="text-center  font-bold mt-10 text-3xl font-serif">
        White Board Sharing App
      </div>
      <div className="flex flex-row justify-between items-center mt-10 mx-10">
        <div className={`flex flex-col gap-5 mx-5 xl:flex-row  text-xl `}>
          <div className="flex flex-row gap-1">
            <label
              className={`${
                tool === "pencil" && "font-extrabold  !text-green-500"
              }`}
            >
              Pencil
            </label>
            <input
              type="radio"
              name="tool"
              id="pencil"
              value="pencil"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-1">
            <label
              className={`${
                tool === "line" && "font-extrabold  !text-green-500"
              }`}
            >
              Line
            </label>
            <input
              type="radio"
              name="tool"
              id="line"
              value="line"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-1">
            <label
              className={`${
                tool === "rect" && "font-extrabold !text-green-500"
              }`}
            >
              Rectangle
            </label>
            <input
              type="radio"
              name="tool"
              id="rect"
              value="rect"
              onChange={(e) => setTool(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-center items-center ">
          <label className={``}>Select Color:</label>
          <input
            type="color"
            name="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="flex flex-row ml-4 gap-3">
          <button
            onClick={undo}
            className="bg-blue-500 w-[60px] text-white rounded-lg h-[40px] "
          >
            Undo
          </button>
          <button onClick={Redo} className="w-[60px] text-blue-500 rounded-lg h-[40px] border-blue-500 border-2 ">
            Redo
          </button>
        </div>
        <div>
          <button
            onClick={clearCanvas}
            className="w-[120px] bg-red-600 text-white h-[40px] rounded-lg mr-2"
          >
            Clear Canvas
          </button>
        </div>
      </div>
      <div className="w-[90%] mx-auto  h-[530px] mt-10 border-2 border-black">
        <WhiteBoard
          socket={socket}
          user={user}
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
          roomId={roomId}
          className="border-2 border-black"
        />
      </div>
    </div>
  );
};

export default JoinRoom;
