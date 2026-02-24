// api/analyze.js
export default async function handler(req, res) {
    // Only allow POST requests from your website
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, data } = req.body; 
    const apiKey = process.env.GROQ_API_KEY; // Make sure this matches your Vercel Environment Variable name!

    let systemPrompt = "";

    // The ML Tool Logic (For Hriday)
    if (type === 'ml') {
        systemPrompt = `You are the "Behavioral ML Engine" built by Hriday Das. 
        The user has entered a suspect social media username: ${data}.
        Generate a highly realistic, simulated behavioral analysis for this specific username. 
        Format your response EXACTLY like this terminal output:
        
        > ML MODEL INITIATED
        > SCANNING USERNAME: ${data}
        > EXTRACTING NEURAL BEHAVIORAL PATTERNS...
        -----------------------------------
        [!] SYNTHETIC PROBABILITY: [Generate a % between 0-100 based on how suspicious the username sounds]
        [!] BEHAVIORAL ENTROPY: [Low / Medium / High]
        
        >> ML PREDICTIONS FOR ${data}:
        - Est. Account Age: [Generate a random realistic timeframe]
        - Automation Level: [e.g., High - Likely Python/Selenium bot]
        - Engagement Authenticity: [e.g., 2% Real, 98% Farmed]
        
        >> BEHAVIORAL ANOMALIES DETECTED:
        1. [Make up a realistic behavioral flag, e.g., "Posts exactly every 4 hours"]
        2. [Make up a stylometric flag, e.g., "High usage of copy-pasted cryptocurrency links"]
        -----------------------------------
        > ML ANALYSIS COMPLETE.`;
    } 
    // The OSINT Tool Logic (For Prosenjit)
    else {
        systemPrompt = `You are the "Cyber Forensic OSINT Engine" built by Prosenjit Singha. 
        The user has entered a suspect social media username: ${data}.
        Generate a highly realistic, simulated OSINT background check for this specific username.
        Format your response EXACTLY like this terminal output:
        
        > FORENSIC OSINT AUDIT INITIATED
        > TARGET ACQUIRED: ${data}
        > QUERYING METADATA AND GRAPH NODES...
        -----------------------------------
        [!] THREAT STATUS: [CONFIRMED FAKE / SUSPICIOUS / VERIFIED]
        
        >> EXTRACTED TELEMETRY FOR ${data}:
        - Hidden UID Creation Date: [Generate a specific past date/time, e.g., 2023-11-12 14:02:11 UTC]
        - Geo-Temporal Origin: [Generate a specific location, e.g., Originating IP block traces to Lagos, Nigeria]
        - Clone Status: [e.g., YES - Mimicking a verified profile]
        
        >> FORENSIC EVIDENCE:
        1. [Make up a realistic metadata flaw, e.g., "Profile image traces back to a 2018 stock photo site"]
        2. [Make up a graph theory flaw, e.g., "Follower network shows 0 mutual connections (Linear Graph)"]
        
        >> RECOMMENDED ACTION: Escalate to Grievance Officer via Section 79.
        -----------------------------------
        > FORENSIC AUDIT COMPLETE.`;
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Using Meta's Llama 3 model
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Analyze the username: ${data}` }
                ],
                temperature: 0.7
            })
        });

        const apiData = await response.json();
        
        // Error handling if the API key is wrong or Groq is down
        if (apiData.error) {
            return res.status(200).json({ result: `> API ERROR: ${apiData.error.message}` });
        }

        const generatedText = apiData.choices[0].message.content;
        res.status(200).json({ result: generatedText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Engine failure' });
    }
}
