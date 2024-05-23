import React, { useState } from "react"
import axios from "axios"

interface ChatMessage {
    sender: string;
    message: string;
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            const chatMessage: ChatMessage = { sender: 'User', message };
            await setChatHistory(prevChatHistory => [...prevChatHistory, chatMessage]);
            setMessage('');
        }
    
        axios.post('https://floqer-assignment-wmve.onrender.com/genai', { query: message })
            .then(response => {
                const replyMessage: ChatMessage = { sender: 'AI', message: response.data.response };
                setChatHistory(prevChatHistory => [...prevChatHistory, replyMessage]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return(
        <div className="w-full h-screen flex flex-col p-2">
            <div className="w-full h-[55%] bg-darkcream overflow-y-auto mt-4 mb-4 p-2 rounded-md">
                    {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 ${msg.sender==='User' ? 'bg-white text-darkpurple' : 'bg-purple text-cream'} rounded shadow`}>
                        {msg.message}
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