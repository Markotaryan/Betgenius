export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { tips } = req.body;

  const prompt = `Eres un experto en apuestas deportivas. Analizá estos tips de alta probabilidad y construí la MEJOR combinada posible maximizando el balance entre probabilidad y cuota:

${JSON.stringify(tips.map(t => ({ partido: t.match, apuesta: t.prediction, prob: t.probability, cuota_min: t.odds_min, cuota_max: t.odds_max })))}

Seleccioná 2 o 3 apuestas (no más) que tengan alta correlación de éxito y cuota combinada atractiva.

Responde SOLO en JSON:
{
  "combo": {
    "selections": [
      {"match": "...", "bet": "...", "odds": 1.20, "prob": 80}
    ],
    "total_odds": 2.45,
    "combined_prob": 58,
    "stake_pct": 2,
    "potential_multiplier": 2.45,
    "analysis": "Análisis de 3-4 oraciones explicando por qué esta combinada tiene valor real...",
    "risk_level": "MEDIA",
    "value_rating": 8
  }
}`;

  try {
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
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: 'Error generando combinada' });
  }
}
