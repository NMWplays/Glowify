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
        document.documentElement.style.setProperty("--spice-button-active", color);
        document.documentElement.style.setProperty("--glowify-accent", color);

        const css = `
            .encore-dark-theme .encore-bright-accent-set {
                --background-base: ${color};
                --background-highlight: ${color};
                --background-press: ${color};
            }
            .main-genericButton-button.main-genericButton-buttonActive {
                color: ${color} !important;
            }
            .main-genericButton-button.main-genericButton-buttonActiveDot:after {
                background-color: ${color} !important;
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
        const defaultColor = "#1ed760";
        document.documentElement.style.setProperty("--spice-button-active", defaultColor);

        const css = `
            .encore-dark-theme .encore-bright-accent-set {
                --background-base: var(--spice-button-active);
                --background-highlight: #3be477;
                --background-press: #1abc54;
            }
            .main-genericButton-button.main-genericButton-buttonActive {
                color: var(--spice-button);
            }
            .main-genericButton-button.main-genericButton-buttonActiveDot:after {
                background-color: var(--spice-button);
            }
        `;
        updateStyle(css);
        localStorage.setItem("glowify-accent-mode", "default");
    }

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
    function applyTransparentControls(width, height) {
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
                            Glowify Settings
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
                <button id="close-glowify-popup" aria-label="Close settings">
                    <svg role="img" height="16" width="16" viewBox="0 0 16 16" class="spotify-x-icon">
                        <path d="M1.47 1.47a.75.75 0 011.06 0L8 6.94l5.47-5.47a.75.75 0 111.06 1.06L9.06 8l5.47 5.47a.75.75 0 11-1.06 1.06L8 9.06l-5.47 5.47a.75.75 0 11-1.06-1.06L6.94 8 1.47 2.53a.75.75 0 010-1.06z"></path>
                    </svg>
                </button>

                <h3>Glowify Settings</h3>

                <div class="accent-row">
                    <label for="accent-mode">Button Accent Color:</label>
                    <select id="accent-mode">
                        <option value="default">Default</option>
                        <option value="custom">Custom</option>
                        <option value="dynamic">Dynamic</option>
                    </select>
                    <input type="color" id="accent-picker" value="#1DB954" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="glow-mode">Glow Accent Color:</label>
                    <select id="glow-mode">
                        <option value="default">Default</option>
                        <option value="custom">Custom</option>
                    </select>
                    <input type="color" id="glow-picker" value="#1DB954" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="background-mode">Background:</label>
                    <select id="background-mode">
                        <option value="dynamic">Dynamic</option>
                        <option value="custom">Custom Image</option>
                    </select>
                    <input type="file" id="background-file" accept="image/*" style="display:none;">
                </div>

                <div class="accent-row">
                    <label for="player-width">Player Width:</label>
                    <select id="player-width">
                        <option value="default">Default</option>
                        <option value="theme">Theme</option>
                    </select>
                </div>

                <div class="accent-row">
                    <label for="player-radius">Player Border Radius:</label>
                    <div class="radius-control">
                        <button id="radius-minus">-</button>
                        <input type="number" id="player-radius" min="0" max="100" step="1">
                        <button id="radius-plus">+</button>
                    </div>
                </div>

                <div class="accent-row">
                    <label>Background Blur:</label>
                    <div class="radius-control">
                        <button id="bg-blur-minus">-</button>
                        <input type="number" id="bg-blur" min="0" max="40" step="1">
                        <button id="bg-blur-plus">+</button>
                    </div>
                </div>
        `;
        document.body.appendChild(popup);
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


        // === Add Transparent Controls Inputs ===
        const popupInner = popup.querySelector(".glowify-popup-inner");
        popupInner.insertAdjacentHTML(
            "beforeend",
            `
                <div class="accent-row">
                    <label>Transparent Controls Width:</label>
                    <div class="radius-control">
                        <button id="tc-width-minus">-</button>
                        <input type="number" id="tc-width" min="50" max="400" step="1">
                        <button id="tc-width-plus">+</button>
                    </div>
                </div>

                <div class="accent-row">
                    <label>Transparent Controls Height:</label>
                    <div class="radius-control">
                        <button id="tc-height-minus">-</button>
                        <input type="number" id="tc-height" min="20" max="300" step="1">
                        <button id="tc-height-plus">+</button>
                    </div>
                </div>
            `
        );

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