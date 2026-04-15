<?php
$title = "Tienda";
require_once __DIR__ . '/includes/head.php';
?>
<link rel="stylesheet" href="styles/shop.css">
<?php
require_once __DIR__ . '/includes/header.php';
$shop_config = getConfig('shop.json');

// Inyectar para que sea totalmente offline
injectDataToScript('SHOP_DATA', $shop_config);
?>
<main class="main-content">
<section class="shop-section">
    <div class="page-header">
        <h1>Tienda Oficial</h1>
    </div>

    <!-- Si hay más de un type en shop_config, JS inyectará aquí los filtros -->
    <div class="shop-controls" id="shopControls">
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Buscar por nombre..." aria-label="Buscar producto">
            <button id="clearSearchBtn" class="clear-btn" aria-label="Limpiar búsqueda">&times;</button>
        </div>
        <!-- Contenedor para filtros por tipo - se rellena por JS si es necesario -->
        <div id="typeFiltersContainer" class="type-filters"></div>
        <button id="clearFiltersBtn" class="btn btn-outline" style="display: none;">Limpiar Filtros</button>
    </div>

    <!-- Contenedor general donde JS parsea los productos -->
    <div id="noResultsMsg" class="shop-empty" style="display: none;">
        <h2>Vaya...</h2>
        <p>No se encontró ningún producto con los filtros actuales.</p>
    </div>

    <div class="shop-grid" id="productsGrid">
        <!-- Renderizado por JS -->
    </div>
</section>

<?php 
printJsScript('tienda.js');
require_once __DIR__ . '/includes/footer.php'; 
?>
