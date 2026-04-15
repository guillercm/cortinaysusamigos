<?php
$title = "El Creador";
require_once __DIR__ . '/includes/head.php';
?>
<link rel="stylesheet" href="styles/creator.css">
<?php
require_once __DIR__ . '/includes/header.php'; 
$creator_config = getConfig('creator.json');
?>

<main class="main-content">
<section class="creator-section">
    <div class="creator-container">
        <div class="creator-poster">
            <img src="assets/creator/poster.png" alt="Póster del Creador" onerror="this.src='assets/logo.png'">
        </div>
        <div class="creator-content">
            <h1 class="creator-title">Sobre el Proyecto</h1>
            <?php if(isset($creator_config['creator']['description'])): ?>
                <p class="creator-description"><?= htmlspecialchars($creator_config['creator']['description']) ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
