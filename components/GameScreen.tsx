
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Scene, GameState as GameStatusType } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { GAME_TITLE } from '../constants';
import * as GeminiService from '../services/geminiService';

interface GameScreenProps {
  scene: Scene | null;
  choices: string[];
  isLoading: boolean; // Loading da cena/imagem
  onSelectChoice: (choice: string) => void;
  gameState: GameStatusType;
  onPlayAgain: () => void;
  error: string | null;
  playerName: string;
}

const SpeakerIcon: React.FC<{ isSpeaking: boolean; isGenerating: boolean; className?: string }> = ({ isSpeaking, isGenerating, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    {isGenerating ? (
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 17.5228 17.5228 22 12 22Z" className="opacity-50 animate-spin"/>
    ) : isSpeaking ? (
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
    ) : (
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.25 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V12zM15 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75V12z" />
    )}
  </svg>
);


const GameScreen: React.FC<GameScreenProps> = ({
  scene,
  choices,
  isLoading, // Loading geral da cena
  onSelectChoice,
  gameState,
  onPlayAgain,
  error,
  playerName
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const stopAndCleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Libera o recurso
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setIsSpeaking(false);
  }, [audioUrl]);


  const handleToggleSpeak = useCallback(async () => {
    if (!scene?.story) return;
    setTtsError(null);

    if (isSpeaking || isGeneratingSpeech) {
      stopAndCleanupAudio();
      setIsGeneratingSpeech(false); // Garante que pare a geração se estiver em progresso
    } else {
      setIsGeneratingSpeech(true);
      try {
        const newAudioUrl = await GeminiService.generateSpeechFromText(scene.story);
        if (newAudioUrl) {
          // Limpa áudio anterior antes de tocar novo
          stopAndCleanupAudio();
          
          setAudioUrl(newAudioUrl);
          const audio = new Audio(newAudioUrl);
          audioRef.current = audio;
          
          audio.oncanplaythrough = () => {
            audio.play().catch(e => {
                console.error("Erro ao reproduzir áudio:", e);
                setTtsError("Não foi possível reproduzir a narração.");
                stopAndCleanupAudio();
            });
          };
          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            stopAndCleanupAudio(); // Limpa após terminar
          };
          audio.onerror = (e) => {
            console.error("Erro no elemento de áudio:", e);
            setTtsError("Ocorreu um erro durante a narração.");
            stopAndCleanupAudio();
          };
        } else {
          setTtsError("Não foi possível gerar a narração.");
        }
      } catch (err) {
        console.error("Erro ao gerar TTS:", err);
        setTtsError(err instanceof Error ? err.message : "Falha desconhecida na narração.");
      } finally {
        setIsGeneratingSpeech(false);
      }
    }
  }, [scene?.story, isSpeaking, isGeneratingSpeech, stopAndCleanupAudio]);

  // Limpa o áudio se a cena mudar ou o componente for desmontado
  useEffect(() => {
    return () => {
      stopAndCleanupAudio();
    };
  }, [scene?.story, stopAndCleanupAudio]);


  if (error && gameState !== 'playing') {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
            <ErrorDisplay message={error} onRetry={gameState === 'error' ? onPlayAgain : undefined} />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100">
      <header className="w-full max-w-3xl mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-400">{GAME_TITLE}</h1>
        <p className="text-slate-400 text-sm">Jogando como: {playerName}</p>
      </header>

      {isLoading && (!scene || choices.length === 0) && <LoadingSpinner text="Criando sua aventura..." size="lg" />}
      
      {error && gameState === 'playing' &&  <ErrorDisplay message={error} />}
      {ttsError && <ErrorDisplay message={`Erro na narração: ${ttsError}`} />}


      {scene && (
        <div className="bg-slate-800/50 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-3xl">
          <div className="mb-6 aspect-video w-full bg-slate-700 rounded-lg overflow-hidden shadow-lg">
            {isLoading && !scene.imageUrl && <div className="w-full h-full flex items-center justify-center"><LoadingSpinner text="Evocando visuais..." /></div>}
            {scene.imageUrl && (
              <img
                src={scene.imageUrl}
                alt={scene.imagePrompt || "Cena da aventura"}
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              />
            )}
            {!isLoading && !scene.imageUrl && <div className="w-full h-full flex items-center justify-center text-slate-400">A imagem aparecerá aqui</div> }
          </div>

          <div className="mb-6 prose prose-invert prose-lg max-w-none prose-p:text-slate-200 prose-headings:text-sky-300">
             {isLoading && !scene.story && <p className="animate-pulse">O ar crepita com antecipação...</p>}
             {scene.story && (
                <div className="relative">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{scene.story}</p>
                    {scene.story && ( // Botão TTS sempre disponível se houver história
                         <button
                            onClick={handleToggleSpeak}
                            title={isSpeaking ? "Parar narração" : (isGeneratingSpeech ? "Gerando narração..." : "Ouvir história")}
                            aria-label={isSpeaking ? "Parar narração" : (isGeneratingSpeech ? "Gerando narração..." : "Ouvir história")}
                            className={`absolute top-0 right-0 p-2 text-sky-300 hover:text-sky-100 transition-colors ${isSpeaking || isGeneratingSpeech ? 'animate-pulse' : ''}`}
                            disabled={isLoading || isGeneratingSpeech} // Desabilita se cena está carregando OU fala está gerando
                        >
                            <SpeakerIcon isSpeaking={isSpeaking} isGenerating={isGeneratingSpeech} className="w-6 h-6" />
                        </button>
                    )}
                </div>
             )}
          </div>

          {gameState === 'gameOver' && scene.story ? (
            <div className="text-center">
                {choices.length > 0 && choices[0].toLowerCase().includes('jogar novamente') ? (
                     <button
                        onClick={() => { stopAndCleanupAudio(); onPlayAgain(); }}
                        className="mt-4 px-8 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors text-lg shadow-md"
                    >
                        {choices[0]}
                    </button>
                ) : (
                     <button
                        onClick={() => { stopAndCleanupAudio(); onPlayAgain(); }}
                        className="mt-4 px-8 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors text-lg shadow-md"
                    >
                        Jogar Novamente?
                    </button>
                )}
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-sky-300 mb-3">O que você faz?</h3>
              {isLoading && choices.length === 0 && (
                 <div className="space-y-3">
                    {[1,2,3].map(i => (
                         <div key={i} className="w-full h-12 bg-slate-700 rounded-lg animate-pulse"></div>
                    ))}
                 </div>
              )}
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => { stopAndCleanupAudio(); onSelectChoice(choice);}}
                  disabled={isLoading || isGeneratingSpeech || isSpeaking}
                  className="w-full block text-left px-6 py-4 bg-sky-700/70 text-sky-100 font-medium rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-wait shadow-md"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
       <footer className="mt-12 text-sm text-slate-500">
        Uma história guiada por IA com Gemini & Imagen
      </footer>
    </div>
  );
};

export default GameScreen;
