
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-sky-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <img src="https://picsum.photos/seed/darkfantasygame/128/128" alt="Ícone do Jogo de Fantasia Sombria" className="mx-auto mb-6 rounded-full shadow-lg w-24 h-24 object-cover border-2 border-red-700" />
        <h1 className="text-4xl font-bold text-sky-300 mb-3">{GAME_TITLE}</h1>
        <p className="text-slate-400 mb-8">Enfrente o perigo em um mundo de fantasia sombria moldado por suas escolhas!</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-sky-200 mb-1 text-left">
              Seu Nome, Herói(ína):
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              placeholder="Ex: Vorlag, o Implacável"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-sky-200 mb-1 text-left">
              Escolha o Cenário da Sua Desgra... Aventura:
            </label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23f87171' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
              disabled={isLoading}
            >
              {themes.map(theme => (
                <option key={theme} value={theme} className="bg-slate-700 text-slate-100 p-2">{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !playerName.trim() || !selectedTheme.trim()}
            className="w-full py-3 px-6 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Forjando seu Destino...' : 'Desafiar o Perigo'}
          </button>
        </form>
      </div>
       <footer className="mt-8 text-sm text-slate-500">
        Forjado nas sombras com Gemini & Imagen
      </footer>
    </div>
  );
};

export default WelcomeScreen;