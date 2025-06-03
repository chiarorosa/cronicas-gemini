
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        {/* User should replace this placeholder with their actual game logo image if available */}
        <img 
            src="https://picsum.photos/seed/darkskullfantasy/128/128" 
            alt="Ícone do Jogo" 
            className="mx-auto mb-6 rounded-full shadow-lg w-24 h-24 object-cover border-2 border-purple-600" 
        />
        <h1 className="text-4xl font-bold font-serif text-purple-400 mb-1">{GAME_TITLE}</h1>
        <p className="text-2xl font-serif text-purple-400 mb-6">ECOS DO ABISMO</p>
        <p className="text-neutral-400 mb-8 text-sm">
          Explore masmorras esquecidas, enfrente horrores antigos e deixe sua alma ser forjada pelas trevas... Sua jornada começa com uma escolha.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-purple-300 mb-1 text-left">
              NOME DO(A) AVENTUREIRO(A):
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="Ex: Tharivol Sombravento, Flagelo dos Lichs"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-purple-300 mb-1 text-left">
              ESCOLHA SEU DESTINO MALDITO
            </label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a3a3a3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
              disabled={isLoading}
            >
              {themes.map(theme => (
                <option key={theme} value={theme} className="bg-neutral-800 text-neutral-200 p-2">{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !playerName.trim() || !selectedTheme.trim()}
            className="w-full py-3 px-6 bg-red-800 text-amber-300 font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <SkullIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Forjando seu Destino...' : 'INVOCAR O DESTINO'}
          </button>
        </form>
      </div>
       <footer className="mt-8 text-sm text-neutral-500">
        Forjado nas sombras com Gemini & Imagen
      </footer>
    </div>
  );
};

export default WelcomeScreen;