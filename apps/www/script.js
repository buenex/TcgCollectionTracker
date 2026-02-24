const CONFIG = {
    API_BASE: 'https://buenex-my-apis.duckdns.org/tcg-tracker/v1',
    DB_NAME: 'TcgPokemonDB',
    DB_VERSION: 1
};

let userFavorites = [];
let userObtained = [];
let db;

// --- 1. GERENCIAMENTO DE INDEXED DB ---
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (db.objectStoreNames.contains('cards')) {
                db.deleteObjectStore('cards');
            }
            db.createObjectStore('cards', { keyPath: 'id' });
        };

        request.onsuccess = (e) => {
            db = e.target.result;
            resolve(db);
        };
        request.onerror = (e) => reject("Erro ao abrir IndexedDB");
    });
};

const saveCardsLocal = async (cards) => {
    const tx = db.transaction('cards', 'readwrite');
    const store = tx.objectStore('cards');
    cards.forEach(card => {
        if (card.id) store.put(card);
    });
    return tx.complete;
};

const getAllCardsLocal = () => {
    return new Promise((resolve) => {
        const tx = db.transaction('cards', 'readonly');
        const store = tx.objectStore('cards');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
    });
};

// --- 2. LÓGICA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', async () => {
    await initDB();
    let currentFilter = 'all';

    const ui = {
        loginContainer: document.getElementById('login-container'),
        dashboardContainer: document.getElementById('dashboard-container'),
        loginBtn: document.getElementById('login-btn'),
        logoutBtn: document.getElementById('logout-btn'),
        userDisplay: document.getElementById('user-display'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        searchBtn: document.getElementById('search-btn'),
        searchInput: document.getElementById('search-input'),
        objectList: document.getElementById('object-list')
    };

    const syncCards = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/cards/all`);
            if (response.ok) {
                const cards = await response.json();
                await saveCardsLocal(cards);
            }
        } catch (e) { console.error("Falha no sync", e); }
    };

    const generateHash = (user, pass) => btoa(`${user}:${pass}`);

    const checkAuth = async () => {
        const loggedUser = localStorage.getItem('logged_user');
        const userHash = localStorage.getItem('user_hash');

        if (loggedUser && userHash) {
            ui.loginContainer.classList.add('d-none');
            ui.dashboardContainer.classList.remove('d-none');
            ui.userDisplay.textContent = `Olá, ${loggedUser}`;

            await loadUserStatus(userHash);

            const localCards = await getAllCardsLocal();
            if (localCards.length > 0) {
                renderCollection(localCards);
            }

            await syncCards();
            if (localCards.length === 0) {
                const freshCards = await getAllCardsLocal();
                renderCollection(freshCards);
            }
        } else {
            ui.loginContainer.classList.remove('d-none');
            ui.dashboardContainer.classList.add('d-none');
        }
    };

    const renderCollection = (allCards) => {
        const myCards = allCards.filter(c => userObtained.includes(c.id));
        if (myCards.length === 0) {
            ui.objectList.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">Sua coleção está vazia.</p></div>`;
            return;
        }
        renderCards(myCards);
    };

    // --- ATUALIZAÇÃO DA RENDERIZAÇÃO ---
    const renderCards = (cards) => {
        ui.objectList.innerHTML = '';

        // Lógica de Filtro
        const filteredCards = cards.filter(card => {
            if (currentFilter === 'obtained') return userObtained.includes(card.id);
            if (currentFilter === 'favorites') return userFavorites.includes(card.id);
            return true;
        });

        filteredCards.forEach(card => {
            const id = card.id;
            const isFav = userFavorites.includes(id);
            const isObt = userObtained.includes(id);

            const cardCol = document.createElement('div');
            cardCol.className = 'col-md-3 mb-4';
            cardCol.id = `card-container-${id}`;
            cardCol.innerHTML = `
                <div class="card h-100 shadow-sm border card-pokemon ${isObt ? '' : 'grayscale'} ${isFav ? 'is-favorite' : ''}">
                    <div class="position-absolute top-0 start-0 m-2">
                        <span class="badge bg-dark opacity-75" style="font-size: 0.7rem;">${card.code || 'N/A'}</span>
                    </div>

                    <img src="${card.image || 'src/img/notfound.png'}" class="card-img-top p-3" alt="${card.name}">
                    
                    <div class="card-body pt-0 text-center">
                        <small class="text-muted text-uppercase fw-bold" style="font-size: 0.7rem;">
                            ${card.set_name || 'Set Desconhecido'}
                        </small>
                        
                        <h5 class="card-title mb-1">${card.name}</h5>
                        
                        <div class="mb-2">
                            <span class="text-secondary small italic">✨ ${card.rarity || 'Comum'}</span>
                        </div>

                        <div class="d-flex justify-content-center gap-4 mt-3">
                            <span class="btn-status is-obt ${isObt ? 'active' : ''}" 
                                data-id="${id}" data-type="obtained" title="Obtida">
                                🎴
                            </span>
                            <span class="btn-status is-fav ${isFav ? 'active' : ''}" 
                                data-id="${id}" data-type="favorites" title="Favorita">
                                ⭐
                            </span>
                        </div>
                    </div>
                </div>
            `;
            ui.objectList.appendChild(cardCol);
        });
        setupToggleEvents();
    };

    // --- LÓGICA DOS FILTROS ---
    const setupFilters = () => {
        const filters = {
            'all': document.getElementById('filter-all'),
            'obtained': document.getElementById('filter-obtained'),
            'favorites': document.getElementById('filter-favorites')
        };

        Object.keys(filters).forEach(key => {
            filters[key].addEventListener('click', async () => {
                // UI
                Object.values(filters).forEach(btn => btn.classList.remove('filter-active'));
                filters[key].classList.add('filter-active');

                // Lógica
                currentFilter = key;
                const allCards = await getAllCardsLocal();
                renderCards(allCards);
            });
        });
    };

    function createSwitchHTML(id, type, label, checked, extraClass = '') {
        return type == 'obtained' ? `
            <div class="form-check form-switch">
            <label class="form-check-label small ${extraClass}">${label}</label>
                <input class="form-check-input toggle-status" type="checkbox" role="switch" 
                    data-id="${id}" data-type="${type}" ${checked ? 'checked' : ''}>
            </div>
        `: `
        <div class="form-check form-switch">
            <input class="form-check-input toggle-status" type="checkbox" role="switch" 
                data-id="${id}" data-type="${type}" ${checked ? 'checked' : ''}>
            <label class="form-check-label small ${extraClass}">${label}</label>
        </div>
    `;
    }

    ui.searchBtn.addEventListener('click', async () => {
        const query = ui.searchInput.value.trim();
        if (!query) return;
        try {
            const response = await fetch(`${CONFIG.API_BASE}/cards?name=${query}`);
            const data = await response.json();
            await saveCardsLocal(data);
            renderCards(data);
        } catch (error) { console.error("Erro na busca", error); }
    });

    async function loadUserStatus(hash) {
        try {
            const [f, o] = await Promise.all([
                fetch(`${CONFIG.API_BASE}/favorites/${hash}`),
                fetch(`${CONFIG.API_BASE}/obtained/${hash}`)
            ]);
            userFavorites = f.ok ? await f.json() : [];
            userObtained = o.ok ? await o.json() : [];
        } catch (e) { console.error(e); }
    }

    // --- NOVA LÓGICA DE EVENTOS ---
    function setupToggleEvents() {
        const hash = localStorage.getItem('user_hash');
        document.querySelectorAll('.btn-status').forEach(btn => {
            btn.onclick = async (e) => {
                const { id, type } = e.currentTarget.dataset;
                const isActive = e.currentTarget.classList.contains('active');
                const shouldBeActive = !isActive;

                // Visual instantâneo
                const cardElement = document.querySelector(`#card-container-${CSS.escape(id)} .card`);
                e.currentTarget.classList.toggle('active', shouldBeActive);

                if (type === 'obtained') {
                    cardElement.classList.toggle('grayscale', !shouldBeActive);
                } else {
                    cardElement.classList.toggle('is-favorite', shouldBeActive);
                }

                try {
                    const res = await fetch(`${CONFIG.API_BASE}/${type}/${hash}/${id}`, {
                        method: shouldBeActive ? 'POST' : 'DELETE'
                    });
                    if (!res.ok) throw new Error();
                    updateLocalCache(type, id, shouldBeActive);

                    // Se estiver em um filtro ativo e desmarcar, remove da visão
                    if (!shouldBeActive && currentFilter !== 'all') {
                        renderCards(await getAllCardsLocal());
                    }
                } catch (error) {
                    alert("Erro ao sincronizar.");
                    location.reload(); // Reverte em caso de erro crítico
                }
            };
        });
    }

    function updateLocalCache(type, cardId, isChecked) {
        if (type === 'favorites') {
            isChecked ? (!userFavorites.includes(cardId) && userFavorites.push(cardId))
                : (userFavorites = userFavorites.filter(i => i !== cardId));
            
            if (!isChecked && currentFilter === 'favorites') {
                document.getElementById(`card-container-${cardId}`)?.remove();
            }
        } else {
            isChecked ? (!userObtained.includes(cardId) && userObtained.push(cardId))
                : (userObtained = userObtained.filter(i => i !== cardId));

            if (!isChecked && currentFilter === 'obtained') {
                document.getElementById(`card-container-${cardId}`)?.remove();
            }
        }
    }

    ui.loginBtn.addEventListener('click', () => {
        const u = ui.usernameInput.value.trim();
        const p = ui.passwordInput.value.trim();
        if (u && p) {
            localStorage.setItem('logged_user', u);
            localStorage.setItem('user_hash', generateHash(u, p));
            checkAuth();
        }
    });

    ui.logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    checkAuth();
    setupFilters()
});