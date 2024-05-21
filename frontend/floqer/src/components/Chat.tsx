import React, { useState } from "react"

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
        setChatHistory([...chatHistory, message]);
        setMessage('');
        }
    };

    return(
        <div className="w-full h-screen flex flex-col p-2">
            <div className="w-full h-[55%] bg-darkcream overflow-y-auto mt-4 mb-4 p-2 rounded-md">
                    {chatHistory.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded shadow">
                        {msg}
                    </div>
                    ))}
                </div>
            <div className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 rounded-md bg-darkcream"
                placeholder="Type your message..."
            />
            <button
            onClick={handleSendMessage}
            className="bg-purple text-cream p-2 rounded-md"
            >
            Send
            </button>
            </div>
        </div>
    )
}

export default Chat;