# Especificação Técnica - M3 Office 3D

## 📋 Resumo do Projeto

Visualização 3D em tempo real do trio de agentes (Organizer, Coder, Verifier) trabalhando em um escritório virtual, integrado com o sistema M3.

---

## 1. Especificação Técnica Detalhada

### 1.1 Stack Tecnológico

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|-----------|
| Framework | Next.js | 14+ | SSR, routing, API routes |
| Language | TypeScript | 5+ | Type safety |
| Styling | Tailwind CSS | 3.4+ | UI styling |
| 3D Engine | Three.js | 0.160+ | Core 3D rendering |
| React 3D | @react-three/fiber | 8.15+ | React integration |
| 3D Helpers | @react-three/drei | 9.92+ | Pre-built 3D components |
| State | Zustand | 4.4+ | Global state management |
| Icons | Lucide React | latest | UI icons |
| Animation | @react-spring/three | 9.7+ | Smooth animations |

### 1.2 Arquitetura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Overlay Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Status Bar  │  │  Controls   │  │   Agent Legend      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      3D Scene Layer                          │
│                    (React Three Fiber)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Office Environment                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │    │
│  │  │ Station  │  │ Station  │  │ Station  │          │    │
│  │  │Organizer │  │  Coder   │  │ Verifier │          │    │
│  │  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │          │    │
│  │  │ │Agent │ │  │ │Agent │ │  │ │Agent │ │          │    │
│  │  │ │ + PC │ │  │ │ + PC │ │  │ │ + PC │ │          │    │
│  │  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │          │    │
│  │  └──────────┘  └──────────┘  └──────────┘          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│           (Zustand Store + m3-state.json polling)            │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Design System - Cores

#### Cores dos Agentes
```typescript
const AGENT_COLORS = {
  organizer: {
    primary: '#3B82F6',   // Blue-500
    secondary: '#1D4ED8', // Blue-700
    glow: '#60A5FA',      // Blue-400
  },
  coder: {
    primary: '#10B981',   // Emerald-500
    secondary: '#047857', // Emerald-700
    glow: '#34D399',      // Emerald-400
  },
  verifier: {
    primary: '#8B5CF6',   // Violet-500
    secondary: '#6D28D9', // Violet-700
    glow: '#A78BFA',      // Violet-400
  },
} as const;
```

#### Cores de Status
```typescript
const STATUS_COLORS = {
  idle: '#6B7280',      // Gray-500
  working: '#FBBF24',   // Amber-400 (pulsing)
  completed: '#10B981', // Emerald-500
  error: '#EF4444',     // Red-500 (fast pulse)
} as const;
```

### 1.4 Especificações de Animação

#### Animações por Estado

| Estado | Animação | Duração | Easing |
|--------|----------|---------|--------|
| idle | Respiração sutil (Y: ±0.02) | 2s | sine.inOut |
| typing | Movimento mãos + cabeça bob | 0.1s | linear |
| thinking | Cabeça inclinada + "..." pulso | 1.5s | sine.inOut |
| completed | Braço levantado + bounce | 0.5s | back.out |
| error | Cabeça baixa + shake | 0.3s | elastic.out |

#### Transições
- Todas as transições de estado: 300ms
- Câmera orbital: suavizada com damping
- Updates de tela: fade transition 150ms

### 1.5 Especificação de Performance

- **Target FPS**: 60fps em desktops, 30fps em mobile
- **Draw Calls**: < 50 (usando instancing onde possível)
- **Texture Resolution**: 512x512 para telas de PC
- **Shadow Map**: 2048x2048, PCFSoftShadowMap
- **LOD**: Simplificar geometria em distância

---

## 2. Lista de Componentes React

### 2.1 Componentes 3D (Scene)

