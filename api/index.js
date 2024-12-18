const express = require("express");
const sharp = require("sharp");

const app = express();

app.get("/resize", async (req, res) => {
    const { url, width, height } = req.query;

    if (!url || !width || !height) {
        return res.status(400).send("Missing parameters: url, width, or height");
    }

    try {
        // Fetch the image
        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const imageBuffer = await response.arrayBuffer();

        // Resize the image
        const resizedImage = await sharp(Buffer.from(imageBuffer))
            .resize(parseInt(width), parseInt(height))
            .jpeg()
            .toBuffer();

        // Return the resized image
        res.setHeader("Content-Type", "image/jpeg");
        res.send(resizedImage);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
