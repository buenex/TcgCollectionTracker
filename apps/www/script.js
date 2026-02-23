const CONFIG = {
    API_BASE: 'http://localhost:8010/proxy/tcg-tracker/v1',
};

let userFavorites = [];
let userObtained = [];

document.addEventListener('DOMContentLoaded', async () => {
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

    // --- LÓGICA DE AUTENTICAÇÃO ---

    const generateHash = (user, pass) => btoa(`${user}:${pass}`);

    const checkAuth = async () => {
        const loggedUser = localStorage.getItem('logged_user');
        const userHash = localStorage.getItem('user_hash');

        if (loggedUser && userHash) {
            ui.loginContainer.classList.add('d-none');
            ui.dashboardContainer.classList.remove('d-none');
            ui.userDisplay.textContent = `Olá, ${loggedUser}`;
            
            // Carrega os dados do usuário assim que confirma a autenticação
            await loadUserStatus(userHash);

        } else {
            ui.loginContainer.classList.remove('d-none');
            ui.dashboardContainer.classList.add('d-none');
        }
    };

    ui.loginBtn.addEventListener('click', () => {
        const user = ui.usernameInput.value.trim();
        const pass = ui.passwordInput.value.trim();

        if (user && pass) {
            localStorage.setItem('logged_user', user);
            localStorage.setItem('user_hash', generateHash(user, pass));
            checkAuth();
        } else {
            alert('Por favor, preencha todos os campos!');
        }
    });

    ui.logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload(); // Recarrega para limpar estados
    });

    // --- LÓGICA DE BUSCA E RENDERIZAÇÃO ---

    const renderCards = (cards) => {
        ui.objectList.innerHTML = '';

        cards.forEach(card => {
            const isFavorited = userFavorites.includes(card.id);
            const isObtained = userObtained.includes(card.id);

            const cardCol = document.createElement('div');
            cardCol.className = 'col';
            cardCol.innerHTML = `
                <div class="card h-100 shadow-sm border card-pokemon">
                    <img src="${card.image??"src/img/notfound.png"}" class="card-img-top p-3" alt="${card.name}">
                    <div class="card-body pt-0">
                        <small class="text-muted text-uppercase fw-bold">${card.set_name}</small>
                        <h5 class="card-title mb-1">${card.name}</h5>
                        <p class="text-muted mb-3" style="font-size: 0.8rem;">ID: ${card.id}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            ${createSwitchHTML(card.id, 'obtained', 'Obtained', isObtained)}
                            ${createSwitchHTML(card.id, 'favorites', '❤', isFavorited, 'text-danger')}
                        </div>
                    </div>
                </div>
            `;
            ui.objectList.appendChild(cardCol);
        });

        setupToggleEvents();
    };

    // Helper para gerar o HTML do Switch
    function createSwitchHTML(id, type, label, checked, labelClass = '') {
        return `
            <div class="form-check form-switch">
                <input class="form-check-input toggle-status" type="checkbox" role="switch" 
                    data-id="${id}" data-type="${type}" ${checked ? 'checked' : ''}>
                <label class="form-check-label small ${labelClass}">${label}</label>
            </div>
        `;
    }

    ui.searchBtn.addEventListener('click', async () => {
        const query = ui.searchInput.value.trim();
        if (!query) return alert("Digite algo para buscar!");

        try {
            const response = await fetch(`${CONFIG.API_BASE}/cards?name=${query}`);
            if (!response.ok) throw new Error('Erro na busca');
            const data = await response.json();
            renderCards(data);
        } catch (error) {
            console.error("Erro ao buscar:", error);
            alert("Erro ao conectar com a API de busca.");
        }
    });

    // --- LÓGICA DE SINCRONIZAÇÃO COM API ---

    async function loadUserStatus(hash) {
        try {
            const [favRes, obtRes] = await Promise.all([
                fetch(`${CONFIG.API_BASE}/favorites/${hash}`),
                fetch(`${CONFIG.API_BASE}/obtained/${hash}`)
            ]);

            userFavorites = favRes.ok ? await favRes.json() : [];
            userObtained = obtRes.ok ? await obtRes.json() : [];
        } catch (error) {
            console.error("Erro ao carregar listas do usuário:", error);
        }
    }

    function setupToggleEvents() {
        const hash = localStorage.getItem('user_hash');
        
        document.querySelectorAll('.toggle-status').forEach(toggle => {
            // Remove ouvintes antigos para evitar disparos duplicados se renderizar de novo
            toggle.replaceWith(toggle.cloneNode(true));
        });

        // Adiciona os novos ouvintes
        document.querySelectorAll('.toggle-status').forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                const { id, type } = e.target.dataset;
                const isChecked = e.target.checked;
                const method = isChecked ? 'POST' : 'DELETE';

                try {
                    const response = await fetch(`${CONFIG.API_BASE}/${type}/${hash}/${id}`, { method });
                    if (!response.ok) throw new Error('Falha na API');
                    
                    updateLocalCache(type, id, isChecked);
                } catch (error) {
                    console.error("Erro no toggle:", error);
                    e.target.checked = !isChecked; // Reverte o visual
                    alert("Erro ao salvar. Verifique sua conexão.");
                }
            });
        });
    }

    function updateLocalCache(type, cardId, isChecked) {
        const list = type === 'favorites' ? userFavorites : userObtained;
        if (isChecked) {
            if (!list.includes(cardId)) list.push(cardId);
        } else {
            const index = list.indexOf(cardId);
            if (index > -1) list.splice(index, 1);
        }
        // Atualiza as variáveis globais corretamente
        if (type === 'favorites') userFavorites = list;
        else userObtained = list;
    }
    // Inicialização
    checkAuth();
});