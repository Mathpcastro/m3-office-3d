# M3 Implementation Plan - Office 3D

## FASE 1: Setup e Estrutura Base
- [ ] Inicializar projeto Next.js com TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar Three.js, React Three Fiber, Drei
- [ ] Criar estrutura de pastas
- [ ] Configurar TypeScript paths
- [ ] Criar types básicos (Agent, Task, M3State)

## FASE 2: Cena 3D Básica
- [ ] Criar componente Office (canvas 3D)
- [ ] Configurar iluminação (ambient + directional)
- [ ] Criar chão e paredes do escritório
- [ ] Configurar câmera orbital (OrbitControls)
- [ ] Adicionar grid helper para debug

## FASE 3: Estações de Trabalho
- [ ] Criar componente Desk (mesa)
- [ ] Criar componente Chair (cadeira)
- [ ] Criar componente Computer (PC + monitor)
- [ ] Criar componente Agent (avatar placeholder)
- [ ] Posicionar **4 estações**: Maestro, Organizer, Coder, Verifier
- [ ] **Maestro**: Console de comando central (visão geral)
- [ ] **Organizer**: Mesa com blueprints/diagramas
- [ ] **Coder**: Mesa com múltiplos monitores
- [ ] **Verifier**: Mesa com checklists e testes
- [ ] Aplicar materiais e cores diferentes para cada agente

## FASE 4: Telas dos PCs
- [ ] Criar sistema de textura dinâmica para telas
- [ ] Criar componente ScreenContent (UI 2D na tela 3D)
- [ ] Mostrar: nome do agente, status atual, progresso
- [ ] Adicionar animação de código/terminal nas telas
- [ ] Cores diferentes para cada status (idle, working, completed, error)

## FASE 5: Animações
- [ ] Animação de "digitando" (movimento sutil)
- [ ] Animação de "pensando" (balançar cabeça)
- [ ] Animação de "completou" (levantar braço)
- [ ] Animação de "erro" (cabeça para baixo)
- [ ] Transições suaves entre estados

## FASE 6: Integração com M3
- [ ] Criar hook useM3State para ler m3-state.json
- [ ] Conectar estado real com visualização 3D
- [ ] Atualizar telas em tempo real quando estado muda
- [ ] Sincronizar animações com fases do M3

## FASE 7: UI Overlay
- [ ] Criar painel superior com status geral
- [ ] Mostrar: task atual, tempo decorrido, fase atual
- [ ] Botões de controle (reset câmera, pausar/resumir)
- [ ] Legendas explicando cada cor/estado

## FASE 8: Polimento
- [ ] Adicionar sombras (shadow maps)
- [ ] Melhorar iluminação (point lights próximas aos PCs)
- [ ] Adicionar partículas/efeitos visuais sutis
- [ ] Otimizar performance (LOD, frustum culling)
- [ ] Responsividade para mobile

## FASE 9: Deploy
- [ ] Configurar build para Vercel
- [ ] Otimizar bundle size
- [ ] Testar em diferentes navegadores
- [ ] Deploy!

## Notas Técnicas

### Cores por Agente
- Organizer: Azul (#3B82F6)
- Coder: Verde (#10B981)
- Verifier: Roxo (#8B5CF6)

### Status e Cores
- Idle: Cinza
- Working: Amarelo (pulsando)
- Completed: Verde
- Error: Vermelho (pulsando rápido)

### Estrutura de Estado
```typescript
interface M3State {
  task: string;
  status: 'idle' | 'organizing' | 'coding' | 'verifying' | 'completed' | 'error';
  currentAgent: 'organizer' | 'coder' | 'verifier' | null;
  progress: number;
  attempts: {
    organizer: number;
    coder: number;
    verifier: number;
  };
  logs: string[];
}
```