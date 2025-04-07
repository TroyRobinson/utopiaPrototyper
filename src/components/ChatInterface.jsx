import React, { useState, useRef, useEffect } from 'react';
import { FlexCol, FlexRow } from '../utils.jsx';
import { sendMessageToOpenRouter } from '../services/openRouterService';
import ReactAppRenderer from './ReactAppRenderer';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add an initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `# Welcome to the React App Generator

Ask me to create a React component and I'll generate the code for you! 

For example, you can ask:
- "Create a todo list app"
- "Make a weather widget"
- "Build a simple calculator"

The generated code will be displayed for you to copy and use in your own React projects.`
        }
      ]);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Create conversation history for context
      const conversationHistory = [
        {
          role: 'system',
          content: `You are a mini React application generator. When the user asks for something, respond with valid JSX for a small React application that addresses their request. 
          
          IMPORTANT FORMATTING REQUIREMENTS:
          1. NEVER include import statements - they will be handled automatically.
          2. Always define a NAMED FUNCTION COMPONENT such as "function TodoList()" or "function MiniApp()".
          3. Assume all React hooks (useState, useEffect, etc.) are already available.
          4. Make the component self-contained with any necessary state and styling.
          5. Format your response with a markdown code block using the jsx tag.
          
          Example of CORRECT format:
          \`\`\`jsx
          function MiniApp() {
            const [count, setCount] = useState(0);
            
            return (
              <div style={{padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
                <h3>Counter App</h3>
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>Increment</button>
              </div>
            );
          }
          \`\`\`
          
          Do not include any explanations or text outside the code block. Only provide the component code.`
        },
        ...messages.filter(m => m.role !== 'assistant' || !m.content.includes('Welcome to the React App Generator')),
        userMessage
      ];
      
      const response = await sendMessageToOpenRouter(conversationHistory);
      const assistantMessage = response.choices[0].message;
      
      // Clean the response if needed
      if (assistantMessage && assistantMessage.content) {
        // If response doesn't have markdown code blocks, try to wrap it
        if (!assistantMessage.content.includes('```')) {
          assistantMessage.content = '```jsx\n' + assistantMessage.content + '\n```';
        }
      }
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}. Please check your OpenRouter API key and try again.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexCol style={{ width: '100%', height: '100%', padding: '20px' }}>
      <FlexCol 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          gap: '16px',
          marginBottom: '20px',
          padding: '10px'
        }}
      >
        {messages.map((message, index) => (
          <FlexCol
            key={index}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: message.role === 'user' ? '80%' : '100%',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: message.role === 'user' ? '#007bff' : '#f1f1f1',
              color: message.role === 'user' ? 'white' : 'black',
            }}
          >
            {message.role === 'assistant' && message.content.includes('```') ? (
              <ReactAppRenderer code={message.content} />
            ) : (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: message.content
                    .replace(/# (.*?)\n/g, '<h3>$1</h3>')
                    .replace(/\n/g, '<br/>') 
                }}
              />
            )}
          </FlexCol>
        ))}
        {loading && (
          <FlexRow style={{ alignSelf: 'flex-start', gap: '4px', padding: '12px' }}>
            <div className="dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0s', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#999' }}></div>
            <div className="dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#999' }}></div>
            <div className="dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#999' }}></div>
          </FlexRow>
        )}
        <div ref={messagesEndRef} />
      </FlexCol>
      <FlexRow style={{ gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me to create a mini React app..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '24px',
            border: '1px solid #ddd',
            fontSize: '16px',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: '24px',
            backgroundColor: loading || !input.trim() ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </FlexRow>
    </FlexCol>
  );
};

export default ChatInterface; 