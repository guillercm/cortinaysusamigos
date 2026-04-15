<?php 
require_once __DIR__ . '/functions.php';
$general_config = getConfig('general.json');

// Title resolution
$page_title = $general_config['name'];
if (isset($title) && $title !== '') {
    $page_title = $title . ' | ' . $general_config['name'];
}

// Meta description resolution
$meta_desc = "Página oficial de Cortina y sus amigos.";
if (isset($description) && $description !== '') {
    $meta_desc = $description;
}

// URL resolution
$base_url = "https://www.cortinaysusamigos.com";
$current_path = basename($_SERVER['PHP_SELF'], '.php');
if ($current_path === 'index') {
    $page_url = $base_url . "/";
} else {
    $page_url = $base_url . "/" . $current_path;
}
$shared_image = $base_url . "/assets/shared.jpg";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($page_title) ?></title>
    <link rel="shortcut icon" href="assets/favicon.ico" />
    <meta name="description" content="<?= htmlspecialchars($meta_desc) ?>">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="<?= htmlspecialchars($page_url) ?>">
    
    <!-- Open Graph Metadata -->
    <meta property="og:title" content="<?= htmlspecialchars($page_title) ?>">
    <meta property="og:image" content="<?= htmlspecialchars($shared_image) ?>">
    <meta property="og:site_name" content="<?= htmlspecialchars($general_config['name']) ?>">
    <meta property="og:description" content="<?= htmlspecialchars($meta_desc) ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= htmlspecialchars($page_url) ?>">
    
    <!-- Twitter Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="<?= htmlspecialchars($general_config['name']) ?>">
    <meta name="twitter:title" content="<?= htmlspecialchars($page_title) ?>">
    <meta name="twitter:description" content="<?= htmlspecialchars($meta_desc) ?>">
    <meta name="twitter:image" content="<?= htmlspecialchars($shared_image) ?>">
    <meta name="twitter:url" content="<?= htmlspecialchars($page_url) ?>">
    
    <!-- Estilos base -->
    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/header.css">
    <link rel="stylesheet" href="styles/footer.css">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    
    <?php printJsScript('functions.js'); ?>