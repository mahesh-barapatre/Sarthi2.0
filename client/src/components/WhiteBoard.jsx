import React, { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const roughGen = rough.generator();

const WhiteBoard = ({
  canvasRef,
  elements,
  setElements,
  tool,
  color,
  socket,
  user,
  roomId,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rip, setRip] = useState(true); // If it true, then last update was true
  const ctxRef = useRef(null);
  const prevPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    socket.on("test", (data) => {
      if (data?.name === user) return;
      else {
        setRip(false);
        setElements(data?.pic);
      }
    });
  }, [socket, setElements, user]);

  useEffect(() => {
    const canvas = canvasRef.current;
    // canvas.height = window.innerHeight * 2;
    canvas.height = window.innerHeight * 0.7;
    canvas.width = window.innerWidth * 2;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, [color]);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  useEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    // Clear the canvas first
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGen.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            }
          )
        );
      } else if (element.type === "rect") {
        roughCanvas.draw(
          roughGen.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            }
          )
        );
      }
    });
    if (rip) {
      socket.emit("newData", {
        pic: elements,
        name: user,
        roomId: roomId,
      });
    }
  }, [elements, rip, roomId, socket, user]);

  const handleStartDrawing = (x, y) => {
    setRip(true);
    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          type: "pencil",
          path: [[x, y]],
          stroke: color,
        },
      ]);
    } else if (tool === "line" || tool === "rect") {
      prevPosRef.current = { x, y };
      setElements((prev) => [
        ...prev,
        {
          type: tool,
          offsetX: x,
          offsetY: y,
          width: x,
          height: y,
          stroke: color,
        },
      ]);
    }
    setIsDrawing(true);
  };

  const handleDrawing = (x, y) => {
    if (isDrawing) {
      if (tool === "pencil") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: [...ele.path, [x, y]],
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "line" || tool === "rect") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: x,
                height: y,
              };
            } else {
              return ele;
            }
          })
        );
      }
    }
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    handleStartDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    handleDrawing(offsetX, offsetY);
  };

  const handleMouseUp = () => {
    handleStopDrawing();
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const offsetX = touch.clientX;
    const offsetY = touch.clientY;
    handleStartDrawing(offsetX, offsetY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const offsetX = touch.clientX;
    const offsetY = touch.clientY;
    handleDrawing(offsetX, offsetY);
  };

  const handleTouchEnd = () => {
    handleStopDrawing();
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="h-[100%] w-[100%] overflow-hidden"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard;

