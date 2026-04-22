export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `Eres un experto analista de apuestas deportivas con 15 años de experiencia en estadísticas deportivas. Hoy es ${today}.

Analiza los siguientes datos REALES y genera EXACTAMENTE 10 tips de apuestas para hoy.

=== DATOS NBA - STANDINGS ACTUALES (Temporada 2025-26) ===
TOP OESTE: OKC Thunder (64-18) #1 | San Antonio Spurs (62-20) #2 | Denver Nuggets (54-28) | Lakers (53-29) | Houston Rockets (52-30)
TOP ESTE: Detroit Pistons (60-22) #1 | Boston Celtics (56-26) #2 | New York Knicks (53-29) | Cleveland (52-30) | Toronto (46-36)
Temporada terminando, playoffs en curso.

=== PREMIER LEAGUE - PRÓXIMOS PARTIDOS ===
- Burnley vs Man City (Mié 22 Abr): Prob. Man City 84.9% | Empate 9.9% | Burnley 5.2%
- Bournemouth vs Leeds (Mié 22 Abr): Prob. Bournemouth 47.4% | Empate 26.4% | Leeds 26.2%
- Liverpool vs Crystal Palace (Sáb 25 Abr): Prob. Liverpool 65.5% | Empate 19.4% | Palace 15.1%
- Arsenal vs Newcastle (Sáb 25 Abr): Prob. Arsenal 65.4% | Empate 19.5% | Newcastle 15.1%
- Man United vs Brentford (Lun 27 Abr): Prob. Man United 51.7% | Empate 24.1% | Brentford 24.2%

=== LA LIGA - PRÓXIMOS PARTIDOS ===
- Barcelona vs Celta Vigo (Mié 22 Abr): Prob. Barcelona 78.4% | Empate 12.7% | Celta 8.9%
- Elche vs Atlético Madrid (Mié 22 Abr): Prob. Elche 39.7% | Empate 26% | Atlético 34.3%
- Real Betis vs Real Madrid (Vie 24 Abr): Prob. Betis 26.1% | Empate 23.5% | Real Madrid 50.4%
- Getafe vs Barcelona (Sáb 25 Abr): Prob. Getafe 14.6% | Empate 20.5% | Barcelona 64.9%
- Villarreal vs Real Oviedo (Jue 23 Abr): Prob. Villarreal 46.1% | Empate 27.9% | Oviedo 26%

=== RESULTADOS RECIENTES ===
- Brighton 3-0 Chelsea (hoy)
- Real Madrid 2-1 Alavés (hoy)
- Man City 2-1 Arsenal (dom pasado)
- Leeds 3-0 Wolverhampton
- Barcelona ganó sus últimos 4 partidos

Genera 10 tips con esta distribución:
- 4 tips fútbol (Premier League y La Liga, los más próximos)
- 3 tips NBA playoffs
- 1 tip Euroliga
- 1 tip combinada (parlay 2-3 selecciones de alta prob)
- 1 tip de valor especial (apuesta alternativa interesante)

Para cada tip, responde SOLO en este JSON exacto (sin texto adicional, sin backticks):
{
  "tips": [
    {
      "id": 1,
      "league": "Premier League",
      "sport": "futbol",
      "match": "Burnley vs Manchester City",
      "date": "Mié 22 Abr",
      "time": "16:00",
      "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      "bet_type": "Victoria Visitante",
      "prediction": "Manchester City Gana",
      "probability": 83,
      "odds_min": 1.18,
      "odds_max": 1.28,
      "stake_pct": 4,
      "analysis": "Análisis detallado de 3-4 oraciones explicando por qué esta apuesta tiene valor...",
      "stats": ["Stat 1 concreta con números", "Stat 2 concreta con números", "Stat 3 H2H o forma reciente"],
      "value_rating": 7
    }
  ]
}

El campo value_rating es del 1 al 10 (qué tan buena es la apuesta considerando probabilidad vs cuota).
Devuelve SOLO el JSON. Sin texto antes ni después.`;

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
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error generando tips' });
  }
}
