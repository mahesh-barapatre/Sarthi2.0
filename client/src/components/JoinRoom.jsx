import React, { useState, useRef } from "react";
import WhiteBoard from "./WhiteBoard";
import ToolRadioButton from "./ToolRadioButton";
import Button from "./Button";
import { Icon } from "@iconify/react/dist/iconify.js";

const JoinRoom = ({ socket, user, roomId }) => {
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
      console.log("Entered");
      setElements((prev) => [...prev, history[history.length - 1]]);
      const newitem = history;
      newitem.pop();
      if (newitem.length) {
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
    <div
      id="whiteboard"
      className="w-full bg-red-600 h-screen overflow-hidden flex flex-col"
    >
      <div className="flex sm:flex-row flex-col space-y-2 justify-between items-center border-gray-300 border-2 bg-gray-100 p-3 shadow-lg">
        <div className="flex gap-5 mx-5 xl:flex-row text-xl">
          <ToolRadioButton tool="pencil" currentTool={tool} setTool={setTool}>
            Pencil
            <Icon icon="ion:pencil-sharp" width={20} />
          </ToolRadioButton>
          <ToolRadioButton tool="line" currentTool={tool} setTool={setTool}>
            Line
            <Icon icon="uil:line-alt" width={20} />
          </ToolRadioButton>
          <ToolRadioButton tool="rect" currentTool={tool} setTool={setTool}>
            Rectangle
            <Icon icon="material-symbols:rectangle-outline" width={20} />
          </ToolRadioButton>
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-sm font-bold">Select Color:</label>
          <div className="overflow-hidden w-7 h-5">
            <input
              type="color"
              name="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="flex ml-4 gap-3">
          <button
            onClick={undo}
            className="font-bold bg-blue-500 hover:bg-blue-600 p-1 text-white rounded"
          >
            Undo
          </button>
          {/* <Button onClick={Redo} className="border border-blue-500 text-blue-500 w-24 h-10 rounded-lg">Redo</Button> */}
          <button
            onClick={clearCanvas}
            className="font-bold bg-red-500 hover:bg-red-600 p-1 text-white rounded"
          >
            Clear Canvas
          </button>
        </div>
      </div>
      <div className="">
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
          className=""
        />
      </div>
    </div>
  );
};

export default JoinRoom;
