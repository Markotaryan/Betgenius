import { useState } from 'react';
import Head from 'next/head';

const LEAGUE_STYLES = {
  'Premier League': { accent: '#00ff87', badge: '#1a3a1a', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'La Liga':        { accent: '#ff6b35', badge: '#2a1a0a', icon: '🇪🇸' },
  'NBA':            { accent: '#f7b731', badge: '#1a1a0a', icon: '🏀' },
  'Euroliga':       { accent: '#00d4ff', badge: '#0a1a2a', icon: '🌍' },
  'Combinada':      { accent: '#a78bfa', badge: '#1a0a2e', icon: '🔗' },
  'Especial':       { accent: '#ff4da6', badge: '#2a0a1a', icon: '⭐' },
};

const getRisk = (prob) => {
  if (prob >= 75) return { label: 'MUY ALTA', color: '#00ff87', bg: 'rgba(0,255,135,0.1)' };
  if (prob >= 62) return { label: 'ALTA',     color: '#7af542', bg: 'rgba(122,245,66,0.1)' };
  if (prob >= 48) return { label: 'MEDIA',    color: '#f7b731', bg: 'rgba(247,183,49,0.1)' };
  return              { label: 'ESPECIAL',    color: '#ff6b35', bg: 'rgba(255,107,53,0.1)' };
};

function ProbCircle({ value, color }) {
  const r = 30, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="76" height="76" style={{ flexShrink: 0 }}>
      <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
      <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 38 38)"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="38" y="43" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">{value}%</text>
    </svg>
  );
}

