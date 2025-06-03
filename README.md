# Crônicas de Gemini - Aventura Interativa

Bem-vindo às Crônicas de Gemini, um jogo de aventura interativo baseado em texto onde suas escolhas moldam uma narrativa sombria e envolvente. Com o poder da API Gemini do Google para geração de histórias dinâmicas e da API Imagen para criar visuais atmosféricos para cada cena, prepare-se para uma jornada única a cada jogada. O jogo também conta com narração Text-to-Speech (TTS) gerada por IA para uma imersão ainda maior.

![Logo do Jogo](assets/cronicas-gemini-LOGO.png)
*(Certifique-se de que o arquivo `cronicas-gemini-LOGO.png` esteja na pasta `assets`)*

## Funcionalidades

*   **Aventura Interativa Baseada em Texto:** Mergulhe em uma história onde suas decisões direcionam o fluxo narrativo.
*   **Narrativa Dinâmica com IA:** A API Gemini (`gemini-2.5-flash-preview-04-17`) cria reviravoltas e cenários únicos em tempo real.
*   **Geração de Imagens com IA:** Cada cena é acompanhada por uma imagem gerada pela API Imagen (`imagen-3.0-generate-002`) para enriquecer a atmosfera visual.
*   **Narração com Text-to-Speech (TTS):** Ouça a história sendo narrada por uma voz gerada por IA, utilizando um modelo Gemini TTS.
*   **Escolhas Impactantes:** As opções apresentadas ao jogador realmente alteram o curso da aventura, levando a múltiplos caminhos e finais.
*   **Temas Variados:** Comece sua aventura escolhendo entre diferentes temas sombrios, como "Cripta amaldiçoada infestada de demônios" ou "Ruínas de um castelo ancestral guardado por um dragão".
*   **Interface Responsiva:** Jogue em qualquer dispositivo, seja desktop ou mobile.

## Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **APIs de IA do Google:**
    *   `@google/genai` SDK
    *   Geração de Texto: `gemini-2.5-flash-preview-04-17`
    *   Geração de Imagem: `imagen-3.0-generate-002`
    *   Text-to-Speech (TTS): Modelo Gemini TTS (ex: `gemini-2.5-flash-preview-tts`)
*   **Módulos ES6:** Carregados diretamente no navegador via `importmap`.

## Primeiros Passos

Siga estas instruções para configurar e executar o projeto localmente.

### Pré-requisitos

*   Node.js (versão LTS recomendada) e npm (ou yarn).
*   Um navegador web moderno (Chrome, Firefox, Edge, Safari).
*   Uma chave de API do Google AI Studio para usar as APIs Gemini e Imagen.

### Configuração da Chave de API

**Este é um passo crucial.** O aplicativo espera que a chave de API esteja disponível como uma variável de ambiente `process.env.API_KEY`.

