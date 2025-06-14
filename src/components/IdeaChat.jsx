import { useState, useRef, useEffect } from "react";
import axios from "axios";

const IdeaChat = () => {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Fitness");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const userInput = `Topic: ${topic} | Niche: ${niche}`;
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setLoading(true);
    setError("");

    const prompt = `You are a content strategist. Suggest one trending Instagram reel idea for a creator in the ${niche} niche. Topic: ${topic}. Include a caption, 5 relevant hashtags, and a strong opening hook.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setTopic("");
    } catch (err) {
      console.error("OpenAI error:", err.response?.data || err.message);
      setError("Failed to generate content. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/*  header */}
      <header className="p-4 text-xl font-bold text-center border-b border-gray-700">
        Give some prompt
      </header>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl p-4 rounded-lg whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-600 self-end ml-auto"
                : "bg-gray-700 self-start mr-auto"
            }`}
          >
            <div className="text-xs mb-1 font-semibold">
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
        {loading && <p className="text-green-400">Generating idea.</p>}
        {error && <p className="text-red-400">{error}</p>}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      
      <form
  onSubmit={handleSubmit}
  className="w-full px-4 py-3 border-t border-gray-700 bg-gray-900"
>
  <div className="max-w-3xl mx-auto flex items-end gap-3 bg-[#40414f] px-4 py-3 rounded-2xl">
    <textarea
      value={topic}
      onChange={(e) => {
        setTopic(e.target.value);
        e.target.style.height = "auto"; // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // Grow vertically
      }}
      placeholder="Send a message..."
      rows={1}
      className="flex-1 min-w-0 resize-none overflow-hidden bg-transparent text-white text-sm focus:outline-none"
      required
    />
    <select
      value={niche}
      onChange={(e) => setNiche(e.target.value)}
      className="bg-gray-700 border border-gray-600 text-white text-sm px-3 py-2 rounded-md"
    >
      <option>Fitness</option>
      <option>Fashion</option>
      <option>Finance</option>
      <option>Tech</option>
      <option>Market</option>
    </select>
    <button
      type="submit"
      className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md"
    >
      {loading ? "..." : "Generate"}
    </button>
  </div>
</form>

    </div>
  );
};

export default IdeaChat;
