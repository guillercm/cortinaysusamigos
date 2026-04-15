<?php
$title = "Inicio";
require_once __DIR__ . '/includes/head.php';
?>
<link rel="stylesheet" href="styles/home.css">
<?php
require_once __DIR__ . '/includes/header.php'; 
?>
<?php
$home_config = getConfig('home.json');

// Helper interno para normalizar nombres
function normalizeName($name) {
    // Reemplaza tildes (una aproximación básica de PHP, también se puede usar iconv)
    $unwanted_array = array(
        'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
        'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
        'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
        'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
        'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y'
    );
    $str = strtr($name, $unwanted_array);
    $str = strtolower($str);
    $str = preg_replace('/[^a-z0-9]+/', '', $str);
    return $str;
}
?>
<main class="main-content">
<div class="full-width-hero">
    <div class="hero-gradient"></div>
    <div class="hero-content">
        <h1 class="hero-title text-shadow-title">Cortina y sus amigos</h1>
        <?php if(isset($home_config['shortDescription'])): ?>
            <p class="hero-short-desc"><?= htmlspecialchars($home_config['shortDescription']) ?></p>
        <?php endif; ?>
    </div>
</div>

<section class="characters-section">
    <div class="page-header">
        <h2>Personajes</h2>
    </div>

    <div class="carousel-container">
        <button class="carousel-btn prev-btn" id="prevCharBtn" aria-label="Anterior">&lsaquo;</button>
        <div class="carousel-track-container" id="carouselTrackContainer">
            <div class="carousel-track" id="carouselTrack">
                <?php if(isset($home_config['characterGroups'])): ?>
                    <?php foreach($home_config['characterGroups'] as $index => $group): ?>
                        <?php 
                            $hasMultiple = isset($group['images']) && is_array($group['images']);
                            $images = $hasMultiple ? $group['images'] : [isset($group['image']) ? $group['image'] : normalizeName($group['name'])];
                        ?>
                        <div class="carousel-slide <?= $hasMultiple ? 'has-multiple-images' : '' ?>" data-index="<?= $index ?>">
                            <div class="slide-img-wrapper">
                                <?php foreach($images as $i => $img): ?>
                                    <img src="assets/home/characters/<?= htmlspecialchars($img) ?>.png" 
                                         alt="Imagen de <?= htmlspecialchars($group['name']) ?>"
                                         class="<?= $i === 0 ? 'active' : '' ?>"
                                         draggable="false"
                                         onerror="this.src='assets/home/poster.png';">
                                <?php endforeach; ?>
                            </div>
                            <h3 class="slide-name"><?= htmlspecialchars($group['name']) ?></h3>
                            <div class="slide-desc-container">
                                <p class="slide-desc"><?= htmlspecialchars($group['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
        <button class="carousel-btn next-btn" id="nextCharBtn" aria-label="Siguiente">&rsaquo;</button>
    </div>
</section>

<section class="about-section">
    <div class="about-text">
        <?php if(isset($home_config['description'])): ?>
            <div class="about-desc">
                <?php foreach($home_config['description'] as $p): ?>
                    <p><?= htmlspecialchars($p) ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <?php if(isset($home_config['trailer'])): ?>
    <div class="about-video">
        <div class="short-video-wrapper">
            <?php 
            renderYoutubeVideo(
                $home_config['trailer']['youtubeId'], 
                $home_config['trailer']['title'], 
                '100%', 
                '100%', 
                false, 
                'autoplay=1&mute=1&loop=1&playlist=' . $home_config['trailer']['youtubeId']
            ); 
            ?>
        </div>
    </div>
    <?php endif; ?>
</section>

<?php printJsScript('home.js'); ?>
<?php require_once __DIR__ . '/includes/footer.php'; ?>