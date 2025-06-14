
import IdeaChat from "./components/IdeaChat";
import { useEffect } from "react";
import axios from "axios";

const App = () => {

  const key = process.env.VITE_OPENAI_API_KEY;
  console.log(key);
  useEffect(() => {
    const callOpenAI = async () => {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: "Give me a trending Instagram reel idea for tech." },
            ],
            temperature: 0.7,
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: "Bearer ${process.env.VITE_OPENAI_API_KEY}", 
              "Content-Type": "application/json",
            },
          }
        );
        console.log(" RESPONSE:", response.data);
      } catch (err) {
        console.error(" ERROR:", err.response?.data || err.message);
      }
    };

    callOpenAI();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-white bg-black">
      <h1>Give some prompt</h1>
      <a />;
    </div>
  );
};

export default App;
