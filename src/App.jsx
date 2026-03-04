import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ChevronRight, LayoutGrid, Trophy, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveGame(null); setSelectedCategory('All'); }}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">google classroom-</h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <button className="hover:text-white transition-colors flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard
            </button>
            <button className="hover:text-white transition-colors flex items-center gap-2">
              <Flame className="w-4 h-4" /> Trending
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="group relative bg-[#141414] border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setActiveGame(game)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {game.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-1">{game.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-1">{game.description}</p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ChevronRight className="w-6 h-6 text-black" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold mb-2">No games found</h3>
            <p className="text-white/40">Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl aspect-video bg-[#141414] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1A1A1A]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                    <img src={activeGame.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-none mb-1">{activeGame.title}</h2>
                    <p className="text-xs text-white/40">{activeGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveGame(null)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/60 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Game Iframe */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={activeGame.url}
                  className="w-full h-full border-none"
                  title={activeGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#1A1A1A] border-t border-white/10 flex items-center justify-between">
                <p className="text-sm text-white/60 max-w-2xl line-clamp-1">
                  {activeGame.description}
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
                    Report Bug
                  </button>
                  <button className="bg-emerald-500 text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors">
                    Full Screen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-tighter italic">google classroom-</span>
          </div>
          <div className="flex gap-8 text-xs font-medium text-white/40 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">DMCA</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/20">
            © 2024 google classroom-. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
