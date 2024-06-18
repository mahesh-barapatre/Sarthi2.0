import React, { useState, useRef } from "react";
import WhiteBoard from "./WhiteBoard";
import ToolRadioButton from "./ToolRadioButton";
import Button from "./Button";

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
    <div id="whiteboard" className="w-full bg-red-600 h-screen overflow-hidden flex flex-col">
  <div className="flex justify-between items-center border-gray-300 border-2 bg-gray-100 p-3 shadow-lg">
    <div className="flex flex-col gap-5 mx-5 xl:flex-row text-xl">
      <ToolRadioButton tool="pencil" currentTool={tool} setTool={setTool}>Pencil</ToolRadioButton>
      <ToolRadioButton tool="line" currentTool={tool} setTool={setTool}>Line</ToolRadioButton>
      <ToolRadioButton tool="rect" currentTool={tool} setTool={setTool}>Rectangle</ToolRadioButton>
    </div>
    <div className="flex items-center">
      <label className="mr-2">Select Color:</label>
      <input
        type="color"
        name="color"
        id="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
    <div className="flex ml-4 gap-3">
      <Button onClick={undo} className="bg-blue-500 text-white w-24 h-10 rounded-lg">Undo</Button>
      {/* <Button onClick={Redo} className="border border-blue-500 text-blue-500 w-24 h-10 rounded-lg">Redo</Button> */}
      <Button onClick={clearCanvas} className="bg-red-600 text-white w-32 h-10 rounded-lg">Clear Canvas</Button>
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
