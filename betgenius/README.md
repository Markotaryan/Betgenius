# BetGenius AI 🎯

App de análisis de apuestas deportivas con Inteligencia Artificial.

## Stack
- Next.js 14
- API de Anthropic (Claude)
- Deploy en Vercel (gratis)

## Cómo publicar en Vercel

### Paso 1 — Subir a GitHub
1. Creá un repositorio nuevo en github.com (botón verde "New")
2. Nombre: `betgenius` — Privado ✓ — Sin README
3. Copiá los comandos que te da GitHub y ejecutalos en terminal

### Paso 2 — Conectar Vercel
1. Entrá a vercel.com y creá cuenta con tu GitHub
2. "Add New Project" → seleccioná el repo `betgenius`
3. En "Environment Variables" agregá:
   - Key: `ANTHROPIC_API_KEY`
   - Value: tu key de Anthropic
4. Click "Deploy"

### Paso 3 — Tu URL
Vercel te da una URL tipo: `betgenius.vercel.app`

## Variables de entorno necesarias
```
ANTHROPIC_API_KEY=sk-ant-...
```

⚠️ NUNCA subas el archivo .env.local a GitHub. Ya está en .gitignore.
