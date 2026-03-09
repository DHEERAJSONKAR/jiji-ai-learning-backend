import JijiAvatar from './JijiAvatar';
import ResourceCard from './ResourceCard';
import { User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-enter flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
          <User className="text-white w-5 h-5" />
        </div>
      ) : (
        <JijiAvatar />
      )}
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-5 py-3 ${
          isUser 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
            : 'glass-dark text-gray-100'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        
        {message.resources && message.resources.length > 0 && (
          <div className="mt-4 space-y-2 w-full">
            <p className="text-sm text-gray-400 mb-2">📚 Related Resources:</p>
            {message.resources.map((resource, idx) => (
              <ResourceCard key={idx} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
