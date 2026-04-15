<?php
$title = "Juegos";
require_once __DIR__ . '/includes/head.php'; 
?>
<link rel="stylesheet" href="styles/games.css">
<?php
require_once __DIR__ . '/includes/header.php'; 
$games_config = getConfig('games.json');

// Inyectar datos offline
injectDataToScript('GAMES_DATA', $games_config);
?>

<main class="main-content">
<section class="games-section">
    <div class="page-header">
        <h1>Juegos</h1>
    </div>

    <div class="games-container">
        <!-- Tarjeta Impostor -->
        <?php if(isset($games_config['games']['impostor'])): $impostor = $games_config['games']['impostor']; ?>
        <article class="game-card" id="card-impostor">
            <div class="game-info">
                <h2><?= htmlspecialchars($impostor['name']) ?></h2>
                <div class="instructions">
                    <h3>Cómo jugar:</h3>
                    <ul>
                    <?php foreach($impostor['instructions'] as $inst): ?>
                        <li><?= htmlspecialchars($inst) ?></li>
                    <?php endforeach; ?>
                    </ul>
                </div>
                <!-- Botón que activa la modal del SPA -->
                <button class="btn btn-play" id="btnPlayImpostor">Jugar Ahora</button>
            </div>
            <div class="game-examples">
                <?php if(isset($impostor['examples']) && count($impostor['examples']) > 0): ?>
                    <div class="carousel-videos" id="carouselImpostor">
                        <div class="carousel-track">
                            <?php foreach($impostor['examples'] as $idx => $ex): ?>
                                <!-- Lazy load si hay más de 2 (index > 1) -->
                                <?php $srcAttr = ($idx > 1) ? 'data-src' : 'src'; ?>
                                <div class="carousel-slide">
                                    <?php renderYoutubeVideo($ex['youtubeId'], 'Ejemplo ' . ($idx + 1), '100%', '100%', ($idx > 1)); ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <?php if(count($impostor['examples']) > 1): ?>
                            <button class="carousel-btn prev">&lt;</button>
                            <button class="carousel-btn next">&gt;</button>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </article>
        <?php endif; ?>

        <!-- Tarjeta Conecto -->
        <?php if(isset($games_config['games']['conecto'])): $conecto = $games_config['games']['conecto']; ?>
        <article class="game-card" id="card-conecto">
            <div class="game-info">
                <h2><?= htmlspecialchars($conecto['name']) ?></h2>
                <div class="instructions">
                    <h3>Cómo jugar:</h3>
                    <ul>
                    <?php foreach($conecto['instructions'] as $inst): ?>
                        <li><?= htmlspecialchars($inst) ?></li>
                    <?php endforeach; ?>
                    </ul>
                </div>
            </div>
            <div class="game-examples">
                <?php if(isset($conecto['examples']) && count($conecto['examples']) > 0): ?>
                    <div class="carousel-videos" id="carouselConecto">
                        <div class="carousel-track">
                            <?php foreach($conecto['examples'] as $idx => $ex): ?>
                                <?php $srcAttr = ($idx > 1) ? 'data-src' : 'src'; ?>
                                <div class="carousel-slide">
                                    <?php renderYoutubeVideo($ex['youtubeId'], 'Ejemplo ' . ($idx + 1), '100%', '100%', ($idx > 1)); ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <?php if(count($conecto['examples']) > 1): ?>
                            <button class="carousel-btn prev">&lt;</button>
                            <button class="carousel-btn next">&gt;</button>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </article>
        <?php endif; ?>
    </div>
</section>

