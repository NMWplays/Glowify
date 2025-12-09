if (!window.glowifyObserverInitialized) {
    window.glowifyObserverInitialized = true;

    // === Helper ===
    function updateStyle(css) {
        let styleTag = document.getElementById("glowify-button-style");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "glowify-button-style";
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = css;
    }

    // === Accent Handling ===
    function applyAccent(color) {
        document.documentElement.style.setProperty("--spice-button", color);
        document.documentElement.style.setProperty("--spice-button-active", color);

        document.documentElement.style.setProperty("--background-highlight", color);

        document.documentElement.style.setProperty("--glowify-accent", color);

        const css = `
            .AZ6uIUy8_YPogVERteBi:hover .r9ZhqDYZeNTrb4R4Te8W {
                fill: ${color} !important;
            }

            .AZ6uIUy8_YPogVERteBi:hover .t_sZQVE189C6jf_gtE_w {
                fill: ${color} !important;
            }

            .e-91000-button-primary:hover .e-91000-button-primary__inner {
                background-color: ${color} !important;
            }

            .e-91000-button-primary:active .e-91000-button-primary__inner {
                background-color: ${color} !important;
            }

            .custom-playing-bar {
                fill: ${color} !important;
            }

            .home-visualizer-bar {
                fill: ${color} !important;
            }
        `;
        updateStyle(css);

        localStorage.setItem("glowify-accent-mode", "custom");
        localStorage.setItem("glowify-custom-color", color);
    }

    let lastDynamicColor = null;

    function applyDynamicAccent() {
        const dynamicColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-color")
            .trim();

        if (!dynamicColor || dynamicColor === lastDynamicColor) return;
        lastDynamicColor = dynamicColor;

        applyAccent(dynamicColor);
        document.documentElement.style.setProperty("--glowify-dynamic-color", dynamicColor);
        localStorage.setItem("glowify-accent-mode", "dynamic");
    }

    function resetAccentToDefault() {
        document.documentElement.style.setProperty("--spice-button", "");
        document.documentElement.style.setProperty("--spice-button-active", "");
        document.documentElement.style.setProperty("--background-highlight", "");
        document.documentElement.style.setProperty("--glowify-accent", "");

        const css = `
            .AZ6uIUy8_YPogVERteBi:hover .r9ZhqDYZeNTrb4R4Te8W {
                fill: #3be477;
            }

            .AZ6uIUy8_YPogVERteBi:hover .t_sZQVE189C6jf_gtE_w {
                fill: #3be477;
            }

            .e-91000-button-primary:hover .e-91000-button-primary__inner {
                background-color: #3be477;
            }

            .e-91000-button-primary:active .e-91000-button-primary__inner {
                background-color: #3be477;
            }

            .custom-playing-bar {
                fill: #3be477;
            }

            .home-visualizer-bar {
                fill: #3be477;
            }
        `;
        updateStyle(css);

        localStorage.setItem("glowify-accent-mode", "default");
        localStorage.removeItem("glowify-custom-color");
    }

    /*Playlist SVG*/

    (async function () {
        while (!Spicetify?.Player || !Spicetify?.Player?.data) {
            await new Promise(r => setTimeout(r, 300));
        }

        let lastSvg = null;
        let lastIndicator = null;

        function createBars(indicator) {
            if (lastSvg) {
                lastSvg.remove();
                lastSvg = null;
            }

            const parent = indicator.parentNode;
            const rectHeight = parent.offsetHeight;
            const bottom = rectHeight - 2;
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");

            svg.setAttribute("width", "16");
            svg.setAttribute("height", rectHeight);
            svg.style.position = "absolute";
            svg.style.left = "0px";
            svg.style.top = "0px";
            svg.style.pointerEvents = "none";

            const bars = [];
            const speeds = [];
            const phases = [];

            for (let i = 0; i < 4; i++) {
                const bar = document.createElementNS(svgNS, "rect");
                bar.setAttribute("x", i * 4);
                bar.setAttribute("width", "3");
                bar.setAttribute("y", bottom - 4);
                bar.setAttribute("height", 4);
                bar.classList.add("custom-playing-bar");
                svg.appendChild(bar);
                bars.push(bar);

                speeds.push(0.008 + Math.random() * 0.007);
                phases.push(Math.random() * Math.PI * 2);
            }

            parent.insertBefore(svg, indicator);
            lastSvg = svg;
            lastIndicator = indicator;

            const start = performance.now();

            function animate() {
                if (!lastSvg || !lastIndicator) return;

                const playButton = lastIndicator.parentNode.querySelector(".main-trackList-rowImagePlayButton");
                const isPlaying = Spicetify.Player.isPlaying() && (!playButton || window.getComputedStyle(playButton).opacity === "0");

                if (!isPlaying) {
                    lastSvg.remove();
                    lastSvg = null;
                    lastIndicator = null;
                    return;
                }

                const now = performance.now();
                const t = now - start;

                bars.forEach((bar, i) => {
                    const maxHeight = lastIndicator.parentNode.offsetHeight * 0.7;
                    const minHeight = 3;
                    const height = minHeight + (Math.sin(t * speeds[i] + phases[i]) + 1) / 2 * (maxHeight - minHeight);
                    bar.setAttribute("height", height);
                    bar.setAttribute("y", bottom - height);
                });

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        }

        async function updateIndicator() {
            const indicator = document.querySelector(
                ".X_HqPouENflGygaUXNus:not([style*='display: none']), [data-playing-indicator]:not([style*='display: none'])"
            );

            if (!indicator) {
                if (lastSvg) {
                    lastSvg.remove();
                    lastSvg = null;
                    lastIndicator = null;
                }
                return false;
            }

            // check if track is paused
            const playButton = indicator.parentNode.querySelector(".main-trackList-rowImagePlayButton");
            const isPlaying = Spicetify.Player.isPlaying() && (!playButton || window.getComputedStyle(playButton).opacity === "0");

            if (lastSvg && !isPlaying) {
                lastSvg.remove();
                lastSvg = null;
                lastIndicator = null;
            }

            if (indicator !== lastIndicator) createBars(indicator);

            return true;
        }

        Spicetify.Player.addEventListener("songchange", () => {
            if (lastSvg) {
                lastSvg.remove();
                lastSvg = null;
                lastIndicator = null;
            }
            updateIndicator();
        });

        setInterval(updateIndicator, 100);
    })();

    /*Homescreen SVG*/

    (function () {

        const homeSvgs = new Map();
        const svgNS = "http://www.w3.org/2000/svg";

        function createHomeVisualizer(img) {
            if (homeSvgs.has(img)) return;

            const parent = img.parentNode;
            if (!parent) return;

            parent.style.setProperty("position", "relative", "important");

            const rectHeight = parent.offsetHeight || 20;
            const bottom = rectHeight - 2;

            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", "16");
            svg.setAttribute("height", rectHeight);
            svg.style.pointerEvents = "none";
            svg.style.zIndex = "999999";

            const bars = [];
            for (let i = 0; i < 4; i++) {
                const bar = document.createElementNS(svgNS, "rect");
                bar.setAttribute("x", i * 4);
                bar.setAttribute("width", "3");
                bar.setAttribute("y", bottom - 4);
                bar.setAttribute("height", 4);
                bar.classList.add("home-visualizer-bar"); // CSS-Class for color
                svg.appendChild(bar);
                bars.push({
                    element: bar,
                    speed: 0.008 + Math.random() * 0.007,
                    phase: Math.random() * Math.PI * 2
                });
            }

            parent.appendChild(svg);
            img.style.display = "none";

            homeSvgs.set(img, { svg, bars, rectHeight, bottom });
        }

        function updateHomeScreenVisualizer() {
            document.querySelectorAll("img.H70qcBekoGWOlskuON5R").forEach(img => {
                if (img.style.display !== "none") createHomeVisualizer(img);
            });
        }

        const homeObserver = new MutationObserver(updateHomeScreenVisualizer);
        homeObserver.observe(document.body, { childList: true, subtree: true });

        // global animation loop
        const start = performance.now();
        function animate() {
            const t = performance.now() - start;

            homeSvgs.forEach(data => {
                if (!document.body.contains(data.svg)) {
                    homeSvgs.delete(data);
                    return;
                }

                const shortcut = data.svg.closest(".view-homeShortcutsGrid-shortcut");
                data.svg.style.display = (shortcut && shortcut.matches(":hover")) ? "none" : "block";

                data.bars.forEach(barData => {
                    const maxHeight = data.rectHeight * 0.7;
                    const minHeight = 3;
                    const height = minHeight + (Math.sin(t * barData.speed + barData.phase) + 1) / 2 * (maxHeight - minHeight);
                    barData.element.setAttribute("height", height);
                    barData.element.setAttribute("y", data.bottom - height);
                });
            });

            requestAnimationFrame(animate);
        }

        animate();
        updateHomeScreenVisualizer();

        Spicetify.Player.addEventListener("onplaypause", () => {
            if (!Spicetify.Player.isPlaying()) {
                homeSvgs.forEach(data => data.svg.remove());
                homeSvgs.clear();
            } else {
                updateHomeScreenVisualizer();
            }
        });

    })();

    // === Glow Accent Handling ===
    function applyGlowAccent(color) {
        document.documentElement.style.setProperty("--glowify-glow-accent", color);
        localStorage.setItem("glowify-glow-mode", "custom");
        localStorage.setItem("glowify-glow-color", color);
    }

    function resetGlowAccentToDefault() {
        const defaultColor = "var(--accent-color)";
        document.documentElement.style.setProperty("--glowify-glow-accent", defaultColor);
        localStorage.setItem("glowify-glow-mode", "default");
    }

    // === Artist Background Controller ===
    (function ArtistBackgroundController() {
        const ORIGINALS = new WeakMap();
        const ART_SELECTOR = ".XR9tiExSLOuxgWTKxzse";
        const STORAGE_KEY_MODE = "glowify-artist-bg-mode";
        const STORAGE_KEY_CUSTOM = "glowify-bg-image";

        // helpers
        function getSavedMode() { return localStorage.getItem(STORAGE_KEY_MODE) || "theme"; }
        function setSavedMode(mode) { localStorage.setItem(STORAGE_KEY_MODE, mode); }
        function getCustomImage() { return localStorage.getItem(STORAGE_KEY_CUSTOM); }

        function isArtistPage() {
            try { return (location && location.pathname && location.pathname.includes("/artist")) || !!document.querySelector(ART_SELECTOR); }
            catch (e) { return false; }
        }

        function getImgElem(el) { if (!el) return null; return el.tagName === "IMG" ? el : el.querySelector("img"); }

        function saveOriginalIfNeeded(el) {
            if (ORIGINALS.has(el)) return;
            const img = getImgElem(el);
            if (img) ORIGINALS.set(el, { type: "img", src: img.src || "" });
            else {
                const inlineBg = el.style.backgroundImage;
                if (inlineBg) ORIGINALS.set(el, { type: "bg", bg: inlineBg });
                else ORIGINALS.set(el, { type: "bg", bg: getComputedStyle(el).backgroundImage || "" });
            }
        }

        function restoreOriginal(el) {
            if (!ORIGINALS.has(el)) return;
            const orig = ORIGINALS.get(el);
            const img = getImgElem(el);
            if (orig.type === "img" && img) img.src = orig.src || "";
            else if (orig.type === "bg") {
                el.style.backgroundImage = orig.bg || "";
                el.style.backgroundRepeat = "";
                el.style.backgroundSize = "";
                el.style.backgroundPosition = "";
            }
        }

        function applyMode(mode) {
            if (!isArtistPage()) return;
            const nodes = document.querySelectorAll(ART_SELECTOR);
            if (!nodes || nodes.length === 0) return;
            const customImage = getCustomImage();

            nodes.forEach((el) => {
                try {
                    saveOriginalIfNeeded(el);
                    const img = getImgElem(el);

                    // default: hide first, damit kein Aufblitzen
                    el.style.opacity = "0";

                    if (mode === "theme") {
                        restoreOriginal(el);
                        el.style.opacity = "1";
                    } else if (mode === "custom" && customImage) {
                        if (img) img.src = customImage;
                        else {
                            el.style.backgroundImage = `url("${customImage}")`;
                            el.style.backgroundRepeat = "no-repeat";
                            el.style.backgroundSize = "cover";
                            el.style.backgroundPosition = "center center";
                        }
                        el.style.opacity = "1";
                    }
                    // mode === "none" -> opacity bleibt 0, nichts weiter tun
                } catch (err) { console.warn("applyMode element error", err); }
            });
        }

        function applySavedModeIfArtist() { if (!isArtistPage()) return; applyMode(getSavedMode()); }

        function initPopupHandlers() {
            const artistSelect = document.getElementById("artist-bg-mode");
            const artistFile = document.getElementById("artist-bg-file");
            if (!artistSelect) return false;
            if (artistSelect._glowify_inited) return true;
            artistSelect._glowify_inited = true;

            artistSelect.addEventListener("change", (e) => {
                const val = e.target.value;
                setSavedMode(val);
                if (val === "custom" && !getCustomImage() && artistFile) { artistFile.click(); return; }
                if (isArtistPage()) applyMode(val);
            });

            if (artistFile) {
                artistFile.addEventListener("change", async (ev) => {
                    try {
                        if (ev.target.files && ev.target.files[0]) {
                            await applyCustomBackground(ev.target.files[0]);
                            if (getSavedMode() === "custom" && isArtistPage()) applyMode("custom");
                        }
                    } catch (err) { console.warn("artistFile change failed", err); }
                });
            }

            try { artistSelect.value = getSavedMode(); } catch (e) {}
            return true;
        }

        const bodyObserver = new MutationObserver((mutations) => {
            let popupFound = false;
            let artistFound = false;

            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) {
                    for (const n of m.addedNodes) {
                        if (n.nodeType !== 1) continue;
                        if (!popupFound && n.querySelector && (n.querySelector("#artist-bg-mode") || n.id === "glowify-settings-popup")) popupFound = true;
                        if (!artistFound && (n.matches && n.matches(ART_SELECTOR) || (n.querySelector && n.querySelector(ART_SELECTOR)))) artistFound = true;
                    }
                }
                if (!artistFound && m.type === "attributes" && m.target && m.target.matches && m.target.matches(ART_SELECTOR)) artistFound = true;
            }

            if (popupFound) initPopupHandlers();
            if (artistFound) {
                if (bodyObserver._debounce) clearTimeout(bodyObserver._debounce);
                bodyObserver._debounce = setTimeout(() => { applySavedModeIfArtist(); }, 60);
            }
        });

        function startObservers() {
            if (!document.body) return false;
            bodyObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "src", "class"] });
            return true;
        }

        (function hookHistory() {
            const wrap = (fn) => {
                const orig = history[fn];
                return function (...args) {
                    const res = orig.apply(this, args);
                    setTimeout(() => { if (isArtistPage()) applySavedModeIfArtist(); }, 80);
                    return res;
                };
            };
            history.pushState = wrap("pushState");
            history.replaceState = wrap("replaceState");
            window.addEventListener("popstate", () => setTimeout(() => { if (isArtistPage()) applySavedModeIfArtist(); }, 80));
        })();

        // --- Robust glowifyBackgroundChange handler ---
        (function installBgChangeHandler() {
            const RETRY_COUNT = 4;
            const RETRY_DELAY = 80;
            let debounceTimer = null;

            async function doApplyCustomWithRetries() {
                if (getSavedMode() !== "custom") return;
                if (!isArtistPage()) return;
                for (let i = 0; i < RETRY_COUNT; i++) {
                    try { applyMode("custom"); } catch (e) { console.warn("applyMode(custom) failed", i, e); }
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                }
            }

            window.removeEventListener("glowifyBackgroundChange", window._glowifyArtistBgHandler || (()=>{}));
            window._glowifyArtistBgHandler = () => {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => { doApplyCustomWithRetries().catch(console.warn); debounceTimer = null; }, 60);
            };
            window.addEventListener("glowifyBackgroundChange", window._glowifyArtistBgHandler);
        })();

        (function tryInit() {
            if (!startObservers()) { setTimeout(tryInit, 200); return; }
            initPopupHandlers();
            if (isArtistPage()) applySavedModeIfArtist();
        })();
    })();

    // === Background Handling ===
    async function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function applyCustomBackground(file) {
        const img = await fileToBase64(file);
        const tmpImg = new Image();
        tmpImg.src = img;
        await new Promise((r) => (tmpImg.onload = r));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxW = 1920, maxH = 1080;
        let { width, height } = tmpImg;

        if (width > maxW) {
            height *= maxW / width;
            width = maxW;
        }
        if (height > maxH) {
            width *= maxH / height;
            height = maxH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(tmpImg, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        localStorage.setItem("glowify-bg-mode", "custom");
        localStorage.setItem("glowify-bg-image", compressedBase64);
        updateBackground();
    }

    function applySavedBackground() {
        const mode = localStorage.getItem("glowify-bg-mode");
        const image = localStorage.getItem("glowify-bg-image");
        const root = document.querySelector(".Root__top-container");
        if (!root) return;

        if (mode === "custom" && image) {
            root.style.setProperty("--image_url", `url("${image}")`);
        }
    }

    function updateBackground() {
        const mode = localStorage.getItem("glowify-bg-mode") || "dynamic";
        const image = localStorage.getItem("glowify-bg-image");
        const root = document.querySelector(".Root__top-container");
        if (!root) return;

        if (mode === "custom" && image) {
            root.style.setProperty("--image_url", `url("${image}")`);
        } else {
            window.dispatchEvent(new Event("glowifyBackgroundChange"));
        }
    }

    // === Player Width Handling ===
    function applyPlayerWidth(mode) {
        const player = document.querySelector(".Root__now-playing-bar");
        if (!player) return;

        if (mode === "theme") {
            player.style.width = "65%";
            player.style.margin = "0 auto 5px";
        } else {
            player.style.margin = "calc(var(--panel-gap) * -1)";
            player.style.width = "unset";
        }

        localStorage.setItem("glowify-player-width", mode);
    }

    // === Player Border Radius Handling ===
    function applyPlayerRadius(px) {
        const player = document.querySelector(".Root__now-playing-bar");
        if (!player) return;

        player.style.borderRadius = px + "px";
        localStorage.setItem("glowify-player-radius", px);
    }

    function ensurePlayerWidthApplied() {
        const mode = localStorage.getItem("glowify-player-width") || "theme";
        const radius = parseInt(localStorage.getItem("glowify-player-radius") || "30", 10);
        const player = document.querySelector(".Root__now-playing-bar");

        if (player) {
            applyPlayerWidth(mode);
            applyPlayerRadius(radius);
        } else {
            const obs = new MutationObserver(() => {
                const found = document.querySelector(".Root__now-playing-bar");
                if (found) {
                    applyPlayerWidth(mode);
                    applyPlayerRadius(radius);
                    obs.disconnect();
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }
    }

    // === Transparent Controls Handling (Fixed for Spotify UI) ===
    
    function getOsName() {
        return (Spicetify?.Platform?.PlatformData?.os_name || navigator.platform || "").toString().toLowerCase();
    }

    function isUnixLikeOS() {
        const os = getOsName();
        return os.includes("linux") || os.includes("mac") || os.includes("darwin") || os.includes("osx") || os.includes("macos");
    }

    function applyTransparentControls(width, height) {
        const opacity = isUnixLikeOS() ? 0 : 1;

        const css = `
            .Root__top-container::after {
                content: "";
                position: fixed;
                top: 0;
                right: 0;
                z-index: 999;
                backdrop-filter: brightness(2.12);
                width: ${width}px !important;
                height: ${height}px !important;
                pointer-events: none;
                transition: all 0.25s ease;
                opacity: ${opacity} !important;
            }
        `;
        let styleTag = document.getElementById("glowify-transparent-controls");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "glowify-transparent-controls";
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = css;

        localStorage.setItem("glowify-tc-width", width);
        localStorage.setItem("glowify-tc-height", height);
    }

    function ensureTransparentControlsApplied() {
        const width = parseInt(localStorage.getItem("glowify-tc-width") || "135", 10);
        const height = parseInt(localStorage.getItem("glowify-tc-height") || "64", 10);
        applyTransparentControls(width, height);
    }

    // === Backgorund-Picture-Blur ===
    // === Background Blur Handling ===
    function applyBackgroundBlur(px) {
        document.documentElement.style.setProperty("--glowify-bg-blur", px + "px");
        localStorage.setItem("glowify-bg-blur", px);
    }

    function ensureBackgroundBlurApplied() {
        const saved = parseInt(localStorage.getItem("glowify-bg-blur") || "7", 10);
        applyBackgroundBlur(saved);
    }

    const savedGlowMode = localStorage.getItem("glowify-glow-mode") || "default";
    const savedGlowColor = localStorage.getItem("glowify-glow-color") || "#1DB954";
    if (savedGlowMode === "custom") {
        applyGlowAccent(savedGlowColor);
    } else {
        resetGlowAccentToDefault();
    }

    // === Initialization ===
    const savedAccentMode = localStorage.getItem("glowify-accent-mode") || "default";
    const savedAccentColor = localStorage.getItem("glowify-custom-color") || "#1DB954";

    if (savedAccentMode === "custom") {
        applyAccent(savedAccentColor);
    } else if (savedAccentMode === "dynamic") {
        applyDynamicAccent();
    } else {
        resetAccentToDefault();
    }

    applySavedBackground();
    ensurePlayerWidthApplied();
    ensureTransparentControlsApplied();
    ensureBackgroundBlurApplied();

    // === Dynamic Accent Observer ===
    if (!window.glowifyDynamicObserver) {
        window.glowifyDynamicObserver = new MutationObserver(() => {
            const mode = localStorage.getItem("glowify-accent-mode");
            if (mode === "dynamic") applyDynamicAccent();
        });
        window.glowifyDynamicObserver.observe(document.body, { attributes: true, subtree: true });
    }

    // === Popup Languages ===

        const glowifyTranslations = {
        de: {
            settingsTitle: "Glowify Einstellungen",
            title: "Glowify Einstellungen",
            accentColor: "Button-Farbe:",
            glowColor: "Glow-Farbe:",
            background: "Hintergrund:",
            apbackground: "Künstler Seiten Hintergrund:",
            playerWidth: "Player-Breite:",
            playerRadius: "Player Border Radius:",
            backgroundBlur: "Hintergrund-Unschärfe:",
            transparentWidth: "Transparente Controls Breite:",
            transparentHeight: "Transparente Controls Höhe:",
            close: "Schließen",
            dropdown: {
                default: "Standard",
                custom: "Benutzerdefiniert",
                dynamic: "Dynamisch",
                theme: "Theme",
                none: "Keiner"
            }
        },
        en: {
            settingsTitle: "Glowify Settings",
            title: "Glowify Settings",
            accentColor: "Button Accent Color:",
            glowColor: "Glow Accent Color:",
            background: "Background:",
            apbackground: "Artist Page Background:",
            playerWidth: "Player Width:",
            playerRadius: "Player Border Radius:",
            backgroundBlur: "Background Blur:",
            transparentWidth: "Transparent Controls Width:",
            transparentHeight: "Transparent Controls Height:",
            close: "Close",
            dropdown: {
                default: "Default",
                custom: "Custom",
                dynamic: "Dynamic",
                theme: "Theme",
                none: "None"
            }
        },
        ru: {
            settingsTitle: "Настройки Glowify",
            title: "Настройки Glowify",
            accentColor: "Цвет акцента кнопок:",
            glowColor: "Цвет свечения:",
            background: "Фон:",
            apbackground: "Фон страницы артиста:",
            playerWidth: "Ширина плеера:",
            playerRadius: "Скругление углов плеера:",
            backgroundBlur: "Размытие фона:",
            transparentWidth: "Ширина прозрачных элементов:",
            transparentHeight: "Высота прозрачных элементов:",
            close: "Закрыть",
            dropdown: {
                default: "Стандартно",
                custom: "Пользовательский",
                dynamic: "Динамический",
                theme: "Тема",
                none: "Нет"
            }
        },
        es: {
            settingsTitle: "Configuración de Glowify",
            title: "Configuración de Glowify",
            accentColor: "Color de acento del botón:",
            glowColor: "Color del brillo:",
            background: "Fondo:",
            apbackground: "Fondo de la página del artista:",
            playerWidth: "Ancho del reproductor:",
            playerRadius: "Radio del borde del reproductor:",
            backgroundBlur: "Desenfoque del fondo:",
            transparentWidth: "Ancho de controles transparentes:",
            transparentHeight: "Altura de controles transparentes:",
            close: "Cerrar",
            dropdown: {
                default: "Predeterminado",
                custom: "Personalizado",
                dynamic: "Dinámico",
                theme: "Tema",
                none: "Ninguno"
            }
        },
        fr: {
            settingsTitle: "Paramètres Glowify",
            title: "Paramètres Glowify",
            accentColor: "Couleur d’accent du bouton:",
            glowColor: "Couleur de l’effet lumineux:",
            background: "Arrière-plan:",
            apbackground: "Arrière-plan de la page de l’artiste:",
            playerWidth: "Largeur du lecteur:",
            playerRadius: "Rayon de bord du lecteur:",
            backgroundBlur: "Flou de l’arrière-plan:",
            transparentWidth: "Largeur des contrôles transparents:",
            transparentHeight: "Hauteur des contrôles transparents:",
            close: "Fermer",
            dropdown: {
                default: "Par défaut",
                custom: "Personnalisé",
                dynamic: "Dynamique",
                theme: "Thème",
                none: "Aucun"
            }
        },
        pt: {
            settingsTitle: "Configurações do Glowify",
            title: "Configurações do Glowify",
            accentColor: "Cor de destaque do botão:",
            glowColor: "Cor do brilho:",
            background: "Fundo:",
            apbackground: "Fundo da página do artista:",
            playerWidth: "Largura do player:",
            playerRadius: "Raio do canto do player:",
            backgroundBlur: "Desfoque do fundo:",
            transparentWidth: "Largura dos controles transparentes:",
            transparentHeight: "Altura dos controles transparentes:",
            close: "Fechar",
            dropdown: {
                default: "Padrão",
                custom: "Personalizado",
                dynamic: "Dinâmico",
                theme: "Tema",
                none: "Nenhum"
            }
        },
        tr: {
            settingsTitle: "Glowify Ayarları",
            title: "Glowify Ayarları",
            accentColor: "Düğme vurgu rengi:",
            glowColor: "Parlama rengi:",
            background: "Arka plan:",
            apbackground: "Sanatçı Sayfası Arka Planı:",
            playerWidth: "Oynatıcı genişliği:",
            playerRadius: "Oynatıcı köşe yuvarlama:",
            backgroundBlur: "Arka plan bulanıklığı:",
            transparentWidth: "Şeffaf kontroller genişliği:",
            transparentHeight: "Şeffaf kontroller yüksekliği:",
            close: "Kapat",
            dropdown: {
                default: "Varsayılan",
                custom: "Özel",
                dynamic: "Dinamik",
                theme: "Tema",
                none: "Hiçbiri"
            }
        },
        hi: {
            settingsTitle: "Glowify सेटिंग्स",
            title: "Glowify सेटिंग्स",
            accentColor: "बटन एक्सेंट रंग:",
            glowColor: "ग्लो एक्सेंट रंग:",
            background: "पृष्ठभूमि:",
            apbackground: "कलाकार पृष्ठ पृष्ठभूमि:",
            playerWidth: "प्लेयर चौड़ाई:",
            playerRadius: "प्लेयर बॉर्डर रेडियस:",
            backgroundBlur: "पृष्ठभूमि धुंधलापन:",
            transparentWidth: "पारदर्शी कंट्रोल चौड़ाई:",
            transparentHeight: "पारदर्शी कंट्रोल ऊँचाई:",
            close: "बंद करें",
            dropdown: {
                default: "डिफ़ॉल्ट",
                custom: "कस्टम",
                dynamic: "डायनेमिक",
                theme: "थीम",
                none: "कोई नहीं"
            }
        }
    };

        const clientLocale = (Spicetify?.Platform?.Session?.locale || navigator.language || "en").split("-")[0];
        const lang = glowifyTranslations[clientLocale] ? clientLocale : "en";
        const t = glowifyTranslations[lang];

    // === Context-Menu Integration ===
    const observer = new MutationObserver(() => {
        const menu = document.querySelector("#context-menu");
        if (!menu || menu.querySelector("#glowify-settings-btn")) return;

        const buttons = menu.querySelectorAll("button.main-contextMenu-menuItemButton");
        for (const btn of buttons) {
            if (btn.textContent.trim() === "Experimental features") {
                const newItem = document.createElement("li");
                newItem.className = "main-contextMenu-menuItem";
                newItem.innerHTML = `
                    <button class="main-contextMenu-menuItemButton" id="glowify-settings-btn">
                        <span class="e-91000-text encore-text-body-small main-contextMenu-menuItemLabel">
                            ${t.settingsTitle}
                        </span>
                    </button>
                `;
                btn.closest("li").after(newItem);
                document
                    .querySelector("#glowify-settings-btn")
                    .addEventListener("click", showGlowifySettingsMenu);
                break;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });


    // === Popup Window ===
    window.showGlowifySettingsMenu = function () {
        const existing = document.querySelector("#glowify-settings-popup");
        if (existing) existing.remove();

        const popup = document.createElement("div");
        popup.id = "glowify-settings-popup";
        popup.innerHTML = `
            <div class="glowify-popup-inner">
                <button id="close-glowify-popup" aria-label="${t.close}">
                    <svg role="img" height="16" width="16" viewBox="0 0 16 16" class="spotify-x-icon">
                        <path d="M1.47 1.47a.75.75 0 011.06 0L8 6.94l5.47-5.47a.75.75 0 111.06 1.06L9.06 8l5.47 5.47a.75.75 0 11-1.06 1.06L8 9.06l-5.47 5.47a.75.75 0 11-1.06-1.06L6.94 8 1.47 2.53a.75.75 0 010-1.06z"></path>
                    </svg>
                </button>

                <h3>${t.title}</h3>

                <div class="accent-row">
                    <label for="accent-mode">${t.accentColor}</label>
                    <select id="accent-mode">
                        <option value="default">${t.dropdown.default}</option>
                        <option value="custom">${t.dropdown.custom}</option>
                        <option value="dynamic">${t.dropdown.dynamic}</option>
                    </select>
                    <input type="color" id="accent-picker" value="#1DB954" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="glow-mode">${t.glowColor}</label>
                    <select id="glow-mode">
                        <option value="default">${t.dropdown.default}</option>
                        <option value="custom">${t.dropdown.custom}</option>
                    </select>
                    <input type="color" id="glow-picker" value="#1DB954" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="background-mode">${t.background}</label>
                    <select id="background-mode">
                        <option value="dynamic">${t.dropdown.dynamic}</option>
                        <option value="custom">${t.dropdown.custom}</option>
                    </select>
                    <input type="file" id="background-file" accept="image/*" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="artist-bg-mode">${t.apbackground}</label>
                    <select id="artist-bg-mode">
                        <option value="theme">${t.dropdown.theme}</option>
                        <option value="none">${t.dropdown.none}</option>
                        <option value="custom">${t.dropdown.custom}</option>
                    </select>
                    <input type="file" id="artist-bg-file" accept="image/*" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="player-width">${t.playerWidth}</label>
                    <select id="player-width">
                        <option value="default">${t.dropdown.default}</option>
                        <option value="theme">${t.dropdown.theme}</option>
                    </select>
                </div>

                <div class="accent-row">
                    <label for="player-radius">${t.playerRadius}</label>
                    <div class="radius-control">
                        <button id="radius-minus">-</button>
                        <input type="number" id="player-radius" min="0" max="100" step="1">
                        <button id="radius-plus">+</button>
                    </div>
                </div>

                <div class="accent-row">
                    <label>${t.backgroundBlur}</label>
                    <div class="radius-control">
                        <button id="bg-blur-minus">-</button>
                        <input type="number" id="bg-blur" min="0" max="40" step="1">
                        <button id="bg-blur-plus">+</button>
                    </div>
                </div>
                
                <div class="accent-row">
                    <label>${t.transparentWidth}</label>
                    <div class="radius-control">
                        <button id="tc-width-minus">-</button>
                        <input type="number" id="tc-width" min="50" max="400" step="1">
                        <button id="tc-width-plus">+</button>
                    </div>
                </div>

                <div class="accent-row">
                    <label>${t.transparentHeight}</label>
                    <div class="radius-control">
                        <button id="tc-height-minus">-</button>
                        <input type="number" id="tc-height" min="20" max="300" step="1">
                        <button id="tc-height-plus">+</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        disableTransparentControlsInPopup(popup);
            // === Popup Styling ===
            const style = document.createElement("style");
            style.id = "glowify-style";
            style.textContent = `
                #glowify-settings-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: transparent;
                    border: none;
                    border-radius: 20px;
                    padding: 20px 28px 24px;
                    z-index: 99999;
                    box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color));
                    color: white;
                    font-family: sans-serif;
                    animation: fadeIn 0.6s ease;
                    backdrop-filter: blur(2rem);
                    width: fit-content;
                }

                #glowify-settings-popup .glowify-popup-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    align-items: flex-start;
                    position: relative;
                }

                #glowify-settings-popup .spotify-x-icon { fill: white !important; }

                #glowify-settings-popup h3 { 
                    align-self: center; 
                    margin: 0 0 8px 0; 
                }

                #glowify-settings-popup #close-glowify-popup {
                    position: absolute;
                    top: 5px;
                    right: -9px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s ease, transform 0.15s ease;
                }

                #glowify-settings-popup #close-glowify-popup:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                #glowify-settings-popup .accent-row {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 10px;
                    width: 100%;
                }

                #glowify-settings-popup label { 
                    min-width: 206px; 
                    text-align: left; 
                }

                #glowify-settings-popup select {
                    background: #00000057;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 4px 8px;
                    cursor: pointer;
                }

                #glowify-settings-popup #accent-picker,
                #glowify-settings-popup #background-file {
                    border: none;
                    border-radius: 10px;
                    background: none;
                    transition: all 0.2s ease;
                    width: 178px;
                    box-shadow: 0 0 25px 8px var(--accent-color);
                }

                #glowify-settings-popup .radius-control {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                #glowify-settings-popup .radius-control button {
                    background: #00000057;
                    border: none;
                    color: white;
                    border-radius: 6px;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                #glowify-settings-popup .radius-control button:hover { 
                    background: var(--accent-color); 
                }

                #glowify-settings-popup #player-radius,
                #glowify-settings-popup #tc-width,
                #glowify-settings-popup #tc-height,
                #glowify-settings-popup #bg-blur {
                    width: 50px;
                    text-align: center;
                    border: none;
                    border-radius: 6px;
                    padding: 4px;
                    background: #00000057;
                    color: white;
                }
            `;
            if (!document.querySelector("#glowify-style")) document.head.appendChild(style);


        function disableTransparentControlsInPopup(popup) {
            const disable = isUnixLikeOS();

            const ids = [
                "#tc-width",
                "#tc-height",
                "#tc-width-minus",
                "#tc-width-plus",
                "#tc-height-minus",
                "#tc-height-plus"
            ];

            ids.forEach(sel => {
                const el = popup.querySelector(sel);
                if (!el) return;
                try { el.disabled = disable; } catch (e) {}
                try { el.readOnly = disable; } catch (e) {}
                el.style.pointerEvents = disable ? "none" : "";
                el.style.opacity = disable ? "0.5" : "";
                el.style.cursor = disable ? "not-allowed" : "";
                if (disable) {
                    el.setAttribute("aria-disabled", "true");
                    el.setAttribute("tabindex", "-1");
                } else {
                    el.removeAttribute("aria-disabled");
                    el.removeAttribute("tabindex");
                }
            });
        }

        // === Logic ===
        const picker = document.getElementById("accent-picker");
        const modeSelect = document.getElementById("accent-mode");
        const glowMode = document.getElementById("glow-mode");
        const glowPicker = document.getElementById("glow-picker");
        const bgSelect = document.getElementById("background-mode");
        const bgFile = document.getElementById("background-file");
        const widthSelect = document.getElementById("player-width");
        const radiusInput = document.getElementById("player-radius");
        const radiusMinus = document.getElementById("radius-minus");
        const radiusPlus = document.getElementById("radius-plus");

        const tcWidth = document.getElementById("tc-width");
        const tcHeight = document.getElementById("tc-height");
        const tcWMinus = document.getElementById("tc-width-minus");
        const tcWPlus = document.getElementById("tc-width-plus");
        const tcHMinus = document.getElementById("tc-height-minus");
        const tcHPlus = document.getElementById("tc-height-plus");

        const currentMode = localStorage.getItem("glowify-accent-mode") || "default";
        const currentColor = localStorage.getItem("glowify-custom-color") || "#1DB954";
        const currentBgMode = localStorage.getItem("glowify-bg-mode") || "dynamic";
        const currentWidth = localStorage.getItem("glowify-player-width") || "default";
        const currentRadius = parseInt(localStorage.getItem("glowify-player-radius") || "30", 10);
        const curTCWidth = parseInt(localStorage.getItem("glowify-tc-width") || "135", 10);
        const curTCHeight = parseInt(localStorage.getItem("glowify-tc-height") || "64", 10);
        const currentGlowMode = localStorage.getItem("glowify-glow-mode") || "default";
        const currentGlowColor = localStorage.getItem("glowify-glow-color") || "#1DB954";

        modeSelect.value = currentMode;
        bgSelect.value = currentBgMode;
        widthSelect.value = currentWidth;
        radiusInput.value = currentRadius;
        picker.value = currentColor;
        tcWidth.value = curTCWidth;
        tcHeight.value = curTCHeight;
        glowMode.value = currentGlowMode;
        glowPicker.value = currentGlowColor;
        glowPicker.style.display = currentGlowMode === "custom" ? "block" : "none";

        picker.style.display = currentMode === "custom" ? "block" : "none";
        bgFile.style.display = currentBgMode === "custom" ? "block" : "none";

        glowMode.addEventListener("change", (e) => {
            const value = e.target.value;
            if (value === "custom") {
                glowPicker.style.display = "block";
                applyGlowAccent(glowPicker.value);
            } else {
                glowPicker.style.display = "none";
                resetGlowAccentToDefault();
            }
        });

        glowPicker.addEventListener("input", (e) => applyGlowAccent(e.target.value));
        
        modeSelect.addEventListener("change", (e) => {
            const value = e.target.value;
            if (value === "custom") {
                picker.style.display = "block";
                applyAccent(picker.value);
            } else if (value === "dynamic") {
                picker.style.display = "none";
                lastDynamicColor = null;
                applyDynamicAccent();
            } else {
                picker.style.display = "none";
                resetAccentToDefault();
            }
        });

        picker.addEventListener("input", (e) => applyAccent(e.target.value));

        bgSelect.addEventListener("change", (e) => {
            const value = e.target.value;
            if (value === "custom") {
                bgFile.style.display = "block";
                const saved = localStorage.getItem("glowify-bg-image");
                if (saved) {
                    localStorage.setItem("glowify-bg-mode", "custom");
                    updateBackground();
                } else {
                    bgFile.click();
                }
            } else {
                bgFile.style.display = "none";
                localStorage.setItem("glowify-bg-mode", "dynamic");
                updateBackground();
            }
        });

        bgFile.addEventListener("change", async (e) => {
            if (e.target.files && e.target.files[0]) {
                await applyCustomBackground(e.target.files[0]);
            }
        });

        widthSelect.addEventListener("change", (e) => applyPlayerWidth(e.target.value));

        radiusInput.addEventListener("input", (e) => applyPlayerRadius(e.target.value));
        radiusMinus.addEventListener("click", () => {
            let val = Math.max(0, parseInt(radiusInput.value, 10) - 1);
            radiusInput.value = val;
            applyPlayerRadius(val);
        });
        radiusPlus.addEventListener("click", () => {
            let val = Math.min(100, parseInt(radiusInput.value, 10) + 1);
            radiusInput.value = val;
            applyPlayerRadius(val);
        });

        // === Transparent Controls Handlers ===
        tcWidth.addEventListener("input", () => {
            applyTransparentControls(parseInt(tcWidth.value, 10), parseInt(tcHeight.value, 10));
        });
        tcHeight.addEventListener("input", () => {
            applyTransparentControls(parseInt(tcWidth.value, 10), parseInt(tcHeight.value, 10));
        });

        tcWMinus.addEventListener("click", () => {
            let val = Math.max(50, parseInt(tcWidth.value, 10) - 1);
            tcWidth.value = val;
            applyTransparentControls(val, parseInt(tcHeight.value, 10));
        });
        tcWPlus.addEventListener("click", () => {
            let val = Math.min(400, parseInt(tcWidth.value, 10) + 1);
            tcWidth.value = val;
            applyTransparentControls(val, parseInt(tcHeight.value, 10));
        });

        tcHMinus.addEventListener("click", () => {
            let val = Math.max(20, parseInt(tcHeight.value, 10) - 1);
            tcHeight.value = val;
            applyTransparentControls(parseInt(tcWidth.value, 10), val);
        });
        tcHPlus.addEventListener("click", () => {
            let val = Math.min(300, parseInt(tcHeight.value, 10) + 1);
            tcHeight.value = val;
            applyTransparentControls(parseInt(tcWidth.value, 10), val);
        });

        // === Background Blur Handlers ===
        const bgBlur = document.getElementById("bg-blur");
        const bgBlurMinus = document.getElementById("bg-blur-minus");
        const bgBlurPlus = document.getElementById("bg-blur-plus");

        const currentBlur = parseInt(localStorage.getItem("glowify-bg-blur") || "7", 10);
        bgBlur.value = currentBlur;

        bgBlur.addEventListener("input", () => {
            applyBackgroundBlur(parseInt(bgBlur.value, 10));
        });

        bgBlurMinus.addEventListener("click", () => {
            let val = Math.max(0, parseInt(bgBlur.value, 10) - 1);
            bgBlur.value = val;
            applyBackgroundBlur(val);
        });

        bgBlurPlus.addEventListener("click", () => {
            let val = Math.min(40, parseInt(bgBlur.value, 10) + 1);
            bgBlur.value = val;
            applyBackgroundBlur(val);
        });

        // === Close Popup ===
        document
            .querySelector("#close-glowify-popup")
            .addEventListener("click", () => popup.remove());
    };

}