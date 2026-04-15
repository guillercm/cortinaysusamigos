// scripts/home.js
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('prevCharBtn');
    const nextBtn = document.getElementById('nextCharBtn');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId;
    let slideWidth = slides[0].offsetWidth + 20; // 20 is the total horizontal margin (10px each side)

    // Setup clones for infinite cycle
    const firstClone = slides[0].cloneNode(true);
    const secondClone = slides[1].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    const secondLastClone = slides[slides.length - 2].cloneNode(true);

    firstClone.classList.add('clone');
    secondClone.classList.add('clone');
    lastClone.classList.add('clone');
    secondLastClone.classList.add('clone');

    track.appendChild(firstClone);
    track.appendChild(secondClone);
    track.insertBefore(lastClone, slides[0]);
    track.insertBefore(secondLastClone, lastClone);

    const allSlides = Array.from(track.querySelectorAll('.carousel-slide'));

    currentIndex = 2; // Real index 0 is at offset 2 due to two clones prepended

    function updateCarousel() {
        slideWidth = allSlides[0].offsetWidth + parseInt(window.getComputedStyle(allSlides[0]).marginLeft) * 2;

        const containerWidth = track.parentElement.offsetWidth;
        const offset = (containerWidth / 2) - (slideWidth / 2);
        currentTranslate = offset - (currentIndex * slideWidth);
        prevTranslate = currentTranslate;
        setTransform(currentTranslate);
        updateActiveSlide();
    }

    function setTransform(translate) {
        track.style.transform = `translateX(${translate}px)`;
    }

    function updateActiveSlide() {
        allSlides.forEach((slide, index) => {
            slide.classList.remove('is-active');
            if (index === currentIndex) {
                slide.classList.add('is-active');
            }
        });
    }

    function adjustIndexIfCloned() {
        let adjusted = false;

        if (currentIndex === 0) {
            currentIndex = allSlides.length - 4;
            adjusted = true;
        } else if (currentIndex === 1) {
            currentIndex = allSlides.length - 3;
            adjusted = true;
        } else if (currentIndex === allSlides.length - 2) {
            currentIndex = 2;
            adjusted = true;
        } else if (currentIndex === allSlides.length - 1) {
            currentIndex = 3;
            adjusted = true;
        }

        if (adjusted) {
            track.classList.add('no-transition');
            track.style.transition = 'none';
            const containerWidth = track.parentElement.offsetWidth;
            const offset = (containerWidth / 2) - (slideWidth / 2);
            currentTranslate = offset - (currentIndex * slideWidth);
            prevTranslate = currentTranslate;
            setTransform(currentTranslate);
            updateActiveSlide(); // Maintain the active style internally

            // Force browser reflow to apply styles synchronously before removing class
            void track.offsetWidth;

            track.classList.remove('no-transition');
        }
    }

    function goToSlide(index) {
        track.style.transition = 'transform 0.4s ease-out';
        currentIndex = index;
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex >= allSlides.length - 2) return;
        goToSlide(currentIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex <= 1) return;
        goToSlide(currentIndex - 1);
    });

    track.addEventListener('transitionend', adjustIndexIfCloned);

    // Initial positioning
    setTimeout(() => {
        updateCarousel();
    }, 100);

    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        updateCarousel();
    });

    // Touch and Drag
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove);
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
    });
    track.addEventListener('mousemove', touchMove);

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        // Only trigger drag if it's left click
        if (event.type.includes('mouse') && event.button !== 0) return;

        isDragging = true;
        startPos = getPositionX(event);
        track.style.transition = 'none'; // disable transition during drag
        animationId = requestAnimationFrame(animation);
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationId);

        const movedBy = currentTranslate - prevTranslate;

        // threshold for changing slide is 80px drag
        if (movedBy < -80 && currentIndex < allSlides.length - 2) {
            currentIndex += 1;
        } else if (movedBy > 80 && currentIndex > 1) {
            currentIndex -= 1;
        }

        goToSlide(currentIndex);
    }

    function animation() {
        setTransform(currentTranslate);
        if (isDragging) requestAnimationFrame(animation);
    }

    // Direct click on slides
    allSlides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            // Prevent going to slide if we are dragging
            if (Math.abs(currentTranslate - prevTranslate) > 10) return;

            if (currentIndex !== index) {
                goToSlide(index);
            }
        });
    });

    // Image cycling for slides with multiple images
    function initImageCycling() {
        const slidesWithMultiple = allSlides.filter(s => s.classList.contains('has-multiple-images'));
        if (slidesWithMultiple.length === 0) return;

        // Group slides by their data-index to keep clones in sync
        const groups = {};
        slidesWithMultiple.forEach(slide => {
            const idx = slide.getAttribute('data-index');
            if (!groups[idx]) {
                groups[idx] = {
                    slides: [],
                    currentImgIndex: 0,
                    totalImages: slide.querySelectorAll('.slide-img-wrapper img').length
                };
            }
            groups[idx].slides.push(slide);
        });

        setInterval(() => {
            Object.keys(groups).forEach(idx => {
                const group = groups[idx];
                group.currentImgIndex = (group.currentImgIndex + 1) % group.totalImages;

                group.slides.forEach(slide => {
                    const imgs = slide.querySelectorAll('.slide-img-wrapper img');
                    imgs.forEach((img, i) => {
                        if (i === group.currentImgIndex) {
                            img.classList.add('active');
                        } else {
                            img.classList.remove('active');
                        }
                    });
                });
            });
        }, 3000);
    }

    initImageCycling();
});