<!-- SUPER MODAL SINGLE PAGE APP PARA EL JUEGO IMPOSTOR -->
<div id="impostorLobbyModal" class="impostor-app-modal" style="display: none;">
    <div class="impostor-app-header">
        <h2><?= htmlspecialchars($games_config['games']['impostor']['name']) ?></h2>
        <button id="closeLobbyBtn" class="close-modal-btn">&times;</button>
    </div>
    
    <div class="impostor-app-body" id="lobbyBody">
        <!-- Fase 1: Añadir nombres -->
        <div class="lobby-section">
            <h3>Jugadores (<span id="playercount">0</span>)</h3>
            <div class="player-input-row">
                <input type="text" id="newPlayerName" placeholder="Escribe un nombre...">
                <button class="btn" id="addPlayerBtn" aria-label="Añadir jugador">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
            </div>
            <ul id="playerListEl" class="player-list"></ul>
            <p id="playerError" class="error-msg"></p>
        </div>

        <!-- Fase 2: Configuración de sala -->
        <div class="lobby-section">
            <h3>Configuración</h3>
            
            <div class="config-row">
                <label for="numImpostors">Nº Impostores:</label>
                <select id="numImpostors">
                    <option value="1">1</option>
                </select>
            </div>
            
            <div class="config-row hint-toggle-row">
                <label for="showHintCheck">Pista para impostores</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="showHintCheck" checked>
                    <span class="toggle-slider round"></span>
                </label>
            </div>

            <div id="specialRolesContainer" class="config-roles reveal-screen no-select user-drag-none">

            </div>

            <div class="config-packets">
                <h4>Paquetes de Palabras</h4>
                <div id="wordPacketsContainer" class="packets-grid reveal-screen no-select user-drag-none">

                </div>
                <p id="packetError" class="error-msg"></p>
            </div>

        </div>

        <div class="lobby-footer">
            <button class="btn btn-start-game" id="startGameBtn" disabled>¡EMPEZAR PARTIDA!</button>
        </div>
    </div>

    <!-- PANTALLA EN JUEGO (REVEAL) -->
    <div class="impostor-app-body reveal-screen no-select user-drag-none" id="gameBody" style="display: none;">
        <div id="gameStepShowRole" class="game-step-container">
            <!-- Cabecera flex: texto a la izquierda, botón ayuda a la derecha -->
            <div class="game-step-header">
                <h3 id="currentPlayerTurnText">Turno de...</h3>
                <div class="help-actio no-select user-drag-none">
                    <button id="helpGameBtn" class="circle-btn">?</button>
                </div>
            </div>
            <p class="swipe-hint">Desliza la carta hacia arriba para ver tu rol y suéltala para esconderlo.</p>
            
            <div class="card-reveal-area">
                <div class="secret-card" id="secretCardContent">
                    <img id="roleImg" src="" alt="">
                    <h3 id="roleName" class="text-shadow-title" style="color:var(--c-primary)">Civil</h3>
                    <p id="secretWordOrHint" class="secret-word">PALABRA</p>
                    <p id="roleDesc" class="role-desc">Descripción del rol...</p>
                </div>
                <div class="card-cover" id="cardCover">
                    <span>Arrastra</span>
                    <img src="assets/games/impostor/roles/roles.png" alt="Tapa oculta">
                    
                </div>
            </div>

            <button class="btn" id="nextPlayerRoleBtn" disabled>Siguiente Jugador</button>
        </div>

        <!-- PANTALLA DE RESULTADOS DE QUIEN EMPIEZA -->
        <div id="gameStepWhoStarts" class="game-step-container" style="display: none;">
            <div class="who-starts-box">
                <h3>Empieza jugando:</h3>
                <h2 id="startingPlayerName" class="highlight-name">...</h2>
            </div>
            <div class="roles-summary-box">
                <ul id="livePlayersList" class="live-list"></ul>
            </div>
            <button class="btn btn-danger" id="endGameRevealBtn">Terminar y revelar roles</button>
        </div>
        
        <!-- PANTALLA DE REVELACIÓN FINAL -->
        <div id="gameStepRevealAll" class="game-step-container" style="display: none;">
            <h3>Resultados de la partida</h3>
            <p style="margin-bottom: 1rem">La palabra secreta era: <strong id="finalSecretWord" style="color:var(--c-primary)"></strong></p>
            <ul id="finalRolesList" class="final-roles-list"></ul>
            <button class="btn" id="backToLobbyBtn">Volver a la sala</button>
        </div>

    </div>
</div>

<!-- MODAL DE AYUDA -->
<div id="helpModal" class="help-modal no-select user-drag-none" style="display: none;">
    <div class="help-modal-content">
        <span class="close-help">&times;</span>
        <h2>Instrucciones Rápidas</h2>
        <div class="help-steps">
            <div class="help-step"><img src="assets/games/impostor/steps/1.png" onerror="this.src='assets/logo.png'"> <p>Obtén tu rol</p></div>
            <div class="help-step"><img src="assets/games/impostor/steps/2.png" onerror="this.src='assets/logo.png'"> <p>Da pistas</p></div>
            <div class="help-step"><img src="assets/games/impostor/steps/3.png" onerror="this.src='assets/logo.png'"> <p>Presta atención</p></div>
            <div class="help-step"><img src="assets/games/impostor/steps/4.png" onerror="this.src='assets/logo.png'"> <p>Votar</p></div>
        </div>
    </div>
</div>

<?php 
printJsScript('games.js');
require_once __DIR__ . '/includes/footer.php'; 
?>
