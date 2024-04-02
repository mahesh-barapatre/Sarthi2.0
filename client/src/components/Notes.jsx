import React, { useEffect, useState } from 'react'

function Notes({ socket }) {

    const [content, setContent] = useState('');

   useEffect(() => {
     socket.on('contentChange', (newContent) => {
          console.log(newContent)
            setContent(newContent);
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('contentChange');
        };
    }, [socket]); // Include socket in the dependency array to ensure the effect runs when socket changes


   const handleInputChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);

            socket.emit('contentChange', newContent);
    };

   return (
    <div className="notepad">
      <textarea
        className="notepad-content"
        value={content}
        onChange={handleInputChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default Notes
