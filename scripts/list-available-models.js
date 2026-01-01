const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY not found");
    process.exit(1);
}

console.log("🔑 API Key: " + apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length - 3));
console.log("\n🔍 Fetching list of available models from Google Gemini API...\n");

// List models endpoint
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log("=".repeat(70));
            console.log("Available Models:");
            console.log("=".repeat(70));
            
            if (response.models && response.models.length > 0) {
                response.models.forEach((model) => {
                    console.log(`\n📦 ${model.name}`);
                    console.log(`   Display Name: ${model.displayName || 'N/A'}`);
                    console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                    if (model.description) {
                        console.log(`   Description: ${model.description.substring(0, 100)}...`);
                    }
                });
                
                console.log("\n" + "=".repeat(70));
                console.log("\n💡 Use these model names (without 'models/' prefix) in your code:");
                response.models
                    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                    .forEach(m => {
                        const modelName = m.name.replace('models/', '');
                        console.log(`   ✅ "${modelName}"`);
                    });
            } else {
                console.log("No models found!");
            }
        } else {
            console.error(`Error: Status ${res.statusCode}`);
            console.error(data);
        }
    });
}).on('error', (error) => {
    console.error('Error:', error.message);
});

