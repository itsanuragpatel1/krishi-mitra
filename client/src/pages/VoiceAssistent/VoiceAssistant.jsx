
import React, { useState, useEffect, useRef } from 'react';

import { GoogleGenAI } from "@google/genai";

import './VoiceAssistant.css';

const VoiceAssistant = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const callTimerRef = useRef(null);

  // Initialize Gemini AI using exact code provided
  const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_KEY});

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => setIsListening(true);

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        if (event.results[current].isFinal) {
          setTranscript(transcript);
          handleUserInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto-restart listening if call is active and not speaking or generating
        if (isCallActive && !isSpeaking && !isGenerating) {
          setTimeout(() => {
            if (isCallActive && !isSpeaking && !isGenerating) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
      };
    }
  }, [isCallActive, isSpeaking, isGenerating]);

  useEffect(() => {
    if (isCallActive && callTimerRef.current === null) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (!isCallActive && callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const buildConversationContext = () => {
    let context = `You are Krishi Mitra, an AI farming assistant having a voice conversation with a farmer. 

IMPORTANT INSTRUCTIONS:
- Keep responses short and conversational (maximum 2 sentences)
- Talk like you're speaking to someone on a phone call, not writing
- Be friendly, helpful, and direct
- Ask follow-up questions to keep the conversation natural
- Focus on practical farming advice
- Never use bullet points, paragraphs, or formal language
- Sound natural and conversational

Previous conversation context:
`;

    // Keep only last 4 messages for cost optimization (most effective)
    const recentHistory = conversationHistory.slice(-4);
    recentHistory.forEach(msg => {
      context += `${msg.role === 'user' ? 'Farmer' : 'Krishi Mitra'}: ${msg.content}\n`;
    });

    return context;
  };

  const handleUserInput = async (inputValue) => {
    if (!inputValue.trim()) return;

    // Stop listening and start generating
    setIsListening(false);
    setIsGenerating(true);

    // Add user message to conversation history
    const userMessage = { role: 'user', content: inputValue, timestamp: Date.now() };
    setConversationHistory(prev => [...prev, userMessage]);

    try {
      // Build context-aware prompt
      const contextPrompt = buildConversationContext();
      const fullPrompt = `${contextPrompt}

Farmer just said: "${inputValue}"

Respond as Krishi Mitra in a natural, conversational way:`;

      // Use exact Gemini API code as provided
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      const aiResponse = response.text;

      // Add AI response to conversation history
      const aiMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() };
      setConversationHistory(prev => [...prev, aiMessage]);

      setAssistantMessage(aiResponse);
      setIsGenerating(false);
      speakMessage(aiResponse);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const fallbackResponse = getFallbackResponse(inputValue);

      // Add fallback to history
      const aiMessage = { role: 'assistant', content: fallbackResponse, timestamp: Date.now() };
      setConversationHistory(prev => [...prev, aiMessage]);

      setAssistantMessage(fallbackResponse);
      setIsGenerating(false);
      speakMessage(fallbackResponse);
    }
  };

  const getFallbackResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('crop') || lowerInput.includes('plant')) {
      return 'For crop selection, consider your soil type and local climate. What specific crop are you thinking about growing?';
    } else if (lowerInput.includes('weather')) {
      return 'Weather is crucial for farming decisions. What farming activity are you planning?';
    } else if (lowerInput.includes('disease') || lowerInput.includes('pest')) {
      return 'Early detection helps with pest management. What symptoms are you seeing on your crops?';
    } else if (lowerInput.includes('fertilizer') || lowerInput.includes('nutrients')) {
      return 'Soil testing helps determine exact nutrient needs. Have you tested your soil recently?';
    } else {
      return 'I can help with farming questions. What specific challenge are you facing?';
    }
  };

  const speakMessage = (message) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Resume listening after speaking
        if (isCallActive && recognitionRef.current) {
          setTimeout(() => {
            if (isCallActive && !isSpeaking) {
              recognitionRef.current.start();
            }
          }, 500);
        }
      };

      synthRef.current.speak(utterance);
    }
  };

  const startCall = () => {
    // Direct transition to active call
    setIsCallActive(true);
    setCallDuration(0);
    setConversationHistory([]);

    // Start with welcome message - microphone stays OFF until intro finishes
    const welcomeMessage = 'Hello! I am your Krishi Mitra assistant. How can I help you with farming today?';
    setAssistantMessage(welcomeMessage);

    // Add welcome to conversation history
    const welcomeHistory = { role: 'assistant', content: welcomeMessage, timestamp: Date.now() };
    setConversationHistory([welcomeHistory]);

    // Start speaking welcome message immediately
    setTimeout(() => {
      speakMessage(welcomeMessage);
    }, 500);
  };

  const endCall = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    setIsCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsGenerating(false);
    setTranscript('');
    setAssistantMessage('');
    setCallDuration(0);
    setConversationHistory([]);
  };

  const toggleMute = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else if (isCallActive && !isSpeaking && !isGenerating) {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="voice-assistant-container">
      {/* Pre-call State - Minimal and Clean */}
      {!isCallActive && (
        <div className="pre-call-screen">
          <div className="welcome-section">
            <div className="ai-avatar-large">
              <div className="avatar-pulse"></div>
              🤖
            </div>
            <h1 className="welcome-title">Krishi Mitra</h1>
            <p className="welcome-subtitle">
              Voice Assistant for Smart Farming
            </p>
            <button className="start-call-btn" onClick={startCall}>
              <span className="btn-icon">🎤</span>
              Start Voice Call
            </button>
          </div>
        </div>
      )}

      {/* Active Call State */}
      {isCallActive && (
        <div className="active-call-screen">
          <div className="call-header">
            <div className="call-status">
              <span className="status-indicator active"></span>
              <span className="status-text">Connected</span>
              <span className="call-timer">{formatDuration(callDuration)}</span>
            </div>
          </div>

          <div className="participants-section">
            <div className="participant ai-participant">
              <div className={`participant-avatar ai-avatar ${isSpeaking ? 'speaking' : ''}`}>
                🤖
                {isSpeaking && (
                  <div className="avatar-sound-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
              <h3>Krishi Mitra</h3>
              <p className="participant-status">
                {isGenerating ? 'Thinking...' : (isSpeaking ? 'Speaking...' : 'Listening...')}
              </p>
            </div>

            <div className="participant user-participant">
              <div className={`participant-avatar user-avatar ${isListening ? 'listening' : ''}`}>
                👤
                {isListening && (
                  <div className="avatar-sound-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
              <h3>You</h3>
              <p className="participant-status">
                {isListening ? 'Speaking...' : 'Ready'}
              </p>
            </div>
          </div>

          <div className="conversation-panel">
            {assistantMessage && (
              <div className="message assistant-message">
                <div className="message-bubble assistant-bubble">
                  <strong>🤖 Assistant:</strong>
                  <p>{assistantMessage}</p>
                </div>
              </div>
            )}

            {transcript && (
              <div className="message user-message">
                <div className="message-bubble user-bubble">
                  <strong>👤 You:</strong>
                  <p>{transcript}</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="generating-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Krishi Mitra is thinking...</p>
              </div>
            )}
          </div>

          <div className="call-controls">
            <button 
              className={`control-btn mute-btn ${!isListening && isCallActive ? 'muted' : ''}`}
              onClick={toggleMute}
              disabled={isGenerating}
              title={isListening ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isListening ? '🎤' : '🔇'}
            </button>

            <button 
              className="control-btn end-call-btn"
              onClick={endCall}
              title="End call"
            >
              📞
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
