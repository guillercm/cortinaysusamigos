</head>
<body>
    <header class="main-header">
        <div class="header-container">
            <a href="index.php" class="header-logo" aria-label="Ir al inicio">
                <img src="assets/logo.png" alt="Logo de Cortina y sus amigos">
                <span class="logo-title">Cortina y sus amigos</span>
            </a>
            
            <input type="checkbox" id="menu-toggle" class="menu-toggle">
            <label for="menu-toggle" class="menu-backdrop" aria-hidden="true"></label>
            <label for="menu-toggle" class="hamburger-menu" aria-label="Abrir menú">
                <span></span>
                <span></span>
                <span></span>
            </label>
            
            <nav class="header-nav">
                <ul class="nav-links">
                    <?php
                    if ($general_config && isset($general_config['links'])) {
                        // Comprobar si ocultar enlaces de películas (si films.json está vacío o todos showing = false)
                        $filmsConfig = getConfig('films.json');
                        $showFilmsLink = false;
                        if ($filmsConfig && isset($filmsConfig['films'])) {
                            foreach ($filmsConfig['films'] as $film) {
                                if (isset($film['showing']) && $film['showing'] === true) {
                                    $showFilmsLink = true;
                                    break;
                                }
                            }
                        }

                        foreach ($general_config['links'] as $link) {
                            $url = $link['url'] === '' ? 'index.php' : $link['url'] . '.php';
                            
                            // Si el enlace es 'peliculas' pero no se debe mostrar, lo saltamos
                            if ($link['url'] === 'peliculas' && !$showFilmsLink) continue;

                            $activeClass = (basename($_SERVER['PHP_SELF']) === $url) ? 'active' : '';
                            echo '<li class="nav-item"><a href="' . htmlspecialchars($url) . '" class="' . $activeClass . '">' . htmlspecialchars($link['label']) . '</a></li>';
                        }
                    }
                    ?>
                </ul>
            </nav>
        </div>
    </header>
