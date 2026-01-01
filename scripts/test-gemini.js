const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test gemini-pro (Text)
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test text");
        console.log("gemini-pro works!");
    } catch (e) {
        console.error("gemini-pro failed:", e.message);
    }

    // Test gemini-pro-vision (Image)
    try {
        // Vision model requires an image, but let's see if we can instantiate it or call it.
        // We'll mimic a simple call (it might fail due to missing image, but shouldn't be 404)
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        // accessing name or configuraiton doesn't trigger API, generating content does.
        // We need a dummy image to test it properly, but even a text-only prompt to vision model 
        // typically returns 400 "image required" or similar, NOT 404 "model not found".
        const result = await model.generateContent("Test vision");
        console.log("gemini-pro-vision worked (unexpectedly with text only)");
    } catch (e) {
        if (e.message.includes("404")) {
            console.error("gemini-pro-vision 404 NOT FOUND");
        } else {
            console.log("gemini-pro-vision exists (error was not 404):", e.message);
        }
    }
}

// Simple env loader
const fs = require('fs');
const path = require('path');
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log("Could not read .env.local");
}

main();
