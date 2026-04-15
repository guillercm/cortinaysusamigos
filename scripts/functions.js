/**
 * Utilidades genéricas para todo el proyecto.
 */

// Elimina tildes y caracteres especiales para poder encontrar las imágenes o buscar texto.
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Devuelve un nuevo array desordenado (Fisher-Yates) para no mutar el original a la primera.
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Previene scroll cuando una modal completa está encendida.
function toggleBodyScroll(state) {
    document.body.style.overflow = state ? 'hidden' : 'auto';
}