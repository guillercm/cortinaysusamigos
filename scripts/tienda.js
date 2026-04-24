document.addEventListener('DOMContentLoaded', () => {
    if (typeof SHOP_DATA === 'undefined') return;

    const data = SHOP_DATA;
    const types = data.types || [];
    const products = data.products || [];
    const linksMap = {};

    // Mapear links
    (data.links || []).forEach(link => {
        linksMap[link.id] = link;
    });

    const productsGrid = document.getElementById('productsGrid');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const typeFiltersContainer = document.getElementById('typeFiltersContainer');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const shopControlsContainer = document.getElementById('shopControls');

    let activeTypes = new Set();
    let currentSearchTerm = '';

    // Init Filters si hay > 1 tipo
    if (types.length > 1) {
        types.forEach(type => {
            const label = document.createElement('label');
            label.className = 'filter-label';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = type.id;

            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    activeTypes.add(type.id);
                } else {
                    activeTypes.delete(type.id);
                }
                updateClearFiltersBtnVisibility();
                renderProducts();
            });

            label.appendChild(input);
            label.append(type.name);
            typeFiltersContainer.appendChild(label);
        });
    } else {
        // Remover el contenedor de checkboxes
        if (typeFiltersContainer) typeFiltersContainer.style.display = 'none';
        if (clearFiltersBtn) clearFiltersBtn.style.display = 'none';
    }

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = removeAccents(e.target.value.toLowerCase().trim());
        clearSearchBtn.style.display = currentSearchTerm.length > 0 ? 'block' : 'none';
        renderProducts();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        clearSearchBtn.style.display = 'none';
        renderProducts();
    });

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            activeTypes.clear();
            const inputs = typeFiltersContainer.querySelectorAll('input[type="checkbox"]');
            inputs.forEach(input => input.checked = false);
            updateClearFiltersBtnVisibility();
            renderProducts();
        });
    }

    function updateClearFiltersBtnVisibility() {
        if (!clearFiltersBtn) return;
        clearFiltersBtn.style.display = activeTypes.size > 0 ? 'inline-flex' : 'none';
    }

    function renderProducts() {
        productsGrid.innerHTML = '';
        let visibleCount = 0;

        products.forEach(product => {
            // Filtro por visibilidad
            if (product.showing === false) return;

            // Filtro Texto
            let matchText = true;
            if (currentSearchTerm !== '') {
                const productName = removeAccents((product.name || '').toLowerCase());
                matchText = productName.includes(currentSearchTerm);
            }

            // Filtro Type
            let matchType = true;
            if (activeTypes.size > 0) {
                matchType = activeTypes.has(product.typeId);
            }

            if (matchText && matchType) {
                visibleCount++;
                productsGrid.appendChild(createProductCard(product));
            }
        });

        if (visibleCount === 0) {
            noResultsMsg.style.display = 'block';
            productsGrid.style.display = 'none';
        } else {
            noResultsMsg.style.display = 'none';
            productsGrid.style.display = 'grid';
        }
    }

    function createProductCard(product) {
        const article = document.createElement('article');
        article.className = 'product-card';

        // Creación del Carrusel
        const carousel = document.createElement('div');
        carousel.className = 'product-carousel';

        const track = document.createElement('div');
        track.className = 'carousel-track';

        const imgCount = typeof product.images === 'number' ? product.images : 1;
        for (let i = 1; i <= imgCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.src = `assets/shop/${product.id}/${i}.png`;
            img.alt = `${product.name} - Imagen ${i}`;
            img.loading = "lazy";
            slide.appendChild(img);
            track.appendChild(slide);
        }

        carousel.appendChild(track);

        if (imgCount > 1) {
            let currentIndex = 0;

            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-btn prev';
            prevBtn.innerHTML = '&#10094;'; // <

            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-btn next';
            nextBtn.innerHTML = '&#10095;'; // >

            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = currentIndex > 0 ? currentIndex - 1 : imgCount - 1;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = currentIndex < imgCount - 1 ? currentIndex + 1 : 0;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            });

            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
        }

        article.appendChild(carousel);

        // Info info
        const info = document.createElement('div');
        info.className = 'product-info';

        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.name;
        info.appendChild(title);

        const linkConfig = linksMap[product.linkId];
        if (linkConfig) {
            const anchor = document.createElement('a');
            anchor.className = 'btn product-link';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.href = `${linkConfig.baseUrl}${product.link}`;
            anchor.textContent = linkConfig.buttonText || 'Ver';
            info.appendChild(anchor);

            if (linkConfig.warning) {
                const notice = document.createElement('p');
                notice.className = 'product-link-notice';
                notice.textContent = linkConfig.warning;
                info.appendChild(notice);
            }
        }

        article.appendChild(info);

        return article;
    }

    // Inicializar render
    renderProducts();
});
