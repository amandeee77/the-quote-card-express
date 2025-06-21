"use strict";

const express = require("express");
const app = express();
const port = 8080;
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
    origin: "http://localhost:5500", // If your front end runs here; adjust if needed
};

app.use(cors(corsOptions));
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function getRandomImage() {
    const endpoint = `https://api.unsplash.com/photos/random/?client_id=${process.env.CLIENT_ID}`;
    try {
        const response = await fetch(endpoint);
        const returnedData = await response.json();

        if (!returnedData.urls || !returnedData.urls.regular) {
            throw new Error(`Unexpected response: ${JSON.stringify(returnedData)}`);
        }

        return returnedData.urls.regular;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

app.get("/api/v1/getRandomImage", async (req, res) => {
    const imageUrl = await getRandomImage();
    if (imageUrl) {
        res.status(200).json({ status: 200, data: imageUrl });
    } else {
        res.status(500).json({ status: 500, message: "Failed to retrieve image" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});