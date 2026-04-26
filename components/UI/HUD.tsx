/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { Heart, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, Settings, Palette, Gauge, Type, Zap, User } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, ShopItem, RUN_SPEED_BASE, GameDifficulty, GameTheme, THEMES, AvatarStyle } from '../../types';
import { audio } from '../System/Audio';

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'PULO DUPLO',
        description: 'Pule novamente no ar. Essencial para obstáculos altos.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'VIDA MÁXIMA',
        description: 'Adiciona permanentemente um coração e te cura.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'KIT DE REPARO',
        description: 'Restaura 1 ponto de Vida instantaneamente.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMORTALIDADE',
        description: 'Habilidade: Pressione Espaço/Toque para ser invencível por 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    },
    {
        id: 'BLASTER',
        name: 'CANHÃO CYBER',
        description: 'Atire lasers para destruir obstáculos. Use a tecla F ou toque.',
        cost: 2500,
        icon: Zap,
        oneTime: true
    },
    // FREE ITEMS
    {
        id: 'AVATAR_ROBOT',
        name: 'ROBÔ PADRÃO',
        description: 'Avatar robótico original.',
        cost: 0,
        icon: User,
        oneTime: true
    },
    {
        id: 'THEME_NEON',
        name: 'TEMA NEON',
        description: 'Vibe Cyberpunk clássica.',
        cost: 0,
        icon: Palette,
        oneTime: true
    },
    // PURCHASABLE AVATARS
    {
        id: 'AVATAR_CYBERPUNK',
        name: 'AVATAR CYBER',
        description: 'Estilo humanoide aprimorado.',
        cost: 2000,
        icon: User,
        oneTime: true
    },
    {
        id: 'AVATAR_ALIEN',
        name: 'AVATAR ALIEN',
        description: 'Bio-tecnologia extraterrestre.',
        cost: 5000,
        icon: User,
        oneTime: true
    },
    // PURCHASABLE THEMES
    {
        id: 'THEME_DESERT',
        name: 'TEMA DESERTO',
        description: 'Areias escaldantes e ruínas.',
        cost: 1500,
        icon: Palette,
        oneTime: true
    },
    {
        id: 'THEME_OCEAN',
        name: 'TEMA OCEANO',
        description: 'Profundidades cibernéticas subaquáticas.',
        cost: 1500,
        icon: Palette,
        oneTime: true
    }
];

const GAME_TIPS = [
    "DICA: Colete letras para formar palavras e ganhar bônus de pontuação!",
    "DICA: Compre o Pulo Duplo na loja para alcançar lugares mais altos.",
    "DICA: Evite os buracos negros! Eles são fatais se você cair.",
    "DICA: Use o Canhão Cyber (tecla F ou Toque) para destruir obstáculos.",
    "DICA: A imortalidade protege você de qualquer colisão por 5 segundos.",
    "DICA: Visite a Loja para desbloquear novos Avatares e Temas visuais.",
    "DICA: Deslize para baixo (Selta Baixo/S) para passar por baixo de lasers altos.",
    "DICA: Quanto mais longe você vai, mais rápido e difícil o jogo fica!"
];

