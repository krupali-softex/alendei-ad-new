import React, { useState, useEffect, useRef } from "react";
import { generateAiAd } from "../../services/apiService";
import { setAdFormData } from "../../state/slices/adFormSlice";
import { mapApiResponseToFormState } from "../../utils/mapApiResponse";
import { useDispatch, useSelector } from "react-redux";
import AdCampaignTracker from "./ad-flow-sections/AdCampaignTracker";
import { RootState } from "../../state/store";

const AdForm: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("awareness");
  const user = useSelector((state: RootState) => state.user.data);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const params = {
        prompt: input,
      };
      let response = await generateAiAd(params);
      const mappedData = mapApiResponseToFormState(response);
      dispatch(setAdFormData(mappedData));

      // Add system (AI) response from API
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: response.response ? response.response : "Something went wrong",
        },
      ]);
    } catch (err) {
      console.error("API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: "Oops! Something went wrong with the AI response.",
        },
      ]);
    }
    setLoading(false);
  };

  const chatRef = useRef<HTMLDivElement | null>(null); //  Correct TypeScript type

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]); // Runs every time messages update

  return (
    <div className="row g-5 ai-ad-flow">
      <div className="col-xl-8 col-lg-7 col-md-12">
        <div className="campaign-card p-40">
          <div className="ai-ad-chat-container">
            <div className="ai-ad-chat" ref={chatRef}>
              <h1 className="section-title text-primary mb-5 text-center">
                Hello, {user?.username}
              </h1>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender}-message`}
                >
                  {msg.text}
                  {msg.sender === "system" &&
                    msg.text.includes("Ad Campaign") && (
                      <div className="chat-options mt-3">
                        {["awareness", "traffic", "engagement", "leads"].map(
                          (option) => (
                            <label key={option} className="option">
                              <input
                                type="radio"
                                name="adType"
                                value={option}
                                className="custom-radio"
                                checked={selectedOption === option}
                                onChange={() => setSelectedOption(option)}
                              />
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </label>
                          )
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
            {loading && (
              <div className="loading-container">
                <div className="loading host">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
          </div>

          <div className="send-message">
            <form onSubmit={handleSendMessage}>
              <div className="d-flex position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn-sendMsg" type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 30"
                    fill="none"
                  >
                    <path
                      d="M0.119141 30.0016V18.8909L9.81815 15.1873L0.119141 11.4837V0.373047L23.1543 15.1873L0.119141 30.0016Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AdCampaignTracker />
    </div>
  );
};

export default AdForm;