1.  **Obtenha uma Chave de API:**
    *   Acesse o [Google AI Studio](https://aistudio.google.com/).
    *   Crie um novo projeto ou use um existente.
    *   Gere uma chave de API. Guarde-a em segurança.

2.  **Configure a Chave de API para Desenvolvimento Local:**
    Como este é um projeto frontend puro que utiliza `process.env.API_KEY` diretamente nos scripts carregados pelo navegador, você precisará simular a presença dessa variável de ambiente.
    Abra o arquivo `index.html` e, **antes** da linha `<script type="module" src="/index.tsx"></script>`, adicione o seguinte bloco de script, substituindo `"SUA_CHAVE_API_AQUI"` pela sua chave real:

    ```html
    <!-- index.html -->
    <script>
      window.process = {
        env: {
          API_KEY: "SUA_CHAVE_API_AQUI" // IMPORTANTE: Substitua pela sua chave de API real
        }
      };
    </script>
    <script type="module" src="/index.tsx"></script>
    ```

    **Atenção:**
    *   Nunca versione sua chave de API diretamente no código se estiver usando um sistema de controle de versão público (como GitHub). O método acima é para desenvolvimento local.
    *   Para um ambiente de produção, você precisaria de um processo de build ou um servidor que injetasse a chave de API de forma segura.

### Instalação

1.  Clone o repositório (se aplicável) ou certifique-se de ter todos os arquivos do projeto em uma pasta local.
    ```bash
    # Exemplo se fosse um repositório git
    # git clone https://seu-repositorio-url.com/cronicas-de-gemini.git
    # cd cronicas-de-gemini
    ```

2.  Como o projeto utiliza CDNs para React e `@google/genai` (definido no `importmap` em `index.html`) e não possui um passo de build explícito (como Webpack ou Vite) nos arquivos fornecidos, não há um comando `npm install` tradicional para instalar essas dependências de frontend de um `package.json`. As dependências são resolvidas pelo navegador em tempo de execução.

### Executando o Aplicativo

1.  **Servidor Local:**
    Para que o aplicativo funcione corretamente (especialmente com módulos ES6 e para evitar problemas de CORS se você estivesse fazendo chamadas diretas de API sem um backend), você deve servi-lo através de um servidor HTTP local.
    *   Se você tem Node.js, pode usar pacotes como `http-server` ou `serve`:
        ```bash
        # Instale http-server globalmente (se ainda não o fez)
        npm install -g http-server
        # Navegue até a pasta raiz do seu projeto no terminal e execute:
        http-server .
        ```
        Ou com `serve`:
        ```bash
        # Instale serve globalmente (se ainda não o fez)
        npm install -g serve
        # Navegue até a pasta raiz do seu projeto no terminal e execute:
        serve .
        ```
    *   Muitos editores de código (como VS Code com a extensão "Live Server") também oferecem maneiras fáceis de iniciar um servidor local.

2.  Abra seu navegador e acesse o endereço fornecido pelo servidor local (geralmente `http://localhost:8080` ou similar).

## Estrutura do Projeto

```
.
├── assets/
│   └── cronicas-gemini-LOGO.png  # Logo do jogo
├── components/
│   ├── ErrorDisplay.tsx          # Componente para exibir mensagens de erro
│   ├── GameScreen.tsx            # Componente principal da tela de jogo
│   ├── LoadingSpinner.tsx        # Componente de indicador de carregamento
│   └── WelcomeScreen.tsx         # Componente da tela inicial
├── services/
│   └── geminiService.ts          # Lógica para interagir com as APIs Gemini e Imagen
├── App.tsx                       # Componente principal da aplicação, gerencia o estado do jogo
├── constants.ts                  # Constantes do jogo (títulos, nomes de modelos, etc.)
├── index.html                    # Ponto de entrada HTML principal
├── index.tsx                     # Ponto de entrada do React, renderiza o App
├── metadata.json                 # Metadados da aplicação (para AI Frame Studio)
├── README.md                     # Este arquivo
└── types.ts                      # Definições de tipos TypeScript
```

## Como Funciona

### Fluxo do Jogo

1.  **Tela de Boas-vindas (`WelcomeScreen.tsx`):**
    *   O jogador insere seu nome e escolhe um tema para a aventura.
    *   Ao clicar em "Invocar o Destino", o jogo inicia.

2.  **Geração da Cena Inicial:**
    *   `App.tsx` chama `GeminiService.generateInitialScene()` com o nome do jogador e o tema.
    *   Esta função envia um prompt para a API Gemini (`gemini-2.5-flash-preview-04-17`) solicitando a história da primeira cena, um prompt de imagem em inglês e três escolhas para o jogador.
    *   A resposta da API é um JSON contendo esses dados.

3.  **Geração da Imagem da Cena:**
    *   Com o `imagePrompt` recebido, `App.tsx` chama `GeminiService.generateImage()`.
    *   Esta função usa a API Imagen (`imagen-3.0-generate-002`) para gerar uma imagem baseada no prompt.
    *   A imagem é retornada como uma string base64 e exibida.

4.  **Tela de Jogo (`GameScreen.tsx`):**
    *   Exibe a história da cena atual, a imagem gerada e as escolhas disponíveis.
    *   **Narração TTS:** O jogador pode clicar no ícone de alto-falante para ouvir a história da cena. Isso chama `GeminiService.generateSpeechFromText()`, que usa um modelo Gemini TTS para converter o texto da história em áudio. O áudio é então reproduzido no navegador.
    *   O jogador seleciona uma das escolhas.

5.  **Geração da Próxima Cena:**
    *   `App.tsx` chama `GeminiService.generateNextScene()` com a história anterior, a escolha do jogador, o nome e o tema.
    *   Semelhante à cena inicial, a API Gemini gera a continuação da história, um novo `imagePrompt` e novas escolhas, ou indica que o jogo terminou (`gameOver: true`).
    *   O processo de geração de imagem se repete para a nova cena.

6.  **Fim de Jogo:**
    *   Se a API indicar `gameOver: true`, a tela de jogo exibe a conclusão da história e uma opção para "Jogar Novamente?".
    *   Clicar em "Jogar Novamente?" reseta o jogo e retorna à tela de boas-vindas.

### Gerenciamento de Estado

*   O estado principal do jogo (cena atual, escolhas, nome do jogador, tema, estado de carregamento, erros) é gerenciado em `App.tsx` usando os hooks do React (`useState`, `useCallback`).
*   O estado é passado para os componentes filhos (`WelcomeScreen`, `GameScreen`) via props.

### Interação com as APIs (`services/geminiService.ts`)

*   **`getAiClient()`:** Inicializa e retorna uma instância do cliente `GoogleGenAI` usando a `API_KEY` do ambiente.
*   **`parseJsonFromText()`:** Uma função utilitária para extrair e analisar JSON de respostas da API Gemini, que podem vir encapsuladas em blocos de código markdown.
*   **`generateInitialScene()`:** Cria o prompt inicial e obtém a primeira cena da API Gemini.
*   **`generateNextScene()`:** Cria prompts subsequentes com base nas escolhas do jogador e obtém as próximas cenas.
*   **`generateImage()`:** Envia um prompt para a API Imagen e retorna a URL de dados base64 da imagem gerada.
*   **`generateSpeechFromText()`:** Envia texto para a API Gemini TTS, processa a resposta de áudio (que vem em chunks base64 e formato L16), constrói um cabeçalho WAV e cria um `ObjectURL` para reprodução.

### Tratamento de Erros

*   O aplicativo tenta capturar erros de chamadas de API.
*   Uma mensagem de erro proeminente é exibida se a `API_KEY` não estiver configurada ou for inválida (`API_KEY_ERROR_MESSAGE`).
*   Outros erros durante a geração de cena ou imagem são mostrados na tela, com uma opção de "Tentar Novamente" se for um erro fatal que impede o jogo de continuar (como o erro de API Key na tela de boas-vindas).
*   Erros de TTS também são exibidos discretamente.

## Considerações Importantes

*   **Segurança da Chave de API:** Nunca exponha sua chave de API em repositórios públicos. O método de configuração de chave em `index.html` é apenas para desenvolvimento local.
*   **Custos de API:** O uso das APIs Gemini e Imagen pode incorrer em custos. Monitore seu uso no console do Google Cloud ou AI Studio.
*   **Cotas da API:** Esteja ciente das cotas de uso da API para evitar interrupções no serviço.
*   **Qualidade da Geração:** A qualidade da história e das imagens depende dos modelos de IA e da engenharia de prompts. Os prompts atuais são projetados para um tema de fantasia sombria.
*   **Desempenho:** A geração de imagens e TTS pode levar alguns segundos. Indicadores de carregamento são usados para melhorar a experiência do usuário.

---

Divirta-se explorando as profundezas das Crônicas de Gemini!
