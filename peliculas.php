<?php
$title = "Películas";
require_once __DIR__ . '/includes/head.php';
?>
<link rel="stylesheet" href="styles/films.css">
<?php
require_once __DIR__ . '/includes/header.php';
$films_config = getConfig('films.json');

// Helper para parsear la fecha "6-02-24" a "6 de febrero de 2024"
function formatearFecha($fechaStr)
{
    if (!$fechaStr) return "";
    $partes = explode('-', $fechaStr);
    if (count($partes) === 3) {
        $dia = intval($partes[0]);
        $mesNum = intval($partes[1]);
        $año = intval($partes[2]);
        // Arreglar año para que asuma 2000
        if ($año < 100) $año += 2000;

        $meses = ["", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        $mesStr = isset($meses[$mesNum]) ? $meses[$mesNum] : "";
        return "$dia de $mesStr de $año";
    }
    return $fechaStr;
}

$hasFilms = false;
$activeFilms = [];

if (isset($films_config['films'])) {
    foreach ($films_config['films'] as $film) {
        if (isset($film['showing']) && $film['showing'] === true) {
            $hasFilms = true;
            $activeFilms[] = $film;
        }
    }
}
?>

<main class="main-content">

    <?php if (!$hasFilms): ?>
        <section class="films-section">
            <div class="films-empty">
                <h2>Próximamente...</h2>
            </div>
        </section>
    <?php else: ?>
        <!-- HERO SLIDER SECTION -->
        <section class="film-slider-container">

            <?php if (count($activeFilms) > 1): ?>
                <button class="film-nav-arrow prev-film" id="prevFilmBtn" aria-label="Película Anterior">&lsaquo;</button>
                <button class="film-nav-arrow next-film" id="nextFilmBtn" aria-label="Siguiente Película">&rsaquo;</button>
            <?php endif; ?>

            <div class="film-slider-track" id="filmSliderTrack">
                <?php foreach ($activeFilms as $index => $film): ?>
                    <div class="film-slide <?= $index === 0 ? 'is-active' : '' ?>" data-index="<?= $index ?>">
                        <div class="film-full-hero">
                            <!-- Img en lugar de background para permitir onerror -->
                            <img class="film-hero-bg" src="assets/films/<?= htmlspecialchars($film['id']) ?>/poster.png" alt="Póster de <?= htmlspecialchars($film['title']) ?>" onerror="this.src='assets/home/poster.png'">

                            <!-- Degradado inferior a superior -->
                            <div class="film-hero-gradient"></div>

                            <div class="film-hero-content">
                                <!-- Si hay logo usamos imagen, si falla mostramos el texto -->
                                <img class="film-hero-logo" src="assets/films/<?= htmlspecialchars($film['id']) ?>/logo.png" alt="Logo de <?= htmlspecialchars($film['title']) ?>" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <h1 class="film-hero-title text-shadow-title" style="display:none;"><?= htmlspecialchars($film['title']) ?></h1>

                                <div class="film-hero-cta">
                                    <?php if (isset($film['youtubeId']) && trim($film['youtubeId']) !== ""): ?>
                                        <a href="https://www.youtube.com/watch?v=<?= htmlspecialchars($film['youtubeId']) ?>" target="_blank" class="film-btn-watch">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                                            </svg>
                                            VER EN YOUTUBE
                                        </a>
                                    <?php else: ?>
                                        <div class="film-coming-soon">Próximamente...</div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- DETAILS SECTION -->
        <section class="film-details-section">
            <?php foreach ($activeFilms as $index => $film): ?>
                <div class="film-details-container <?= $index === 0 ? 'is-active' : '' ?>" data-index="<?= $index ?>">

                    <div class="film-details-layout">
                        <!-- DERECHA: INFO (AHORA ARRIBA) -->
                        <div class="film-info-column">
                            <h2 class="film-info-title"><?= htmlspecialchars($film['title']) ?></h2>
                            <div class="film-meta-large">
                                <span class="film-meta-item"><strong>Duración:</strong> <?= htmlspecialchars($film['duration']) ?></span>
                                <span class="film-meta-item"><strong>Fecha de lanzamiento:</strong> <?= htmlspecialchars(formatearFecha($film['date'])) ?></span>
                                <span class="film-meta-item"><strong>Género:</strong> <span class="film-genres-highlight"><?= htmlspecialchars(implode(', ', $film['genres'])) ?></span></span>
                            </div>

                            <div class="film-synopsis-large">
                                <?= nl2br(htmlspecialchars($film['synopsis'])) ?>
                            </div>
                        </div>

                        <!-- IZQUIERDA: CAROUSEL DE SHORTS (AHORA ABAJO) -->
                        <div class="film-trailers-column">
                            <?php if (isset($film['trailers']) && count($film['trailers']) > 0): ?>
                                <div class="film-shorts-grid">
                                    <?php foreach ($film['trailers'] as $trailer): ?>
                                        <div class="film-short-wrapper">
                                        <div class="film-short-wrapper">
                                            <?php renderYoutubeVideo($trailer['youtubeId'], 'YouTube Short', 315, 560); ?>
                                        </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                </div>
            <?php endforeach; ?>
        </section>
    <?php endif; ?>

    <?php if ($hasFilms): ?>
        <?php printJsScript('peliculas.js'); ?>
    <?php endif; ?>

    <?php require_once __DIR__ . '/includes/footer.php'; ?>