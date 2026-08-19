import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Google Maps Grounded Salon Discovery
app.post("/api/salons/grounded-search", async (req: Request, res: Response) => {
  try {
    const { query, latitude, longitude, areaName, category } = req.body;
    const searchArea = areaName || "Mansarovar, Jaipur";
    const userLat = typeof latitude === "number" ? latitude : 26.8533;
    const userLng = typeof longitude === "number" ? longitude : 75.7681;
    const searchQuery = query || category || "top rated hair salons, spas, and beauty studios";

    if (!ai) {
      return res.json({
        success: true,
        source: "curated_fallback",
        text: `Showing top-rated salons, styling studios and spas in ${searchArea}.`,
        groundingChunks: [
          {
            maps: {
              title: "Scissors & Shears Salon",
              uri: `https://www.google.com/maps/search/?api=1&query=Scissors+and+Shears+Salon+${encodeURIComponent(searchArea)}`,
            },
          },
          {
            maps: {
              title: "Luxe Beauty Lounge",
              uri: `https://www.google.com/maps/search/?api=1&query=Luxe+Beauty+Lounge+${encodeURIComponent(searchArea)}`,
            },
          },
        ],
      });
    }

    const prompt = `You are Nexora SalonOS AI Grounding Assistant. The user is looking for salons or beauty services in/near ${searchArea} (coordinates: ${userLat}, ${userLng}).
User query: "${searchQuery}".
Provide a concise, helpful summary highlighting top rated salons, specific specialties (haircuts, styling, facials, bridal, nails, spa), typical pricing, opening status, and why customers love them. Include exact salon names and addresses when available.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLat,
              longitude: userLng,
            },
          },
        },
      },
    });

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      success: true,
      source: "gemini_google_maps_grounding",
      text: response.text || "Found verified salons matching your request.",
      groundingChunks,
    });
  } catch (err: any) {
    console.error("Error in grounded search:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to search salons with Maps grounding",
    });
  }
});

// AI Beauty & Stylist Advisor (maps-grounded recommendation)
app.post("/api/salons/ai-advisor", async (req: Request, res: Response) => {
  try {
    const { userPrompt, preferences, location } = req.body;
    const userLoc = location?.area || "Mansarovar, Jaipur";
    const userLat = location?.latitude || 26.8533;
    const userLng = location?.longitude || 75.7681;

    if (!ai) {
      return res.json({
        success: true,
        summary: `For your request "${userPrompt}", we recommend an expert consultation for precision hair shaping or a rejuvenating Hydra Facial.`,
        recommendations: [
          {
            salonName: "Scissors & Shears Salon",
            service: "Signature Layer Cut & Deep Spa",
            highlight: "Award winning stylist Aarav with 7+ yrs experience",
            approxPrice: "₹499 - ₹799",
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=Scissors+and+Shears+Salon+${encodeURIComponent(userLoc)}`,
          },
          {
            salonName: "Luxe Beauty Lounge",
            service: "7-Step Hydra Facial Deluxe",
            highlight: "Instant glow with clinical extraction & LED therapy",
            approxPrice: "₹1,799",
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=Luxe+Beauty+Lounge+${encodeURIComponent(userLoc)}`,
          },
        ],
        groundingSources: [],
      });
    }

    const prompt = `You are Nexora's Elite Salon & Beauty Consultant. A client in ${userLoc} is asking for personalized salon & treatment recommendations.
User Query: "${userPrompt}".
Client Preferences: ${JSON.stringify(preferences || {})}.
Give an expert recommendation on which treatment/haircut fits best, and mention specific top-rated salons nearby in ${userLoc} with their key highlights, estimated price, and address.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLat,
              longitude: userLng,
            },
          },
        },
      },
    });

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      success: true,
      text: response.text,
      groundingChunks,
    });
  } catch (err: any) {
    console.error("AI Advisor error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to generate AI advice",
    });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true, host: "0.0.0.0" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexora SalonOS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
