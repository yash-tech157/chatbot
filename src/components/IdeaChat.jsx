import { useState, useRef, useEffect } from "react";
import axios from "axios";

const IdeaChat = () => {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Fitness");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
debugger;
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

    const prompt = `I am  a content strategist. Suggest one trending Instagram reel idea for a creator in the ${niche} niche. Topic: ${topic}. Include a caption, 5 relevant hashtags, and a strong opening hook.`;

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
    <div className="center">
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4 ">
      <div className="w-full max-w-3xl h-full flex flex-col border border-gray-700 rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <header className="text-center text-2xl font-bold p-4 border-b border-gray-700 bg-gray-800 ">
          Content Idea Assistant
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg whitespace-pre-wrap w-fit max-w-[90%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-700 text-white self-start mr-auto"
              }`}
            >
              <div className="text-xs mb-1 font-semibold">
                {msg.role === "user" ? "You" : "AI"}
              </div>
              <div>{msg.content}</div>
            </div>
          ))}
          {loading && (
            <p className="text-green-400 self-start">Generating idea...</p>
          )}
          {error && <p className="text-red-400 self-start">{error}</p>}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-4 border-t border-gray-700 bg-gray-800"
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic..."
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            required
          />
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
          >
            <option>Fitness</option>
            <option>Fashion</option>
            <option>Finance</option>
            <option>Tech</option>
            <option>Media</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md"
          >
            {loading ? "..." : "Generate"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default IdeaChat;
