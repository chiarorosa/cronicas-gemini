import React, { useState } from 'react';
import { GAME_TITLE, DEFAULT_THEME } from '../constants';

interface WelcomeScreenProps {
  onStartGame: (playerName: string, theme: string) => void;
  isLoading: boolean;
}

const themes = [
  "Cripta amaldiçoada infestada de demônios",
  "Ruínas de um castelo ancestral guardado por um dragão",
  "Floresta sombria com cultistas e artefatos profanos",
  "Cidade subterrânea dos anões, ameaçada por monstros das profundezas",
  "Santuário celestial sitiado por hordas infernais",
  "Pântano desolado com ruínas de uma civilização perdida",
  "Montanha gélida onde um mal antigo desperta"
];

const SkullIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2.5-9c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm-2.5 4c-1.381 0-2.5 1.119-2.5 2.5h5c0-1.381-1.119-2.5-2.5-2.5z"/>
  </svg>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame, isLoading }) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>(DEFAULT_THEME);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && selectedTheme.trim()) {
      onStartGame(playerName.trim(), selectedTheme.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black via-red-950 to-black">
      <div className="bg-neutral-950/80 backdrop-blur-sm border border-red-900/50 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        {/* 
          INSTRUÇÃO PARA O LOGO:
          Para usar o logo do jogo 'cronicas-gemini-LOGO.png':
          1. Certifique-se de que existe uma pasta chamada 'assets' no diretório raiz do seu projeto.
          2. Coloque o arquivo de imagem do logo (ex: 'cronicas-gemini-LOGO.png') 
             dentro desta pasta 'assets'.
          3. Certifique-se de que o nome e a extensão no atributo 'src' abaixo 
             correspondam exatamente ao seu arquivo.
          Exemplo: src="assets/cronicas-gemini-LOGO.png" 
        */}
        <img
            src="assets/cronicas-gemini-LOGO.png" // Caminho para o logo PNG no diretório 'assets'
            alt="Logo Crônicas de Gemini" 
            className="mx-auto mb-8 sm:mb-10 shadow-lg w-28 h-28 sm:w-36 sm:h-36 object-contain"
        />
        {/* Títulos de texto removidos conforme solicitado */}
        {/* <h1 className="text-4xl font-bold font-serif text-purple-400 mb-1">{GAME_TITLE}</h1> */}
        {/* <p className="text-2xl font-serif text-purple-400 mb-6">ECOS DO ABISMO</p> */}
        
        <p className="text-neutral-400 mb-8 text-sm">
          Explore masmorras esquecidas, enfrente horrores antigos e deixe sua alma ser forjada pelas trevas... Sua jornada começa com uma escolha.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-red-400 mb-1 text-left">
              NOME DO(A) AVENTUREIRO(A):
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              placeholder="Ex: Tharivol Sombravento, Flagelo dos Lichs"
              required
              disabled={isLoading}
              aria-label="Nome do Aventureiro"
            />
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-red-400 mb-1 text-left">
              ESCOLHA SEU DESTINO MALDITO
            </label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-neutral-700 rounded-lg text-neutral-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a3a3a3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
              disabled={isLoading}
              aria-label="Escolha seu destino maldito"
            >
              {themes.map(theme => (
                <option key={theme} value={theme} className="bg-neutral-800 text-neutral-200 p-2">{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !playerName.trim() || !selectedTheme.trim()}
            className="w-full py-3 px-6 bg-red-900 text-amber-400 font-semibold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <SkullIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Forjando seu Destino...' : 'INVOCAR O DESTINO'}
          </button>
        </form>
      </div>
       <footer className="mt-8 text-sm text-neutral-600">
        Forjado nas sombras com Gemini & Imagen
      </footer>
    </div>
  );
};

export default WelcomeScreen;
