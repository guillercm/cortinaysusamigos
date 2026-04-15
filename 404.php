<?php
$title = "404 No Encontrado";
require_once __DIR__ . '/includes/head.php';
?>
<link rel="stylesheet" href="styles/404.css">
<?php
require_once __DIR__ . '/includes/header.php'; 
$error_config = getConfig('errors.json');
$error_data = isset($error_config['errors']['404']) ? $error_config['errors']['404'] : ['title' => '404', 'message' => 'Not found'];

// Poster resolution
$poster_path = 'assets/errors/poster-404.png';
// Local check for fallback
if (!file_exists(__DIR__ . '/' . $poster_path)) {
    $poster_path = 'assets/logo.png';
}
?>
<main class="main-content">
<section class="error-section">
    <div class="error-container">
        <img src="<?= $poster_path ?>" alt="404" class="error-image">
        <h1 class="error-title"><?= htmlspecialchars($error_data['title']) ?></h1>
        <p class="error-message"><?= htmlspecialchars($error_data['message']) ?></p>
        <a href="index.php" class="btn error-btn">Volver al Inicio</a>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
