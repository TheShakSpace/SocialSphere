import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// AI Caption Generator Endpoint
app.post("/api/gemini/caption", async (req, res) => {
  try {
    const { topic, mood, platform } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return high-quality, simulated aesthetic response when API key is missing
      console.log("No GEMINI_API_KEY found, returning high-quality simulation.");
      const demoCaptions = [
        `✨ Decoded reality: ${topic}. Navigating the neural space in a ${mood || "cosmic"} frequency. #SocialSphere #Future`,
        `🌐 [Neural link established]: Processing ${topic}. Current mood: ${mood || "vibrant"}. What is your digital stance on this?`,
        `🪐 Floating across the data stream. ${topic} is where connections align. Mindful orbits only. 💫`,
        `💠 Synthesized perspective: ${topic}. Architecting tomorrow's ideas today in full 3D.`,
      ];
      // Simulate delay for realism
      await new Promise((resolve) => setTimeout(resolve, 800));
      return res.json({ captions: demoCaptions });
    }

    const prompt = `Generate 4 creative, engaging, futuristic social media captions for a platform named "SocialSphere". 
Topic: "${topic}"
Desired Mood: "${mood || "Cosmic"}"
Target Platform/Vibe: "${platform || "Professional Future"}"

Make them feel premium, elegant, and intellectual. Do not use generic emoji spam. Emphasize clean typography structures. Return them as a JSON list of strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "STRING"
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const captions = JSON.parse(text.trim());
    return res.json({ captions });
  } catch (error: any) {
    console.error("Gemini Caption Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate caption" });
  }
});

// AI Mood Analyzer/Enhancer Endpoint
app.post("/api/gemini/mood", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text content is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Dynamic simulated mood analysis
      console.log("No GEMINI_API_KEY found, returning simulated mood analysis.");
      const moods = ["Cosmic", "Inspired", "Cyberpunk", "Melancholy", "Ethereal", "Minimalist"];
      const selectedMood = moods[Math.floor(Math.random() * moods.length)];
      const glowColors: Record<string, string> = {
        Cosmic: "from-[#7C5CFF] to-[#00D4FF]",
        Inspired: "from-[#00FFA3] to-[#00D4FF]",
        Cyberpunk: "from-[#FF5A5F] to-[#7C5CFF]",
        Melancholy: "from-[#98A2B3] to-[#7C5CFF]",
        Ethereal: "from-[#00D4FF] to-[#00FFA3]",
        Minimalist: "from-gray-700 to-gray-900",
      };
      await new Promise((resolve) => setTimeout(resolve, 600));
      return res.json({
        mood: selectedMood,
        confidence: 0.94,
        gradient: glowColors[selectedMood] || "from-[#7C5CFF] to-[#00D4FF]",
        suggestion: "Your content radiates deep technological poetry. Consider adding an ambient sound card!"
      });
    }

    const prompt = `Analyze the emotional, visual, and stylistic mood of the following text:
"${text}"

Classify it into one of these exact moods: "Cosmic", "Inspired", "Cyberpunk", "Melancholy", "Ethereal", or "Minimalist".
Provide:
1. The detected mood.
2. A confidence score between 0.0 and 1.0.
3. A Tailwind CSS background gradient (e.g., "from-[#7C5CFF] to-[#00D4FF]") representing this mood.
4. An engaging design suggestion for how to visually present this post.

Return the result as a JSON object matching this schema:
{
  "mood": "Cosmic" | "Inspired" | "Cyberpunk" | "Melancholy" | "Ethereal" | "Minimalist",
  "confidence": number,
  "gradient": string,
  "suggestion": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            mood: { type: "STRING" },
            confidence: { type: "NUMBER" },
            gradient: { type: "STRING" },
            suggestion: { type: "STRING" }
          },
          required: ["mood", "confidence", "gradient", "suggestion"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    const result = JSON.parse(responseText.trim());
    return res.json(result);
  } catch (error: any) {
    console.error("Gemini Mood Analyzer Error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze mood" });
  }
});

// Setup Vite Dev Middleware or Production Static Assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SocialSphere Backend listening at http://localhost:${PORT}`);
  });
}

setupServer();
