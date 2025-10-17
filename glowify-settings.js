if (!window.glowifyObserverInitialized) {
  window.glowifyObserverInitialized = true;

  function updateStyle(css) {
    let styleTag = document.getElementById('glowify-button-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'glowify-button-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css;
  }

  function applyAccent(color) {
    document.documentElement.style.setProperty('--spice-button-active', color);
    document.documentElement.style.setProperty('--glowify-accent', color);
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
    localStorage.setItem('glowify-accent-mode', 'custom');
    localStorage.setItem('glowify-custom-color', color);
  }

  function applyDynamicAccent() {
    const dynamicColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    if (dynamicColor) applyAccent(dynamicColor);
    document.documentElement.style.setProperty('--glowify-dynamic-color', dynamicColor);
    localStorage.setItem('glowify-accent-mode', 'dynamic');
  }

  function resetToDefault() {
    const defaultColor = '#1ed760';
    document.documentElement.style.setProperty('--spice-button-active', defaultColor);
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
    localStorage.setItem('glowify-accent-mode', 'default');
  }

  const savedMode = localStorage.getItem('glowify-accent-mode') || 'default';
  const savedColor = localStorage.getItem('glowify-custom-color') || '#1DB954';

  if (savedMode === 'custom') {
    applyAccent(savedColor);
  } else if (savedMode === 'dynamic') {
    applyDynamicAccent();
  } else {
    resetToDefault();
  }

  if (!window.glowifyDynamicObserver) {
    window.glowifyDynamicObserver = new MutationObserver(() => {
      const mode = localStorage.getItem('glowify-accent-mode');
      if (mode === 'dynamic') applyDynamicAccent();
    });
    window.glowifyDynamicObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });
  }

  const observer = new MutationObserver(() => {
    const menu = document.querySelector('#context-menu');
    if (!menu) return;
    if (menu.querySelector('#glowify-settings-btn')) return;

    const buttons = menu.querySelectorAll('button.main-contextMenu-menuItemButton');
    for (const btn of buttons) {
      const text = btn.textContent.trim();
      if (text === 'Experimental features') {
        const newItem = document.createElement('li');
        newItem.className = 'main-contextMenu-menuItem';
        newItem.innerHTML = `
          <button class="main-contextMenu-menuItemButton" role="menuitem" tabindex="-1" id="glowify-settings-btn">
            <span class="e-91000-text encore-text-body-small ellipsis-one-line main-contextMenu-menuItemLabel" dir="auto">
              Glowify Settings
            </span>
            <div class="Ewi6k41lmVvG1mxXoCx4"></div>
          </button>
        `;
        btn.closest('li').after(newItem);
        document.querySelector('#glowify-settings-btn').addEventListener('click', showGlowifySettingsMenu);
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.showGlowifySettingsMenu = function () {
    const existing = document.querySelector('#glowify-settings-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'glowify-settings-popup';
    popup.innerHTML = `
      <div class="glowify-popup-inner">
        <button id="close-glowify-popup" aria-label="Close settings">
          <svg role="img" height="16" width="16" viewBox="0 0 16 16" class="spotify-x-icon">
            <path d="M1.47 1.47a.75.75 0 0 1 1.06 0L8 6.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L9.06 8l5.47 5.47a.75.75 0 1 1-1.06 1.06L8 9.06l-5.47 5.47a.75.75 0 1 1-1.06-1.06L6.94 8 1.47 2.53a.75.75 0 0 1 0-1.06z"></path>
          </svg>
        </button>

        <h3 style="align-self:center;">Glowify Settings</h3>

        <div class="accent-row">
          <label for="accent-mode">Accent Color:</label>
          <select id="accent-mode">
            <option value="default">Default</option>
            <option value="custom">Custom</option>
            <option value="dynamic">Dynamic</option>
          </select>
          <input type="color" id="accent-picker" value="#1DB954" style="display:none;">
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    const style = document.createElement('style');
    style.id = 'glowify-style';
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
        box-shadow: 0 0 25px 8px var(--accent-color);
        color: white;
        font-family: sans-serif;
        animation: fadeIn 0.6s ease;
        backdrop-filter: blur(2rem);
        width: fit-content;
      }

      .glowify-popup-inner {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        position: relative;
      }

      #close-glowify-popup {
        position: absolute;
        top: 5px;
        right: -9px;
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease, transform 0.15s ease;
      }

      #close-glowify-popup:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      .spotify-x-icon {
        fill: white;
        pointer-events: none;
      }

      .accent-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      #accent-mode {
        flex: 1;
        background: #00000057;
        color: white;
        border: none;
        border-radius: 10px;
        padding: 4px 8px;
        cursor: pointer;
      }

      #accent-picker {
        cursor: pointer;
        border: none;
        border-radius: 10px;
        width: 40px;
        height: 35px;
        background: none;
        transition: all 0.2s ease;
      }

      #accent-picker:focus-visible {
        outline: none;
        border-radius: 20px;
        box-shadow: 0 0 8px 2px var(--accent-color);
      }
    `;
    if (!document.querySelector('#glowify-style')) document.head.appendChild(style);

    const picker = document.getElementById('accent-picker');
    const modeSelect = document.getElementById('accent-mode');

    const currentMode = localStorage.getItem('glowify-accent-mode') || 'default';
    const currentColor = localStorage.getItem('glowify-custom-color') || '#1DB954';
    modeSelect.value = currentMode;
    picker.value = currentColor;
    picker.style.display = currentMode === 'custom' ? 'block' : 'none';

    modeSelect.addEventListener('change', e => {
      const value = e.target.value;
      if (value === 'custom') {
        picker.style.display = 'block';
        applyAccent(picker.value);
      } else if (value === 'dynamic') {
        picker.style.display = 'none';
        applyDynamicAccent();
      } else {
        picker.style.display = 'none';
        resetToDefault();
      }
    });

    picker.addEventListener('input', e => applyAccent(e.target.value));
    document.querySelector('#close-glowify-popup').addEventListener('click', () => popup.remove());
  };
}