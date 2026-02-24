# Planner Diário Inteligente

Um aplicativo de planejamento diário que permite aos usuários criar, organizar e acompanhar suas tarefas com horários de início e fim, cores personalizadas e um sistema de acompanhamento de tempo em tempo real.

## Funcionalidades

- **Criação e Gerenciamento de Tarefas:** Adicione tarefas com nome, horário de início, horário de fim e cor.
- **Visualização por Cores:** Identificação visual rápida das tarefas através de cores de fundo personalizadas para cada card.
- **Status da Tarefa:** Marque tarefas como 'Não Iniciada', 'Em Andamento', 'Pela Metade', 'Concluída' ou 'Não Concluída'.
- **Início de Tarefas:** Botão dedicado para iniciar uma tarefa, alterando seu status para 'Em Andamento'.
- **Controle de Tempo em Tempo Real:** Acompanhe o tempo decorrido e o tempo restante para tarefas 'Em Andamento' com uma barra de progresso visual.
- **Alarmes e Notificações:** Receba alertas sonoros no início e no fim das tarefas para gerenciar seu tempo de forma eficaz.
- **Atualização Automática de Status:** Tarefas 'Em Andamento' que atingem o horário de fim são automaticamente marcadas como 'Não Concluída' para revisão.
- **Edição e Exclusão:** Modifique ou remova tarefas existentes.
- **Histórico de Tarefas:** Visualize o histórico de suas atividades.

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Tailwind CSS
- **Gerenciamento de Estado:** Hooks do React (useState, useEffect, useCallback)
- **Roteamento:** Wouter
- **Persistência de Dados:** LocalStorage
- **Build Tool:** Vite

## Como Usar

Para configurar e executar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o Node.js e o pnpm instalados em sua máquina.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/simonegabionetta/planner-diario-inteligente.git
   cd planner-diario-inteligente
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

### Execução

Para iniciar o aplicativo em modo de desenvolvimento:

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta disponível).

### Build para Produção

Para gerar uma versão otimizada para produção:

```bash
pnpm build
```

Os arquivos de build serão gerados na pasta `dist`.

## Deploy

Este projeto pode ser facilmente implantado em plataformas como a Vercel. Para atualizações, um novo deploy é necessário após cada push para o repositório principal.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
