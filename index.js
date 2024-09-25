const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const corsOptions = {
               origin: ' http://localhost:5173', // replace with your actual frontend URL
               methods: ['GET', 'POST'], // specify allowed methods
               allowedHeaders: ['Content-Type', 'Authorization'], // allow specific headers
             };
app.use(cors(corsOptions));
app.use(express.json());

app.post('/check', async (req, res) => {
  const { videoId } = req.body;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
               const browser = await puppeteer.launch({
                              args: ['--no-sandbox', '--disable-setuid-sandbox'],  // Required for Render
                            });
    const page = await browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'networkidle2' });
    
    const pageContent = await page.content();
    const isMonetized = pageContent.includes('"yt_ad":');
    
    await browser.close();
    
    res.json({ isMonetized });
  } catch (error) {
    console.error('Error fetching video source:', error);
    res.status(500).json({ error: 'Error fetching video source' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
