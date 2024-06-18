import React, { useEffect, useState } from 'react'

function Notes({ socket }) {

    const [content, setContent] = useState('');

   useEffect(() => {
     socket.on('contentChange', (newContent) => {
            setContent(newContent);
        });

        return () => {
            socket.off('contentChange');
        };
    }, [socket]);

   const handleInputChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
            socket.emit('contentChange', newContent);
    };

   return (
    <div className="flex flex-col sm:flex-row h-screen">
    {/* Sidebar */}
    <div className="w-full sm:w-1/6 bg-blue-300 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>
      <nav className="flex flex-col space-y-2">
      </nav>
    </div>

    {/* Main Content */}
    <div id='notes' className="flex-1 bg-blue-100 border-l border-blue-300 p-4">
      <textarea
        className="notepad-content underline bg-blue-50 text-blue-900 w-full h-full p-4 resize-none outline-none font-mono"
        value={content}
        onChange={handleInputChange}
        placeholder="Start typing..."
        spellCheck={false}
      ></textarea>
    </div>
  </div>

  );
}

export default Notes