| Componente | Props | Descrição |
|------------|-------|-----------|
| `Office` | `children` | Container principal da cena |
| `OfficeEnvironment` | - | Chão, paredes, iluminação base |
| `Workstation` | `agent: AgentType, position: [x,y,z]` | Estação completa (mesa + cadeira + PC) |
| `Desk` | `color: string` | Mesa 3D com gavetas |
| `Chair` | `color: string, rotation: number` | Cadeira de escritório |
| `Computer` | `screenContent: ReactNode` | PC + monitor com tela dinâmica |
| `Screen` | `agent: AgentType, status: Status` | Tela mostrando progresso |
| `Avatar` | `agent: AgentType, state: AgentState` | Personagem 3D animado |
| `AgentHead` | `expression: Expression` | Cabeça do avatar com expressões |
| `AgentBody` | `pose: Pose` | Corpo do avatar |
| `StatusLight` | `status: Status, color: string` | LED indicador de status |

### 2.2 Componentes UI (Overlay)

| Componente | Props | Descrição |
|------------|-------|-----------|
| `UIOverlay` | - | Container de todos os overlays |
| `StatusBar` | `m3State: M3State` | Barra superior com info geral |
| `AgentCard` | `agent: AgentInfo` | Card com detalhes do agente |
| `ProgressRing` | `progress: number` | Anel de progresso animado |
| `LogPanel` | `logs: string[]` | Painel de logs scrollable |
| `Controls` | `onReset, onPause` | Botões de controle |
| `Legend` | - | Legenda de cores/estados |

### 2.3 Componentes de Conteúdo de Tela

| Componente | Props | Descrição |
|------------|-------|-----------|
| `ScreenContent` | `agent: AgentType, task: string` | Container de conteúdo da tela |
| `TerminalView` | `lines: string[]` | Terminal com código scrollando |
| `ProgressView` | `progress: number, stage: string` | Barra de progresso |
| `StatusView` | `status: Status` | Ícone grande de status |

### 2.4 Hooks Customizados

| Hook | Retorno | Descrição |
|------|---------|-----------|
| `useM3State` | `M3State, refresh` | Polling de m3-state.json |
| `useAgentAnimation` | `animations, transition` | Controle de animações por estado |
| `useScreenTexture` | `texture, update` | Canvas 2D → textura Three.js |
| `useOrbitControls` | `controlsRef` | Config da câmera orbital |

---

## 3. Estrutura de Arquivos

```
my-app/
├── app/
│   ├── page.tsx                    # Página principal
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Estilos globais
├── components/
│   ├── scene/                      # Componentes 3D
│   │   ├── Office.tsx
│   │   ├── OfficeEnvironment.tsx
│   │   ├── Workstation.tsx
│   │   ├── Desk.tsx
│   │   ├── Chair.tsx
│   │   ├── Computer.tsx
│   │   ├── Screen.tsx
│   │   ├── Avatar.tsx
│   │   ├── AgentHead.tsx
│   │   ├── AgentBody.tsx
│   │   └── StatusLight.tsx
│   ├── ui/                         # Componentes UI
│   │   ├── UIOverlay.tsx
│   │   ├── StatusBar.tsx
│   │   ├── AgentCard.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── LogPanel.tsx
│   │   ├── Controls.tsx
│   │   └── Legend.tsx
│   ├── screen-content/             # Conteúdo das telas
│   │   ├── ScreenContent.tsx
│   │   ├── TerminalView.tsx
│   │   ├── ProgressView.tsx
│   │   └── StatusView.tsx
│   └── providers/                  # Providers
│       └── M3StateProvider.tsx
├── hooks/                          # Custom hooks
│   ├── useM3State.ts
│   ├── useAgentAnimation.ts
│   ├── useScreenTexture.ts
│   └── useOrbitControls.ts
├── lib/                            # Utilitários
│   ├── utils.ts
│   ├── constants.ts                # Cores, posições, etc
│   └── types.ts                    # TypeScript types
├── store/                          # Zustand store
│   └── m3Store.ts
├── public/                         # Assets estáticos
│   └── textures/
├── types/                          # Definições de tipos
│   └── index.ts
└── next.config.js
```

