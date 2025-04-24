import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBot } from "@/contexts/ChatBotContext";
import { useRateLimitTracker } from "@/hooks/useRateLimitTracker";
import { GeminiAPIError, geminiChat } from "@/services/geminiService";
import {
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Key,
  MessageCircle,
  RefreshCw,
  Send,
  Settings,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Set of predefined responses for brain tumor-related questions
const tumorResponses: Record<string, string[]> = {
  meningioma: [
    "Meningiomas are tumors that grow from the meninges — the membranes that surround your brain and spinal cord. Most meningiomas are noncancerous (benign).",
    "Common symptoms of meningiomas include headaches, seizures, blurred vision, weakness in your arms or legs, and changes in behavior or personality.",
    "Treatment options for meningiomas include surgery, radiation therapy, and in some cases, careful monitoring if the tumor is slow-growing.",
  ],
  glioma: [
    "Gliomas are tumors that originate in the glial cells of the brain or spinal cord. They can be low-grade (slow-growing) or high-grade (fast-growing).",
    "Symptoms of gliomas may include headaches, nausea, vomiting, seizures, neurological deficits, and personality changes.",
    "Treatment for gliomas typically involves surgery, radiation therapy, chemotherapy, or a combination of these approaches.",
  ],
  pituitary: [
    "Pituitary tumors develop in the pituitary gland at the base of the brain. Most are benign adenomas that don't spread to other parts of the body.",
    "Symptoms can include vision problems, headaches, and hormonal imbalances affecting growth, reproduction, and metabolism.",
    "Treatment options include surgery, radiation therapy, medication to control hormone production, or observation for small, non-functioning tumors.",
  ],
  general: [
    "Brain tumors can be primary (originating in the brain) or secondary (spreading from cancer elsewhere in the body).",
    "Early diagnosis is crucial for effective treatment of brain tumors. If you experience persistent headaches, vision changes, or neurological symptoms, consult a doctor.",
    "Modern diagnostic techniques for brain tumors include MRI, CT scans, and sometimes PET scans or biopsies.",
    "Survival rates for brain tumors vary widely depending on the type, grade, location, and patient factors like age and overall health.",
    "CereBro AI can help detect and classify brain tumors from MRI scans with high accuracy, but always consult with a medical professional for diagnosis.",
  ],
  surgery: [
    "Brain tumor surgery aims to remove as much of the tumor as possible while preserving neurological function.",
    "The type of surgical approach depends on the tumor's location, size, and type. Common approaches include craniotomy, minimally invasive surgery, and laser interstitial thermal therapy.",
    "Recovery from brain tumor surgery varies widely but typically involves a hospital stay of 3-7 days followed by several weeks of rehabilitation.",
  ],
  radiation: [
    "Radiation therapy uses high-energy beams, such as X-rays or protons, to kill tumor cells.",
    "It can be delivered externally (external beam radiation) or internally (brachytherapy).",
    "Side effects may include fatigue, hair loss, memory problems, and skin reactions at the treatment site.",
  ],
  chemotherapy: [
    "Chemotherapy uses drugs to kill rapidly growing cells, including cancer cells.",
    "For brain tumors, it can be administered orally, intravenously, or directly into the cerebrospinal fluid.",
    "Common side effects include nausea, fatigue, increased risk of infection, and potential long-term cognitive effects.",
  ],
  prognosis: [
    "The prognosis for brain tumors depends on various factors including tumor type, grade, location, patient age, and overall health.",
    "Low-grade tumors generally have a better prognosis than high-grade tumors.",
    "Advances in treatment approaches have improved survival rates for many types of brain tumors over the past decade.",
  ],
  metastatic: [
    "Metastatic brain tumors are cancer cells that have spread to the brain from primary tumors in other organs.",
    "The most common cancers that spread to the brain are lung, breast, melanoma, colon, and kidney cancers.",
    "Treatment typically involves a combination of surgery, radiation therapy, and systemic treatments like chemotherapy or targeted therapy.",
  ],
  symptoms: [
    "Common brain tumor symptoms include headaches, seizures, personality changes, memory problems, and difficulty with balance or speech.",
    "Symptoms can vary widely depending on the tumor's location, size, and growth rate.",
    "Some tumors may not cause symptoms until they reach a significant size, especially if located in less critical areas of the brain.",
  ],
  diagnosis: [
    "Brain tumor diagnosis typically begins with neurological exams and imaging studies like MRI or CT scans.",
    "A definitive diagnosis often requires a biopsy to examine the tumor tissue under a microscope.",
    "Advanced imaging techniques like functional MRI, MR spectroscopy, and PET scans can provide additional information about the tumor's characteristics.",
  ],
  risk_factors: [
    "Risk factors for brain tumors include exposure to ionizing radiation, certain genetic syndromes, and a family history of brain tumors.",
    "Most brain tumors occur spontaneously with no clear cause.",
    "Age is also a factor, with certain tumor types more common in specific age groups.",
  ],
  children: [
    "Brain tumors are the most common solid tumors in children.",
    "The most common types in children include medulloblastomas, astrocytomas, ependymomas, and brainstem gliomas.",
    "Treatment approaches for children with brain tumors often differ from adults, with a focus on minimizing long-term developmental effects.",
  ],
  lifestyle: [
    "While there are no proven ways to prevent brain tumors, maintaining a healthy lifestyle is always beneficial for overall health.",
    "This includes eating a balanced diet, regular exercise, avoiding smoking, and limiting alcohol consumption.",
    "Managing stress and getting adequate sleep can also support overall brain health.",
  ],
  support: [
    "Support groups can provide valuable emotional support and practical advice for patients with brain tumors and their families.",
    "Organizations like the American Brain Tumor Association and the National Brain Tumor Society offer resources, education, and support services.",
    "Psychological counseling may help cope with the emotional challenges of a brain tumor diagnosis.",
  ],
};

// More sophisticated context tracking for conversation
interface ConversationContext {
  lastTumorType: string | null;
  questionCount: number;
  lastTopics: string[];
}

// Function to find the best matching topic for a query
const findBestTopic = (query: string): string => {
  query = query.toLowerCase();

  // Define topic keywords for improved matching
  const topicKeywords: Record<string, string[]> = {
    meningioma: ["meningioma", "meninges", "membrane"],
    glioma: ["glioma", "glial", "glioblastoma", "gbm"],
    pituitary: [
      "pituitary",
      "hypophysis",
      "hormone",
      "prolactinoma",
      "acromegaly",
    ],
    surgery: [
      "surgery",
      "operation",
      "surgical",
      "remove",
      "resection",
      "craniotomy",
    ],
    radiation: [
      "radiation",
      "radiotherapy",
      "radiosurgery",
      "gamma knife",
      "cyberknife",
      "proton",
    ],
    chemotherapy: [
      "chemo",
      "chemotherapy",
      "temozolomide",
      "drugs",
      "avastin",
      "bevacizumab",
    ],
    prognosis: [
      "prognosis",
      "survival",
      "life expectancy",
      "outcome",
      "chances",
      "recover",
    ],
    metastatic: ["metastatic", "metastasis", "spread", "secondary"],
    symptoms: [
      "symptom",
      "sign",
      "indication",
      "headache",
      "seizure",
      "nausea",
      "vomiting",
      "balance",
    ],
    diagnosis: [
      "diagnosis",
      "test",
      "scan",
      "mri",
      "ct",
      "biopsy",
      "detect",
      "identify",
    ],
    risk_factors: [
      "risk",
      "cause",
      "factor",
      "genetic",
      "hereditary",
      "radiation exposure",
    ],
    children: [
      "child",
      "children",
      "pediatric",
      "young",
      "kid",
      "medulloblastoma",
    ],
    lifestyle: [
      "lifestyle",
      "diet",
      "exercise",
      "prevention",
      "healthy",
      "habits",
    ],
    support: [
      "support",
      "group",
      "help",
      "cope",
      "counseling",
      "therapy",
      "assistance",
    ],
    general: [
      "tumor",
      "cancer",
      "brain",
      "treatment",
      "neuro-oncology",
      "oncologist",
      "cerebro",
    ],
  };

  // Score each topic based on keyword matches
  let bestMatch = "general";
  let highestScore = 0;

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    let score = 0;
    keywords.forEach((keyword) => {
      if (query.includes(keyword)) {
        // Get exact match bonus
        score += 10;

        // Additional points for word boundaries (better matches)
        const regex = new RegExp(`\\b${keyword}\\b`, "i");
        if (regex.test(query)) {
          score += 5;
        }
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  // If nothing specific matched well, check for more general topics
  if (highestScore === 0) {
    if (query.includes("help") || query.includes("can you")) {
      return "general";
    }
    if (query.includes("thank")) {
      return "gratitude";
    }
    if (
      query.includes("hello") ||
      query.includes("hi ") ||
      query.includes("hey")
    ) {
      return "greeting";
    }
  }

  return bestMatch;
};

// Function to analyze sentiment and adapt response tone
const analyzeSentiment = (
  query: string
): "concerned" | "curious" | "urgent" | "neutral" => {
  query = query.toLowerCase();

  // Check for urgent/concerned keywords
  const urgentWords = [
    "help",
    "emergency",
    "urgent",
    "serious",
    "worried",
    "scared",
    "frightened",
    "terrified",
  ];
  const concernedWords = [
    "worried",
    "concerned",
    "anxious",
    "nervous",
    "afraid",
  ];
  const curiousWords = [
    "curious",
    "wonder",
    "interested",
    "what is",
    "how does",
    "why is",
    "can you explain",
  ];

  for (const word of urgentWords) {
    if (query.includes(word)) {
      return "urgent";
    }
  }

  for (const word of concernedWords) {
    if (query.includes(word)) {
      return "concerned";
    }
  }

  for (const word of curiousWords) {
    if (query.includes(word)) {
      return "curious";
    }
  }

  return "neutral";
};

// Enhanced function to generate AI-like responses based on query
const generateResponse = (
  query: string,
  context: ConversationContext
): [string, ConversationContext] => {
  const updatedContext = { ...context };

  // Track conversation complexity
  updatedContext.questionCount += 1;

  // If it's a greeting or thank you, provide appropriate response
  if (query.toLowerCase().match(/^(hello|hi|hey|greetings)/i)) {
    return [
      "Hello! I'm Dranzer, an AI assistant specialized in brain tumor information. How can I help you today?",
      updatedContext,
    ];
  }

  if (query.toLowerCase().match(/thank you|thanks|thx/i)) {
    return [
      "You're welcome! If you have any more questions about brain tumors, feel free to ask. I'm here to help.",
      updatedContext,
    ];
  }

  // Find the best matching topic for the query
  const topic = findBestTopic(query);

  // Add to recent topics (keep last 3)
  updatedContext.lastTopics.push(topic);
  if (updatedContext.lastTopics.length > 3) {
    updatedContext.lastTopics.shift();
  }

  // Set tumor type if applicable
  if (["meningioma", "glioma", "pituitary"].includes(topic)) {
    updatedContext.lastTumorType = topic;
  }

  // Analyze sentiment to adapt response tone
  const sentiment = analyzeSentiment(query);

  // Select response based on topic
  let response = "";

  if (topic === "gratitude") {
    response =
      "You're welcome! I'm happy to help with any other questions you have about brain tumors.";
  } else if (topic === "greeting") {
    response =
      "Hello! I'm Dranzer, an AI assistant specialized in brain tumor information. How can I help you today?";
  } else if (tumorResponses[topic]) {
    // Get a response from the appropriate topic
    response =
      tumorResponses[topic][
        Math.floor(Math.random() * tumorResponses[topic].length)
      ];

    // For follow-up questions in an ongoing conversation
    if (context.questionCount > 1) {
      // Add contextual transitions for follow-up questions
      if (
        context.lastTopics.length >= 2 &&
        context.lastTopics[context.lastTopics.length - 2] !== topic
      ) {
        const transitions = [
          "Regarding your question about ",
          "On the topic of ",
          "About ",
          "Concerning ",
        ];
        response = `${
          transitions[Math.floor(Math.random() * transitions.length)]
        }${topic.replace("_", " ")}: ${response}`;
      }
    }

    // Add helpful follow-up suggestions after a few interactions
    if (context.questionCount >= 2) {
      // Suggest related topics based on current topic
      const relatedTopics: Record<string, string[]> = {
        meningioma: ["symptoms", "diagnosis", "treatment"],
        glioma: ["prognosis", "treatment", "symptoms"],
        pituitary: ["symptoms", "diagnosis", "hormone"],
        surgery: ["recovery", "risks", "alternatives"],
        radiation: ["side effects", "types", "effectiveness"],
        chemotherapy: ["side effects", "drugs", "schedule"],
        general: ["types", "symptoms", "treatment"],
      };

      if (relatedTopics[topic]) {
        const suggestedTopic =
          relatedTopics[topic][
            Math.floor(Math.random() * relatedTopics[topic].length)
          ];
        response += ` If you'd like to know more about ${suggestedTopic} related to this, feel free to ask.`;
      }
    }
  } else {
    // If no good match, provide a general response
    response =
      "I specialize in providing information about brain tumors, their types, symptoms, diagnosis, and treatment options. Could you please ask a question related to these topics?";
  }

  // Modify response based on sentiment
  if (sentiment === "urgent") {
    response =
      "If you're experiencing a medical emergency, please contact emergency services or go to your nearest hospital immediately. " +
      response;
  } else if (sentiment === "concerned") {
    response =
      "I understand your concern. " +
      response +
      " Remember that consulting with healthcare professionals for personalized advice is always recommended.";
  } else if (sentiment === "curious") {
    response =
      response +
      " I hope that satisfies your curiosity. Feel free to ask if you'd like to explore this topic further.";
  }

  return [response, updatedContext];
};

// Fallback responses when API is not configured or errors occur
const fallbackResponses: Record<string, string[]> = {
  general: [
    "I'm a specialized AI assistant for brain tumor information. To unlock my full capabilities, click the settings ⚙️ icon above and enter your Gemini API key.",
    "I can provide better information about brain tumors with a Gemini API key. Click the settings ⚙️ icon to configure it.",
    "For advanced AI-powered responses, please configure your personal Gemini API key by clicking the settings ⚙️ icon.",
  ],
  error: [
    "I encountered an issue connecting to the Gemini API. Please check your internet connection and API key.",
    "There was a problem processing your request. Please try again later or check your Gemini API configuration.",
    "I'm having trouble accessing the Gemini AI services right now. If this persists, please verify your API key is correct.",
  ],
};

// Validate Gemini API key format
const isValidGeminiKey = (key: string): boolean => {
  // Gemini API keys typically start with "AI" followed by alphanumeric characters
  return /^AI[a-zA-Z0-9_-]{20,}$/.test(key.trim());
};

// Generate a fallback response when the API is not available
const generateFallbackResponse = (type: "general" | "error"): string => {
  const responses = fallbackResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
};

const ChatBot: React.FC = () => {
  const {
    messages,
    addMessage,
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    hasUnreadMessages,
    setHasUnreadMessages,
    geminiConfig,
    setGeminiAPIKey,
  } = useChatBot();

  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Use the custom hook to track rate limit status
  const { isRetrying, retryCount, maxRetries } = useRateLimitTracker({
    isActive: isOpen && geminiConfig.isConfigured,
  });

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiKeyInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (endOfMessagesRef.current && isOpen && !isMinimized) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Focus API key input when settings dialog is opened
  useEffect(() => {
    if (isSettingsOpen && apiKeyInputRef.current) {
      setTimeout(() => {
        if (apiKeyInputRef.current) {
          apiKeyInputRef.current.focus();
        }
      }, 100);
    }
  }, [isSettingsOpen]);

  // Initialize API key input field when settings dialog opens
  useEffect(() => {
    if (isSettingsOpen) {
      setApiKeyInput(geminiConfig.apiKey);
      setShowApiKey(false);
      setValidationError("");
    }
  }, [isSettingsOpen, geminiConfig.apiKey]);

  // Check if first time user
  useEffect(() => {
    const hasConfiguredBefore = localStorage.getItem("hasConfiguredChatbot");
    if (!hasConfiguredBefore && !geminiConfig.isConfigured) {
      setIsFirstTimeUser(true);
    }
  }, [geminiConfig.isConfigured]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      setHasUnreadMessages(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    setIsFirstTimeUser(false);
    localStorage.setItem("hasConfiguredChatbot", "true");
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const validateAndSaveAPIKey = () => {
    const key = apiKeyInput.trim();

    // Clear previous validation errors
    setValidationError("");

    // Check for empty key
    if (!key) {
      setValidationError("API key cannot be empty.");
      return;
    }

    // Check for valid format
    if (!isValidGeminiKey(key)) {
      setValidationError(
        "Invalid API key format. Gemini API keys typically start with 'AI' followed by a long string."
      );
      return;
    }

    // Save the valid key
    setGeminiAPIKey(key);
    setIsSettingsOpen(false);
    toast.success("Gemini API key saved successfully!");
  };

  const clearApiKey = () => {
    setApiKeyInput("");
    if (apiKeyInputRef.current) {
      apiKeyInputRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === "" || isThinking) return;

    // Add user message
    const userMessage = inputValue.trim();
    addMessage(userMessage, false);
    setInputValue("");
    setIsThinking(true);

    try {
      if (geminiConfig.isConfigured) {
        // Prepare message history for the API
        const conversationHistory = messages.slice(-10).map((msg) => ({
          role: msg.isBot ? ("model" as const) : ("user" as const),
          text: msg.text,
        }));

        // Get response from Gemini API
        const botResponse = await geminiChat({
          apiKey: geminiConfig.apiKey,
          userMessage,
          conversationHistory,
        });

        // Add bot response
        addMessage(botResponse, true);
      } else {
        // Use fallback response if API is not configured
        setTimeout(() => {
          addMessage(generateFallbackResponse("general"), true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Add detailed error message based on error type
      let errorMessage =
        "Sorry, I encountered an error responding to your message.";

      if (error instanceof GeminiAPIError) {
        if (
          error.message.toLowerCase().includes("invalid") ||
          error.message.toLowerCase().includes("key") ||
          error.message.toLowerCase().includes("auth")
        ) {
          errorMessage =
            "The API key appears to be invalid. Please check your API key in settings.";
          // Show a toast for API key errors
          toast.error("API key error. Please check your settings.", {
            action: {
              label: "Configure",
              onClick: handleOpenSettings,
            },
          });
        } else if (
          error.message.toLowerCase().includes("rate") ||
          error.message.toLowerCase().includes("limit") ||
          error.message.toLowerCase().includes("quota")
        ) {
          errorMessage =
            "Rate limit exceeded. I've tried several times but couldn't get a response. Please wait a few minutes before trying again, or consider upgrading your API quota.";

          toast.error("Rate limit reached", {
            description:
              "Maximum retry attempts reached. Please wait before trying again.",
            duration: 5000,
          });
        } else {
          errorMessage = error.message;
        }
      }

      addMessage(errorMessage, true);
    } finally {
      setIsThinking(false);
    }
  };

  // Animation classes for smoother transitions
  const chatOpenAnimation = "transition-all duration-300 ease-in-out transform";
  const buttonHoverAnimation =
    "transition-all hover:scale-105 active:scale-95 duration-200";

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {/* Chat Button */}
        <Button
          onClick={toggleChat}
          className={`rounded-full w-16 h-16 bg-cerebro-accent hover:bg-cerebro-accent/90 shadow-xl flex items-center justify-center relative ${buttonHoverAnimation}
            ${hasUnreadMessages ? "animate-pulse" : ""}`}
        >
          <MessageCircle size={28} />
          {hasUnreadMessages && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </Button>

        {/* Chat Interface */}
        {isOpen && (
          <Card
            className={`w-[320px] md:w-[420px] bg-cerebro-dark border border-white/10 mt-4 overflow-hidden flex flex-col shadow-xl ${chatOpenAnimation}`}
            style={{
              maxHeight: isMinimized ? "48px" : "560px",
              opacity: 1,
              transform: isMinimized ? "translateY(0)" : "translateY(0)",
            }}
          >
            {/* Chat Header */}
            <div className="bg-cerebro-darker p-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10 bg-cerebro-accent flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </Avatar>
                <div>
                  <span className="font-medium text-lg">Dranzer AI</span>
                  <div className="text-xs text-gray-400 flex items-center">
                    <span
                      className={`w-2 h-2 ${
                        geminiConfig.isConfigured
                          ? "bg-green-500"
                          : "bg-amber-500"
                      } rounded-full mr-1.5`}
                    ></span>
                    <span>
                      {geminiConfig.isConfigured
                        ? "AI Powered"
                        : "Limited Mode"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 ${
                    !geminiConfig.isConfigured
                      ? "animate-pulse ring-2 ring-amber-500"
                      : ""
                  }`}
                  onClick={handleOpenSettings}
                  title="Configure API"
                >
                  <Settings size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={minimizeChat}
                >
                  {isMinimized ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={toggleChat}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* First time user API key prompt */}
            {!isMinimized && isFirstTimeUser && !geminiConfig.isConfigured && (
              <div className="px-4 py-3 bg-cerebro-accent/10 border-b border-cerebro-accent/20">
                <div className="flex items-start space-x-3">
                  <Key className="h-5 w-5 text-cerebro-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Set up your API key
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      For the best experience, add your personal Gemini API key.
                      <Button
                        variant="link"
                        className="text-cerebro-accent p-0 h-auto text-xs font-medium ml-1"
                        onClick={handleOpenSettings}
                      >
                        Configure now
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <ScrollArea
                  className="flex-1 p-4 overflow-y-auto"
                  style={{ height: "420px" }}
                >
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isBot ? "justify-start" : "justify-end"
                        } ${chatOpenAnimation} ${
                          message.isBot
                            ? "animate-in fade-in slide-in-from-left-5"
                            : "animate-in fade-in slide-in-from-right-5"
                        }`}
                        style={{ animationDuration: "300ms" }}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 shadow-md
                            ${
                              message.isBot
                                ? "bg-cerebro-darker border border-white/10"
                                : "bg-cerebro-accent text-white"
                            }`}
                        >
                          <p className="whitespace-pre-wrap text-sm md:text-base">
                            {message.text}
                          </p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Thinking indicator */}
                    {isThinking && (
                      <div
                        className="flex justify-start animate-in fade-in slide-in-from-left-5"
                        style={{ animationDuration: "200ms" }}
                      >
                        <div className="max-w-[85%] rounded-lg p-3 bg-cerebro-darker border border-white/10 shadow-md">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div
                                className="w-2 h-2 bg-cerebro-accent rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-cerebro-accent rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-cerebro-accent rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                            <p className="text-sm">Dranzer is thinking...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={endOfMessagesRef} />
                  </div>
                </ScrollArea>

                {/* API Key Notice */}
                {!geminiConfig.isConfigured && (
                  <div className="px-3 py-2 bg-amber-500/10 border-t border-amber-500/20">
                    <p className="text-xs text-amber-300 flex items-center">
                      <Key className="h-3 w-3 mr-1.5" />
                      <span>
                        Set up Gemini API key for full AI capabilities
                      </span>
                    </p>
                  </div>
                )}

                {/* Input Area */}
                {!isMinimized && (
                  <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-white/10 bg-cerebro-dark"
                  >
                    {/* Show retry status if applicable - now using hook values */}
                    {isRetrying && (
                      <div className="flex items-center mb-2 p-1.5 bg-amber-500/10 rounded text-xs">
                        <RefreshCw className="h-3 w-3 text-amber-500 mr-2 animate-spin" />
                        <span className="text-amber-500">
                          Rate limit hit. Retrying ({retryCount}/{maxRetries}
                          )...
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        className="bg-cerebro-darker text-white border-white/10 focus-visible:ring-cerebro-accent"
                        placeholder="Ask about brain tumors..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        ref={inputRef}
                        disabled={isThinking}
                      />
                      <Button
                        type="submit"
                        className="bg-cerebro-accent hover:bg-cerebro-accent/90"
                        disabled={isThinking || !inputValue.trim()}
                      >
                        {isThinking ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </Card>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-cerebro-dark border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Gemini API Configuration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm flex items-center">
                <Key className="h-4 w-4 mr-1.5" />
                Your Gemini API Key
              </Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  ref={apiKeyInputRef}
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Gemini API key"
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    // Clear validation errors when typing
                    if (validationError) {
                      setValidationError("");
                    }
                  }}
                  className="bg-cerebro-darker border-white/10 text-white pr-20 py-6 text-base"
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex">
                  {apiKeyInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-1"
                      onClick={clearApiKey}
                      title="Clear input"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleShowApiKey}
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Validation error message */}
              {validationError && (
                <div className="mt-2 text-red-400 text-xs flex items-start space-x-1.5">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="bg-cerebro-darker/50 rounded-md p-3 mt-2">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-1.5 text-cerebro-accent" />
                  How to get your Gemini API Key:
                </h4>
                <ol className="text-xs space-y-2 text-gray-300 list-decimal pl-4">
                  <li>
                    Visit{" "}
                    <a
                      href="https://ai.google.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cerebro-accent hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </li>
                  <li>Sign in with your Google account</li>
                  <li>Go to "API keys" in the left sidebar</li>
                  <li>Click "Create API Key" and copy the generated key</li>
                  <li>Paste it here to enable AI-powered responses</li>
                </ol>
                <p className="text-xs text-gray-400 mt-3">
                  Your key is stored only on your device and is never sent to
                  our servers.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={validateAndSaveAPIKey}
              className={`bg-cerebro-accent hover:bg-cerebro-accent/90 ${buttonHoverAnimation}`}
              disabled={!apiKeyInput.trim()}
            >
              Save My API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;
