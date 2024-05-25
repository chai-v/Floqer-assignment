import React, { useState, useRef, useEffect } from "react"
import axios from "axios"

interface ChatMessage {
    sender: string;
    message: string;
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);


    const handleEnter = async (e: { key: string; }) => {
        if (e.key === 'Enter') {
            await handleSendMessage();
        };
    }

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            const chatMessage: ChatMessage = { sender: 'User', message };
            await setChatHistory(prevChatHistory => [...prevChatHistory, chatMessage]);
            setMessage('');
            setIsLoading(true);
        }
    
        axios.post('https://floqer-assignment-wmve.onrender.com/chatGA/query', { query: message })
            .then(response => {
                const replyMessage: ChatMessage = { sender: 'AI', message: response.data.response };
                setIsLoading(false);
                setChatHistory(prevChatHistory => [...prevChatHistory, replyMessage]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(()=>{
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    },[chatHistory, isLoading]);

    return(
        <div className="w-full h-screen flex flex-col p-2">
            <div ref={chatContainerRef} className="w-full h-[55%] bg-darkcream overflow-y-auto no-scrollbar mt-4 mb-4 p-2 rounded-md">
                    {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 ${msg.sender==='User' ? 'bg-white text-darkpurple' : 'bg-purple text-cream'} rounded shadow`}>
                        {msg.message}
                    </div>
                    ))}
                    {isLoading && <div className="mb-2 p-2 bg-purple rounded shadow">
                        <div className="animate-pulse opacity-70 flex flex-col gap-2">
                            <div className="h-2.5 bg-cream rounded-full w-[45%]"></div>
                            <div className="h-2 bg-cream rounded-full w-[75%]"></div>
                            <div className="h-2 bg-cream rounded-full w-[65%]"></div>
                            <div className="h-2 bg-cream rounded-full w-[70%]"></div>
                        </div>
                    </div>}
                </div>
            <div className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEnter}
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