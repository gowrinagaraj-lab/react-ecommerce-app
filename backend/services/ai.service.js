const CANNED_REPLIES = [
  {
    match: /\bhello\b|\bhi\b|\bhey\b/i,
    reply: "Hello! I am your AI assistant. Ask me about your order, our products, or anything else.",
  },
  {
    match: /\border\b|\bshipping\b|\bdeliver/i,
    reply: "You can track your orders from the **Dashboard**. Let me know your order number and I can look into it.",
  },
  {
    match: /\bproduct\b|\bcatalog/i,
    reply: "You can browse and filter products on the Dashboard. Want a recommendation?",
  },
  {
    match: /\bhelp\b/i,
    reply: "I'm here to help! Try asking about orders, products, or your account.",
  },
];

const DEFAULT_REPLY =
  "Thanks for your message! This is a mock AI reply — wire up a real provider in `services/ai.service.js` when you're ready.";

// Stand-in for a real LLM call. Picks a canned reply by keyword match so the
// chat UI has something realistic to render before a real provider is wired in.
const generateReply = async (message) => {
  const matched = CANNED_REPLIES.find(({ match }) => match.test(message));
  const reply = matched ? matched.reply : DEFAULT_REPLY;

  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

  return reply;
};

module.exports = { generateReply };
