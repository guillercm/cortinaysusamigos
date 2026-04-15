document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevFilmBtn');
    const nextBtn = document.getElementById('nextFilmBtn');
    const heroSlides = document.querySelectorAll('.film-slide');
    const detailPanels = document.querySelectorAll('.film-details-container');
    
    if (heroSlides.length <= 1) return; // Solo hay 1 película, no requiere navegación

    let currentIndex = 0;

    function goToSlide(index) {
        // Ciclar el índice
        if (index < 0) index = heroSlides.length - 1;
        if (index >= heroSlides.length) index = 0;

        // Actualizar slider principal (Hero) con fade
        heroSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('is-active');
            } else {
                slide.classList.remove('is-active');
            }
        });

        // Actualizar panel de detalles inferior
        detailPanels.forEach((panel, i) => {
            if (i === index) {
                panel.classList.add('is-active');
            } else {
                panel.classList.remove('is-active');
            }
        });

        currentIndex = index;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
});
