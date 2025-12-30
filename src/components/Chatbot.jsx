import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Leadsplatter AI. How can I help you find better leads today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Call Node.js Backend
            const response = await fetch('http://localhost:3000/api/ai/chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMsg.text
                }),
            });

            if (!response.ok) {
                throw new Error("AI API failed");
            }

            const result = await response.json();
            const botText = result.response;

            const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("AI Error:", error);
            // Fallback for demo if API is overloaded or token is invalid
            setTimeout(() => {
                const fallbackMsg = { id: Date.now() + 1, text: "I'm currently experiencing high traffic (API Limitation). Try asking about 'Pricing' or 'Features'!", sender: 'bot' };
                setMessages(prev => [...prev, fallbackMsg]);
            }, 1000);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    className="chatbot-toggle"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bot size={20} />
                        <span style={{ fontWeight: 600 }}>Leadsplatter AI</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="close-btn">
                        <X size={18} />
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot">
                            <div className="message-bubble typing">
                                <span>●</span><span>●</span><span>●</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="submit" disabled={!inputText.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </>
    );
};

export default Chatbot;
