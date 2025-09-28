import React, { useState } from "react";
import "./ChatbotHero.css";
import { assets } from "../../assets/assets";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import * as franc from 'franc';

const ChatbotHero = () => {
  const [inputValue, setInputValue] = useState("");
  const [image,setImage]=useState("");
  const [messages, setMessages] = useState([]);

  

let  text = "ഒരു ഉപന്യാസം എന്നത് ഒരു എഴുത്തുകാരന്റെ വാദം, വിശകലനം അല്ലെങ്കിൽ ഒരു വിഷയത്തെക്കുറിച്ചുള്ള വ്യാഖ്യാനം അവതരിപ്പിക്കുന്ന ഒരു നോൺ-ഫിക്ഷൻ രചനയാണ്, സാധാരണയായി ഒരു ആമുഖം, ബോഡി ഖണ്ഡികകൾ, ഒരു ഉപസംഹാരം എന്നിവ ഉപയോഗിച്ച് ഇത് ഘടനാപരമാണ്. ഇംഗ്ലീഷ് ഉപന്യാസങ്ങൾ പലപ്പോഴും സാഹിത്യ ഗ്രന്ഥങ്ങളുടെ വിശകലനത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു, എന്നാൽ അക്കാദമിക് വാദം മുതൽ വ്യക്തിപരമായ പ്രതിഫലനം വരെയുള്ള വിവിധ വിഷയങ്ങളിലും ഉദ്ദേശ്യങ്ങളിലും ഈ ഫോർമാറ്റ് പ്രയോഗിക്കാൻ കഴിയും. ഫലപ്രദമായ ഉപന്യാസങ്ങൾ വ്യക്തമായ തീസിസ് പ്രസ്താവന, യുക്തിസഹമായ ഓർഗനൈസേഷൻ, പിന്തുണയ്ക്കുന്ന തെളിവുകൾ, സുഗമമായ സംക്രമണങ്ങൾ, പ്രധാന പോയിന്റുകൾ സംഗ്രഹിക്കുകയും സമാപനം നൽകുകയും ചെയ്യുന്ന ശക്തമായ ഒരു നിഗമനം എന്നിവയെ ആശ്രയിച്ചിരിക്കുന്നു.";

const langCode = franc.franc(text);    // returns ISO-639-3 code
console.log(langCode); 

  const ai = new GoogleGenAI({apiKey:import.meta.env.VITE_GEMINI_KEY});

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: "user", text: image?`Attached Image  , ${inputValue}`:inputValue };
    setMessages((prev) => [...prev, userMessage]);

    // clear input immediately
    setInputValue("");
    setImage('');

    const getBase64 = async (image) => {
      return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  };

  const inputValue1=inputValue+' in short conversation tone do not use long para';
  console.log(inputValue1)

      const final=async()=>{
        const fullData=await getBase64(image)
        return fullData.split(',')[1];
      }

      const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image?(await final()):'',
        },
      },
      { text: inputValue1 },
    ];  


  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: image?contents:inputValue1,
  });

  console.log(response);

    const botMessage = {
      sender: "bot",
      text: response.text,
    };
    setMessages((prev) => [...prev, botMessage]);
  };


  const textToSpeech=(msg)=>{
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = "hi-IN"; // specify language if needed
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="main-container">
      {messages.length === 0 && (
        <div className="hero-section">
          <h1 className="main-heading">Welcome to Krishi Mitra</h1>
          <h1 className="sub-heading">your personal Farming Solution</h1>
        </div>
      )}

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}> 
            <ReactMarkdown>{msg.text}</ReactMarkdown>
            {msg.sender==="bot"?<img src={assets.volume} alt="" className="volume" onClick={()=>(textToSpeech(msg.text))} />:'' }
          </div>
        ))}
      </div>

      <div className="search-bar-container">
        <div className="image-preview">{image?<img src={URL.createObjectURL(image)} alt="" />:''}</div>
        <input type="file"  id="cam"  onChange={(e)=>setImage(e.target.files[0])} hidden/> 
        <label htmlFor="cam"><img src={assets.camera} alt="camera" /></label>
        <img src={assets.microphone} alt="mic" />
        <input type="text" className="search-input" placeholder="Ask Krishi Mitra..." value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <img src={assets.send} alt="send" onClick={handleSendMessage} />
      </div>
    </main>
  );
};

export default ChatbotHero;
