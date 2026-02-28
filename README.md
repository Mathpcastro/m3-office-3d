# M3 Office 3D

Visualização em tempo real do Dev Trio (Organizer, Coder, Verifier) trabalhando em um escritório 3D usando Three.js.

## Conceito

Um escritório 3D interativo onde cada agente do M3 (Organizer, Coder, Verifier) tem sua própria estação de trabalho com PC. O progresso das tarefas é mostrado em tempo real nas telas.

## Funcionalidades

- [ ] Escritório 3D completo com iluminação
- [ ] 3 avatares/estações: Organizer, Coder, Verifier
- [ ] PCs com telas mostrando progresso em tempo real
- [ ] Animações dos agentes (digitando, pensando, terminando)
- [ ] Integração com M3 state para atualização real
- [ ] Câmera orbital para explorar o escritório
- [ ] UI overlay com status geral

## Tecnologias

- Next.js 14
- Three.js + React Three Fiber
- TypeScript
- Tailwind CSS
- Socket.io (para realtime updates)

## Estrutura

```
app/
├── components/
│   ├── Office.tsx          # Cena 3D principal
│   ├── Agent.tsx           # Componente do agente (avatar + PC)
│   ├── Computer.tsx        # PC com tela animada
│   └── Camera.tsx          # Câmera orbital
├── hooks/
│   └── useM3State.ts       # Hook para ler estado do M3
├── types/
│   └── agent.ts
└── page.tsx
public/
└── models/                 # Modelos 3D (se necessário)
```

## Como usar

1. O M3 cria uma task em `m3-state.json`
2. O escritório 3D lê esse estado em tempo real
3. Cada agente mostra sua fase atual na tela do PC
4. Animações refletem o estado (idle, working, completed, error)

## Deploy

Vercel (suporta Three.js SSR)
