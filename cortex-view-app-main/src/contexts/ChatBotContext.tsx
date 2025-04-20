import React, { createContext, useContext, useEffect, useState } from "react";

// Define message type
export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Define API key type
export interface GeminiConfig {
  apiKey: string;
  isConfigured: boolean;
}

// Define context type
interface ChatBotContextType {
  messages: Message[];
  addMessage: (text: string, isBot: boolean) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  hasUnreadMessages: boolean;
  setHasUnreadMessages: React.Dispatch<React.SetStateAction<boolean>>;
  clearMessages: () => void;
  geminiConfig: GeminiConfig;
  setGeminiAPIKey: (apiKey: string) => void;
}

// Create context
const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

// Provider component
export const ChatBotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Dranzer, an AI assistant specialized in brain tumor information. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>({
    apiKey: "",
    isConfigured: false,
  });

  // Load messages from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }

    // Load API key from local storage if available
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) {
      setGeminiConfig({
        apiKey: savedApiKey,
        isConfigured: true,
      });
    }
  }, []);

  // Save messages to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Add a new message
  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (isBot && !isOpen) {
      setHasUnreadMessages(true);
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm Dranzer, an AI assistant specialized in brain tumor information. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    localStorage.removeItem("chatMessages");
  };

  // Set Gemini API key
  const setGeminiAPIKey = (apiKey: string) => {
    setGeminiConfig({
      apiKey,
      isConfigured: !!apiKey,
    });

    // Save API key to local storage
    if (apiKey) {
      localStorage.setItem("geminiApiKey", apiKey);
    } else {
      localStorage.removeItem("geminiApiKey");
    }
  };

  return (
    <ChatBotContext.Provider
      value={{
        messages,
        addMessage,
        isOpen,
        setIsOpen,
        isMinimized,
        setIsMinimized,
        hasUnreadMessages,
        setHasUnreadMessages,
        clearMessages,
        geminiConfig,
        setGeminiAPIKey,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};

// Custom hook to use the chatbot context
export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (context === undefined) {
    throw new Error("useChatBot must be used within a ChatBotProvider");
  }
  return context;
};
