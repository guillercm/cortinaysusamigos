<?php
// includes/functions.php

/**
 * Lee un fichero JSON de configuración y lo decodifica.
 */
function getConfig($filename) {
    $path = __DIR__ . '/../config/' . $filename;
    if (file_exists($path)) {
        return json_decode(file_get_contents($path), true);
    }
    return null;
}

/**
 * Imprime una etiqueta script con la fecha del servidor actual
 * para evitar el cacheo interdiario pero permitirlo de forma intradía.
 */
function printJsScript($filename) {
    $datePart = date('Ymd');
    echo '<script src="scripts/' . $filename . '?' . $datePart . '"></script>' . "\n";
}

/**
 * Imprime la data de PHP como un script de JavaScript directamente incrustado,
 * permitiendo que si se guarda el html siga funcionando de manera offline.
 */
function injectDataToScript($variableName, $data) {
    echo '<script>' . "\n";
    echo 'const ' . $variableName . ' = ' . json_encode($data, JSON_UNESCAPED_UNICODE) . ';' . "\n";
    echo '</script>' . "\n";
}
/**
 * Renderiza un iframe de YouTube con optimización srcdoc (Performance).
 * @param string $videoId ID del vídeo de YouTube.
 * @param string $title Título para accesibilidad.
 * @param mixed $width Ancho (por defecto 100%).
 * @param mixed $height Alto (por defecto 100%).
 * @param bool $manualLazy Si es true, usa data-src/data-srcdoc para ser activado por JS (ej: carruseles).
 * @param string $extraParams Parámetros adicionales para la URL de YouTube.
 */
function renderYoutubeVideo($videoId, $title = 'Video de YouTube', $width = '100%', $height = '100%', $manualLazy = false, $extraParams = '') {
    $videoId = htmlspecialchars($videoId);
    $title = htmlspecialchars($title);
    
    // Atributos dinámicos: para carruseles usamos data- para que el JS los active al entrar en vista.
    // Para el resto usamos src/srcdoc directamente con loading="lazy" nativo.
    $srcAttrName = $manualLazy ? 'data-src' : 'src';
    $srcdocAttrName = $manualLazy ? 'data-srcdoc' : 'srcdoc';
    
    // URL de YouTube
    $baseUrl = "https://www.youtube.com/embed/" . $videoId;
    if ($extraParams) {
        $baseUrl .= (strpos($baseUrl, '?') === false ? '?' : '&') . $extraParams;
    }
    
    // URL para el autoplay al hacer clic en la miniatura del srcdoc
    $autoplayUrl = $baseUrl . (strpos($baseUrl, '?') === false ? '?' : '&') . 'autoplay=1';

    // Contenido optimizado del srcdoc
    $srcdocContent = "<style>
        * {padding:0;margin:0;overflow:hidden;box-sizing:border-box}
        html,body{height:100%;background:#000}
        img{position:absolute;width:100%;height:100%;top:0;bottom:0;margin:auto;object-fit:cover}
        .play-button{width:68px;height:48px;background:rgba(0,0,0,0.7);border-radius:12%;display:flex;justify-content:center;align-items:center;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);cursor:pointer}
        .play-button span{font:48px/1.5 sans-serif;color:white}
    </style>
    <a href='" . $autoplayUrl . "'>
        <img src='https://img.youtube.com/vi/" . $videoId . "/maxresdefault.jpg' alt='" . $title . "' onerror='this.src=\"https://img.youtube.com/vi/" . $videoId . "/0.jpg\"'>
        <div class='play-button'>
            <span>▶</span>
        </div>
    </a>";

    echo '<iframe ' . 
         'width="' . $width . '" ' . 
         'height="' . $height . '" ' . 
         $srcAttrName . '="' . $baseUrl . '" ' . 
         $srcdocAttrName . '="' . htmlspecialchars($srcdocContent) . '" ' . 
         'title="' . $title . '" ' . 
         'frameborder="0" ' . 
         'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' . 
         'allowfullscreen ' . 
         'loading="lazy">' . 
         '</iframe>';
}
?>