function TipCard({ tip, index, bankroll }) {
  const [open, setOpen] = useState(false);
  const ls = LEAGUE_STYLES[tip.league] || { accent: '#7c3aed', badge: '#1a0a2e', icon: '🎯' };
  const risk = getRisk(tip.probability);
  const stakeAmt = ((bankroll * tip.stake_pct) / 100).toFixed(0);

  return (
    <div className="fade-in" style={{
      animationDelay: `${index * 0.07}s`,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18, overflow: 'hidden', marginBottom: 12,
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${ls.accent}, transparent)` }} />

      <div style={{ padding: '16px 18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              <span style={{
                background: ls.badge, color: ls.accent, fontSize: 11, fontWeight: 700,
                padding: '3px 9px', borderRadius: 6
              }}>{ls.icon} {tip.league}</span>
              <span style={{
                background: risk.bg, color: risk.color, fontSize: 11, fontWeight: 700,
                padding: '3px 9px', borderRadius: 6
              }}>● {risk.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '3px 0' }}>
                {tip.date} · {tip.time}
              </span>
            </div>

            {/* Match */}
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
              {tip.match}
            </div>

            {/* Prediction pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${ls.accent}12`, border: `1px solid ${ls.accent}25`,
              padding: '6px 14px', borderRadius: 10, marginBottom: 6
            }}>
              <span style={{ color: ls.accent, fontWeight: 800, fontSize: 15 }}>{tip.prediction}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>·</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{tip.bet_type}</span>
            </div>
          </div>

          <ProbCircle value={tip.probability} color={risk.color} />
        </div>

        {/* Quick info row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 8,
            padding: '6px 12px', fontSize: 12
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Cuota: </span>
            <span style={{ color: ls.accent, fontWeight: 700 }}>@{tip.odds_min} – {tip.odds_max}</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 8,
            padding: '6px 12px', fontSize: 12
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Stake: </span>
            <span style={{ color: '#f7b731', fontWeight: 700 }}>{tip.stake_pct}% · ${stakeAmt}</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 8,
            padding: '6px 12px', fontSize: 12
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Valor: </span>
            {'⭐'.repeat(Math.min(Math.round(tip.value_rating / 2), 5))}
          </div>
        </div>

        {/* Expand button */}
        <button onClick={() => setOpen(!open)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
          fontSize: 12, cursor: 'pointer', marginTop: 10, padding: '4px 0',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          {open ? '▲ Ocultar análisis' : '▼ Ver análisis completo'}
        </button>

        {/* Expandable analysis */}
        {open && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 12 }}>
              {tip.analysis}
            </p>
            {tip.stats?.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.45)'
              }}>
                <span style={{ color: ls.accent, flexShrink: 0 }}>▸</span>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [combo, setCombo] = useState(null);
  const [comboLoading, setComboLoading] = useState(false);
  const [tab, setTab] = useState('tips');
  const [filter, setFilter] = useState('Todas');
  const [bankroll, setBankroll] = useState(1000);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');

  const generateTips = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tips', { method: 'POST' });
      const data = await res.json();
      if (data.tips) { setTips(data.tips); setGenerated(true); }
      else setError('Error al generar tips. Intentá de nuevo.');
    } catch (e) {
      setError('Error de conexión. Intentá de nuevo.');
    }
    setLoading(false);
  };

  const generateCombo = async () => {
    const highProb = tips.filter(t => t.probability >= 60);
    if (!highProb.length) return;
    setComboLoading(true);
    try {
      const res = await fetch('/api/combo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tips: highProb })
      });
      const data = await res.json();
      if (data.combo) setCombo(data.combo);
    } catch (e) {}
    setComboLoading(false);
  };

  const filtered = tips.filter(t => {
    if (filter === 'Todas') return true;
    if (filter === 'Fútbol') return t.sport === 'futbol';
    if (filter === 'NBA') return t.league === 'NBA';
    if (filter === 'Alta Prob.') return t.probability >= 65;
    return true;
  });

  const avgProb = tips.length ? Math.round(tips.reduce((a, t) => a + t.probability, 0) / tips.length) : 0;
  const highProbCount = tips.filter(t => t.probability >= 65).length;

  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <Head>
        <title>BetGenius AI — Tips de Apuestas con Inteligencia Artificial</title>
        <meta name="description" content="Análisis profesional de apuestas deportivas con IA. Los mejores tips del día para fútbol, NBA y Euroliga con estadísticas reales." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#08080f' }}>

        {/* HEADER */}
        <header style={{
          background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, boxShadow: '0 4px 20px rgba(124,58,237,0.35)'
                }}>🎯</div>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.3px' }}>
                    <span style={{ color: '#a78bfa' }}>Bet</span>
                    <span>Genius</span>
                    <span style={{
                      marginLeft: 7, fontSize: 9, background: 'linear-gradient(90deg,#7c3aed,#4f46e5)',
                      padding: '2px 6px', borderRadius: 20, fontWeight: 700, letterSpacing: 1, verticalAlign: 'middle'
                    }}>AI</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                    Análisis deportivo con IA · {today}
                  </div>
                </div>
              </div>
              {generated && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{
                    background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)',
                    borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#00ff87', fontWeight: 600
                  }}>
                    ✓ {tips.length} tips listos
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2 }}>
              {[
                { id: 'tips', label: '🎯 Tips del Día' },
                { id: 'combo', label: '🔗 Combinadas' },
                { id: 'bankroll', label: '💰 Bankroll' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  background: tab === t.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: tab === t.id ? '2px solid #7c3aed' : '2px solid transparent',
                  color: tab === t.id ? '#a78bfa' : 'rgba(255,255,255,0.35)',
                  padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                  fontWeight: 600, borderRadius: '8px 8px 0 0', transition: 'all 0.2s'
                }}>{t.label}</button>
              ))}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 60px' }}>

          {/* ===== TIPS TAB ===== */}
          {tab === 'tips' && (
            <div>
              {!generated ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,70,229,0.04))',
                  borderRadius: 24, border: '1px solid rgba(124,58,237,0.15)', marginBottom: 24
                }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>
                    Tips del Día con IA
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 8, maxWidth: 420, margin: '0 auto 8px', fontSize: 14, lineHeight: 1.6 }}>
                    La IA analiza standings, forma reciente, estadísticas H2H y probabilidades estadísticas de los partidos de hoy.
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 28, fontSize: 13 }}>
                    🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League · 🇪🇸 La Liga · 🏀 NBA · 🌍 Euroliga
                  </p>
                  {error && (
                    <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16 }}>{error}</div>
                  )}
                  <button onClick={generateTips} disabled={loading} style={{
                    background: loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    border: 'none', color: 'white', padding: '15px 40px',
                    borderRadius: 14, fontSize: 16, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 8px 30px rgba(124,58,237,0.4)',
                    display: 'inline-flex', alignItems: 'center', gap: 10
                  }}>
                    {loading ? <><span className="spinner" /> Analizando partidos...</> : '✨ Generar 10 Tips de Hoy'}
                  </button>
                  <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                    ⚠️ Solo para análisis. No es asesoramiento financiero. Jugá responsablemente.
                  </div>
                </div>
              ) : (
                <>
                  {/* Stats bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
                    {[
                      { label: 'Tips Generados', value: tips.length, icon: '🎯', color: '#a78bfa' },
                      { label: 'Alta Probabilidad', value: highProbCount, icon: '✅', color: '#00ff87' },
                      { label: 'Prob. Promedio', value: avgProb + '%', icon: '📊', color: '#f7b731' },
                    ].map(s => (
                      <div key={s.label} style={{
                        background: 'rgba(255,255,255,0.03)', borderRadius: 14,
                        padding: '14px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 18 }}>{s.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: '4px 0' }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Filters */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['Todas', 'Fútbol', 'NBA', 'Alta Prob.'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                          background: filter === f ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.05)',
                          border: 'none', color: filter === f ? 'white' : 'rgba(255,255,255,0.45)',
                          padding: '7px 16px', borderRadius: 20, fontSize: 13,
                          fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}>{f}</button>
                      ))}
                    </div>
                    <button onClick={generateTips} disabled={loading} style={{
                      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                      color: '#a78bfa', padding: '7px 14px', borderRadius: 20,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}>🔄 Regenerar</button>
                  </div>

                  {/* Tips list */}
                  {filtered.map((tip, i) => (
                    <TipCard key={tip.id} tip={tip} index={i} bankroll={bankroll} />
                  ))}

                  <div style={{
                    textAlign: 'center', marginTop: 24, padding: '14px',
                    background: 'rgba(255,100,50,0.05)', borderRadius: 12,
                    border: '1px solid rgba(255,100,50,0.1)', fontSize: 12,
                    color: 'rgba(255,255,255,0.3)', lineHeight: 1.6
                  }}>
                    ⚠️ BetGenius AI es una herramienta de análisis estadístico. No garantiza resultados.
                    Las apuestas implican riesgo de pérdida. Jugá responsablemente.
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== COMBO TAB ===== */}
          {tab === 'combo' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🔗 Generador de Combinadas</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  La IA selecciona los mejores tips y los combina para maximizar el retorno con el menor riesgo posible.
                </p>
              </div>

              {!generated ? (
                <div style={{
                  textAlign: 'center', padding: '40px',
                  background: 'rgba(255,255,255,0.02)', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                    Primero generá los tips del día
                  </p>
                  <button onClick={() => setTab('tips')} style={{
                    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa', padding: '10px 20px', borderRadius: 10,
                    cursor: 'pointer', fontWeight: 600, fontSize: 14
                  }}>Ir a Tips del Día →</button>
                </div>
              ) : (
                <>
                  <button onClick={generateCombo} disabled={comboLoading} style={{
                    background: comboLoading ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    border: 'none', color: 'white', padding: '14px 28px', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: comboLoading ? 'not-allowed' : 'pointer',
                    marginBottom: 24, boxShadow: '0 6px 24px rgba(124,58,237,0.3)',
                    display: 'inline-flex', alignItems: 'center', gap: 10
                  }}>
                    {comboLoading ? <><span className="spinner" /> Calculando...</> : '🔗 Generar Mejor Combinada'}
                  </button>

                  {combo && (
                    <div className="fade-in" style={{
                      background: 'rgba(124,58,237,0.05)',
                      borderRadius: 18, border: '1px solid rgba(124,58,237,0.2)',
                      overflow: 'hidden'
                    }}>
                      <div style={{ height: 3, background: 'linear-gradient(90deg,#7c3aed,#4f46e5,#7c3aed)' }} />
                      <div style={{ padding: 24 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                          🔗 Combinada Recomendada por IA
                        </div>

                        {combo.selections?.map((s, i) => (
                          <div key={i} style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                            padding: '12px 16px', marginBottom: 10,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8
                          }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.match}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{s.bet}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: 16 }}>@{s.odds}</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.prob}% prob.</div>
                            </div>
                          </div>
                        ))}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '20px 0' }}>
                          {[
                            { label: 'Cuota Total', value: `@${combo.total_odds}`, color: '#a78bfa' },
                            { label: 'Prob. Combinada', value: `${combo.combined_prob}%`, color: '#00ff87' },
                            { label: 'Multiplicador', value: `×${combo.potential_multiplier}`, color: '#f7b731' },
                          ].map(s => (
                            <div key={s.label} style={{
                              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                              padding: '14px', textAlign: 'center'
                            }}>
                              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{
                          background: 'rgba(124,58,237,0.08)', borderRadius: 12,
                          padding: '14px 16px', border: '1px solid rgba(124,58,237,0.15)', marginBottom: 14
                        }}>
                          <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, marginBottom: 6 }}>💡 Análisis IA</div>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{combo.analysis}</p>
                        </div>

                        <div style={{
                          background: 'rgba(247,183,49,0.08)', borderRadius: 10,
                          padding: '10px 14px', border: '1px solid rgba(247,183,49,0.15)', fontSize: 13
                        }}>
                          <span style={{ color: '#f7b731' }}>💰 Stake recomendado: </span>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                            {combo.stake_pct}% de tu bankroll · ${((bankroll * combo.stake_pct) / 100).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== BANKROLL TAB ===== */}
          {tab === 'bankroll' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>💰 Gestión de Bankroll</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>
                Ingresá tu capital total y calculamos cuánto apostar en cada tip.
              </p>

              <div style={{
                background: 'rgba(124,58,237,0.06)', borderRadius: 18, padding: 24,
                border: '1px solid rgba(124,58,237,0.15)', marginBottom: 20
              }}>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 12 }}>
                  Tu Bankroll Total (USD)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 30, color: '#f7b731' }}>$</span>
                  <input type="number" value={bankroll} onChange={e => setBankroll(Number(e.target.value))}
                    style={{
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white', padding: '12px 16px', borderRadius: 12,
                      fontSize: 28, fontWeight: 800, width: 180, outline: 'none'
                    }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Apuesta Mínima (1%)', pct: 1, color: '#00ff87', icon: '🔒', desc: 'Apuestas de muy bajo riesgo' },
                  { label: 'Apuesta Conservadora (3%)', pct: 3, color: '#7af542', icon: '✅', desc: 'Alta probabilidad (>75%)' },
                  { label: 'Apuesta Estándar (5%)', pct: 5, color: '#f7b731', icon: '⚡', desc: 'Probabilidad media-alta' },
                  { label: 'Apuesta Agresiva (8%)', pct: 8, color: '#ff6b35', icon: '🎯', desc: 'Solo cuando estás muy seguro' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 14,
                    padding: '16px', border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ fontSize: 20 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: '8px 0 4px' }}>
                      ${((bankroll * s.pct) / 100).toFixed(0)}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(124,58,237,0.06)', borderRadius: 14, padding: '18px 20px',
                border: '1px solid rgba(124,58,237,0.15)', marginBottom: 16
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#a78bfa' }}>
                  📋 Reglas de Oro
                </div>
                {[
                  'Nunca apostés más del 5% en una apuesta individual.',
                  'En combinadas, máximo 2-3% — el riesgo se multiplica.',
                  'Si perdés el 20% del bankroll, tomá una pausa de al menos 1 semana.',
                  'Registrá TODAS tus apuestas para analizar tu rendimiento real.',
                  'Separar el bankroll de tus finanzas personales es fundamental.',
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, marginBottom: 10,
                    fontSize: 13, color: 'rgba(255,255,255,0.55)', alignItems: 'flex-start'
                  }}>
                    <span style={{ color: '#7c3aed', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    {r}
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(255,100,50,0.06)', borderRadius: 14, padding: '14px 18px',
                border: '1px solid rgba(255,100,50,0.12)'
              }}>
                <div style={{ fontSize: 12, color: '#ff6b35', fontWeight: 600, marginBottom: 6 }}>⚠️ Juego Responsable</div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.7 }}>
                  Las apuestas deportivas implican riesgo real de pérdida económica. BetGenius AI es una herramienta
                  de análisis estadístico y no garantiza resultados. Si sentís que el juego es un problema,
                  buscá ayuda profesional.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
