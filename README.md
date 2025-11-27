# 🎰 Roleta WebSec

Ferramenta de moderação interativa com roleta aleatória para seleção de participantes e aplicação de punições.

**🌐 Site**: [https://uictorius.github.io/roleta-websec/](https://uictorius.github.io/roleta-websec/)  
**📦 Repositório**: [https://github.com/uictorius/roleta-websec](https://github.com/uictorius/roleta-websec)

## 📋 Sobre o Projeto

Roleta WebSec é uma aplicação web moderna desenvolvida em React + TypeScript que permite criar roletas aleatórias para seleção de participantes e aplicação de punições (timeouts ou bans). Ideal para servidores de Discord, comunidades online e ferramentas de moderação.

## ✨ Funcionalidades

- **Roleta Interativa**: Sistema de roleta visual com animações suaves
- **Múltiplos Participantes**: Adicione quantos participantes desejar
- **Modo Snake**: Opção para intercalar participantes com "Snake" na roleta
- **Tipos de Punição**:
  - **Castigo**: Timeout com duração configurável (1 minuto a 1 semana ou aleatório)
  - **Ban**: Banimento permanente (apenas para roles com permissão)
- **Sistema de Roles**: Diferentes níveis de permissão (Moderador, Admin, Manager, Owner)
- **Sistema de Áudio**: Sons para rotação, vitória e interações
- **Controle de Volume**: Ajuste de volume e toggle de som
- **Interface Moderna**: Design glassmorphism com tema cyber/violeta

## 🚀 Requisitos

- Node.js 18+
- npm ou yarn

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/uictorius/roleta-websec.git
cd roleta-websec
```

2. Instale as dependências:

```bash
npm install
```

## 🎮 Como Usar

### Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Adicionar Participantes

1. Digite o nome do participante no campo de texto
2. Clique no botão de adicionar (ícone de usuário) ou pressione Enter
3. Repita para adicionar mais participantes

### Configurar a Punição

1. **Selecione o Tipo de Punição**:

   - **Castigo**: Aplica timeout com duração configurável
   - **BAN**: Aplica banimento permanente (requer permissão)

2. **Configure a Duração** (apenas para Castigo):
   - **Aleatório**: Seleciona uma duração aleatória
   - **Tempo Específico**: Escolha entre 1 minuto, 5 minutos, 10 minutos, 1 hora, 1 dia ou 1 semana

### Selecionar Role

No cabeçalho, selecione sua role:

- **Moderador**: Apenas castigos (sem permissão para ban)
- **Admin**: Castigos e bans
- **Manager**: Castigos e bans
- **Owner**: Castigos e bans

### Modo Snake

Ative o toggle "Modo Snake" para intercalar cada participante com "Snake" na roleta. Útil para adicionar um elemento extra de aleatoriedade.

### Girar a Roleta

1. Certifique-se de ter pelo menos 2 participantes adicionados
2. Clique no botão **"RODAR"**
3. A roleta girará e selecionará um participante aleatório
4. Um modal exibirá o resultado com a punição aplicada

### Controles de Áudio

- **Toggle de Som**: Clique no ícone de volume para ativar/desativar os sons
- **Controle de Volume**: Use o slider para ajustar o volume (0-100%)

### Limpar Lista

Clique em **"Limpar Lista"** para remover todos os participantes e resetar a roleta.

## 📜 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar linter
npm run lint
```

## 🚀 Deploy Automático

O projeto está configurado com GitHub Actions para deploy automático no GitHub Pages.

### Como Funciona

- **Deploy Automático**: Toda vez que você fizer push para a branch `main`, o workflow automaticamente:

  1. Faz build do projeto
  2. Faz deploy para GitHub Pages

- **Deploy Manual**: Você também pode disparar o deploy manualmente através da aba "Actions" no GitHub.

### Configuração do GitHub Pages

1. Vá em **Settings** > **Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. O workflow já está configurado e funcionará automaticamente

O site estará disponível em: `https://uictorius.github.io/roleta-websec/`

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **Web Audio API** - Sistema de áudio sintético

## 📁 Estrutura do Projeto

```
roleta-websec/
├── src/
│   ├── App.tsx           # Componente principal
│   ├── hooks/
│   │   └── useAudio.ts   # Hook para gerenciamento de áudio
│   ├── index.css         # Estilos globais
│   └── main.tsx          # Ponto de entrada
├── public/               # Arquivos estáticos
├── package.json          # Dependências e scripts
└── README.md            # Este arquivo
```

## 🎨 Personalização

### Cores da Roleta

As cores dos segmentos podem ser alteradas no array `WHEEL_COLORS` em `src/App.tsx`:

```typescript
const WHEEL_COLORS = [
  "#8B5CF6", // Violet
  "#EF4444", // Red
  // ... adicione mais cores
];
```

### Tema

O tema pode ser personalizado através do objeto `THEME` em `src/App.tsx`.

## 📝 Notas

- A roleta requer no mínimo 2 participantes para funcionar
- O modo BAN só está disponível para roles com permissão (Admin, Manager, Owner)
- Os sons são gerados sinteticamente usando Web Audio API
- A aplicação é totalmente client-side, não requer backend

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

---

Desenvolvido com ❤️ para a comunidade WebSec
