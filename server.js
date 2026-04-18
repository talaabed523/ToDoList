require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: message }]
        })
    });

    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data));

    if (data.choices && data.choices[0]) {
        res.json({ reply: data.choices[0].message.content });
    } else {
        res.json({ reply: "Sorry, something went wrong. Please try again." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));