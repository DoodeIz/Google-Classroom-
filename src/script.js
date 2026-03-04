let games = [];
let filteredGames = [];
let currentCategory = 'All';
let searchQuery = '';

const gameGrid = document.getElementById('gameGrid');
const searchInput = document.getElementById('searchInput');
const categoryContainer = document.getElementById('categoryContainer');
const emptyState = document.getElementById('emptyState');
const gameModal = document.getElementById('gameModal');
const gameIframe = document.getElementById('gameIframe');

// Initialize Lucide icons
function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Fetch games from JSON
async function fetchGames() {
    try {
        const response = await fetch('src/games.json');
        games = await response.json();
        filteredGames = [...games];
        renderCategories();
        renderGames();
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// Render category buttons
function renderCategories() {
    const categories = ['All', ...new Set(games.map(g => g.category))];
    categoryContainer.innerHTML = categories.map(cat => `
        <button
            onclick="setCategory('${cat}')"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                currentCategory === cat
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }"
        >
            ${cat}
        </button>
    `).join('');
}

// Render game cards
function renderGames() {
    filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = currentCategory === 'All' || game.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredGames.length === 0) {
        gameGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        gameGrid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        gameGrid.innerHTML = filteredGames.map(game => `
            <div
                onclick="openGame('${game.id}')"
                class="group relative bg-[#141414] border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
            >
                <div class="aspect-[4/3] overflow-hidden">
                    <img
                        src="${game.thumbnail}"
                        alt="${game.title}"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerpolicy="no-referrer"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                </div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] uppercase tracking-widest font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                            ${game.category}
                        </span>
                    </div>
                    <h3 class="text-lg font-bold leading-tight mb-1">${game.title}</h3>
                    <p class="text-xs text-white/60 line-clamp-1">${game.description}</p>
                </div>

                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <i data-lucide="chevron-right" class="w-6 h-6 text-black"></i>
                    </div>
                </div>
            </div>
        `).join('');
        initIcons();
    }
}

// Filter logic
function setCategory(cat) {
    currentCategory = cat;
    renderCategories();
    renderGames();
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
});

// Modal logic
function openGame(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;

    document.getElementById('modalTitle').innerText = game.title;
    document.getElementById('modalCategory').innerText = game.category;
    document.getElementById('modalDescription').innerText = game.description;
    document.getElementById('modalIcon').querySelector('img').src = game.thumbnail;
    gameIframe.src = game.url;
    
    gameModal.classList.remove('hidden');
    gameModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    initIcons();
}

function closeGame() {
    gameModal.classList.add('hidden');
    gameModal.classList.remove('flex');
    gameIframe.src = '';
    document.body.style.overflow = 'auto';
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        gameIframe.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGame();
});

// Initial fetch
fetchGames();
initIcons();
