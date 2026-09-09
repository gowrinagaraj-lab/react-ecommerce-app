const { generateReply } = require("../services/ai.service");

// POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "message is required" });
    }

    const reply = await generateReply(message.trim());

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { sendMessage };
