# Deploy M3 Office 3D

O projeto está completo e buildado em `/root/.openclaw/workspace/m3-office-3d/dist/`

## Opção 1: Deploy no seu GitHub (recomendado)

```bash
# 1. Crie um novo repo no GitHub (ex: m3-office-3d)
# 2. No terminal:
cd /root/.openclaw/workspace/m3-office-3d
git remote add origin https://github.com/SEU_USUARIO/m3-office-3d.git
git push -u origin main

# 3. Ative GitHub Pages:
# - Settings > Pages
# - Source: Deploy from a branch
# - Branch: gh-pages

# 4. Deploy automático:
npm run deploy
```

## Opção 2: Ver localmente

```bash
cd /root/.openclaw/workspace/m3-office-3d
npm install
npm run dev
# Acesse: http://localhost:3000
```

## Opção 3: Vercel (mais fácil)

```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

## 📁 Estrutura do Projeto

```
dist/                    # Build pronto para deploy
├── index.html          # Página principal
├── m3-state.json       # Mock de dados
└── _next/              # Assets
```

## 🎮 Funcionalidades

- ✅ 4 estações: Maestro, Organizer, Coder, Verifier
- ✅ Animações em tempo real (typing, thinking, completed, error)
- ✅ Telas dos PCs mostrando progresso
- ✅ UI overlay com status geral
- ✅ Integração com m3-state.json (polling 1s)
- ✅ Controles de câmera (orbital)

## 🎨 Cores por Agente

- 🟡 **Maestro**: Âmbar (#F59E0B) - Centro, comando
- 🔵 **Organizer**: Azul (#3B82F6) - Planejamento
- 🟢 **Coder**: Verde (#10B981) - Desenvolvimento
- 🟣 **Verifier**: Roxo (#8B5CF6) - QA/Revisão

## 📊 Total

- **3,186 linhas** de código
- **39 arquivos**
- **~12 minutos** de desenvolvimento com M3
