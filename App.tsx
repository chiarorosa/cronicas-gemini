
import React, { useState, useEffect, useCallback, useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import { Scene, GameState, GameData } from './types';
import * as GeminiService from './services/geminiService';
import { DEFAULT_THEME, API_KEY_ERROR_MESSAGE } from './constants';

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>('welcome');

  // Mantemos a lógica de parada de áudio aqui para ser acessível globalmente no App.
  // GameScreen gerencia seu próprio audioRef, mas para reset/fatal, precisamos de uma forma de sinalizar.
  // Uma abordagem mais robusta poderia usar Context API ou Zustand para gerenciar o áudio player globalmente.
  // Por simplicidade, o GameScreen já tem sua própria lógica de limpeza no unmount/mudança de cena.
  // Esta função é mais um lembrete de que o áudio precisa ser parado.
  // A limpeza efetiva do áudio (URL.revokeObjectURL, audio.pause()) está agora em GameScreen.
  const stopAnyPlayingAudio = () => {
    // A lógica de parada de áudio agora é primariamente tratada dentro de GameScreen
    // e seu hook de limpeza useEffect.
    // No entanto, em um reset completo, forçar o GameScreen a desmontar/remontar ou
    // passar um prop para ele parar o áudio seria ideal.
    // Como o GameScreen pode não estar montado (ex: erro na WelcomeScreen),
    // não há uma referência direta aqui.
    // O GameScreen's useEffect cleanup ao mudar `scene.story` ou desmontar já cobre isso.
  };


  const resetGame = useCallback(() => {
    stopAnyPlayingAudio();
    setPlayerName('');
    setCurrentTheme(DEFAULT_THEME);
    setCurrentScene(null);
    setChoices([]);
    setError(null);
    setGameState('welcome');
    setIsLoading(false);
  }, []);

  const handleFatalError = useCallback((errorMessage: string) => {
    stopAnyPlayingAudio();
    setError(errorMessage);
    setGameState('error');
    setIsLoading(false);
  }, []);


  const fetchAndSetScene = useCallback(async (gameDataPromise: Promise<GameData>) => {
    setIsLoading(true);
    // A parada de áudio da cena anterior é feita pelo useEffect de GameScreen quando scene.story muda
    try {
      const gameData = await gameDataPromise;
      
      let imageUrl: string | undefined = undefined;
      if (gameData.imagePrompt) {
         try {
            imageUrl = await GeminiService.generateImage(gameData.imagePrompt);
         } catch (imgError) {
            console.warn("Falha na geração da imagem, continuando sem imagem:", imgError);
            imageUrl = "https://picsum.photos/512/512?blur=1"; 
         }
      }

      setCurrentScene({
        story: gameData.story,
        imagePrompt: gameData.imagePrompt,
        imageUrl: imageUrl,
      });
      setChoices(gameData.choices);

      if (gameData.gameOver) {
        setGameState('gameOver');
      } else {
        setGameState('playing');
      }
      setError(null); 
    } catch (err) {
      console.error("Erro ao processar dados do jogo:", err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      if (errorMessage.includes("API Key") || errorMessage.includes("Chave de API") || errorMessage.includes("chave de API")) {
        handleFatalError(API_KEY_ERROR_MESSAGE);
      } else {
         // Se o erro não for fatal (API Key), apenas define o erro para ser exibido na GameScreen
        setError(errorMessage); 
        // Não muda gameState para 'error' a menos que seja um erro de API Key
        // Isso permite que o usuário veja o erro na tela do jogo e potencialmente tente novamente se for uma opção.
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleFatalError]);


  const handleStartGame = useCallback(async (name: string, theme: string) => {
    if (!process.env.API_KEY) {
      handleFatalError(API_KEY_ERROR_MESSAGE);
      return;
    }
    
    setPlayerName(name);
    setCurrentTheme(theme);
    setError(null);
    setGameState('playing'); 
    setCurrentScene(null); // Garante que a cena anterior seja limpa
    setChoices([]);

    await fetchAndSetScene(GeminiService.generateInitialScene(name, theme));
  }, [fetchAndSetScene, handleFatalError]);

  const handleSelectChoice = useCallback(async (choice: string) => {
    if (!currentScene || !playerName) return; // currentScene.story é usado no service
     if (!process.env.API_KEY) {
      handleFatalError(API_KEY_ERROR_MESSAGE);
      return;
    }

    setError(null); // Limpa erros anteriores ao tentar uma nova ação
    // A limpeza de áudio é feita pelo useEffect de GameScreen
    setChoices([]); 

    await fetchAndSetScene(
      GeminiService.generateNextScene(currentScene.story, choice, playerName, currentTheme)
    );
  }, [currentScene, playerName, currentTheme, fetchAndSetScene, handleFatalError]);
  
   useEffect(() => {
    if (!process.env.API_KEY) {
      setTimeout(() => handleFatalError(API_KEY_ERROR_MESSAGE), 0);
    }
  }, [handleFatalError]); // Adicionado handleFatalError às dependências


  if (gameState === 'welcome') {
    return <WelcomeScreen onStartGame={handleStartGame} isLoading={isLoading} />;
  }
  
  // Se for um erro fatal (API Key), GameScreen será renderizado com estado 'error'
  // Se for um erro não fatal durante 'playing', GameScreen mostrará o erro mas manterá o estado 'playing'
   if (gameState === 'error' && error) { // Tela de erro genérica para erros fatais
     return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
        <GameScreen // Passamos GameScreen para reutilizar o ErrorDisplay com botão de reset
            scene={null}
            choices={[]}
            isLoading={false}
            onSelectChoice={() => {}}
            gameState={gameState} // Passa 'error'
            onPlayAgain={resetGame}
            error={error} // O erro fatal
            playerName={playerName || "Jogador(a)"}
        />
      </div>
    );
  }

  return (
    <GameScreen
      scene={currentScene}
      choices={choices}
      isLoading={isLoading}
      onSelectChoice={handleSelectChoice}
      gameState={gameState} // Pode ser 'playing' ou 'gameOver'
      onPlayAgain={resetGame}
      error={error} // Erros não fatais durante o jogo
      playerName={playerName}
    />
  );
};

export default App;