const ShopScreen: React.FC = () => {
    const { 
        score, buyItem, closeShop, 
        hasDoubleJump, hasImmortality, hasBlaster,
        unlockedAvatars, unlockedThemes,
        avatarStyle, setAvatarStyle,
        theme, setTheme
    } = useStore();
    
    const [activeTab, setActiveTab] = useState<'POWERUPS' | 'VISUAL'>('POWERUPS');

    const filteredItems = SHOP_ITEMS.filter(item => {
        const isVisual = item.id.startsWith('AVATAR_') || item.id.startsWith('THEME_');
        if (activeTab === 'POWERUPS' && isVisual) return false;
        if (activeTab === 'VISUAL' && !isVisual) return false;
        
        // Don't show if already bought (oneTime items that aren't visuals)
        if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
        if (item.id === 'IMMORTAL' && hasImmortality) return false;
        if (item.id === 'BLASTER' && hasBlaster) return false;
        
        return true;
    });

    return (
        <div className="absolute inset-0 bg-black/95 z-[100] text-white pointer-events-auto backdrop-blur-xl overflow-y-auto">
             <div className="flex flex-col items-center min-h-full py-8 md:py-12 px-4 max-w-4xl mx-auto">
                 <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-2 font-cyber tracking-[0.2em]">CYBER LOJA</h2>
                    <div className="flex items-center justify-center space-x-3 text-yellow-400">
                        <Diamond className="w-6 h-6 animate-pulse" />
                        <span className="text-2xl md:text-3xl font-mono font-black">{score.toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="flex w-full mb-8 bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button 
                        onClick={() => setActiveTab('POWERUPS')}
                        className={`flex-1 py-3 font-mono tracking-widest text-sm rounded-xl transition-all ${activeTab === 'POWERUPS' ? 'bg-cyan-500 text-black font-bold' : 'text-white/50 hover:text-white'}`}
                    >
                        POWER-UPS
                    </button>
                    <button 
                        onClick={() => setActiveTab('VISUAL')}
                        className={`flex-1 py-3 font-mono tracking-widest text-sm rounded-xl transition-all ${activeTab === 'VISUAL' ? 'bg-purple-500 text-white font-bold' : 'text-white/50 hover:text-white'}`}
                    >
                        VISUAL & AVATAR
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
                     {filteredItems.map(item => {
                         const isAvatar = item.id.startsWith('AVATAR_');
                         const isTheme = item.id.startsWith('THEME_');
                         
                         let isUnlocked = false;
                         let isEquipped = false;
                         
                         if (isAvatar) {
                             const style = item.id.replace('AVATAR_', '') as AvatarStyle;
                             isUnlocked = unlockedAvatars ? unlockedAvatars.includes(style) : false;
                             isEquipped = avatarStyle === style;
                         } else if (isTheme) {
                             const t = item.id.replace('THEME_', '') as GameTheme;
                             isUnlocked = unlockedThemes ? unlockedThemes.includes(t) : false;
                             isEquipped = theme === t;
                         }

                         const canAfford = score >= item.cost;

                         return (
                             <div 
                                key={item.id}
                                className={`bg-white/5 border p-5 rounded-2xl transition-all flex flex-col justify-between group ${isEquipped ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10'}`}
                             >
                                 <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <div className={`p-1.5 rounded ${isEquipped ? 'bg-cyan-500 text-black' : 'bg-white/10'}`}>
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                        </div>
                                        <p className="text-white/50 text-xs leading-relaxed">{item.description}</p>
                                    </div>
                                    {isEquipped && <span className="text-[10px] font-mono bg-cyan-500 text-black px-2 py-0.5 rounded font-bold ml-2">USO</span>}
                                 </div>
                                 
                                 {isUnlocked ? (
                                     <button 
                                        disabled={isEquipped}
                                        onClick={() => {
                                            if (isAvatar) setAvatarStyle(item.id.replace('AVATAR_', '') as AvatarStyle);
                                            if (isTheme) setTheme(item.id.replace('THEME_', '') as GameTheme);
                                        }}
                                        className={`w-full py-2 rounded-lg font-mono text-xs font-bold transition-all ${isEquipped ? 'bg-white/5 text-white/30 cursor-default' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                     >
                                         {isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                                     </button>
                                 ) : (
                                     <button 
                                        onClick={() => buyItem(item.id as any, item.cost)}
                                        disabled={!canAfford}
                                        className={`w-full py-2 rounded-lg font-mono text-sm font-bold flex items-center justify-center space-x-2 transition-all ${canAfford ? 'bg-cyan-500 text-black hover:scale-105 active:scale-95' : 'bg-white/5 text-white/20 grayscale cursor-not-allowed'}`}
                                     >
                                         <span>{item.cost === 0 ? 'GRÁTIS' : item.cost.toLocaleString()}</span>
                                         <Diamond className="w-4 h-4" />
                                     </button>
                                 )}
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="flex items-center px-10 py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)] tracking-[0.2em]"
                 >
                    VOLTAR
                 </button>
             </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { 
    score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, 
    gemsCollected, distance, isImmortalityActive, speed,
    customWord, setCustomWord, difficulty, setDifficulty, theme, setTheme,
    avatarStyle, setAvatarStyle, unlockedAvatars, unlockedThemes
  } = useStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (status !== GameStatus.MENU) return;
    const interval = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % GAME_TIPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [status]);
  const target = customWord.split('');

  const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-[#050011] p-4 pointer-events-auto">
              <div className="relative w-full max-w-md flex flex-col items-center">
                
                {!showSettings && (
                    <div className="mb-12 relative text-center">
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 font-cyber tracking-tighter animate-pulse select-none">
                            CYBER<br/>RUNNER
                        </h1>
                        <div className="absolute -inset-2 bg-cyan-500/20 blur-2xl -z-10 rounded-full animate-pulse"></div>
                        
                        <div className="mt-6 h-8 flex items-center justify-center">
                            <p key={currentTipIndex} className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-1 duration-500">
                                {GAME_TIPS[currentTipIndex]}
                            </p>
                        </div>
                    </div>
                )}

                {showSettings ? (
                    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-6 animate-in slide-in-from-bottom-4 duration-300 max-h-[85vh] overflow-y-auto">
                        <h2 className="text-2xl font-cyber text-cyan-400 border-b border-white/10 pb-2 flex items-center">
                            <Settings className="mr-2" /> CONFIGURAÇÕES
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-mono text-white/50 uppercase tracking-widest flex items-center">
                                    <Type className="w-3 h-3 mr-1" /> Palavra Customizada (Máx 8)
                                </label>
                                <input 
                                    type="text"
                                    value={customWord}
                                    onChange={(e) => setCustomWord(e.target.value)}
                                    className="w-full bg-black/40 border border-white/20 p-2 mt-1 rounded-lg text-cyan-400 font-mono focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-mono text-white/50 uppercase tracking-widest flex items-center">
                                    <User className="w-3 h-3 mr-1" /> Protocolo de Avatar
                                </label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    {Object.values(AvatarStyle).map(s => {
                                        const isUnlocked = unlockedAvatars ? unlockedAvatars.includes(s) : false;
                                        if (!isUnlocked) return null;
                                        return (
                                            <button 
                                                key={s}
                                                onClick={() => setAvatarStyle(s)}
                                                className={`py-2 text-[10px] rounded-lg border transition-all ${avatarStyle === s ? 'bg-blue-500 text-white border-blue-500 font-bold' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                            >
                                                {s === 'ROBOT' ? 'ROBÔ' : s === 'ALIEN' ? 'ALIEN' : 'CYBER'}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[9px] text-white/30 mt-1 italic">Desbloqueie mais na Loja</p>
                            </div>

                            <div>
                                <label className="text-xs font-mono text-white/50 uppercase tracking-widest flex items-center">
                                    <Gauge className="w-3 h-3 mr-1" /> Densidade de Fluxo (Dificuldade)
                                </label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    {Object.values(GameDifficulty).map(d => (
                                        <button 
                                            key={d}
                                            onClick={() => setDifficulty(d)}
                                            className={`py-2 text-[10px] rounded-lg border transition-all ${difficulty === d ? 'bg-cyan-500 text-black border-cyan-500 font-bold' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                        >
                                            {d === 'EASY' ? 'FÁCIL' : d === 'MEDIUM' ? 'MÉDIO' : 'DIFÍCIL'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-mono text-white/50 uppercase tracking-widest flex items-center">
                                    <Palette className="w-3 h-3 mr-1" /> Protocolo Visual (Tema)
                                </label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    {Object.values(GameTheme).map(t => {
                                        const isUnlocked = unlockedThemes ? unlockedThemes.includes(t) : false;
                                        if (!isUnlocked) return null;
                                        return (
                                            <button 
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={`py-2 text-[10px] rounded-lg border transition-all ${theme === t ? 'bg-purple-500 text-white border-purple-500 font-bold' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                            >
                                                {t === 'NEON' ? 'NEON' : t === 'DESERT' ? 'DESERTO' : 'OCEANO'}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[9px] text-white/30 mt-1 italic">Desbloqueie mais na Loja</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowSettings(false)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-sm rounded-xl transition-all"
                        >
                            VOLTAR AO TERMINAL
                        </button>
                    </div>
                ) : (
                    <div className="w-full space-y-6">
                        <button 
                          onClick={() => { audio.init(); startGame(); }}
                          className="w-full group relative px-8 py-6 bg-cyan-500 text-black font-black text-2xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,255,0.4)] tracking-[0.2em] overflow-hidden"
                        >
                            INICIAR
                        </button>

                        <button 
                            onClick={() => useStore.getState().openShop()}
                            className="w-full p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-mono tracking-widest flex flex-col items-center justify-center rounded-2xl hover:brightness-110 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                        >
                            <div className="flex items-center text-xl font-black mb-1">
                                <Palette className="w-6 h-6 mr-3" /> LOJA & CUSTOMIZAÇÃO
                            </div>
                            <div className="text-[10px] opacity-70 uppercase font-bold tracking-[0.3em]">Mude seu Avatar e Tema</div>
                        </button>

                        <button 
                            onClick={() => setShowSettings(true)}
                            className="w-full p-4 bg-white/5 border border-white/10 text-white/70 font-mono tracking-widest flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-xs"
                        >
                            <Settings className="w-4 h-4 mr-2" /> AJUSTES RÁPIDOS
                        </button>

                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-cyan-400/80 text-sm font-bold font-mono tracking-widest uppercase text-center">
                                Deslize para mover e pular
                            </p>
                            <div className="flex space-x-4 opacity-50">
                                 <div className="w-8 h-8 border border-cyan-500/50 rounded flex items-center justify-center text-[10px]">←</div>
                                 <div className="w-8 h-8 border border-cyan-500/50 rounded flex items-center justify-center text-[10px]">↑</div>
                                 <div className="w-8 h-8 border border-cyan-500/50 rounded flex items-center justify-center text-[10px]">→</div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-sm overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] font-cyber text-center uppercase">FIM DE JOGO</h1>
                
                <div id="progress-card" className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md bg-gray-900/40 p-4 rounded-3xl border border-white/5">
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-yellow-400 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5"/> NÍVEL</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{level}</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-cyan-400 text-sm md:text-base"><Diamond className="mr-2 w-4 h-4 md:w-5 md:h-5"/> GEMAS COLETADAS</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{gemsCollected}</div>
                    </div>
                    <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center text-purple-400 text-sm md:text-base"><MapPin className="mr-2 w-4 h-4 md:w-5 md:h-5"/> DISTÂNCIA</div>
                        <div className="text-xl md:text-2xl font-bold font-mono">{Math.floor(distance)} AL</div>
                    </div>
                     <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg flex items-center justify-between mt-2">
                        <div className="flex items-center text-white text-sm md:text-base">PONTUAÇÃO TOTAL</div>
                        <div className="text-2xl md:text-3xl font-bold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{score.toLocaleString()}</div>
                    </div>
                </div>

                <div className="flex flex-col w-full max-w-md gap-4">
                    <button 
                    onClick={() => { audio.init(); restartGame(); }}
                    className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                    >
                        CORRER NOVAMENTE
                    </button>

                    <button 
                        onClick={() => {
                            const text = `🚀 Consegui ${score.toLocaleString()} pontos no CYBER RUNNER!\n🏆 Nível: ${level}\n💎 Gemas: ${gemsCollected}\n🌌 Distância: ${Math.floor(distance)} anos-luz\nJogue agora em: ${window.location.href}`;
                            if (navigator.share) {
                                navigator.share({
                                    title: 'CYBER RUNNER - Meu Progresso',
                                    text: text,
                                    url: window.location.href
                                }).catch(() => {
                                    navigator.clipboard.writeText(text);
                                    alert('Resumo copiado para a área de transferência!');
                                });
                            } else {
                                navigator.clipboard.writeText(text);
                                alert('Resumo copiado para a área de transferência!');
                            }
                        }}
                        className="p-3 bg-white/5 border border-white/10 text-white font-mono tracking-widest flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-sm"
                    >
                         COMPARTILHAR PROGRESSO
                    </button>
                </div>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <Rocket className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                <h1 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500 mb-2 drop-shadow-[0_0_20px_rgba(255,165,0,0.6)] font-cyber text-center leading-tight">
                    MISSÃO COMPLETA
                </h1>
                <p className="text-cyan-300 text-sm md:text-2xl font-mono mb-8 tracking-widest text-center">
                    A RESPOSTA DO UNIVERSO FOI ENCONTRADA
                </p>
                
                <div id="victory-card" className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-black/60 p-6 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                        <div className="text-xs md:text-sm text-gray-400 mb-1 tracking-wider uppercase">Pontuação Final</div>
                        <div className="text-3xl md:text-4xl font-bold font-cyber text-yellow-400">{score.toLocaleString()}</div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/60 p-4 rounded-lg border border-white/10">
                            <div className="text-xs text-gray-400 uppercase">Gemas</div>
                            <div className="text-xl md:text-2xl font-bold text-cyan-400">{gemsCollected}</div>
                        </div>
                        <div className="bg-black/60 p-4 rounded-lg border border-white/10">
                             <div className="text-xs text-gray-400 uppercase">Distância</div>
                            <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.floor(distance)} AL</div>
                        </div>
                     </div>
                </div>

                <div className="flex flex-col w-full max-w-md gap-4 items-center">
                    <button 
                    onClick={() => { audio.init(); restartGame(); }}
                    className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] tracking-widest"
                    >
                        REINICIAR CORRIDA
                    </button>

                    <button 
                        onClick={() => {
                            const text = `🌠 COMPLETEI A MISSÃO no CYBER RUNNER!\n✨ Pontuação: ${score.toLocaleString()}\n💎 Gemas: ${gemsCollected}\n🌌 Distância Total: ${Math.floor(distance)} AL\nDesafie-me aqui: ${window.location.href}`;
                            if (navigator.share) {
                                navigator.share({
                                    title: 'CYBER RUNNER - Missão Completa!',
                                    text: text,
                                    url: window.location.href
                                }).catch(() => {
                                    navigator.clipboard.writeText(text);
                                    alert('Resumo copiado para a área de transferência!');
                                });
                            } else {
                                navigator.clipboard.writeText(text);
                                alert('Resumo copiado para a área de transferência!');
                            }
                        }}
                        className="p-3 bg-white/5 border border-white/10 text-white font-mono tracking-widest flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-sm w-full"
                    >
                        COMPARTILHAR VITÓRIA
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className={containerClass}>
        {/* Minimalist UI - Only show immortality indicator */}
        {isImmortalityActive && (
             <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_gold]">
                 <Shield className="mr-2 fill-yellow-400" /> IMORTAL
             </div>
        )}
    </div>
  );
};
