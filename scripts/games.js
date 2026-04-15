document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------------------------------------ //
    // 1. UTILIDADES CAROUSEL (Game Examples)
    // ------------------------------------------------------------------------------------------------ //
    function setupCarousel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const track = container.querySelector('.carousel-track');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevBtn = container.querySelector('.carousel-btn.prev');
        const nextBtn = container.querySelector('.carousel-btn.next');
        if (!track || slides.length <= 1 || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const maxIndex = slides.length - 1;

        const updateTrack = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';

            nextBtn.disabled = currentIndex === maxIndex;
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
            nextBtn.style.cursor = currentIndex === maxIndex ? 'not-allowed' : 'pointer';

            // Lazy load the iframe of this slide if needed
            const iframe = slides[currentIndex].querySelector('iframe');
            if (iframe) {
                if (iframe.hasAttribute('data-src')) {
                    iframe.setAttribute('src', iframe.getAttribute('data-src'));
                    iframe.removeAttribute('data-src');
                }
                if (iframe.hasAttribute('data-srcdoc')) {
                    iframe.setAttribute('srcdoc', iframe.getAttribute('data-srcdoc'));
                    iframe.removeAttribute('data-srcdoc');
                }
            }
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateTrack();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateTrack();
            }
        });

        // Initialize state
        updateTrack();
    }

    setupCarousel('carouselImpostor');
    setupCarousel('carouselConecto');

    // ------------------------------------------------------------------------------------------------ //
    // 2. MOTOR JUEGO IMPOSTOR (SPA MODAL)
    // ------------------------------------------------------------------------------------------------ //
    if (typeof GAMES_DATA === 'undefined' || !GAMES_DATA.games || !GAMES_DATA.games.impostor) return;

    const impostorData = GAMES_DATA.games.impostor;
    const playBtn = document.getElementById('btnPlayImpostor');
    const modal = document.getElementById('impostorLobbyModal');
    if (!playBtn || !modal) return;

    // Elementos Lobby
    const closeLobbyBtn = document.getElementById('closeLobbyBtn');
    const lobbyBody = document.getElementById('lobbyBody');
    const gameBody = document.getElementById('gameBody');

    // Players List
    const newPlayerInput = document.getElementById('newPlayerName');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const playerListEl = document.getElementById('playerListEl');
    const playercountSpan = document.getElementById('playercount');
    const playerErrorMsg = document.getElementById('playerError');
    const startGameBtn = document.getElementById('startGameBtn');

    // Configs
    const numImpostorsSelect = document.getElementById('numImpostors');
    const showHintCheck = document.getElementById('showHintCheck');
    const specialRolesContainer = document.getElementById('specialRolesContainer');
    const wordPacketsContainer = document.getElementById('wordPacketsContainer');
    const packetErrorMsg = document.getElementById('packetError');

    // Variables de Estado
    let players = [];
    // Load from local storage
    try {
        const saved = localStorage.getItem('impostor_players');
        if (saved) players = JSON.parse(saved);
    } catch (e) { }

    let assignedRoles = []; // { name, role, isImpostor }
    let gameSessionWord = "";
    let gameSessionHint = "";

    // --- Configuración Persistente ---
    let gameConfig = {
        numImpostors: 1,
        showHint: true,
        selectedRoles: [],
        selectedPackets: []
    };

    function loadGameConfig() {
        try {
            const saved = localStorage.getItem('impostor_config');
            if (saved) {
                const parsed = JSON.parse(saved);
                gameConfig = { ...gameConfig, ...parsed };
            }
        } catch (e) { }
    }
    loadGameConfig();

    function saveGameConfig() {
        localStorage.setItem('impostor_config', JSON.stringify(gameConfig));
    }

    // -- Inicialización SPA --
    playBtn.addEventListener('click', () => {
        toggleBodyScroll(true);
        modal.style.display = 'flex';
        lobbyBody.style.display = 'block';
        gameBody.style.display = 'none';

        renderPlayerList();
        renderSpecialRoles();
        renderWordPackets();
        checkReadyStatus();
    });

    closeLobbyBtn.addEventListener('click', () => {
        toggleBodyScroll(false);
        modal.style.display = 'none';
    });

    // -- Eventos de Configuración Directos --
    numImpostorsSelect.addEventListener('change', () => {
        gameConfig.numImpostors = parseInt(numImpostorsSelect.value);
        saveGameConfig();
    });

    showHintCheck.addEventListener('change', () => {
        gameConfig.showHint = showHintCheck.checked;
        saveGameConfig();
    });

    // -- Jugadores --
    function savePlayers() {
        localStorage.setItem('impostor_players', JSON.stringify(players));
    }

    function addPlayer() {
        playerErrorMsg.textContent = "";
        let name = newPlayerInput.value.trim();
        if (name === "") return;
        // Capitalizar primera letra
        name = name.charAt(0).toUpperCase() + name.slice(1);

        // Unicidad ignorant case/spaces
        let nameNorm = name.toLowerCase().replace(/\s+/g, '');
        for (let p of players) {
            if (p.toLowerCase().replace(/\s+/g, '') === nameNorm) {
                playerErrorMsg.textContent = "¡Este jugador ya está en la salita!";
                return;
            }
        }

        players.push(name);
        newPlayerInput.value = "";
        savePlayers();
        renderPlayerList();
        renderSpecialRoles(); // Evaluar max roles
        checkReadyStatus();
    }

    addPlayerBtn.addEventListener('click', addPlayer);
    newPlayerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });

    function deletePlayer(index) {
        players.splice(index, 1);
        savePlayers();
        renderPlayerList();
        renderSpecialRoles();
        checkReadyStatus();
    }

    function renderPlayerList() {
        playerListEl.innerHTML = "";
        players.forEach((p, index) => {
            const li = document.createElement('li');
            li.textContent = p;
            const delBtn = document.createElement('button');
            delBtn.className = 'del-btn';
            delBtn.textContent = 'x';
            delBtn.onclick = () => deletePlayer(index);
            li.appendChild(delBtn);
            playerListEl.appendChild(li);
        });
        playercountSpan.textContent = players.length;

        // Limites de impostores => Math.floor(players.length / 2)
        const maxImpostors = Math.max(1, Math.floor(players.length / 2));
        numImpostorsSelect.innerHTML = "";
        for (let i = 1; i <= maxImpostors; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            numImpostorsSelect.appendChild(opt);
        }

        // Restaurar valor guardado si es válido
        if (gameConfig.numImpostors <= maxImpostors) {
            numImpostorsSelect.value = gameConfig.numImpostors;
        } else {
            numImpostorsSelect.value = 1;
            gameConfig.numImpostors = 1;
            saveGameConfig();
        }

        // Sincronizar otros campos simples
        showHintCheck.checked = gameConfig.showHint;
    }

    // -- Roles Especiales --
    function renderSpecialRoles() {
        specialRolesContainer.innerHTML = "";
        if (!impostorData.roles.special) return;

        impostorData.roles.special.forEach((role, index) => {
            const canPlay = players.length >= role.playersNeeded;

            // Lógica de desmarque automático: si no se cumple el requisito y estaba marcado, se quita.
            if (!canPlay && gameConfig.selectedRoles.includes(role.name)) {
                gameConfig.selectedRoles = gameConfig.selectedRoles.filter(r => r !== role.name);
                saveGameConfig();
            }

            const isChecked = gameConfig.selectedRoles.includes(role.name) && canPlay;

            const container = document.createElement('div');
            container.className = `role-switch ${canPlay ? 'enabled' : ''}`;

            const label = document.createElement('label');
            label.className = 'switch-label';
            label.setAttribute('for', `roleSwitch_${index}`);
            label.innerHTML = `
                <img src="assets/games/impostor/roles/${role.image}.png" alt="${role.name}">
                <div class="switch-label-text">
                    <span>Rol de ${role.name}</span>
                    <span class="switch-label-min">(Mínimo ${role.playersNeeded} jugs)</span>
                </div>
            `;

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `roleSwitch_${index}`;
            input.value = role.name;
            input.disabled = !canPlay;
            input.checked = isChecked;
            input.dataset.rolename = role.name;

            input.addEventListener('change', () => {
                if (input.checked) {
                    if (!gameConfig.selectedRoles.includes(role.name)) {
                        gameConfig.selectedRoles.push(role.name);
                    }
                } else {
                    gameConfig.selectedRoles = gameConfig.selectedRoles.filter(r => r !== role.name);
                }
                saveGameConfig();
            });

            // Toggle switch wrapper
            const toggleLabel = document.createElement('label');
            toggleLabel.className = 'toggle-switch';
            toggleLabel.setAttribute('for', `roleSwitch_${index}`);
            const toggleSlider = document.createElement('span');
            toggleSlider.className = 'toggle-slider round';
            toggleLabel.appendChild(input);
            toggleLabel.appendChild(toggleSlider);

            container.appendChild(label);
            container.appendChild(toggleLabel);
            specialRolesContainer.appendChild(container);
        });
    }

    // -- Paquetes de Palabras --
    function renderWordPackets() {
        wordPacketsContainer.innerHTML = "";
        if (!impostorData.wordPackets) return;

        impostorData.wordPackets.forEach(packet => {
            const isSelected = gameConfig.selectedPackets.length === 0 || gameConfig.selectedPackets.includes(packet.id);
            if (gameConfig.selectedPackets.length === 0) {
                // Inicializar por defecto si está vacío
                gameConfig.selectedPackets.push(packet.id);
                // No guardamos aún para evitar bucles, se guardará al interactuar
            }

            const card = document.createElement('div');
            card.className = `packet-card ${isSelected ? 'selected' : ''}`;
            card.dataset.id = packet.id;

            card.innerHTML = `
                <div class="packet-card-check">✓</div>
                <img src="assets/games/impostor/wordPackets/${packet.id}.png" onerror="this.src='assets/logo.png'">
                <span>${packet.name}</span>
            `;

            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                const id = parseInt(card.dataset.id);
                if (card.classList.contains('selected')) {
                    if (!gameConfig.selectedPackets.includes(id)) gameConfig.selectedPackets.push(id);
                } else {
                    gameConfig.selectedPackets = gameConfig.selectedPackets.filter(pid => pid !== id);
                }
                saveGameConfig();
                checkReadyStatus();
            });

            wordPacketsContainer.appendChild(card);
        });
    }

    function checkReadyStatus() {
        packetErrorMsg.textContent = "";
        let ready = true;
        if (players.length < 3) {
            ready = false;
        }

        const selectedPackets = document.querySelectorAll('.packet-card.selected');
        if (selectedPackets.length === 0) {
            packetErrorMsg.textContent = "Debes seleccionar al menos un paquete de palabras.";
            ready = false;
        }

        startGameBtn.disabled = !ready;
    }

    // ------------------------------------------------------------------------------------------------ //
    // 3. SECUENCIA DE DISPENSACIÓN DE ROLES E INTERACTIVIDAD REVEAL
    // ------------------------------------------------------------------------------------------------ //
    let currentRoleIndex = 0;

    // Controles de reveal
    const stepShowRole = document.getElementById('gameStepShowRole');
    const stepWhoStarts = document.getElementById('gameStepWhoStarts');
    const stepRevealAll = document.getElementById('gameStepRevealAll');

    const currentPlayerTurnText = document.getElementById('currentPlayerTurnText');
    const cardCover = document.getElementById('cardCover');
    const roleImg = document.getElementById('roleImg');
    const roleNameEl = document.getElementById('roleName');
    const secretWordEl = document.getElementById('secretWordOrHint');
    const roleDescEl = document.getElementById('roleDesc');
    const nextPlayerRoleBtn = document.getElementById('nextPlayerRoleBtn');

    // Iniciar el Juego (Core Logic)
    startGameBtn.addEventListener('click', () => {
        // 1. Obtener palabra secreta
        const selectedPackets = Array.from(document.querySelectorAll('.packet-card.selected')).map(c => parseInt(c.dataset.id));
        let possiblePackets = impostorData.wordPackets.filter(p => selectedPackets.includes(p.id));
        let allWordsPool = [];

        possiblePackets.forEach(p => {
            p.words.forEach(w => {
                allWordsPool.push({ word: w, packetName: p.name, sourceObj: p.words });
            });
        });

        if (allWordsPool.length === 0) {
            alert('No hay palabras disponibles en los paquetes seleccionados.');
            return;
        }

        // Random word
        let selectedWordObj = allWordsPool[Math.floor(Math.random() * allWordsPool.length)];
        gameSessionWord = selectedWordObj.word;
        gameSessionHint = showHintCheck.checked ? selectedWordObj.packetName : null;

        // Remover palabra del listón de sesión para no repetir (en la memoria JS)
        let idxToRemove = selectedWordObj.sourceObj.indexOf(gameSessionWord);
        if (idxToRemove > -1) {
            selectedWordObj.sourceObj.splice(idxToRemove, 1);
        }

        // 2. Repartir Roles (Clonar > Shuffle > Asignar roles lógicos > Mezclar con Playernames originales)
        const totalImpostors = parseInt(numImpostorsSelect.value);
        let activeSpecialRoles = [];
        const specialInputs = document.querySelectorAll('#specialRolesContainer input:checked');
        specialInputs.forEach(i => activeSpecialRoles.push(i.value));

        let rolePool = []; // Nombres de roles internamente
        for (let i = 0; i < totalImpostors; i++) rolePool.push('impostor');
        activeSpecialRoles.forEach(r => rolePool.push(r));
        while (rolePool.length < players.length) {
            rolePool.push('civil');
        }

        // Shuffle role array
        rolePool = shuffleArray(rolePool);

        // Atar los roles con los nombres en su ORDEN REAL (el movil pasa persona por persona en circulo)
        assignedRoles = players.map((playerName, idx) => {
            return {
                playerName: playerName,
                roleType: rolePool[idx]
            };
        });

        // 3. Preparar Pantallas
        lobbyBody.style.display = 'none';
        gameBody.style.display = 'block';
        stepShowRole.style.display = 'flex';
        stepWhoStarts.style.display = 'none';
        stepRevealAll.style.display = 'none';

        currentRoleIndex = 0;
        showRoleTurn(currentRoleIndex);
    });

    // Drag / Swipe Lógica
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    const revealThreshold = 250;

    function dragStart(e) {
        if (cardCover.classList.contains('hidden')) return;
        isDragging = true;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        cardCover.style.transition = 'none';
        cardCover.classList.add('gripped');
    }

    function dragMove(e) {
        if (!isDragging) return;
        let y = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        currentY = y - startY;

        // Solo permitir deslizar hacia arriba
        if (currentY < 0) {
            cardCover.style.transform = `translateY(${currentY}px)`;
            if (Math.abs(currentY) > revealThreshold) {
                nextPlayerRoleBtn.disabled = false;
            }
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cardCover.classList.remove('gripped');
        cardCover.style.transition = 'transform 0.3s ease';

        // Snap back to cover
        cardCover.style.transform = `translateY(0)`;
        currentY = 0;
    }

    cardCover.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    cardCover.addEventListener('touchstart', dragStart, { passive: true });
    document.addEventListener('touchmove', dragMove, { passive: true });
    document.addEventListener('touchend', dragEnd);

    // Turn Logic
    function showRoleTurn(index) {
        let p = assignedRoles[index];
        currentPlayerTurnText.textContent = `Que mire ${p.playerName}...`;
        cardCover.style.transform = 'translateY(0)';
        nextPlayerRoleBtn.disabled = true;

        // Setup Card Data
        let internalRoleName = p.roleType;
        let roleInfo;

        if (internalRoleName === 'impostor') {
            roleInfo = impostorData.roles.impostor;
            secretWordEl.textContent = gameSessionHint ? `Pista: ${gameSessionHint}` : ``;
        } else if (internalRoleName === 'civil') {
            roleInfo = impostorData.roles.civil;
            secretWordEl.textContent = `${gameSessionWord}`;
        } else {
            // Special Roles
            roleInfo = impostorData.roles.special.find(r => r.name === internalRoleName);
            secretWordEl.textContent = `${gameSessionWord}`;
        }

        roleNameEl.textContent = roleInfo.name;
        roleNameEl.style.color = roleInfo.color;
        roleImg.src = `assets/games/impostor/roles/${roleInfo.image}.png`;
        roleDescEl.textContent = roleInfo.description;

        if (index === assignedRoles.length - 1) {
            nextPlayerRoleBtn.textContent = "¡A Jugar!";
        } else {
            nextPlayerRoleBtn.textContent = "Siguiente Jugador";
        }
    }

    nextPlayerRoleBtn.addEventListener('click', () => {
        // Scroll al inicio del modal al cambiar de jugador
        const modalEl = document.getElementById('impostorLobbyModal');
        if (modalEl) modalEl.scrollTo({ top: 0, behavior: 'smooth' });

        currentRoleIndex++;
        if (currentRoleIndex >= assignedRoles.length) {
            // Transition to Who Starts
            stepShowRole.style.display = 'none';
            stepWhoStarts.style.display = 'flex';
            determineWhoStarts();
        } else {
            showRoleTurn(currentRoleIndex);
        }
    });

    // ------------------------------------------------------------------------------------------------ //
    // 4. LOGICA EMISOR (Quien arranca) Y RESULTADOS
    // ------------------------------------------------------------------------------------------------ //
    function determineWhoStarts() {
        let startsQueue = [];
        // Añadir cada jugador 2 veces salvo los impostores (1) (Mitad de posiblidades)
        assignedRoles.forEach(p => {
            if (p.roleType === 'impostor') {
                startsQueue.push(p.playerName);
            } else {
                startsQueue.push(p.playerName);
                startsQueue.push(p.playerName);
            }
        });

        startsQueue = shuffleArray(startsQueue);
        const starter = startsQueue[0];

        document.getElementById('startingPlayerName').textContent = starter;

        const liveList = document.getElementById('livePlayersList');
        liveList.innerHTML = "";
        assignedRoles.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p.playerName;
            liveList.appendChild(li);
        });
    }

    document.getElementById('endGameRevealBtn').addEventListener('click', () => {
        stepWhoStarts.style.display = 'none';
        stepRevealAll.style.display = 'flex';

        document.getElementById('finalSecretWord').textContent = gameSessionWord;
        const finalList = document.getElementById('finalRolesList');
        finalList.innerHTML = "";

        assignedRoles.forEach(p => {
            let roleInfo;
            if (p.roleType === 'impostor') roleInfo = impostorData.roles.impostor;
            else if (p.roleType === 'civil') roleInfo = impostorData.roles.civil;
            else roleInfo = impostorData.roles.special.find(r => r.name === p.roleType);

            const li = document.createElement('li');
            li.innerHTML = `
                <img src="assets/games/impostor/roles/${roleInfo.image}.png" onerror="this.src='assets/logo.png'">
                <span class="name">${p.playerName}</span>
                <span class="role text-shadow-title" style="color: ${roleInfo.color}">${roleInfo.name}</span>
            `;
            finalList.appendChild(li);
        });
    });

    document.getElementById('backToLobbyBtn').addEventListener('click', () => {
        gameBody.style.display = 'none';
        lobbyBody.style.display = 'block';
    });

    // ------------------------------------------------------------------------------------------------ //
    // 5. AYUDA FLOTANTE
    // ------------------------------------------------------------------------------------------------ //
    const helpBtn = document.getElementById('helpGameBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.querySelector('.close-help');

    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    closeHelp.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.style.display = 'none';
    });

});