---

## 4. Dependências Necessárias

### 4.1 Instalação Completa

```bash
# Core
npm install three @react-three/fiber @react-three/drei

# Animações
npm install @react-spring/three

# State Management
npm install zustand

# Ícones
npm install lucide-react

# Types (dev)
npm install -D @types/three
```

### 4.2 package.json (dependencies)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "@react-spring/three": "^9.7.0",
    "zustand": "^4.4.0",
    "lucide-react": "latest",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/three": "^0.160.0"
  }
}
```

### 4.3 Configuração TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/lib/*": ["./lib/*"],
      "@/store/*": ["./store/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

---

## 5. Passo a Passo de Implementação

### FASE 1: Setup do Projeto (30 min)

```bash
# 1. Criar projeto Next.js
npx create-next-app@latest m3-office-3d --typescript --tailwind --app

# 2. Entrar na pasta
cd m3-office-3d

# 3. Instalar dependências 3D
npm install three @react-three/fiber @react-three/drei

# 4. Instalar animações e state
npm install @react-spring/three zustand lucide-react

# 5. Instalar types
npm install -D @types/three

# 6. Criar estrutura de pastas
mkdir -p components/scene components/ui components/screen-content components/providers
mkdir -p hooks lib store types
```

### FASE 2: Tipos e Constantes (20 min)

1. **Criar `types/index.ts`**
   - Definir `AgentType`, `Status`, `AgentState`
   - Definir `M3State`, `TaskInfo`
   - Definir `AnimationState`, `Expression`, `Pose`

2. **Criar `lib/constants.ts`**
   - Cores dos agentes
   - Posições das estações
   - Configurações de animação
   - Paths de arquivo

3. **Criar `lib/utils.ts`**
   - Helpers de formatação
   - Helpers de cor

### FASE 3: Store e Hooks (30 min)

1. **Criar `store/m3Store.ts`**
   - Zustand store com estado M3
   - Actions: setStatus, setProgress, addLog
   - Polling automático de m3-state.json

2. **Criar `hooks/useM3State.ts`**
   - Wrapper do store com refresh manual

3. **Criar `hooks/useAgentAnimation.ts`**
   - Mapeamento estado → animação
   - Config de springs para cada animação

### FASE 4: Componentes 3D Base (45 min)

1. **Criar `components/scene/Office.tsx`**
   - Canvas com configurações
   - Iluminação (ambient + directional)
   - OrbitControls

2. **Criar `components/scene/OfficeEnvironment.tsx`**
   - Chão (plane)
   - Paredes (opcional)
   - Grid helper

3. **Criar `components/scene/Desk.tsx`**
   - Box geometry para mesa
   - Material com cor do agente

4. **Criar `components/scene/Chair.tsx`**
   - Geometria simples de cadeira
   - Rotação para frente da mesa

### FASE 5: Telas Dinâmicas (45 min)

1. **Criar `hooks/useScreenTexture.ts`**
   - Canvas 2D para renderizar UI
   - Converter para CanvasTexture
   - Método updateTexture

2. **Criar `components/scene/Screen.tsx`**
   - Plane com textura dinâmica
   - Atualizar quando status muda

3. **Criar `components/screen-content/ScreenContent.tsx`**
   - Renderizar texto/info no canvas

4. **Criar `components/screen-content/TerminalView.tsx`**
   - Simular terminal com código

### FASE 6: Avatares e Animações (60 min)

1. **Criar `components/scene/Avatar.tsx`**
   - Container do avatar
   - Estado de animação

2. **Criar `components/scene/AgentHead.tsx`**
   - Sphere para cabeça
   - Expressões faciais (simples)

3. **Criar `components/scene/AgentBody.tsx`**
   - Capsule para corpo
   - Pose base

4. **Integrar animações**
   - typing: movimento sutil
   - thinking: rotação cabeça
   - completed: escala/bounce
   - error: shake effect

### FASE 7: Workstation Completa (30 min)

1. **Criar `components/scene/Workstation.tsx`**
   - Compor Desk + Chair + Computer + Avatar
   - Posicionar elementos
   - StatusLight

2. **Atualizar `Office.tsx`**
   - Adicionar 3 Workstations nas posições definidas

### FASE 8: UI Overlay (45 min)

1. **Criar `components/ui/UIOverlay.tsx`**
   - Container absoluto sobre canvas

2. **Criar `components/ui/StatusBar.tsx`**
   - Task atual, fase, tempo

3. **Criar `components/ui/AgentCard.tsx`**
   - Cards flutuantes para cada agente

4. **Criar `components/ui/Controls.tsx`**
   - Botões reset/pause
   - Legendas

### FASE 9: Integração M3 (30 min)

1. **Criar mock `public/m3-state.json`**
   - Estrutura de exemplo

2. **Implementar polling no store**
   - fetch a cada 1 segundo
   - Atualizar estado

3. **Conectar componentes**
   - Workstation lê estado do store
   - Screen mostra progresso real
   - Avatar anima conforme status

### FASE 10: Polimento e Deploy (30 min)

1. **Melhorias visuais**
   - Sombras (shadow-map)
   - Point lights perto das estações
   - Glow effects nos status

2. **Performance**
   - Memoizar componentes
   - Otimizar re-renders

3. **Deploy Vercel**
   ```bash
   # Configurar next.config.js
   echo 'module.exports = { output: "export" }' > next.config.js
   
   # Build
   npm run build
   
   # Deploy
   npx vercel --prod
   ```

---

## 6. Checklist de Implementação

### Estrutura Base
- [ ] Next.js inicializado
- [ ] TypeScript configurado
- [ ] Tailwind configurado
- [ ] Three.js instalado
- [ ] Estrutura de pastas criada

### Componentes 3D
- [ ] Office (canvas)
- [ ] OfficeEnvironment (chão/paredes)
- [ ] Desk
- [ ] Chair
- [ ] Computer
- [ ] Screen (com textura dinâmica)
- [ ] Avatar
- [ ] AgentHead
- [ ] AgentBody
- [ ] Workstation (composição)

### UI Overlay
- [ ] UIOverlay container
- [ ] StatusBar
- [ ] AgentCard (3x)
- [ ] ProgressRing
- [ ] LogPanel
- [ ] Controls
- [ ] Legend

### Lógica
- [ ] Types definidos
- [ ] Zustand store
- [ ] useM3State hook
- [ ] useAgentAnimation hook
- [ ] useScreenTexture hook
- [ ] Polling implementado

### Integração
- [ ] m3-state.json sendo lido
- [ ] Telas atualizam em tempo real
- [ ] Animações sincronizadas
- [ ] UI mostra dados reais

### Deploy
- [ ] Build otimizado
- [ ] Deploy na Vercel
- [ ] Testado em múltiplos browsers

---

## 7. Referências Rápidas

### Posições das Estações
```typescript
const STATION_POSITIONS = {
  organizer: [-4, 0, 0],
  coder: [0, 0, 0],
  verifier: [4, 0, 0],
} as const;
```

### Cores Tailwind → Three.js
```typescript
// Converter tailwind color para three.js
const tailwindToThree = (color: string) => {
  // #3B82F6 → 0x3B82F6
  return parseInt(color.replace('#', '0x'));
};
```

### Animação Básica (React Spring)
```typescript
const { position } = useSpring({
  position: isWorking ? [0, 0.1, 0] : [0, 0, 0],
  config: { tension: 300, friction: 10 }
});
```

---

**Total Estimado de Tempo**: ~6 horas de implementação focada

**Prioridades**:
1. Setup e estrutura base
2. Componentes 3D essenciais
3. Sistema de telas
4. Animações básicas
5. Integração com estado
6. UI overlay
7. Polimento e deploy
