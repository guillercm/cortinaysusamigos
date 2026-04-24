/**
 * cookies.js — Sistema de Consentimiento de Cookies de Terceros
 *
 * Gestiona la carga lazy de iframes de YouTube:
 * - Los placeholders con clase .yt-placeholder muestran una imagen local.
 * - Al hacer clic se comprueba el consentimiento (localStorage).
 * - Si no hay consentimiento, se muestra el modal central.
 * - Aceptar → guarda el consentimiento y carga el iframe.
 * - Denegar → cierra el modal, el placeholder sigue visible.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'cookie_consent_third_party';
    const CONSENT_ACCEPTED = 'accepted';
    const CONSENT_DENIED = 'denied';

    /* ── Estado ─────────────────────────────── */
    let pendingWrapper = null; // El wrapper .yt-placeholder que disparó el modal

    /* ── Helpers de consentimiento ──────────── */
    function getConsent() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function setConsent(value) {
        localStorage.setItem(STORAGE_KEY, value);
    }

    function hasAccepted() {
        return getConsent() === CONSENT_ACCEPTED;
    }

    /* ── Carga del iframe real ───────────────── */
    function loadYoutubeIframe(wrapper) {
        const videoId   = wrapper.dataset.youtubeId;
        const baseUrl   = wrapper.dataset.youtubeUrl;
        const title     = wrapper.dataset.title || 'Video de YouTube';
        const width     = wrapper.dataset.width  || '100%';
        const height    = wrapper.dataset.height || '100%';

        if (!videoId || !baseUrl) return;

        const iframe = document.createElement('iframe');
        iframe.src              = baseUrl;
        iframe.title            = title;
        iframe.width            = width;
        iframe.height           = height;
        iframe.frameBorder      = '0';
        iframe.loading          = 'lazy';
        iframe.allowFullscreen  = true;
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('data-cookieconsent', 'marketing');

        // Sustituir el wrapper por el iframe manteniendo el tamaño del contenedor padre
        const parent = wrapper.parentElement;
        parent.replaceChild(iframe, wrapper);
    }

    /* ── Modal ──────────────────────────────── */
    function showModal(wrapper) {
        pendingWrapper = wrapper;
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.classList.add('is-visible');
            toggleBodyScroll(true);
        }
    }

    function hideModal() {
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.classList.remove('is-visible');
            toggleBodyScroll(false);
        }
        pendingWrapper = null;
    }

    /* ── Inicialización de placeholders ─────── */
    function initPlaceholders() {
        const wrappers = document.querySelectorAll('.yt-placeholder');

        wrappers.forEach(function (wrapper) {
            wrapper.addEventListener('click', function () {
                if (hasAccepted()) {
                    loadYoutubeIframe(wrapper);
                } else {
                    showModal(wrapper);
                }
            });

            // Accesibilidad: activar con Enter/Space
            wrapper.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    wrapper.click();
                }
            });
        });
    }

    /* ── Listeners de botones del modal ─────── */
    function initModalButtons() {
        const btnAccept = document.getElementById('cookieBtnAccept');
        const btnDeny   = document.getElementById('cookieBtnDeny');
        const overlay   = document.getElementById('cookieConsentOverlay');

        if (btnAccept) {
            btnAccept.addEventListener('click', function () {
                setConsent(CONSENT_ACCEPTED);
                const target = pendingWrapper;
                hideModal();
                if (target) {
                    loadYoutubeIframe(target);
                }
            });
        }

        if (btnDeny) {
            btnDeny.addEventListener('click', function () {
                setConsent(CONSENT_DENIED);
                hideModal();
            });
        }

        // Cerrar al pulsar fuera del modal
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    hideModal();
                }
            });
        }

        // Cerrar con Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const ov = document.getElementById('cookieConsentOverlay');
                if (ov && ov.classList.contains('is-visible')) {
                    hideModal();
                }
            }
        });
    }

    /* ── Si ya aceptó en sesiones anteriores: carga directa ─── */
    function autoLoadIfAccepted() {
        if (!hasAccepted()) return;
        // No hacemos carga automática: el usuario aún tiene que hacer clic
        // para reproducir el video. Pero si lo deseas, puedes habilitarlo aquí.
    }

    /* ── Entry point ─────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        initPlaceholders();
        initModalButtons();
        autoLoadIfAccepted();
    });

})();
