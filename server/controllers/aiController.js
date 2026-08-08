import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API client if API key is provided
let aiClient = null;
if (process.env.GEMINI_API_KEY) {
    try {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
        console.warn("[AI] Gemini client initialization warning:", e.message);
    }
}

/**
 * Controller to calculate AI Valuation & Risk Score for a listing
 */
export const getAIValuation = async (req, res) => {
    try {
        const { platform, followers_count, engagement_rate, monthly_views, niche, country, monetized, verified } = req.body;

        const followers = Number(followers_count) || 0;
        const engagement = Number(engagement_rate) || 0;
        const views = Number(monthly_views) || 0;

        // Try Gemini 2.0 AI analysis if API key available
        if (aiClient && process.env.GEMINI_API_KEY) {
            try {
                const prompt = `Analyze this social media account listing and return a JSON object with:
1. "estimatedValueMin" (number in INR ₹)
2. "estimatedValueMax" (number in INR ₹)
3. "riskRating" (string: "Low", "Medium", or "High")
4. "riskReason" (short 1-sentence analysis of account health)
5. "sellingTip" (short 1-sentence tip to increase valuation)

Account Details:
- Platform: ${platform}
- Followers: ${followers}
- Engagement Rate: ${engagement}%
- Monthly Views: ${views}
- Niche: ${niche}
- Primary Country: ${country}
- Monetized: ${monetized ? 'Yes' : 'No'}
- Verified: ${verified ? 'Yes' : 'No'}

Respond strictly with valid JSON only.`;

                const response = await aiClient.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                    config: { responseMimeType: "application/json" }
                });

                const text = response.text;
                const result = JSON.parse(text);
                return res.json({ success: true, valuation: result });
            } catch (aiError) {
                console.error("[AI] Gemini API error, falling back to heuristic engine:", aiError.message);
            }
        }

        // Algorithmic Fallback Heuristic Engine (INR ₹)
        let baseMultiplier = 0.15; // ₹0.15 per follower base
        if (platform === 'youtube') baseMultiplier = 0.40;
        if (platform === 'instagram') baseMultiplier = 0.25;
        if (platform === 'tiktok') baseMultiplier = 0.18;

        let estimated = followers * baseMultiplier;
        if (monetized) estimated *= 1.4;
        if (verified) estimated *= 1.3;
        if (engagement > 5) estimated *= 1.25;

        const minVal = Math.round(estimated * 0.85);
        const maxVal = Math.round(estimated * 1.25);

        // Determine Risk Rating
        let riskRating = "Low";
        let riskReason = "Account metrics display healthy engagement ratios.";
        if (followers > 50000 && engagement < 1) {
            riskRating = "High";
            riskReason = "High follower count with under 1% engagement indicates potential inactive/bot followers.";
        } else if (engagement < 2.5) {
            riskRating = "Medium";
            riskReason = "Below average engagement rate for this platform size.";
        }

        return res.json({
            success: true,
            valuation: {
                estimatedValueMin: minVal,
                estimatedValueMax: maxVal,
                riskRating,
                riskReason,
                sellingTip: "Add proof of audience analytics to boost buyer trust and list price by 15-20%."
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Controller to generate compelling listing description using AI
 */
export const generateAIDescription = async (req, res) => {
    try {
        const { title, platform, followers_count, niche, country, monetized } = req.body;

        if (aiClient && process.env.GEMINI_API_KEY) {
            try {
                const prompt = `Write a catchy, professional 3-paragraph marketplace listing description for a ${platform} account titled "${title}".
Details:
- Niche: ${niche}
- Followers: ${followers_count}
- Audience Location: ${country}
- Monetization: ${monetized ? 'Active & Earning' : 'Ready for Monetization'}

Highlight account potential, organic audience growth, and smooth transfer readiness. Return plain text only.`;

                const response = await aiClient.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                });

                return res.json({ success: true, description: response.text });
            } catch (aiError) {
                console.error("[AI] Gemini API description error, falling back:", aiError.message);
            }
        }

        // Fallback description generator
        const desc = `🔥 High-performing ${platform.toUpperCase()} account in the booming ${niche} niche with over ${Number(followers_count).toLocaleString()} engaged followers!

📍 Key Highlights:
• Main Audience: ${country || 'Global'}
• Monetization Status: ${monetized ? 'Monetized & Generating Revenue' : 'Monetization Eligible'}
• Consistent organic engagement with high growth potential for content creators or brand expansion.

⚡ Clean history, full ownership transfer included via Hypp Escrow. Serious buyers only!`;

        return res.json({ success: true, description: desc });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
