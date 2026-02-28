# M3 Office 3D

Visualização 3D em tempo real do Dev Trio (Organizer, Coder, Verifier) trabalhando em um escritório virtual.

![M3 Office 3D](./docs/preview.png)

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Three.js** - Engine 3D
- **React Three Fiber** - Integração React + Three.js
- **Drei** - Componentes utilitários 3D
- **Zustand** - State management
- **React Spring** - Animações

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

### 1. Setup Inicial

```bash
# Criar projeto Next.js
npx create-next-app@latest m3-office-3d --typescript --tailwind --app

# Entrar na pasta
cd m3-office-3d

# Instalar dependências
npm install three @react-three/fiber @react-three/drei
npm install @react-spring/three zustand lucide-react clsx tailwind-merge
npm install -D @types/three
```

### 2. Configurar TypeScript Paths

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. Copiar arquivos do projeto

Copie os arquivos desta pasta para seu projeto:
- `types/` → Tipos TypeScript
- `lib/` → Utilitários e constantes
- `store/` → Zustand store
- `components/` → Componentes React
- `hooks/` → Custom hooks

### 4. Configurar Next.js para exportação estática

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
}

module.exports = nextConfig
```

### 5. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

## 📁 Estrutura do Projeto

```
m3-office-3d/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout raiz
│   └── globals.css           # Estilos globais
├── components/
│   ├── scene/                # Componentes 3D
│   │   ├── Office.tsx
│   │   ├── OfficeEnvironment.tsx
│   │   ├── Workstation.tsx
│   │   ├── Desk.tsx
│   │   ├── Chair.tsx
│   │   ├── Computer.tsx
│   │   ├── Screen.tsx
│   │   └── Avatar.tsx
│   ├── ui/                   # Componentes UI
│   │   ├── UIOverlay.tsx
│   │   ├── StatusBar.tsx
│   │   └── AgentCard.tsx
│   └── screen-content/       # Conteúdo das telas
│       ├── ScreenContent.tsx
│       └── TerminalView.tsx
├── hooks/                    # Custom hooks
│   ├── useM3State.ts
│   ├── useAgentAnimation.ts
│   └── useScreenTexture.ts
├── lib/                      # Utilitários
│   ├── utils.ts
│   ├── constants.ts
│   └── types.ts
├── store/                    # Zustand store
│   └── m3Store.ts
├── types/                    # TypeScript types
│   └── index.ts
├── public/
│   └── m3-state.json         # Arquivo de estado
└── next.config.js
```

## 🎮 Como Usar

### Modificar Estado

Edite o arquivo `public/m3-state.json` para simular diferentes estados:

```json
{
  "status": "coding",
  "task": "Criar componente de login",
  "progress": 60,
  "current_agent": "coder",
  "attempts": {
    "organizer": 1,
    "coder": 2,
    "verifier": 0
  },
  "logs": [
    {
      "time": 1709155200000,
      "agent": "coder",
      "message": "Implementando validação de formulário",
      "level": "info"
    }
  ]
}
```

### Status Possíveis

- `idle` - Aguardando
- `organizing` - Organizer planejando
- `coding` - Coder implementando
- `verifying` - Verifier testando
- `completed` - Tarefa concluída
- `error` - Erro encontrado

### Agents

| Agente | Cor | Função |
|--------|-----|--------|
| Organizer | Azul | Analisa e planeja |
| Coder | Verde | Implementa código |
| Verifier | Roxo | Testa e verifica |

## 🎨 Customização

### Cores

Edite `lib/constants.ts`:

```typescript
export const AGENT_COLORS = {
  organizer: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    glow: '#60A5FA',
  },
  // ...
};
```

### Posições

```typescript
export const WORKSTATION_CONFIGS = [
  {
    agent: 'organizer',
    position: [-4, 0, 0],  // [x, y, z]
    rotation: [0, Math.PI / 6, 0],
    // ...
  },
];
```

## 🚀 Deploy

### Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod
```

Ou conecte seu repositório Git na dashboard da Vercel.

## 📚 Documentação

- [SPECIFICATION.md](./SPECIFICATION.md) - Especificação técnica completa
- [PLAN.md](./PLAN.md) - Plano de implementação

## 📝 Licença

MIT
