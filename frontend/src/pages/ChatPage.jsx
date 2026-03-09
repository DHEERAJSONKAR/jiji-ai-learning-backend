import { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import JijiAvatar from '../components/JijiAvatar';
import { askJiji } from '../services/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (query) => {
    // Add user message
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askJiji(query);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data?.answer || response.answer || "I'm here to help! What would you like to learn?",
        resources: response.data?.resources || response.resources || []
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: "Oops! Something went wrong. Please make sure the backend server is running on port 3000."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-dark border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <JijiAvatar size="md" />
          <div>
            <h1 className="text-xl font-bold gradient-text">Jiji AI</h1>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Zap className="w-3 h-3 text-green-400" />
              Your Learning Companion
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <JijiAvatar size="lg" />
              <h2 className="text-2xl font-bold text-white mt-6 mb-2">
                Hi! I'm <span className="gradient-text">Jiji</span> ✨
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Your AI learning companion. Ask me anything about programming, technology, or any topic you want to learn!
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {[
                  "Explain JavaScript closures",
                  "How does React work?",
                  "Learn Python basics",
                  "What is machine learning?"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="glass rounded-xl px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4 inline mr-2 text-purple-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4">
              <JijiAvatar />
              <div className="glass-dark rounded-2xl">
                <TypingIndicator />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="glass-dark border-t border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isLoading} />
          <p className="text-center text-gray-500 text-xs mt-2">
            Jiji uses AI to help you learn. Responses may not always be accurate.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
