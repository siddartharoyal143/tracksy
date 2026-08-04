import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Google OAuth Login URL endpoint
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "OAUTH_CLIENT_ID is not configured in environment variables." });
  }
  const host = req.get("x-forwarded-host") || req.get("host");
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;
  const scope = "openid email profile";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account`;

  res.json({ url: authUrl });
});

// Google OAuth Callback endpoint
app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send("Authorization code missing.");
    }
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const host = req.get("x-forwarded-host") || req.get("host");
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("OAuth token exchange failed:", tokenData);
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; padding: 30px; text-align: center;">
            <h3 style="color: #e11d48;">Authentication Failed</h3>
            <p>${tokenData.error_description || "Could not retrieve access token."}</p>
            <script>
              setTimeout(() => { if (window.opener) window.close(); }, 3000);
            </script>
          </body>
        </html>
      `);
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    const name = userData.name || userData.given_name || (userData.email ? userData.email.split('@')[0] : 'Google User');
    const email = userData.email || 'user@gmail.com';
    const avatarUrl = userData.picture || '';
    const handle = `@${email.split('@')[0]}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Authentication Successful</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
            .card { background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); text-align: center; max-width: 320px; }
            .spinner { border: 3px solid #e2e8f0; stroke: #4f46e5; border-top: 3px solid #4f46e5; border-radius: 50%; width: 28px; height: 28px; animation: spin 0.8s linear infinite; margin: 1rem auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #0f172a;">Connected as ${name}</h3>
            <p style="margin: 0; font-size: 0.85rem; color: #64748b;">Completing sign in to Tracksy...</p>
            <div class="spinner"></div>
          </div>
          <script>
            const userProfile = {
              name: ${JSON.stringify(name)},
              email: ${JSON.stringify(email)},
              avatarUrl: ${JSON.stringify(avatarUrl)},
              handle: ${JSON.stringify(handle)}
            };
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', userProfile }, '*');
              setTimeout(() => { window.close(); }, 600);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error: any) {
    console.error("Google OAuth Callback Error:", error);
    res.status(500).send("Authentication error: " + error.message);
  }
});

// AI Insights endpoint
app.post("/api/ai-insights", async (req, res) => {
  try {
    const { expenses, subscriptions, totalBudget } = req.body;
    const ai = getGeminiClient();

    const prompt = `Analyze this user's monthly budget and expense data:
Total Monthly Budget: ₹${totalBudget || 10000}
Subscriptions: ${JSON.stringify(subscriptions || [])}
Expenses: ${JSON.stringify(expenses || [])}

Provide a JSON object with:
1. summary: A 2-3 sentence personalized financial analysis and spending prediction.
2. topCategories: An array of top spending categories with name, amount, percentage, and icon.
3. healthScore: An integer from 0 to 100 rating their financial health.
4. recommendations: An array of 3 actionable financial saving tips.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            topCategories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  percentage: { type: Type.NUMBER },
                  icon: { type: Type.STRING },
                },
                required: ["name", "amount", "percentage"],
              },
            },
            healthScore: { type: Type.INTEGER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["summary", "topCategories", "healthScore", "recommendations"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI insights.",
    });
  }
});

// Scan Receipt Endpoint
app.post("/api/scan-receipt", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 payload" });
    }

    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Analyze this receipt image and extract: merchant name, total amount in ₹ (INR), date if available, best fitting category (Food, Transport, Shopping, Bills, Entertainment, Health, Travel, Other), and a short note summary.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            note: { type: Type.STRING },
            date: { type: Type.STRING },
          },
          required: ["merchant", "amount", "category"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Scan Receipt Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze receipt image.",
    });
  }
});

// Voice Parse Endpoint
app.post("/api/voice-parse", async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Parse the following spoken spending statement into structured expense fields:
"${transcript}"

Extract amount (numeric in ₹), category (choose best match from: Food, Transport, Shopping, Bills, Entertainment, Health, Travel, Other), merchant name, and brief note.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            merchant: { type: Type.STRING },
            note: { type: Type.STRING },
          },
          required: ["amount", "category"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Voice Parse Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to parse voice transcript.",
    });
  }
});

// AI Chat Bot Endpoint for AI Insights
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, history = [], financialContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message prompt is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are Tracksy AI, a smart, empathetic, and highly analytical personal financial advisor bot.
Your role is to analyze the user's finances, answer questions, provide spending insights, suggest budget saving strategies, and give actionable financial advice.

Current Financial Context:
- Overall Monthly Budget: ₹${financialContext?.overallBudget || 0}
- Total Spent So Far: ₹${financialContext?.grandTotal || 0}
- Category Spending Totals: ${JSON.stringify(financialContext?.categoryTotals || {})}
- Active Subscriptions: ${JSON.stringify(financialContext?.subscriptions || [])}
- Recent Expenses: ${JSON.stringify(financialContext?.recentTransactions || [])}

Instructions:
- Be clear, conversational, helpful, and concise (2-4 sentences or formatted bullet points).
- Always use INR (₹) symbol when mentioning amounts.
- Give personalized insights directly referencing their actual spending data when appropriate.`;

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
      },
    });

    for (const item of history) {
      if (item.role === 'user' && item.content) {
        await chat.sendMessage({ message: item.content });
      }
    }

    const response = await chat.sendMessage({ message: message });
    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.json({
      success: false,
      reply: "I'm having trouble retrieving AI insights right now. Please try again shortly!",
      error: error.message,
    });
  }
});

async function startServer() {
  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Tracksy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
