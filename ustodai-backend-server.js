const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'UstodAI Backend кор мекунад! 🎓' });
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, subject } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages лозим аст' });
    }

    let system = 'Ту устоди мактаб ҳастӣ бо номи UstodAI. ';
    if (subject && subject !== 'Ҳама') {
      system += 'Мавзӯъ: ' + subject + '. ';
    }
    system += 'Ҷавобҳои кӯтоҳ ва равшан бо тоҷикӣ деҳ. Emoji истифода кун. Донишҷӯро дилгарм кун.';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    res.json({ text: data.content[0].text });

  } catch (err) {
    res.status(500).json({ error: 'Сервер хатогӣ: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('UstodAI Backend порти ' + PORT + ' дар кор аст!');
});
