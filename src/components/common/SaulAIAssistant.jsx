import React, { useMemo, useState } from "react";

const quickReplies = [
  "Show vacation rentals",
  "Show units for sale",
  "How do I contact Saul?",
  "Help me book a stay",
  "I am an owner",
];

function getReply(message) {
  const text = message.toLowerCase();

  if (text.includes("sale") || text.includes("venta") || text.includes("unit")) {
    return "I can help you explore units for sale. Go to OUR LISTINGS for real estate inventory with bedrooms, bathrooms, square meters, parking, views, and price.";
  }
  if (text.includes("rental") || text.includes("book") || text.includes("stay") || text.includes("vacation")) {
    return "For vacation rentals, open VACATION RENTALS. There you can search by dates, guests, and review pricing with the calendar.";
  }
  if (text.includes("contact") || text.includes("call") || text.includes("phone") || text.includes("email") || text.includes("whatsapp")) {
    return "You can contact Saul directly at +507 6616-4212 or by email at saul@playa.com. You can also use the floating WhatsApp button.";
  }
  if (text.includes("owner")) {
    return "Owner services are available through the owner section. You can review owner access, reports, and listing management from the platform.";
  }
  return "I’m Saul AI Assistant. I can help with vacation rentals, real estate listings for sale, owner services, and direct contact with Saul Playa.";
}

export default function SaulAIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome. I’m Saul AI Assistant. Ask me about rentals, units for sale, owner services, or how to contact Saul Playa.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  function sendMessage(text) {
    const userText = text.trim();
    if (!userText) return;
    const reply = getReply(userText);
    setMessages((prev) => [...prev, { role: "user", text: userText }, { role: "assistant", text: reply }]);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        className="saul-ai-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open Saul AI Assistant"
      >
        ✨
      </button>

      {open ? (
        <div className="saul-ai-panel">
          <div className="saul-ai-header">
            <div>
              <div className="saul-ai-title">Saul AI Assistant</div>
              <div className="saul-ai-subtitle">Rentals • Sales • Owner Support</div>
            </div>
            <button type="button" className="saul-ai-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="saul-ai-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`saul-ai-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="saul-ai-quick-replies">
            {quickReplies.map((item) => (
              <button key={item} type="button" className="saul-ai-chip" onClick={() => sendMessage(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="saul-ai-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Saul AI Assistant"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSend) sendMessage(input);
              }}
            />
            <button type="button" className="saul-ai-send" onClick={() => sendMessage(input)} disabled={!canSend}>
              Send
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
