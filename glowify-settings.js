"use strict";
(() => {
  // Extensions/_src/react-shim.ts
  function getReact() {
    var _a;
    return ((_a = window == null ? void 0 : window.Spicetify) == null ? void 0 : _a.React) || (window == null ? void 0 : window.React);
  }
  function requireReact() {
    const R2 = getReact();
    if (!R2) throw new Error("Spicetify.React is not ready yet");
    return R2;
  }
  var ReactFacade = {
    // Safe fallbacks during module init
    memo(component, compare) {
      const R2 = getReact();
      return (R2 == null ? void 0 : R2.memo) ? R2.memo(component, compare) : component;
    },
    forwardRef(render) {
      const R2 = getReact();
      return (R2 == null ? void 0 : R2.forwardRef) ? R2.forwardRef(render) : render;
    },
    // Most other APIs are only used at render time; require React then.
    createElement(...args) {
      return requireReact().createElement(...args);
    },
    get Fragment() {
      var _a;
      return ((_a = getReact()) == null ? void 0 : _a.Fragment) || ((props) => props == null ? void 0 : props.children);
    }
  };
  var react_shim_default = ReactFacade;
  function useState(initial) {
    return requireReact().useState(initial);
  }
  function useEffect(effect, deps) {
    return requireReact().useEffect(effect, deps);
  }
  function useLayoutEffect(effect, deps) {
    const R2 = requireReact();
    return (R2.useLayoutEffect || R2.useEffect)(effect, deps);
  }
  function useMemo(factory, deps) {
    return requireReact().useMemo(factory, deps);
  }
  function useRef(initial) {
    return requireReact().useRef(initial);
  }
  function useCallback(fn, deps) {
    return requireReact().useCallback(fn, deps);
  }

  // node_modules/react-colorful/dist/index.mjs
  function u() {
    return (u = Object.assign || function(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = arguments[r];
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }
      return e;
    }).apply(this, arguments);
  }
  function c(e, r) {
    if (null == e) return {};
    var t, n, o = {}, a = Object.keys(e);
    for (n = 0; n < a.length; n++) r.indexOf(t = a[n]) >= 0 || (o[t] = e[t]);
    return o;
  }
  function i(e) {
    var t = useRef(e), n = useRef(function(e2) {
      t.current && t.current(e2);
    });
    return t.current = e, n.current;
  }
  var s = function(e, r, t) {
    return void 0 === r && (r = 0), void 0 === t && (t = 1), e > t ? t : e < r ? r : e;
  };
  var f = function(e) {
    return "touches" in e;
  };
  var v = function(e) {
    return e && e.ownerDocument.defaultView || self;
  };
  var d = function(e, r, t) {
    var n = e.getBoundingClientRect(), o = f(r) ? (function(e2, r2) {
      for (var t2 = 0; t2 < e2.length; t2++) if (e2[t2].identifier === r2) return e2[t2];
      return e2[0];
    })(r.touches, t) : r;
    return { left: s((o.pageX - (n.left + v(e).pageXOffset)) / n.width), top: s((o.pageY - (n.top + v(e).pageYOffset)) / n.height) };
  };
  var h = function(e) {
    !f(e) && e.preventDefault();
  };
  var m = react_shim_default.memo(function(o) {
    var a = o.onMove, l = o.onKey, s2 = c(o, ["onMove", "onKey"]), m2 = useRef(null), g2 = i(a), p2 = i(l), b2 = useRef(null), _2 = useRef(false), x2 = useMemo(function() {
      var e = function(e2) {
        h(e2), (f(e2) ? e2.touches.length > 0 : e2.buttons > 0) && m2.current ? g2(d(m2.current, e2, b2.current)) : t(false);
      }, r = function() {
        return t(false);
      };
      function t(t2) {
        var n = _2.current, o2 = v(m2.current), a2 = t2 ? o2.addEventListener : o2.removeEventListener;
        a2(n ? "touchmove" : "mousemove", e), a2(n ? "touchend" : "mouseup", r);
      }
      return [function(e2) {
        var r2 = e2.nativeEvent, n = m2.current;
        if (n && (h(r2), !(function(e3, r3) {
          return r3 && !f(e3);
        })(r2, _2.current) && n)) {
          if (f(r2)) {
            _2.current = true;
            var o2 = r2.changedTouches || [];
            o2.length && (b2.current = o2[0].identifier);
          }
          n.focus(), g2(d(n, r2, b2.current)), t(true);
        }
      }, function(e2) {
        var r2 = e2.which || e2.keyCode;
        r2 < 37 || r2 > 40 || (e2.preventDefault(), p2({ left: 39 === r2 ? 0.05 : 37 === r2 ? -0.05 : 0, top: 40 === r2 ? 0.05 : 38 === r2 ? -0.05 : 0 }));
      }, t];
    }, [p2, g2]), C2 = x2[0], E = x2[1], H = x2[2];
    return useEffect(function() {
      return H;
    }, [H]), react_shim_default.createElement("div", u({}, s2, { onTouchStart: C2, onMouseDown: C2, className: "react-colorful__interactive", ref: m2, onKeyDown: E, tabIndex: 0, role: "slider" }));
  });
  var g = function(e) {
    return e.filter(Boolean).join(" ");
  };
  var p = function(r) {
    var t = r.color, n = r.left, o = r.top, a = void 0 === o ? 0.5 : o, l = g(["react-colorful__pointer", r.className]);
    return react_shim_default.createElement("div", { className: l, style: { top: 100 * a + "%", left: 100 * n + "%" } }, react_shim_default.createElement("div", { className: "react-colorful__pointer-fill", style: { backgroundColor: t } }));
  };
  var b = function(e, r, t) {
    return void 0 === r && (r = 0), void 0 === t && (t = Math.pow(10, r)), Math.round(t * e) / t;
  };
  var _ = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) };
  var x = function(e) {
    return L(C(e));
  };
  var C = function(e) {
    return "#" === e[0] && (e = e.substring(1)), e.length < 6 ? { r: parseInt(e[0] + e[0], 16), g: parseInt(e[1] + e[1], 16), b: parseInt(e[2] + e[2], 16), a: 4 === e.length ? b(parseInt(e[3] + e[3], 16) / 255, 2) : 1 } : { r: parseInt(e.substring(0, 2), 16), g: parseInt(e.substring(2, 4), 16), b: parseInt(e.substring(4, 6), 16), a: 8 === e.length ? b(parseInt(e.substring(6, 8), 16) / 255, 2) : 1 };
  };
  var w = function(e) {
    return K(I(e));
  };
  var y = function(e) {
    var r = e.s, t = e.v, n = e.a, o = (200 - r) * t / 100;
    return { h: b(e.h), s: b(o > 0 && o < 200 ? r * t / 100 / (o <= 100 ? o : 200 - o) * 100 : 0), l: b(o / 2), a: b(n, 2) };
  };
  var q = function(e) {
    var r = y(e);
    return "hsl(" + r.h + ", " + r.s + "%, " + r.l + "%)";
  };
  var I = function(e) {
    var r = e.h, t = e.s, n = e.v, o = e.a;
    r = r / 360 * 6, t /= 100, n /= 100;
    var a = Math.floor(r), l = n * (1 - t), u2 = n * (1 - (r - a) * t), c2 = n * (1 - (1 - r + a) * t), i2 = a % 6;
    return { r: b(255 * [n, u2, l, l, c2, n][i2]), g: b(255 * [c2, n, n, u2, l, l][i2]), b: b(255 * [l, l, c2, n, n, u2][i2]), a: b(o, 2) };
  };
  var D = function(e) {
    var r = e.toString(16);
    return r.length < 2 ? "0" + r : r;
  };
  var K = function(e) {
    var r = e.r, t = e.g, n = e.b, o = e.a, a = o < 1 ? D(b(255 * o)) : "";
    return "#" + D(r) + D(t) + D(n) + a;
  };
  var L = function(e) {
    var r = e.r, t = e.g, n = e.b, o = e.a, a = Math.max(r, t, n), l = a - Math.min(r, t, n), u2 = l ? a === r ? (t - n) / l : a === t ? 2 + (n - r) / l : 4 + (r - t) / l : 0;
    return { h: b(60 * (u2 < 0 ? u2 + 6 : u2)), s: b(a ? l / a * 100 : 0), v: b(a / 255 * 100), a: o };
  };
  var S = react_shim_default.memo(function(r) {
    var t = r.hue, n = r.onChange, o = g(["react-colorful__hue", r.className]);
    return react_shim_default.createElement("div", { className: o }, react_shim_default.createElement(m, { onMove: function(e) {
      n({ h: 360 * e.left });
    }, onKey: function(e) {
      n({ h: s(t + 360 * e.left, 0, 360) });
    }, "aria-label": "Hue", "aria-valuenow": b(t), "aria-valuemax": "360", "aria-valuemin": "0" }, react_shim_default.createElement(p, { className: "react-colorful__hue-pointer", left: t / 360, color: q({ h: t, s: 100, v: 100, a: 1 }) })));
  });
  var T = react_shim_default.memo(function(r) {
    var t = r.hsva, n = r.onChange, o = { backgroundColor: q({ h: t.h, s: 100, v: 100, a: 1 }) };
    return react_shim_default.createElement("div", { className: "react-colorful__saturation", style: o }, react_shim_default.createElement(m, { onMove: function(e) {
      n({ s: 100 * e.left, v: 100 - 100 * e.top });
    }, onKey: function(e) {
      n({ s: s(t.s + 100 * e.left, 0, 100), v: s(t.v - 100 * e.top, 0, 100) });
    }, "aria-label": "Color", "aria-valuetext": "Saturation " + b(t.s) + "%, Brightness " + b(t.v) + "%" }, react_shim_default.createElement(p, { className: "react-colorful__saturation-pointer", top: 1 - t.v / 100, left: t.s / 100, color: q(t) })));
  });
  var F = function(e, r) {
    if (e === r) return true;
    for (var t in e) if (e[t] !== r[t]) return false;
    return true;
  };
  var X = function(e, r) {
    return e.toLowerCase() === r.toLowerCase() || F(C(e), C(r));
  };
  function Y(e, t, l) {
    var u2 = i(l), c2 = useState(function() {
      return e.toHsva(t);
    }), s2 = c2[0], f2 = c2[1], v2 = useRef({ color: t, hsva: s2 });
    useEffect(function() {
      if (!e.equal(t, v2.current.color)) {
        var r = e.toHsva(t);
        v2.current = { hsva: r, color: t }, f2(r);
      }
    }, [t, e]), useEffect(function() {
      var r;
      F(s2, v2.current.hsva) || e.equal(r = e.fromHsva(s2), v2.current.color) || (v2.current = { hsva: s2, color: r }, u2(r));
    }, [s2, e, u2]);
    var d2 = useCallback(function(e2) {
      f2(function(r) {
        return Object.assign({}, r, e2);
      });
    }, []);
    return [s2, d2];
  }
  var R;
  var V = "undefined" != typeof window ? useLayoutEffect : useEffect;
  var $ = function() {
    return R || ("undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : void 0);
  };
  var J = /* @__PURE__ */ new Map();
  var Q = function(e) {
    V(function() {
      var r = e.current ? e.current.ownerDocument : document;
      if (void 0 !== r && !J.has(r)) {
        var t = r.createElement("style");
        t.innerHTML = `.react-colorful{position:relative;display:flex;flex-direction:column;width:200px;height:200px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.react-colorful__saturation{position:relative;flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))}.react-colorful__alpha-gradient,.react-colorful__pointer-fill{content:"";position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;border-radius:inherit}.react-colorful__alpha-gradient,.react-colorful__saturation{box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}.react-colorful__alpha,.react-colorful__hue{position:relative;height:24px}.react-colorful__hue{background:linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)}.react-colorful__last-control{border-radius:0 0 8px 8px}.react-colorful__interactive{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:inherit;outline:none;touch-action:none}.react-colorful__pointer{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}.react-colorful__interactive:focus .react-colorful__pointer{transform:translate(-50%,-50%) scale(1.1)}.react-colorful__alpha,.react-colorful__alpha-pointer{background-color:#fff;background-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')}.react-colorful__saturation-pointer{z-index:3}.react-colorful__hue-pointer{z-index:2}`, J.set(r, t);
        var n = $();
        n && t.setAttribute("nonce", n), r.head.appendChild(t);
      }
    }, []);
  };
  var U = function(t) {
    var n = t.className, o = t.colorModel, a = t.color, l = void 0 === a ? o.defaultColor : a, i2 = t.onChange, s2 = c(t, ["className", "colorModel", "color", "onChange"]), f2 = useRef(null);
    Q(f2);
    var v2 = Y(o, l, i2), d2 = v2[0], h2 = v2[1], m2 = g(["react-colorful", n]);
    return react_shim_default.createElement("div", u({}, s2, { ref: f2, className: m2 }), react_shim_default.createElement(T, { hsva: d2, onChange: h2 }), react_shim_default.createElement(S, { hue: d2.h, onChange: h2, className: "react-colorful__last-control" }));
  };
  var W = { defaultColor: "000", toHsva: x, fromHsva: function(e) {
    return w({ h: e.h, s: e.s, v: e.v, a: 1 });
  }, equal: X };
  var Z = function(r) {
    return react_shim_default.createElement(U, u({}, r, { colorModel: W }));
  };

  // Extensions/_src/glowify-settings.tsx
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }
  function readLS(key, fallback) {
    const v2 = localStorage.getItem(key);
    return v2 === null || v2 === "" ? fallback : v2;
  }
  function readNum(key, fallback) {
    const raw = localStorage.getItem(key);
    const parsed = raw === null ? NaN : parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function ensureStyleTag(id) {
    let s2 = document.getElementById(id);
    if (!s2) {
      s2 = document.createElement("style");
      s2.id = id;
      document.head.appendChild(s2);
    }
    return s2;
  }
  function updateStyle(id, css) {
    ensureStyleTag(id).textContent = css;
  }
  function getOsName() {
    var _a, _b;
    return (((_b = (_a = Spicetify == null ? void 0 : Spicetify.Platform) == null ? void 0 : _a.PlatformData) == null ? void 0 : _b.os_name) || navigator.platform || "").toString().toLowerCase();
  }
  function isUnixLikeOS() {
    const os = getOsName();
    return os.includes("linux") || os.includes("mac") || os.includes("darwin") || os.includes("osx") || os.includes("macos");
  }
  var lastDynamicColor = null;
  function applyAccent(color) {
    document.documentElement.style.setProperty("--spice-button", color);
    document.documentElement.style.setProperty("--spice-button-active", color);
    document.documentElement.style.setProperty("--background-highlight", color);
    document.documentElement.style.setProperty("--glowify-accent", color);
    const css = `
    .AZ6uIUy8_YPogVERteBi:hover .r9ZhqDYZeNTrb4R4Te8W { fill: ${color} !important; }
    .AZ6uIUy8_YPogVERteBi:hover .t_sZQVE189C6jf_gtE_w { fill: ${color} !important; }
    .e-91000-button-primary:hover .e-91000-button-primary__inner { background-color: ${color} !important; }
    .e-91000-button-primary:active .e-91000-button-primary__inner { background-color: ${color} !important; }
    .encore-dark-theme .encore-inverted-light-set { --background-base: ${color} !important; }
    .LegacyChip__LegacyChipComponent-sc-tzfq94-0:hover > .ChipInnerComponent-sm-selected.ChipInnerComponent-sm-selected { background-color: ${color} !important; }
    .button-module__button___hf2qg_marketplace { background-color: ${color} !important; }
    .custom-playing-bar { fill: ${color} !important; }
    .home-visualizer-bar { fill: ${color} !important; }
  `;
    updateStyle("glowify-button-style", css);
    localStorage.setItem("glowify-accent-mode", "custom");
    localStorage.setItem("glowify-custom-color", color);
  }
  function applyDynamicAccent() {
    const dynamicColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim();
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
    .AZ6uIUy8_YPogVERteBi:hover .r9ZhqDYZeNTrb4R4Te8W { fill: #3be477; }
    .AZ6uIUy8_YPogVERteBi:hover .t_sZQVE189C6jf_gtE_w { fill: #3be477; }
    .e-91000-button-primary:hover .e-91000-button-primary__inner { background-color: #3be477; }
    .e-91000-button-primary:active .e-91000-button-primary__inner { background-color: #3be477; }
    .encore-dark-theme .encore-inverted-light-set { --background-base: #FFFFFF !important; }
    .LegacyChip__LegacyChipComponent-sc-tzfq94-0:hover > .ChipInnerComponent-sm-selected.ChipInnerComponent-sm-selected { background-color: #f0f0f0 !important; }
    .button-module__button___hf2qg_marketplace { background-color: #FFFFFF !important; }
    .custom-playing-bar { fill: #3be477; }
    .home-visualizer-bar { fill: #3be477; }
  `;
    updateStyle("glowify-button-style", css);
    localStorage.setItem("glowify-accent-mode", "dynamic");
    localStorage.removeItem("glowify-custom-color");
  }
  function applyGlowAccent(color) {
    document.documentElement.style.setProperty("--glowify-glow-accent", color);
    localStorage.setItem("glowify-glow-mode", "custom");
    localStorage.setItem("glowify-glow-color", color);
  }
  function resetGlowAccentToDefault() {
    document.documentElement.style.setProperty("--glowify-glow-accent", "var(--accent-color)");
    localStorage.setItem("glowify-glow-mode", "default");
  }
  function applyOutlineAccent(color) {
    document.documentElement.style.setProperty("--glowify-outline-accent", color);
    localStorage.setItem("glowify-outline-mode", "custom");
    localStorage.setItem("glowify-outline-color", color);
  }
  function resetOutlineAccentToDefault() {
    document.documentElement.style.setProperty("--glowify-outline-accent", "var(--accent-color)");
    localStorage.setItem("glowify-outline-mode", "default");
  }
  function ensureOutlineAccentApplied() {
    const mode = localStorage.getItem("glowify-outline-mode") || "default";
    if (mode === "custom") {
      const color = localStorage.getItem("glowify-outline-color") || "#1DB954";
      document.documentElement.style.setProperty("--glowify-outline-accent", color);
    } else {
      document.documentElement.style.setProperty("--glowify-outline-accent", "var(--accent-color)");
    }
  }
  function applyGlowEffectMode(enabled) {
    const mode = enabled ? "on" : "off";
    localStorage.setItem("glowify-glow-effect-mode", mode);
    if (enabled) {
      document.documentElement.classList.remove("glowify-glow-disabled");
    } else {
      document.documentElement.classList.add("glowify-glow-disabled");
    }
    const css = enabled ? `
      .glowifySectionTitle { box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; border: none !important; outline: none !important; }
      .glowifySectionBody { box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; border: none !important; outline: none !important; }
      .glowifyColorSwatch { box-shadow: 0 0 25px 8px var(--glowify-glow-accent) !important; border: none !important; outline: none !important; }
      .glowifyControlSurface { box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; border: none !important; outline: none !important; }
      .glowifySettingsPanel { box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; border: none !important; outline: none !important; }
      .glowifySelectMenu { box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; border: none !important; outline: none !important; }
    ` : `
      .glowifySectionTitle { box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }
      .glowifySectionBody { box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }
      .glowifyControlSurface { box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }
      .glowifySettingsPanel { box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }
      .glowifySelectMenu { box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }
    `;
    updateStyle("glowify-glow-effect-mode", css);
    const playlistHeaderMode = localStorage.getItem("glowify-playlist-header-mode") || "show";
    const playlistShow = playlistHeaderMode === "show";
    let playlistCss;
    if (!playlistShow) {
      playlistCss = `.main-entityHeader-container.gmKBgPCnX785KDicbdJu { backdrop-filter: none !important; box-shadow: none !important; outline: none !important; }`;
    } else if (enabled) {
      playlistCss = `.main-entityHeader-container.gmKBgPCnX785KDicbdJu { backdrop-filter: blur(1rem) !important; box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; outline: none !important; }`;
    } else {
      playlistCss = `.main-entityHeader-container.gmKBgPCnX785KDicbdJu { backdrop-filter: blur(1rem) !important; box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }`;
    }
    updateStyle("glowify-playlist-header-style", playlistCss);
  }
  function ensureGlowEffectModeApplied() {
    const saved = localStorage.getItem("glowify-glow-effect-mode") || "on";
    applyGlowEffectMode(saved === "on");
  }
  async function fileToBase64(file) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  async function applyCustomBackground(file) {
    const img = await fileToBase64(file);
    const tmpImg = new Image();
    tmpImg.src = img;
    await new Promise((r) => {
      tmpImg.onload = () => r();
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const maxW = 1920, maxH = 1080;
    let width = tmpImg.width, height = tmpImg.height;
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
    const qualities = [0.92, 0.85, 0.7, 0.5];
    for (const q2 of qualities) {
      const compressed = canvas.toDataURL("image/jpeg", q2);
      try {
        localStorage.setItem("glowify-bg-image", compressed);
        localStorage.setItem("glowify-bg-mode", "custom");
        updateBackground();
        return;
      } catch (e) {
      }
    }
    console.warn("Image too large for localStorage even at lowest quality");
  }
  async function applyCustomArtistBackground(file) {
    const img = await fileToBase64(file);
    const tmpImg = new Image();
    tmpImg.src = img;
    await new Promise((r) => {
      tmpImg.onload = () => r();
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const maxW = 1920, maxH = 1080;
    let width = tmpImg.width, height = tmpImg.height;
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
    const qualities = [0.92, 0.85, 0.7, 0.5];
    for (const q2 of qualities) {
      const compressed = canvas.toDataURL("image/jpeg", q2);
      try {
        localStorage.setItem("glowify-artist-bg-image", compressed);
        localStorage.setItem("glowify-artist-bg-mode", "custom");
        return;
      } catch (e) {
      }
    }
    console.warn("Image too large for localStorage even at lowest quality");
  }
  function applySavedBackground() {
    const mode = localStorage.getItem("glowify-bg-mode");
    const image = localStorage.getItem("glowify-bg-image");
    const bgUrl = localStorage.getItem("glowify-bg-url");
    const root = document.querySelector(".Root__top-container");
    if (!root) return;
    if (mode === "custom" && image) root.style.setProperty("--image_url", `url("${image}")`);
    else if (mode === "url" && bgUrl) root.style.setProperty("--image_url", `url("${bgUrl}")`);
  }
  function updateBackground() {
    const mode = localStorage.getItem("glowify-bg-mode") || "dynamic";
    const image = localStorage.getItem("glowify-bg-image");
    const bgUrl = localStorage.getItem("glowify-bg-url");
    const root = document.querySelector(".Root__top-container");
    if (!root) return;
    if (mode === "custom" && image) {
      root.style.setProperty("--image_url", `url("${image}")`);
    } else if (mode === "url" && bgUrl) {
      root.style.setProperty("--image_url", `url("${bgUrl}")`);
      window.dispatchEvent(new Event("glowifyBackgroundChange"));
    } else {
      window.dispatchEvent(new Event("glowifyBackgroundChange"));
    }
  }
  function installArtistBackgroundController() {
    const ORIGINALS = /* @__PURE__ */ new WeakMap();
    const ART_SELECTOR = ".XR9tiExSLOuxgWTKxzse";
    const STORAGE_KEY_MODE = "glowify-artist-bg-mode";
    const STORAGE_KEY_CUSTOM = "glowify-artist-bg-image";
    const STORAGE_KEY_URL = "glowify-artist-bg-url";
    const getSavedMode = () => localStorage.getItem(STORAGE_KEY_MODE) || "theme";
    const setSavedMode = (mode) => localStorage.setItem(STORAGE_KEY_MODE, mode);
    const getCustomImage = () => localStorage.getItem(STORAGE_KEY_CUSTOM);
    const getCustomUrl = () => localStorage.getItem(STORAGE_KEY_URL);
    function isArtistPage() {
      try {
        return location && location.pathname && location.pathname.includes("/artist") || !!document.querySelector(ART_SELECTOR);
      } catch (e) {
        return false;
      }
    }
    function getImgElem(el) {
      var _a, _b;
      if (!el) return null;
      if (el.tagName === "IMG") return el;
      return (_b = (_a = el.querySelector) == null ? void 0 : _a.call(el, "img")) != null ? _b : null;
    }
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
        const html = el;
        html.style.backgroundImage = orig.bg || "";
        html.style.backgroundRepeat = "";
        html.style.backgroundSize = "";
        html.style.backgroundPosition = "";
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
          el.style.opacity = "0";
          if (mode === "theme") {
            restoreOriginal(el);
            el.style.opacity = "1";
          } else if (mode === "custom" && customImage) {
            if (img) img.src = customImage;
            else {
              const html = el;
              html.style.backgroundImage = `url("${customImage}")`;
              html.style.backgroundRepeat = "no-repeat";
              html.style.backgroundSize = "cover";
              html.style.backgroundPosition = "center center";
            }
            el.style.opacity = "1";
          } else if (mode === "url") {
            const urlImg = getCustomUrl();
            if (urlImg) {
              if (img) img.src = urlImg;
              else {
                const html = el;
                html.style.backgroundImage = `url("${urlImg}")`;
                html.style.backgroundRepeat = "no-repeat";
                html.style.backgroundSize = "cover";
                html.style.backgroundPosition = "center center";
              }
              el.style.opacity = "1";
            }
          }
        } catch (err) {
          console.warn("applyMode element error", err);
        }
      });
    }
    function applySavedModeIfArtist() {
      if (!isArtistPage()) return;
      applyMode(getSavedMode());
    }
    const bodyObserver = new MutationObserver((mutations) => {
      var _a, _b;
      let artistFound = false;
      for (const m2 of mutations) {
        if (m2.addedNodes && m2.addedNodes.length) {
          for (const n of Array.from(m2.addedNodes)) {
            if (!n || n.nodeType !== 1) continue;
            if (!artistFound && (n.matches && n.matches(ART_SELECTOR) || n.querySelector && n.querySelector(ART_SELECTOR))) {
              artistFound = true;
            }
          }
        }
        if (!artistFound && m2.type === "attributes" && ((_b = (_a = m2.target) == null ? void 0 : _a.matches) == null ? void 0 : _b.call(_a, ART_SELECTOR))) artistFound = true;
      }
      if (artistFound) {
        const obsAny = bodyObserver;
        if (obsAny._debounce) clearTimeout(obsAny._debounce);
        obsAny._debounce = setTimeout(() => {
          applySavedModeIfArtist();
          obsAny._debounce = null;
        }, 60);
      }
    });
    function startObservers() {
      if (!document.body) return false;
      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "src", "class"]
      });
      return true;
    }
    (function hookHistory() {
      const wrap = (fn) => {
        const orig = history[fn];
        history[fn] = function(...args) {
          const res = orig.apply(this, args);
          setTimeout(() => {
            if (isArtistPage()) applySavedModeIfArtist();
          }, 80);
          return res;
        };
      };
      try {
        wrap("pushState");
        wrap("replaceState");
      } catch (e) {
      }
      window.addEventListener("popstate", () => setTimeout(() => isArtistPage() && applySavedModeIfArtist(), 80));
    })();
    (function installBgChangeHandler() {
      const RETRY_COUNT = 4;
      const RETRY_DELAY = 80;
      let debounceTimer = null;
      async function doApplyCustomWithRetries() {
        if (getSavedMode() !== "custom") return;
        if (!isArtistPage()) return;
        for (let i2 = 0; i2 < RETRY_COUNT; i2++) {
          try {
            applyMode("custom");
          } catch (e) {
            console.warn("applyMode(custom) failed", i2, e);
          }
          await sleep(RETRY_DELAY);
        }
      }
      const anyWin = window;
      window.removeEventListener("glowifyBackgroundChange", anyWin._glowifyArtistBgHandler || (() => {
      }));
      anyWin._glowifyArtistBgHandler = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          doApplyCustomWithRetries().catch(console.warn);
          debounceTimer = null;
        }, 60);
      };
      window.addEventListener("glowifyBackgroundChange", anyWin._glowifyArtistBgHandler);
    })();
    (function tryInit() {
      if (!startObservers()) {
        setTimeout(tryInit, 200);
        return;
      }
      if (isArtistPage()) applySavedModeIfArtist();
    })();
    return {
      applyMode,
      applySavedModeIfArtist,
      setMode: (mode) => {
        setSavedMode(mode);
        applySavedModeIfArtist();
      }
    };
  }
  var PLAYER_WIDTH_MODE_KEY = "glowify-player-width";
  var PLAYER_CUSTOM_W_KEY = "glowify-player-custom-width";
  var PLAYER_CUSTOM_H_KEY = "glowify-player-custom-height";
  var DEFAULT_CUSTOM_WIDTH = 80;
  var DEFAULT_CUSTOM_HEIGHT = 88;
  function getPlayerElement() {
    return document.querySelector(".Root__now-playing-bar");
  }
  function applyPlayerWidth(mode) {
    const player = getPlayerElement();
    if (!player) return;
    if (mode === "theme") {
      player.style.width = "65%";
      player.style.margin = "0 auto 5px";
      player.style.height = "";
    } else if (mode === "default") {
      player.style.width = "unset";
      player.style.margin = "calc(var(--panel-gap) * -1)";
      player.style.height = "";
    } else if (mode === "custom") {
      const w2 = parseFloat(localStorage.getItem(PLAYER_CUSTOM_W_KEY) || String(DEFAULT_CUSTOM_WIDTH));
      const h2 = parseInt(localStorage.getItem(PLAYER_CUSTOM_H_KEY) || String(DEFAULT_CUSTOM_HEIGHT), 10);
      player.style.width = Number.isFinite(w2) ? w2 + "%" : DEFAULT_CUSTOM_WIDTH + "%";
      player.style.height = Number.isFinite(h2) ? h2 + "px" : DEFAULT_CUSTOM_HEIGHT + "px";
      player.style.margin = "0 auto 5px";
    }
  }
  function applyPlayerRadius(px) {
    const player = getPlayerElement();
    if (!player) return;
    player.style.borderRadius = px + "px";
    localStorage.setItem("glowify-player-radius", String(px));
  }
  function ensurePlayerApplied() {
    const mode = localStorage.getItem(PLAYER_WIDTH_MODE_KEY) || "theme";
    const radius = parseInt(localStorage.getItem("glowify-player-radius") || "30", 10);
    const player = getPlayerElement();
    if (player) {
      applyPlayerWidth(mode);
      applyPlayerRadius(radius);
      return;
    }
    const obs = new MutationObserver(() => {
      const found = getPlayerElement();
      if (found) {
        applyPlayerWidth(mode);
        applyPlayerRadius(radius);
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
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
    updateStyle("glowify-transparent-controls", css);
    localStorage.setItem("glowify-tc-width", String(width));
    localStorage.setItem("glowify-tc-height", String(height));
  }
  function ensureTransparentControlsApplied() {
    const width = parseInt(localStorage.getItem("glowify-tc-width") || "135", 10);
    const height = parseInt(localStorage.getItem("glowify-tc-height") || "64", 10);
    applyTransparentControls(width, height);
  }
  function updatePlaylistHeaderCss(show) {
    const glowEnabled = localStorage.getItem("glowify-glow-effect-mode") !== "off";
    let css;
    if (!show) {
      css = `.main-entityHeader-container.gmKBgPCnX785KDicbdJu { backdrop-filter: none !important; box-shadow: none !important; outline: none !important; }`;
    } else if (glowEnabled) {
      css = `.main-entityHeader-container.gmKBgPCnX785KDicbdJu { backdrop-filter: blur(1rem) !important; box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)) !important; outline: none !important; }`;
    } else {
      css = `.main-entityHeader-container.gmKBgPCnX785KDicbdJu { backdrop-filter: blur(1rem) !important; box-shadow: none !important; outline: solid 1px var(--glowify-outline-accent, var(--accent-color)) !important; }`;
    }
    updateStyle("glowify-playlist-header-style", css);
  }
  function applyPlaylistHeader(mode) {
    const m2 = mode === "show" ? "show" : "hide";
    localStorage.setItem("glowify-playlist-header-mode", m2);
    updatePlaylistHeaderCss(m2 === "show");
  }
  function applySavedPlaylistHeader() {
    const saved = localStorage.getItem("glowify-playlist-header-mode") || "show";
    updatePlaylistHeaderCss(saved === "show");
  }
  function applyArtistScrollEffect(blur, brightness) {
    localStorage.setItem("liquify-artist-scroll-blur", String(blur));
    localStorage.setItem("liquify-artist-scroll-brightness", String(brightness));
    const style = ensureStyleTag("liquify-artist-scroll-effect");
    const brightnessVal = (brightness / 100).toFixed(2);
    style.textContent = `
@keyframes yPSdY9z6bkI2272drRTw {
  0% {
    filter: blur(0px) brightness(${brightnessVal});
  }
  80% {
    -webkit-transform: scale(2);
    transform: scale(2);
    filter: blur(${blur}px) brightness(${brightnessVal});
  }
}`;
  }
  function ensureArtistScrollEffectApplied() {
    const blur = readNum("liquify-artist-scroll-blur", 15);
    const brightness = readNum("liquify-artist-scroll-brightness", 70);
    applyArtistScrollEffect(blur, brightness);
  }
  function applyBackgroundBlur(px) {
    document.documentElement.style.setProperty("--glowify-bg-blur", px + "px");
    localStorage.setItem("glowify-bg-blur", String(px));
  }
  function ensureBackgroundBlurApplied() {
    const saved = parseInt(localStorage.getItem("glowify-bg-blur") || "7", 10);
    applyBackgroundBlur(saved);
  }
  function applyBackgroundBrightness(percent) {
    document.documentElement.style.setProperty("--glowify-bg-brightness", percent + "%");
    localStorage.setItem("glowify-bg-brightness", String(percent));
  }
  function ensureBackgroundBrightnessApplied() {
    const saved = parseInt(localStorage.getItem("glowify-bg-brightness") || "45", 10);
    applyBackgroundBrightness(saved);
  }
  function installPlaylistIndicatorVisualizer() {
    (async function() {
      var _a;
      while (!(Spicetify == null ? void 0 : Spicetify.Player) || !((_a = Spicetify == null ? void 0 : Spicetify.Player) == null ? void 0 : _a.data)) await sleep(300);
      let lastSvg = null;
      let lastIndicator = null;
      function createBars(indicator) {
        if (lastSvg) {
          try {
            lastSvg.remove();
          } catch (e) {
          }
          lastSvg = null;
        }
        if (!indicator || !indicator.parentNode) return;
        const parent = indicator.parentNode;
        const rectHeight = parent.offsetHeight || 20;
        const bottom = rectHeight - 2;
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", String(rectHeight));
        svg.style.position = "absolute";
        svg.style.left = "0px";
        svg.style.top = "0px";
        svg.style.pointerEvents = "none";
        const bars = [];
        const speeds = [];
        const phases = [];
        for (let i2 = 0; i2 < 4; i2++) {
          const bar = document.createElementNS(svgNS, "rect");
          bar.setAttribute("x", String(i2 * 4));
          bar.setAttribute("width", "3");
          bar.setAttribute("y", String(bottom - 4));
          bar.setAttribute("height", "4");
          bar.classList.add("custom-playing-bar");
          svg.appendChild(bar);
          bars.push(bar);
          speeds.push(7e-3 + Math.random() * 6e-3);
          phases.push(Math.random() * Math.PI * 2);
        }
        parent.insertBefore(svg, indicator);
        lastSvg = svg;
        lastIndicator = indicator;
        const start = performance.now();
        function animate() {
          var _a2;
          if (!lastSvg || !lastIndicator) return;
          const parentNode = lastIndicator.parentNode;
          if (!parentNode) {
            try {
              lastSvg.remove();
            } catch (e) {
            }
            lastSvg = null;
            lastIndicator = null;
            return;
          }
          const playButton = (_a2 = parentNode.querySelector) == null ? void 0 : _a2.call(parentNode, ".main-trackList-rowImagePlayButton");
          const isPlaying = Spicetify.Player.isPlaying() && (!playButton || window.getComputedStyle(playButton).opacity === "0");
          if (!isPlaying) {
            try {
              lastSvg.remove();
            } catch (e) {
            }
            lastSvg = null;
            lastIndicator = null;
            return;
          }
          const now = performance.now();
          const t = now - start;
          const currentRectHeight = parentNode.offsetHeight || rectHeight;
          const maxHeight = currentRectHeight * 0.7;
          const minHeight = 3;
          const bottomNow = currentRectHeight - 2;
          lastSvg.setAttribute("height", String(currentRectHeight));
          bars.forEach((bar, i2) => {
            const height = minHeight + (Math.sin(t * speeds[i2] + phases[i2]) + 1) / 2 * (maxHeight - minHeight);
            bar.setAttribute("height", String(height));
            bar.setAttribute("y", String(bottomNow - height));
          });
          requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }
      async function updateIndicator() {
        var _a2;
        const indicator = document.querySelector(
          ".X_HqPouENflGygaUXNus:not([style*='display: none']), [data-playing-indicator]:not([style*='display: none'])"
        );
        if (!indicator) {
          if (lastSvg) {
            try {
              lastSvg.remove();
            } catch (e) {
            }
            lastSvg = null;
            lastIndicator = null;
          }
          return false;
        }
        if (!indicator.parentNode) {
          if (lastSvg) {
            try {
              lastSvg.remove();
            } catch (e) {
            }
            lastSvg = null;
            lastIndicator = null;
          }
          return false;
        }
        const parentNode = indicator.parentNode;
        const playButton = (_a2 = parentNode.querySelector) == null ? void 0 : _a2.call(parentNode, ".main-trackList-rowImagePlayButton");
        const isPlaying = Spicetify.Player.isPlaying() && (!playButton || window.getComputedStyle(playButton).opacity === "0");
        if (lastSvg && !isPlaying) {
          try {
            lastSvg.remove();
          } catch (e) {
          }
          lastSvg = null;
          lastIndicator = null;
        }
        if (indicator !== lastIndicator) createBars(indicator);
        return true;
      }
      Spicetify.Player.addEventListener("songchange", () => {
        if (lastSvg) {
          try {
            lastSvg.remove();
          } catch (e) {
          }
          lastSvg = null;
          lastIndicator = null;
        }
        void updateIndicator();
      });
      setInterval(() => void updateIndicator(), 100);
    })();
  }
  function installHomeScreenVisualizer() {
    (function() {
      const homeSvgs = /* @__PURE__ */ new Map();
      const svgNS = "http://www.w3.org/2000/svg";
      let wasPlaying = false;
      function createHomeVisualizer(img) {
        if (homeSvgs.has(img)) return;
        const parent = img.parentNode;
        if (!parent) return;
        parent.style.setProperty("position", "relative", "important");
        const rectHeight = parent.offsetHeight || 20;
        const bottom = rectHeight - 2;
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", String(rectHeight));
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "999999";
        svg.style.position = "absolute";
        const bars = [];
        for (let i2 = 0; i2 < 4; i2++) {
          const bar = document.createElementNS(svgNS, "rect");
          bar.setAttribute("x", String(i2 * 4));
          bar.setAttribute("width", "3");
          bar.setAttribute("y", String(bottom - 4));
          bar.setAttribute("height", "4");
          bar.classList.add("home-visualizer-bar");
          svg.appendChild(bar);
          bars.push({
            element: bar,
            speed: 7e-3 + Math.random() * 6e-3,
            phase: Math.random() * Math.PI * 2
          });
        }
        parent.appendChild(svg);
        img.style.display = "none";
        homeSvgs.set(img, { svg, bars, rectHeight, bottom, parent });
      }
      function updateHomeScreenVisualizer() {
        document.querySelectorAll("img.H70qcBekoGWOlskuON5R").forEach((img) => {
          const im = img;
          if (im.style.display !== "none") createHomeVisualizer(im);
        });
      }
      const homeObserver = new MutationObserver(() => updateHomeScreenVisualizer());
      homeObserver.observe(document.body, { childList: true, subtree: true });
      const start = performance.now();
      function animate() {
        var _a, _b, _c;
        const t = performance.now() - start;
        for (const [img, data] of homeSvgs.entries()) {
          if (!document.body.contains(data.svg)) {
            homeSvgs.delete(img);
            continue;
          }
          const rectHeight = data.parent.offsetHeight || 20;
          const bottom = rectHeight - 2;
          data.svg.setAttribute("height", String(rectHeight));
          const shortcut = (_b = (_a = data.svg).closest) == null ? void 0 : _b.call(_a, ".view-homeShortcutsGrid-shortcut");
          try {
            data.svg.style.display = shortcut && ((_c = shortcut.matches) == null ? void 0 : _c.call(shortcut, ":hover")) ? "none" : "block";
          } catch (e) {
            data.svg.style.display = "block";
          }
          data.bars.forEach((barData) => {
            const maxHeight = rectHeight * 0.7;
            const minHeight = 3;
            const height = minHeight + (Math.sin(t * barData.speed + barData.phase) + 1) / 2 * (maxHeight - minHeight);
            barData.element.setAttribute("height", String(height));
            barData.element.setAttribute("y", String(bottom - height));
          });
        }
        requestAnimationFrame(animate);
      }
      animate();
      updateHomeScreenVisualizer();
      Spicetify.Player.addEventListener("onplaypause", () => {
        var _a;
        const isPlaying = Spicetify.Player.isPlaying();
        if (wasPlaying && !isPlaying) {
          for (const [, data] of homeSvgs.entries()) {
            try {
              (_a = data.svg) == null ? void 0 : _a.remove();
            } catch (e) {
            }
          }
          homeSvgs.clear();
        }
        if (!wasPlaying && isPlaying) {
          updateHomeScreenVisualizer();
        }
        wasPlaying = isPlaying;
      });
    })();
  }
  function installLyricsTranslator() {
    var _a, _b;
    const STORAGE_KEY = "glowify-lyrics-mode";
    const CACHE = /* @__PURE__ */ new Map();
    const RESOLVED = /* @__PURE__ */ new Map();
    const LANG = (((_b = (_a = Spicetify == null ? void 0 : Spicetify.Platform) == null ? void 0 : _a.Session) == null ? void 0 : _b.locale) || navigator.language || "en").split("-")[0];
    let mode = localStorage.getItem(STORAGE_KEY) || "romanization";
    const getFlags = (m2) => {
      const showTranslation = m2 === "translation" || m2 === "both";
      const showRoman = m2 === "romanization" || m2 === "both";
      return { showTranslation, showRoman };
    };
    let wanakanaLoadPromise = null;
    const ensureWanakana = async () => {
      const anyWin = window;
      if (anyWin.wanakana) return true;
      if (wanakanaLoadPromise) return wanakanaLoadPromise;
      wanakanaLoadPromise = new Promise((resolve) => {
        const s2 = document.createElement("script");
        s2.src = "https://cdn.jsdelivr.net/npm/wanakana@4.0.2/umd/wanakana.min.js";
        s2.onload = () => resolve(true);
        s2.onerror = () => resolve(false);
        document.head.appendChild(s2);
      });
      return wanakanaLoadPromise;
    };
    const extractGoogleRomanization = (d2) => {
      const parts = Array.isArray(d2 == null ? void 0 : d2[0]) ? d2[0] : [];
      for (const part of parts) {
        if (!Array.isArray(part) || part.length < 4) continue;
        const candidate = part[3];
        if (part[0] == null && part[1] == null && part[2] == null && typeof candidate === "string" && candidate.trim()) {
          return candidate;
        }
      }
      return "";
    };
    const stripCjk = (s2) => {
      if (!s2) return "";
      return String(s2).replace(/[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g, "").replace(/[\u3040-\u30FF\u31F0-\u31FF\uFF65-\uFF9F]/g, "").replace(/\s+/g, " ").trim();
    };
    const translate = async (text) => {
      if (text.includes("\u266A")) return { translated: text, detected: LANG, roman: "" };
      if (!CACHE.has(text)) {
        CACHE.set(
          text,
          (async () => {
            try {
              const { showTranslation, showRoman } = getFlags(mode);
              const dt = [];
              if (showTranslation) dt.push("t");
              else dt.push("t");
              if (showRoman) dt.push("rm");
              const dtQuery = dt.map((x2) => `dt=${x2}`).join("&");
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${LANG}&${dtQuery}&q=${encodeURIComponent(
                text
              )}`;
              const r = await fetch(url);
              const d2 = await r.json();
              const detectedLang = (typeof (d2 == null ? void 0 : d2[2]) === "string" ? d2[2] : typeof (d2 == null ? void 0 : d2[1]) === "string" ? d2[1] : LANG) || LANG;
              const translated = showTranslation && Array.isArray(d2 == null ? void 0 : d2[0]) ? d2[0].map((x2) => {
                var _a2;
                return (_a2 = x2 == null ? void 0 : x2[0]) != null ? _a2 : "";
              }).join("") : text;
              let roman = "";
              if (showRoman) {
                const detectedLc = String(detectedLang).toLowerCase();
                if (detectedLc.startsWith("ja")) {
                  roman = stripCjk(extractGoogleRomanization(d2));
                  if (!roman) {
                    await ensureWanakana();
                    const anyWin = window;
                    if (anyWin.wanakana) roman = stripCjk(anyWin.wanakana.toRomaji(text));
                  }
                } else if (detectedLc.startsWith("zh")) {
                  roman = stripCjk(extractGoogleRomanization(d2));
                }
              }
              const result = { translated, detected: detectedLang, roman };
              RESOLVED.set(text, result);
              return result;
            } catch (e) {
              console.error("Translate failed:", e);
              return { translated: text, detected: LANG, roman: "" };
            }
          })()
        );
      }
      return CACHE.get(text);
    };
    const removeAllContainers = () => {
      try {
        document.querySelectorAll(".sp-lyric-translation").forEach((el) => el.remove());
      } catch (e) {
      }
    };
    const applyToContainer = (container, translated, detected, roman) => {
      const { showTranslation, showRoman } = getFlags(mode);
      const detectedLc = String(detected || "").toLowerCase();
      const tEl = container.querySelector(".sp-lyric-translation-text");
      const rEl = container.querySelector(".sp-lyric-translation-roman");
      if (tEl) tEl.innerText = showTranslation && detectedLc !== LANG.toLowerCase() ? translated || "" : "";
      if (rEl) rEl.innerText = showRoman ? roman || "" : "";
      if (tEl) tEl.style.display = showTranslation && detectedLc !== LANG.toLowerCase() ? "block" : "none";
      if (rEl) rEl.style.display = showRoman && !!(roman || "").trim() ? "block" : "none";
      const anyVisible = tEl && tEl.style.display !== "none" && !!tEl.innerText.trim() || rEl && rEl.style.display !== "none" && !!rEl.innerText.trim();
      container.style.display = anyVisible ? "block" : "none";
    };
    let observer = null;
    let processing = false;
    let rerunRequested = false;
    let scheduled = false;
    const processLyrics = async () => {
      if (mode === "off") return;
      if (processing) {
        rerunRequested = true;
        return;
      }
      processing = true;
      const { showTranslation, showRoman } = getFlags(mode);
      const parents = document.querySelectorAll(".lyrics-lyricsContent-lyric");
      const jobs = [];
      for (const parent of Array.from(parents)) {
        const textEl = parent.querySelector(".lyrics-lyricsContent-text");
        if (!textEl) continue;
        const text = (textEl.textContent || "").trim();
        if (!text) continue;
        if (text.includes("\u266A")) {
          const existing = parent.querySelector(".sp-lyric-translation");
          if (existing) {
            try {
              existing.remove();
            } catch (e) {
            }
          }
          continue;
        }
        let container = parent.querySelector(".sp-lyric-translation");
        if (!container) {
          container = document.createElement("div");
          container.className = "sp-lyric-translation";
          container.setAttribute("aria-hidden", "true");
          container.style.display = "none";
          const tspan = document.createElement("div");
          tspan.className = "sp-lyric-translation-text";
          Object.assign(tspan.style, {
            fontSize: "0.65em",
            lineHeight: "1.1em",
            marginTop: "2px",
            pointerEvents: "none",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          });
          const rspan = document.createElement("div");
          rspan.className = "sp-lyric-translation-roman";
          Object.assign(rspan.style, {
            fontSize: "0.55em",
            lineHeight: "1em",
            marginTop: "2px",
            pointerEvents: "none",
            fontStyle: "italic",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          });
          container.appendChild(tspan);
          container.appendChild(rspan);
          parent.appendChild(container);
        }
        const active = parent.classList.contains("lyrics-lyricsContent-active");
        const color = active ? "var(--lyrics-color-active)" : "var(--lyrics-color-inactive)";
        const tEl = container.querySelector(".sp-lyric-translation-text");
        const rEl = container.querySelector(".sp-lyric-translation-roman");
        if (tEl) tEl.style.color = color;
        if (rEl) rEl.style.color = color;
        if (!showTranslation && !showRoman) {
          container.style.display = "none";
          continue;
        }
        if (!container.dataset.translated) {
          const cached = RESOLVED.get(text);
          if (cached) {
            applyToContainer(container, cached.translated, cached.detected, cached.roman);
            container.dataset.translated = "1";
            container.dataset.detected = cached.detected || "";
          }
        }
        if (!container.dataset.translated && !container.dataset.translating) {
          container.dataset.translating = "1";
          jobs.push(
            (async () => {
              const { translated, detected, roman } = await translate(text);
              applyToContainer(container, translated, detected, roman);
              container.dataset.translated = "1";
              container.dataset.detected = detected || "";
              delete container.dataset.translating;
            })()
          );
        }
      }
      await Promise.all(jobs.map((p2) => p2.then(() => null, () => null)));
      processing = false;
      if (rerunRequested) {
        rerunRequested = false;
        scheduleProcessLyrics();
      }
    };
    const scheduleProcessLyrics = () => {
      if (mode === "off") return;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        void processLyrics();
      });
    };
    const start = () => {
      if (observer) return;
      observer = new MutationObserver(() => scheduleProcessLyrics());
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
      scheduleProcessLyrics();
    };
    const stop = () => {
      try {
        observer == null ? void 0 : observer.disconnect();
      } catch (e) {
      }
      observer = null;
      processing = false;
      rerunRequested = false;
      scheduled = false;
      removeAllContainers();
    };
    const setMode = (next) => {
      const prev = mode;
      mode = next;
      if (prev !== next) {
        CACHE.clear();
        RESOLVED.clear();
      }
      localStorage.setItem(STORAGE_KEY, next);
      if (next === "off") stop();
      else {
        try {
          document.querySelectorAll(".sp-lyric-translation").forEach((el) => {
            delete el.dataset.translated;
            delete el.dataset.translating;
          });
        } catch (e) {
        }
        start();
        scheduleProcessLyrics();
      }
    };
    if (mode !== "off") start();
    window.addEventListener("glowifyLyricsModeChange", () => {
      const next = localStorage.getItem(STORAGE_KEY) || "romanization";
      setMode(next);
    });
    return { setMode, start, stop, getMode: () => mode };
  }
  var CCA_ENABLED_KEY = "glowify-comfy-cover-enabled";
  var CCA_WIDTH_KEY = "glowify-comfy-cover-width";
  var CCA_HEIGHT_KEY = "glowify-comfy-cover-height";
  var CCA_MARGIN_BOTTOM_KEY = "glowify-comfy-cover-mb";
  var CCA_MARGIN_LEFT_KEY = "glowify-comfy-cover-ml";
  var CCA_BORDER_RADIUS_KEY = "glowify-comfy-cover-br";
  var CCA_DEFAULTS = {
    enabled: "hide",
    width: 90,
    height: 90,
    marginBottom: 35,
    marginLeft: 0,
    borderRadius: 8
  };
  function applyComfyCoverArt() {
    const enabled = readLS(CCA_ENABLED_KEY, CCA_DEFAULTS.enabled);
    const br2 = readNum(CCA_BORDER_RADIUS_KEY, CCA_DEFAULTS.borderRadius);
    const radiusCss = `
    :root .Root__top-container .main-nowPlayingWidget-nowPlaying .main-coverSlotCollapsed-container .cover-art,
    :root .Root__top-container .main-nowPlayingWidget-nowPlaying .main-coverSlotCollapsed-container .VideoPlayer__container video {
      border-radius: ${br2}px !important;
    }
    .sb59T76Xcd92L_RhBcdz {
      border-radius: ${br2}px !important;
    }
  `;
    if (enabled === "hide") {
      updateStyle("glowify-comfy-cover-art", radiusCss);
      return;
    }
    const w2 = readNum(CCA_WIDTH_KEY, CCA_DEFAULTS.width);
    const h2 = readNum(CCA_HEIGHT_KEY, CCA_DEFAULTS.height);
    const mb = readNum(CCA_MARGIN_BOTTOM_KEY, CCA_DEFAULTS.marginBottom);
    const ml = readNum(CCA_MARGIN_LEFT_KEY, CCA_DEFAULTS.marginLeft);
    const css = `
    :root .Root__top-container .main-nowPlayingWidget-nowPlaying .main-coverSlotCollapsed-container .cover-art,
    :root .Root__top-container .main-nowPlayingWidget-nowPlaying .main-coverSlotCollapsed-container .VideoPlayer__container video {
      width: ${w2}px !important;
      height: ${h2}px !important;
      overflow: hidden;
      object-fit: cover;
      max-height: none;
      max-width: none;
      border-radius: ${br2}px !important;
    }
    .sb59T76Xcd92L_RhBcdz {
      margin-bottom: ${mb}px !important;
      margin-left: ${ml}px !important;
      border-radius: ${br2}px !important;
    }
  `;
    updateStyle("glowify-comfy-cover-art", css);
  }
  function ensureComfyCoverArtApplied() {
    applyComfyCoverArt();
  }
  function installLyricsEnhancer() {
    var _a, _b;
    const anyWin = window;
    function tryClick() {
      let tries = 0;
      if (anyWin.__glowifyMehrTimer) clearInterval(anyWin.__glowifyMehrTimer);
      anyWin.__glowifyMehrTimer = setInterval(() => {
        tries++;
        const btn = document.querySelector('.lmcItfTROIyVIjVB6cEd .WbexwvjWsOToCJbeUN_j button[data-encore-id="buttonPrimary"]');
        if (btn) {
          btn.click();
          clearInterval(anyWin.__glowifyMehrTimer);
          anyWin.__glowifyMehrTimer = null;
          return;
        }
        if (tries >= 20) {
          clearInterval(anyWin.__glowifyMehrTimer);
          anyWin.__glowifyMehrTimer = null;
        }
      }, 500);
    }
    if (anyWin.__glowifyMehrCb) {
      (_b = (_a = Spicetify.Player).removeEventListener) == null ? void 0 : _b.call(_a, "songchange", anyWin.__glowifyMehrCb);
    }
    anyWin.__glowifyMehrCb = () => setTimeout(tryClick, 10);
    Spicetify.Player.addEventListener("songchange", anyWin.__glowifyMehrCb);
    tryClick();
  }
  var NSC_KEYS = {
    show: "theme-nsc-show",
    position: "theme-nsc-position",
    height: "theme-nsc-height",
    maxWidth: "theme-nsc-max-width",
    gap: "theme-nsc-gap",
    coverSize: "theme-nsc-cover-size",
    hpad: "theme-nsc-hpad",
    vpad: "theme-nsc-vpad",
    gapPlayer: "theme-nsc-gap-player",
    borderRadius: "theme-nsc-border-radius",
    coverRadius: "theme-nsc-cover-radius"
  };
  var NSC_DEFAULTS = {
    show: "show",
    position: "left",
    height: 80,
    maxWidth: 256,
    gap: 10,
    coverSize: 55,
    hpad: 10,
    vpad: 8,
    gapPlayer: 7,
    borderRadius: 20,
    coverRadius: 12
  };
  function fireNscUpdate() {
    window.dispatchEvent(new Event("nsc-settings-changed"));
  }
  function installNextSongCard() {
    let cardEl = null;
    let nscStyleEl = null;
    let nscScrollStyleEl = null;
    let nscLastScrollTitle = "";
    let nscScrollTimer = null;
    function getNextTrack() {
      var _a, _b, _c;
      try {
        const queue = (_a = Spicetify == null ? void 0 : Spicetify.Queue) == null ? void 0 : _a.nextTracks;
        if (!queue || queue.length === 0) return null;
        for (const item of queue) {
          const uri = ((_b = item == null ? void 0 : item.contextTrack) == null ? void 0 : _b.uri) || (item == null ? void 0 : item.uri) || "";
          if (uri && uri.startsWith("spotify:track:")) {
            const meta = ((_c = item == null ? void 0 : item.contextTrack) == null ? void 0 : _c.metadata) || (item == null ? void 0 : item.metadata) || {};
            const trackId = uri.split(":").pop() || "";
            const artists = [];
            for (let i2 = 0; ; i2++) {
              const nameKey = i2 === 0 ? "artist_name" : `artist_name:${i2}`;
              const uriKey = i2 === 0 ? "artist_uri" : `artist_uri:${i2}`;
              const name = meta[nameKey];
              if (!name) break;
              const aUri = meta[uriKey] || "";
              const id = aUri ? aUri.split(":").pop() || "" : "";
              artists.push({ name, id });
            }
            if (artists.length === 0) {
              artists.push({ name: meta.artist_name || "Unknown", id: "" });
            }
            return {
              title: meta.title || "Unknown",
              artists,
              image: (meta.image_url || meta["image_url"] || "").replace("spotify:image:", "https://i.scdn.co/image/"),
              trackId
            };
          }
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    function ensureNscStyle() {
      if (nscStyleEl) return nscStyleEl;
      nscStyleEl = document.createElement("style");
      nscStyleEl.id = "glowify-nsc-style";
      document.head.appendChild(nscStyleEl);
      return nscStyleEl;
    }
    function buildNscCSS() {
      const h2 = readNum(NSC_KEYS.height, NSC_DEFAULTS.height);
      const mw = readNum(NSC_KEYS.maxWidth, NSC_DEFAULTS.maxWidth);
      const g2 = readNum(NSC_KEYS.gap, NSC_DEFAULTS.gap);
      const cs = readNum(NSC_KEYS.coverSize, NSC_DEFAULTS.coverSize);
      const hp = readNum(NSC_KEYS.hpad, NSC_DEFAULTS.hpad);
      const vp = readNum(NSC_KEYS.vpad, NSC_DEFAULTS.vpad);
      const gp = readNum(NSC_KEYS.gapPlayer, NSC_DEFAULTS.gapPlayer);
      const tw = mw - cs - g2 - hp * 2;
      const br = readNum(NSC_KEYS.borderRadius, NSC_DEFAULTS.borderRadius);
      const pos = readLS(NSC_KEYS.position, NSC_DEFAULTS.position);
      const playerBar = document.querySelector(".Root__now-playing-bar") || document.querySelector(".main-nowPlayingBar-nowPlayingBar") || document.querySelector("footer");
      const pbRect = playerBar ? playerBar.getBoundingClientRect() : null;
      const bottom = pbRect ? window.innerHeight - pbRect.top + gp : 72 + gp;
      const leftPos = pbRect ? pbRect.left : 0;
      const rightPos = pbRect ? window.innerWidth - pbRect.right : 0;
      return `
      #glowify-nsc {
        position: fixed;
        bottom: ${bottom}px;
        ${pos === "left" ? `left: ${leftPos}px;` : `right: ${rightPos}px;`}
        z-index: 9999;
        width: fit-content;
        max-width: ${mw}px;
        height: ${h2}px;
        padding: ${vp}px ${hp}px;
        border-radius: ${br}px;
        background: transparent;
        backdrop-filter: blur(2rem);
        -webkit-backdrop-filter: blur(2rem);
        box-shadow: 0 0 20px 6px var(--glowify-glow-accent, var(--accent-color, rgba(30,215,96,0.35)));
        display: flex;
        align-items: center;
        gap: ${g2}px;
        color: #fff;
        pointer-events: auto;
        transition: opacity 0.4s ease, width 0.5s ease, bottom 0.25s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease;
        overflow: hidden;
      }
      #glowify-nsc-cover {
        width: ${cs}px;
        height: ${cs}px;
        border-radius: ${readNum(NSC_KEYS.coverRadius, NSC_DEFAULTS.coverRadius)}px;
        object-fit: cover;
        flex-shrink: 0;
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      #glowify-nsc-cover:hover { transform: scale(1.05); opacity: 0.85; }
      #glowify-nsc-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        min-width: 0;
        max-width: ${tw}px;
        position: relative;
      }
      #glowify-nsc-title-wrap {
        overflow: hidden;
        max-width: ${tw}px;
        position: relative;
      }
      #glowify-nsc-title-wrap.has-scroll {
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8px, #000 calc(100% - 8px), transparent 100%);
        mask-image: linear-gradient(90deg, transparent 0, #000 8px, #000 calc(100% - 8px), transparent 100%);
      }
      #glowify-nsc-title-track {
        display: inline-block;
        white-space: nowrap;
      }
      .glowify-nsc-title-item {
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        display: inline;
        cursor: pointer;
      }
      .glowify-nsc-title-item:hover { text-decoration: underline; }
      .glowify-nsc-title-spacer {
        display: none;
        width: 3em;
      }
      #glowify-nsc-title-track.scrolling .glowify-nsc-title-spacer { display: inline-block; }
      #glowify-nsc-title-track.scrolling #glowify-nsc-title-b { display: inline; }
      #glowify-nsc-title-b { display: none; }
      #glowify-nsc-artist {
        font-size: 11px;
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #glowify-nsc-artist a {
        color: inherit;
        text-decoration: none;
        cursor: pointer;
      }
      #glowify-nsc-artist a:hover { text-decoration: underline; opacity: 1; }
    `;
    }
    function createCard() {
      if (cardEl) return;
      cardEl = document.createElement("div");
      cardEl.id = "glowify-nsc";
      cardEl.innerHTML = `
      <img id="glowify-nsc-cover" src="" alt="" />
      <div id="glowify-nsc-text">
        <div id="glowify-nsc-title-wrap">
          <div id="glowify-nsc-title-track">
            <span class="glowify-nsc-title-item" id="glowify-nsc-title-a"></span><span class="glowify-nsc-title-spacer"></span><span class="glowify-nsc-title-item" id="glowify-nsc-title-b"></span>
          </div>
        </div>
        <div id="glowify-nsc-artist"></div>
      </div>
    `;
      document.body.appendChild(cardEl);
    }
    function updateCard() {
      const show = readLS(NSC_KEYS.show, NSC_DEFAULTS.show);
      if (show !== "show") {
        if (cardEl) cardEl.style.display = "none";
        ensureNscStyle().textContent = "";
        return;
      }
      const next = getNextTrack();
      if (!next) {
        if (cardEl) cardEl.style.display = "none";
        return;
      }
      createCard();
      ensureNscStyle().textContent = buildNscCSS();
      const coverImg = cardEl.querySelector("#glowify-nsc-cover");
      const titleA = cardEl.querySelector("#glowify-nsc-title-a");
      const titleB = cardEl.querySelector("#glowify-nsc-title-b");
      const artistEl = cardEl.querySelector("#glowify-nsc-artist");
      if (coverImg) {
        coverImg.src = next.image || "";
        coverImg.onclick = next.trackId ? () => Spicetify.Platform.History.push("/track/" + next.trackId) : null;
      }
      const navToTrack = next.trackId ? () => Spicetify.Platform.History.push("/track/" + next.trackId) : null;
      if (titleA) {
        titleA.textContent = next.title;
        titleA.onclick = navToTrack;
      }
      if (titleB) {
        titleB.textContent = next.title;
        titleB.onclick = navToTrack;
      }
      if (artistEl) {
        artistEl.innerHTML = "";
        next.artists.forEach((a, i2) => {
          if (i2 > 0) artistEl.appendChild(document.createTextNode(", "));
          const link = document.createElement("a");
          link.textContent = a.name;
          if (a.id) link.onclick = (e) => {
            e.stopPropagation();
            Spicetify.Platform.History.push("/artist/" + a.id);
          };
          artistEl.appendChild(link);
        });
      }
      cardEl.style.display = "flex";
      const track = cardEl.querySelector("#glowify-nsc-title-track");
      const wrap = cardEl.querySelector("#glowify-nsc-title-wrap");
      if (track && wrap) {
        if (next.title === nscLastScrollTitle && track.classList.contains("scrolling")) {
          return;
        }
        track.classList.remove("scrolling");
        wrap.classList.remove("has-scroll");
        track.style.animation = "none";
        if (nscScrollStyleEl) nscScrollStyleEl.textContent = "";
        nscLastScrollTitle = "";
        const prevSpacer = cardEl.querySelector(".glowify-nsc-title-spacer");
        const prevB = cardEl.querySelector("#glowify-nsc-title-b");
        if (prevSpacer) prevSpacer.style.display = "";
        if (prevB) prevB.style.display = "";
        if (nscScrollTimer) {
          clearTimeout(nscScrollTimer);
          nscScrollTimer = null;
        }
        nscScrollTimer = setTimeout(() => {
          nscScrollTimer = null;
          if (!cardEl || cardEl.style.display === "none") return;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const titleAEl = cardEl.querySelector("#glowify-nsc-title-a");
              const spacerEl = cardEl.querySelector(".glowify-nsc-title-spacer");
              if (!titleAEl) return;
              const bEl = cardEl.querySelector("#glowify-nsc-title-b");
              if (spacerEl) spacerEl.style.display = "inline-block";
              if (bEl) bEl.style.display = "inline";
              const oneTitle = titleAEl.offsetWidth;
              const spacerW = spacerEl ? spacerEl.offsetWidth : 0;
              const scrollDist = oneTitle + spacerW;
              const containerW = wrap.offsetWidth;
              if (oneTitle > containerW) {
                if (!nscScrollStyleEl) {
                  nscScrollStyleEl = document.createElement("style");
                  nscScrollStyleEl.id = "glowify-nsc-scroll-kf";
                  document.head.appendChild(nscScrollStyleEl);
                }
                const dur = scrollDist / 25;
                nscScrollStyleEl.textContent = `
              @keyframes glowify-nsc-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-${scrollDist}px); }
              }
            `;
                track.style.animation = `glowify-nsc-scroll ${dur}s linear infinite`;
                track.classList.add("scrolling");
                wrap.classList.add("has-scroll");
                nscLastScrollTitle = next.title;
              } else {
                if (spacerEl) spacerEl.style.display = "";
                if (bEl) bEl.style.display = "";
              }
            });
          });
        }, 250);
      }
    }
    (async function nscInit() {
      while (!(Spicetify == null ? void 0 : Spicetify.Player) || !(Spicetify == null ? void 0 : Spicetify.Queue)) {
        await sleep(300);
      }
      let bar = null;
      for (let i2 = 0; i2 < 60; i2++) {
        bar = document.querySelector(".Root__now-playing-bar");
        if (bar && bar.getBoundingClientRect().height > 10) break;
        await sleep(250);
      }
      updateCard();
      for (const delay of [500, 1e3, 2e3, 4e3]) {
        setTimeout(updateCard, delay);
      }
      Spicetify.Player.addEventListener("songchange", () => {
        setTimeout(updateCard, 200);
      });
      window.addEventListener("nsc-settings-changed", () => {
        updateCard();
      });
      window.addEventListener("resize", () => {
        updateCard();
      });
      const playerBar = document.querySelector(".Root__now-playing-bar");
      if (playerBar) {
        new ResizeObserver(() => updateCard()).observe(playerBar);
      }
      let cinemaObserver = null;
      let lastCinemaEl = null;
      function watchCinema() {
        const el = document.querySelector(".Root__cinema-view");
        if (el && el !== lastCinemaEl) {
          lastCinemaEl = el;
          if (cinemaObserver) cinemaObserver.disconnect();
          cinemaObserver = new MutationObserver(() => {
            if (!cardEl) return;
            const hidden = el.classList.contains("Root__cinema-view--controls-hidden");
            cardEl.style.opacity = hidden ? "0" : "1";
            cardEl.style.pointerEvents = hidden ? "none" : "auto";
            cardEl.style.backdropFilter = hidden ? "blur(0)" : "blur(2rem)";
            cardEl.style.webkitBackdropFilter = hidden ? "blur(0)" : "blur(2rem)";
            cardEl.style.boxShadow = hidden ? "none" : "";
          });
          cinemaObserver.observe(el, { attributes: true, attributeFilter: ["class"] });
          if (cardEl) {
            const hidden = el.classList.contains("Root__cinema-view--controls-hidden");
            cardEl.style.opacity = hidden ? "0" : "1";
            cardEl.style.pointerEvents = hidden ? "none" : "auto";
            cardEl.style.backdropFilter = hidden ? "blur(0)" : "blur(2rem)";
            cardEl.style.webkitBackdropFilter = hidden ? "blur(0)" : "blur(2rem)";
            cardEl.style.boxShadow = hidden ? "none" : "";
          }
        }
        if (!el && cardEl) {
          cardEl.style.opacity = "1";
          cardEl.style.pointerEvents = "auto";
          cardEl.style.backdropFilter = "blur(2rem)";
          cardEl.style.webkitBackdropFilter = "blur(2rem)";
          cardEl.style.boxShadow = "";
        }
      }
      new MutationObserver(watchCinema).observe(document.body, { childList: true, subtree: true });
      watchCinema();
    })();
  }
  var glowifyTranslations = {
    de: {
      settingsTitle: "Glowify Einstellungen",
      title: "Glowify Einstellungen",
      accentColor: "Button-Farbe:",
      glowEffectMode: "Glow-Modus:",
      glowColor: "Glow-Farbe:",
      outlineColor: "Outline-Akzentfarbe:",
      background: "Hintergrund:",
      apbackground: "K\xFCnstler Seiten Hintergrund:",
      playerWidth: "Player-Breite:",
      playerRadius: "Player Border Radius:",
      backgroundBlur: "Hintergrund-Unsch\xE4rfe:",
      backgroundBrightness: "Hintergrund-Helligkeit (%):",
      transparentWidth: "Transparente Controls Breite:",
      transparentHeight: "Transparente Controls H\xF6he:",
      artistScrollBlur: "K\xFCnstler Scroll-Unsch\xE4rfe (px):",
      artistScrollBrightness: "K\xFCnstler Scroll-Helligkeit (%):",
      close: "Schlie\xDFen",
      playlistHeaderBox: "Playlist-Header-Box:",
      playerCustomWidth: "Player-Breite (%):",
      playerCustomHeight: "Player-H\xF6he (px):",
      chooseFile: "Datei ausw\xE4hlen",
      enterUrl: "Bild-URL eingeben...",
      lyricsMode: "Lyrics-\xDCbersetzung/Romanisierung:",
      lyricsOptions: {
        off: "Aus",
        translation: "Nur \xDCbersetzung",
        romanization: "Nur Romanisierung",
        both: "\xDCbersetzung + Romanisierung"
      },
      dropdown: {
        default: "Standard",
        custom: "Benutzerdefiniert",
        dynamic: "Dynamisch",
        animated: "Animiert",
        theme: "Theme",
        none: "Keiner",
        show: "Anzeigen",
        hide: "Ausblenden",
        url: "URL",
        left: "Links",
        right: "Rechts"
      },
      sections: {
        accent: "Akzent",
        glow: "Glow",
        background: "Hintergrund",
        artist: "K\xFCnstler",
        player: "Player",
        playlist: "Playlist",
        lyrics: "Lyrics",
        transparent: "Transparente Controls",
        nextSongCard: "N\xE4chster-Song-Karte"
      },
      glowOnOff: { on: "An", off: "Aus" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "Breite (px):",
        height: "H\xF6he (px):",
        marginBottom: "Abstand unten (px):",
        marginLeft: "Abstand links (px):",
        borderRadius: "Cover-Eckenradius (px):"
      },
      nextSongCard: {
        show: "N\xE4chster-Song-Karte:",
        position: "Position:",
        height: "Kartenh\xF6he (px):",
        maxWidth: "Max. Breite (px):",
        gap: "Abstand (px):",
        coverSize: "Cover-Gr\xF6\xDFe (px):",
        hpad: "Horizontales Padding (px):",
        vpad: "Vertikales Padding (px):",
        gapPlayer: "Abstand zum Player (px):",
        borderRadius: "Eckenradius (px):",
        coverRadius: "Cover-Radius (px):"
      },
      tooltips: {
        accentColor: "Farbe der Buttons und interaktiven Elemente",
        glowEffectMode: "Glow-Effekt an- oder ausschalten",
        glowColor: "Farbe des Glow-Effekts anpassen",
        outlineColor: "Farbe der Umrandung im No-Glow-Modus anpassen",
        background: "Hintergrundbild-Modus w\xE4hlen",
        apbackground: "Hintergrund der K\xFCnstler-Seite anpassen",
        playerWidth: "Breite des Players \xE4ndern",
        playerRadius: "Abrundung der Player-Ecken",
        backgroundBlur: "St\xE4rke der Hintergrund-Unsch\xE4rfe",
        backgroundBrightness: "Helligkeit des Hintergrundbilds",
        transparentWidth: "Breite der transparenten Fenster-Controls",
        transparentHeight: "H\xF6he der transparenten Fenster-Controls",
        artistScrollBlur: "Unsch\xE4rfe beim Scrollen auf K\xFCnstler-Seiten",
        artistScrollBrightness: "Helligkeit beim Scrollen auf K\xFCnstler-Seiten",
        playlistHeaderBox: "Box um den Playlist-Header ein-/ausblenden",
        lyricsMode: "\xDCbersetzungs- und Romanisierungsmodus f\xFCr Songtexte",
        playerCustomWidth: "Benutzerdefinierte Player-Breite in Prozent",
        playerCustomHeight: "Benutzerdefinierte Player-H\xF6he in Pixeln",
        comfyCoverArtEnabled: "Cover Art im Player ein-/ausblenden",
        comfyCoverArtWidth: "Breite des Cover-Art-Bildes",
        comfyCoverArtHeight: "H\xF6he des Cover-Art-Bildes",
        comfyCoverArtMarginBottom: "Abstand nach unten",
        comfyCoverArtMarginLeft: "Abstand nach links",
        comfyCoverArtBorderRadius: "Eckenradius des Covers",
        nscShow: "N\xE4chster-Song-Karte ein-/ausblenden",
        nscPosition: "Position der Karte (links/rechts)",
        nscHeight: "H\xF6he der Karte",
        nscMaxWidth: "Maximale Breite der Karte",
        nscGap: "Abstand zwischen Cover und Text",
        nscCoverSize: "Gr\xF6\xDFe des Cover-Bildes",
        nscHpad: "Horizontales Padding der Karte",
        nscVpad: "Vertikales Padding der Karte",
        nscGapPlayer: "Abstand zum Player unten",
        nscBorderRadius: "Eckenradius der Karte",
        nscCoverRadius: "Eckenradius des NSC-Covers"
      }
    },
    en: {
      settingsTitle: "Glowify Settings",
      title: "Glowify Settings",
      accentColor: "Button Accent Color:",
      glowEffectMode: "Glow Mode:",
      glowColor: "Glow Accent Color:",
      outlineColor: "Outline Accent Color:",
      background: "Background:",
      apbackground: "Artist Page Background:",
      playerWidth: "Player Width:",
      playerRadius: "Player Border Radius:",
      backgroundBlur: "Background Blur:",
      backgroundBrightness: "Background Brightness (%):",
      transparentWidth: "Transparent Controls Width:",
      transparentHeight: "Transparent Controls Height:",
      artistScrollBlur: "Artist Scroll Blur (px):",
      artistScrollBrightness: "Artist Scroll Brightness (%):",
      close: "Close",
      playlistHeaderBox: "Playlist Header Box:",
      playerCustomWidth: "Player Width (%):",
      playerCustomHeight: "Player Height (px):",
      chooseFile: "Choose file",
      enterUrl: "Enter image URL...",
      lyricsMode: "Lyrics Translation/Romanization:",
      lyricsOptions: {
        off: "Off",
        translation: "Translation only",
        romanization: "Romanization only",
        both: "Translation + Romanization"
      },
      dropdown: {
        default: "Default",
        custom: "Custom",
        dynamic: "Dynamic",
        animated: "Animated",
        theme: "Theme",
        none: "None",
        show: "Show",
        hide: "Hide",
        url: "URL",
        left: "Left",
        right: "Right"
      },
      sections: {
        accent: "Accent",
        glow: "Glow",
        background: "Background",
        artist: "Artist",
        player: "Player",
        playlist: "Playlist",
        lyrics: "Lyrics",
        transparent: "Transparent Controls",
        nextSongCard: "Next Song Card"
      },
      glowOnOff: { on: "On", off: "Off" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "Width (px):",
        height: "Height (px):",
        marginBottom: "Margin Bottom (px):",
        marginLeft: "Margin Left (px):",
        borderRadius: "Cover Border Radius (px):"
      },
      nextSongCard: {
        show: "Next Song Card:",
        position: "Position:",
        height: "Card Height (px):",
        maxWidth: "Card Max Width (px):",
        gap: "Gap (px):",
        coverSize: "Cover Size (px):",
        hpad: "Horizontal Padding (px):",
        vpad: "Vertical Padding (px):",
        gapPlayer: "Gap to Player (px):",
        borderRadius: "Border Radius (px):",
        coverRadius: "Cover Border Radius (px):"
      },
      tooltips: {
        accentColor: "Color of buttons and interactive elements",
        glowEffectMode: "Toggle the glow effect on or off",
        glowColor: "Customize the glow effect color",
        outlineColor: "Customize the outline color in no-glow mode",
        background: "Choose background image mode",
        apbackground: "Customize the artist page background",
        playerWidth: "Change the player width",
        playerRadius: "Rounding of player corners",
        backgroundBlur: "Strength of the background blur",
        backgroundBrightness: "Brightness of the background image",
        transparentWidth: "Width of transparent window controls",
        transparentHeight: "Height of transparent window controls",
        artistScrollBlur: "Blur when scrolling on artist pages",
        artistScrollBrightness: "Brightness when scrolling on artist pages",
        playlistHeaderBox: "Show or hide the playlist header box",
        lyricsMode: "Translation and romanization mode for lyrics",
        playerCustomWidth: "Custom player width in percent",
        playerCustomHeight: "Custom player height in pixels",
        comfyCoverArtEnabled: "Show or hide cover art in the player",
        comfyCoverArtWidth: "Width of the cover art image",
        comfyCoverArtHeight: "Height of the cover art image",
        comfyCoverArtMarginBottom: "Bottom margin offset",
        comfyCoverArtMarginLeft: "Left margin offset",
        comfyCoverArtBorderRadius: "Cover border radius",
        nscShow: "Show or hide the next song card",
        nscPosition: "Card position (left/right)",
        nscHeight: "Height of the card",
        nscMaxWidth: "Maximum width of the card",
        nscGap: "Gap between cover and text",
        nscCoverSize: "Size of the cover image",
        nscHpad: "Horizontal padding of the card",
        nscVpad: "Vertical padding of the card",
        nscGapPlayer: "Gap to the player below",
        nscBorderRadius: "Corner radius of the card",
        nscCoverRadius: "Corner radius of the NSC cover"
      }
    },
    ru: {
      settingsTitle: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Glowify",
      title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Glowify",
      accentColor: "\u0426\u0432\u0435\u0442 \u0430\u043A\u0446\u0435\u043D\u0442\u0430 \u043A\u043D\u043E\u043F\u043E\u043A:",
      glowEffectMode: "\u0420\u0435\u0436\u0438\u043C \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u044F:",
      glowColor: "\u0426\u0432\u0435\u0442 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u044F:",
      outlineColor: "\u0426\u0432\u0435\u0442 \u043A\u043E\u043D\u0442\u0443\u0440\u0430:",
      background: "\u0424\u043E\u043D:",
      apbackground: "\u0424\u043E\u043D \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0430\u0440\u0442\u0438\u0441\u0442\u0430:",
      playerWidth: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043F\u043B\u0435\u0435\u0440\u0430:",
      playerRadius: "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u0443\u0433\u043B\u043E\u0432 \u043F\u043B\u0435\u0435\u0440\u0430:",
      backgroundBlur: "\u0420\u0430\u0437\u043C\u044B\u0442\u0438\u0435 \u0444\u043E\u043D\u0430:",
      backgroundBrightness: "\u042F\u0440\u043A\u043E\u0441\u0442\u044C \u0444\u043E\u043D\u0430 (%):",
      transparentWidth: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432:",
      transparentHeight: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432:",
      artistScrollBlur: "\u0420\u0430\u0437\u043C\u044B\u0442\u0438\u0435 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0438 \u0430\u0440\u0442\u0438\u0441\u0442\u0430 (px):",
      artistScrollBrightness: "\u042F\u0440\u043A\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0438 \u0430\u0440\u0442\u0438\u0441\u0442\u0430 (%):",
      close: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
      playlistHeaderBox: "\u0411\u043B\u043E\u043A \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u043F\u043B\u0435\u0439\u043B\u0438\u0441\u0442\u0430:",
      playerCustomWidth: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043F\u043B\u0435\u0435\u0440\u0430 (%):",
      playerCustomHeight: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043F\u043B\u0435\u0435\u0440\u0430 (px):",
      chooseFile: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0444\u0430\u0439\u043B",
      enterUrl: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 URL \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F...",
      lyricsMode: "\u041F\u0435\u0440\u0435\u0432\u043E\u0434/\u0440\u043E\u043C\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0442\u0435\u043A\u0441\u0442\u0430:",
      lyricsOptions: {
        off: "\u0412\u044B\u043A\u043B.",
        translation: "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u0435\u0440\u0435\u0432\u043E\u0434",
        romanization: "\u0422\u043E\u043B\u044C\u043A\u043E \u0440\u043E\u043C\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
        both: "\u041F\u0435\u0440\u0435\u0432\u043E\u0434 + \u0440\u043E\u043C\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F"
      },
      dropdown: {
        default: "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u043E",
        custom: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439",
        dynamic: "\u0414\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439",
        animated: "\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439",
        theme: "\u0422\u0435\u043C\u0430",
        none: "\u041D\u0435\u0442",
        show: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C",
        hide: "\u0421\u043A\u0440\u044B\u0442\u044C",
        url: "URL",
        left: "\u0421\u043B\u0435\u0432\u0430",
        right: "\u0421\u043F\u0440\u0430\u0432\u0430"
      },
      sections: {
        accent: "\u0410\u043A\u0446\u0435\u043D\u0442",
        glow: "\u0421\u0432\u0435\u0447\u0435\u043D\u0438\u0435",
        background: "\u0424\u043E\u043D",
        artist: "\u0410\u0440\u0442\u0438\u0441\u0442",
        player: "\u041F\u043B\u0435\u0435\u0440",
        playlist: "\u041F\u043B\u0435\u0439\u043B\u0438\u0441\u0442",
        lyrics: "\u0422\u0435\u043A\u0441\u0442",
        transparent: "\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        nextSongCard: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0442\u0440\u0435\u043A\u0430"
      },
      glowOnOff: { on: "\u0412\u043A\u043B.", off: "\u0412\u044B\u043A\u043B." },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "\u0428\u0438\u0440\u0438\u043D\u0430 (px):",
        height: "\u0412\u044B\u0441\u043E\u0442\u0430 (px):",
        marginBottom: "\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043D\u0438\u0437\u0443 (px):",
        marginLeft: "\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px):",
        borderRadius: "\u0420\u0430\u0434\u0438\u0443\u0441 \u0443\u0433\u043B\u043E\u0432 \u043E\u0431\u043B\u043E\u0436\u043A\u0438 (px):"
      },
      nextSongCard: {
        show: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0442\u0440\u0435\u043A\u0430:",
        position: "\u041F\u043E\u0437\u0438\u0446\u0438\u044F:",
        height: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (px):",
        maxWidth: "\u041C\u0430\u043A\u0441. \u0448\u0438\u0440\u0438\u043D\u0430 (px):",
        gap: "\u0417\u0430\u0437\u043E\u0440 (px):",
        coverSize: "\u0420\u0430\u0437\u043C\u0435\u0440 \u043E\u0431\u043B\u043E\u0436\u043A\u0438 (px):",
        hpad: "\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F (px):",
        vpad: "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F (px):",
        gapPlayer: "\u041E\u0442\u0441\u0442\u0443\u043F \u0434\u043E \u043F\u043B\u0435\u0435\u0440\u0430 (px):",
        borderRadius: "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u0443\u0433\u043B\u043E\u0432 (px):",
        coverRadius: "\u0420\u0430\u0434\u0438\u0443\u0441 \u043E\u0431\u043B\u043E\u0436\u043A\u0438 (px):"
      },
      tooltips: {
        accentColor: "\u0426\u0432\u0435\u0442 \u043A\u043D\u043E\u043F\u043E\u043A \u0438 \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
        glowEffectMode: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0438\u043B\u0438 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u044D\u0444\u0444\u0435\u043A\u0442 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u044F",
        glowColor: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0446\u0432\u0435\u0442 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u044F",
        outlineColor: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0446\u0432\u0435\u0442 \u043A\u043E\u043D\u0442\u0443\u0440\u0430 \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 \u0431\u0435\u0437 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u044F",
        background: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0440\u0435\u0436\u0438\u043C \u0444\u043E\u043D\u043E\u0432\u043E\u0433\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
        apbackground: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0444\u043E\u043D \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0430\u0440\u0442\u0438\u0441\u0442\u0430",
        playerWidth: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0448\u0438\u0440\u0438\u043D\u0443 \u043F\u043B\u0435\u0435\u0440\u0430",
        playerRadius: "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u0443\u0433\u043B\u043E\u0432 \u043F\u043B\u0435\u0435\u0440\u0430",
        backgroundBlur: "\u0421\u0438\u043B\u0430 \u0440\u0430\u0437\u043C\u044B\u0442\u0438\u044F \u0444\u043E\u043D\u0430",
        backgroundBrightness: "\u042F\u0440\u043A\u043E\u0441\u0442\u044C \u0444\u043E\u043D\u043E\u0432\u043E\u0433\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
        transparentWidth: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        transparentHeight: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0445 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
        artistScrollBlur: "\u0420\u0430\u0437\u043C\u044B\u0442\u0438\u0435 \u043F\u0440\u0438 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0435 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u0445 \u0430\u0440\u0442\u0438\u0441\u0442\u043E\u0432",
        artistScrollBrightness: "\u042F\u0440\u043A\u043E\u0441\u0442\u044C \u043F\u0440\u0438 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0435 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u0445 \u0430\u0440\u0442\u0438\u0441\u0442\u043E\u0432",
        playlistHeaderBox: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C/\u0441\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043F\u043B\u0435\u0439\u043B\u0438\u0441\u0442\u0430",
        lyricsMode: "\u0420\u0435\u0436\u0438\u043C \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430 \u0438 \u0440\u043E\u043C\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0442\u0435\u043A\u0441\u0442\u043E\u0432",
        playerCustomWidth: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0430\u044F \u0448\u0438\u0440\u0438\u043D\u0430 \u043F\u043B\u0435\u0435\u0440\u0430 \u0432 \u043F\u0440\u043E\u0446\u0435\u043D\u0442\u0430\u0445",
        playerCustomHeight: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0430\u044F \u0432\u044B\u0441\u043E\u0442\u0430 \u043F\u043B\u0435\u0435\u0440\u0430 \u0432 \u043F\u0438\u043A\u0441\u0435\u043B\u044F\u0445",
        comfyCoverArtEnabled: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C/\u0441\u043A\u0440\u044B\u0442\u044C \u043E\u0431\u043B\u043E\u0436\u043A\u0443 \u0432 \u043F\u043B\u0435\u0435\u0440\u0435",
        comfyCoverArtWidth: "\u0428\u0438\u0440\u0438\u043D\u0430 \u043E\u0431\u043B\u043E\u0436\u043A\u0438",
        comfyCoverArtHeight: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043E\u0431\u043B\u043E\u0436\u043A\u0438",
        comfyCoverArtMarginBottom: "\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043D\u0438\u0437\u0443",
        comfyCoverArtMarginLeft: "\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430",
        comfyCoverArtBorderRadius: "\u0420\u0430\u0434\u0438\u0443\u0441 \u0443\u0433\u043B\u043E\u0432 \u043E\u0431\u043B\u043E\u0436\u043A\u0438",
        nscShow: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C/\u0441\u043A\u0440\u044B\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0442\u0440\u0435\u043A\u0430",
        nscPosition: "\u041F\u043E\u0437\u0438\u0446\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (\u043B\u0435\u0432\u043E/\u043F\u0440\u0430\u0432\u043E)",
        nscHeight: "\u0412\u044B\u0441\u043E\u0442\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
        nscMaxWidth: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0448\u0438\u0440\u0438\u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
        nscGap: "\u0417\u0430\u0437\u043E\u0440 \u043C\u0435\u0436\u0434\u0443 \u043E\u0431\u043B\u043E\u0436\u043A\u043E\u0439 \u0438 \u0442\u0435\u043A\u0441\u0442\u043E\u043C",
        nscCoverSize: "\u0420\u0430\u0437\u043C\u0435\u0440 \u043E\u0431\u043B\u043E\u0436\u043A\u0438",
        nscHpad: "\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
        nscVpad: "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
        nscGapPlayer: "\u0420\u0430\u0441\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0434\u043E \u043F\u043B\u0435\u0435\u0440\u0430",
        nscBorderRadius: "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u0443\u0433\u043B\u043E\u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
        nscCoverRadius: "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u043E\u0431\u043B\u043E\u0436\u043A\u0438 NSC"
      }
    },
    es: {
      settingsTitle: "Configuraci\xF3n de Glowify",
      title: "Configuraci\xF3n de Glowify",
      accentColor: "Color de acento del bot\xF3n:",
      glowEffectMode: "Modo de brillo:",
      glowColor: "Color del brillo:",
      outlineColor: "Color del contorno:",
      background: "Fondo:",
      apbackground: "Fondo de la p\xE1gina del artista:",
      playerWidth: "Ancho del reproductor:",
      playerRadius: "Radio del borde del reproductor:",
      backgroundBlur: "Desenfoque del fondo:",
      backgroundBrightness: "Brillo del fondo (%):",
      transparentWidth: "Ancho de controles transparentes:",
      transparentHeight: "Altura de controles transparentes:",
      artistScrollBlur: "Desenfoque de scroll del artista (px):",
      artistScrollBrightness: "Brillo de scroll del artista (%):",
      close: "Cerrar",
      playlistHeaderBox: "Caja del encabezado de la playlist:",
      playerCustomWidth: "Ancho del reproductor (%):",
      playerCustomHeight: "Altura del reproductor (px):",
      chooseFile: "Elegir archivo",
      enterUrl: "Ingrese la URL de la imagen...",
      lyricsMode: "Traducci\xF3n/romanizaci\xF3n de letras:",
      lyricsOptions: {
        off: "Desactivado",
        translation: "Solo traducci\xF3n",
        romanization: "Solo romanizaci\xF3n",
        both: "Traducci\xF3n + romanizaci\xF3n"
      },
      dropdown: {
        default: "Predeterminado",
        custom: "Personalizado",
        dynamic: "Din\xE1mico",
        animated: "Animado",
        theme: "Tema",
        none: "Ninguno",
        show: "Mostrar",
        hide: "Ocultar",
        url: "URL",
        left: "Izquierda",
        right: "Derecha"
      },
      sections: {
        accent: "Acento",
        glow: "Brillo",
        background: "Fondo",
        artist: "Artista",
        player: "Reproductor",
        playlist: "Playlist",
        lyrics: "Letras",
        transparent: "Controles Transparentes",
        nextSongCard: "Tarjeta de siguiente canci\xF3n"
      },
      glowOnOff: { on: "Activado", off: "Desactivado" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "Ancho (px):",
        height: "Altura (px):",
        marginBottom: "Margen inferior (px):",
        marginLeft: "Margen izquierdo (px):",
        borderRadius: "Radio de borde de la portada (px):"
      },
      nextSongCard: {
        show: "Tarjeta de siguiente canci\xF3n:",
        position: "Posici\xF3n:",
        height: "Altura de tarjeta (px):",
        maxWidth: "Ancho m\xE1ximo (px):",
        gap: "Espacio (px):",
        coverSize: "Tama\xF1o de portada (px):",
        hpad: "Padding Horizontal (px):",
        vpad: "Padding Vertical (px):",
        gapPlayer: "Espacio al reproductor (px):",
        borderRadius: "Radio de esquina (px):",
        coverRadius: "Radio de portada (px):"
      },
      tooltips: {
        accentColor: "Color de botones y elementos interactivos",
        glowEffectMode: "Activar o desactivar el efecto de brillo",
        glowColor: "Personalizar el color del brillo",
        outlineColor: "Personalizar el color del contorno en modo sin brillo",
        background: "Elegir el modo de imagen de fondo",
        apbackground: "Personalizar el fondo de la p\xE1gina del artista",
        playerWidth: "Cambiar el ancho del reproductor",
        playerRadius: "Redondeo de las esquinas del reproductor",
        backgroundBlur: "Intensidad del desenfoque del fondo",
        backgroundBrightness: "Brillo de la imagen de fondo",
        transparentWidth: "Ancho de los controles transparentes",
        transparentHeight: "Altura de los controles transparentes",
        artistScrollBlur: "Desenfoque al hacer scroll en p\xE1ginas de artistas",
        artistScrollBrightness: "Brillo al hacer scroll en p\xE1ginas de artistas",
        playlistHeaderBox: "Mostrar/ocultar la caja del encabezado de playlist",
        lyricsMode: "Modo de traducci\xF3n y romanizaci\xF3n de letras",
        playerCustomWidth: "Ancho personalizado del reproductor en porcentaje",
        playerCustomHeight: "Altura personalizada del reproductor en p\xEDxeles",
        comfyCoverArtEnabled: "Mostrar/ocultar la portada en el reproductor",
        comfyCoverArtWidth: "Ancho de la imagen de portada",
        comfyCoverArtHeight: "Altura de la imagen de portada",
        comfyCoverArtMarginBottom: "Desplazamiento del margen inferior",
        comfyCoverArtMarginLeft: "Desplazamiento del margen izquierdo",
        comfyCoverArtBorderRadius: "Radio de borde de la portada",
        nscShow: "Mostrar/ocultar la tarjeta de siguiente canci\xF3n",
        nscPosition: "Posici\xF3n de la tarjeta (izqda./dcha.)",
        nscHeight: "Altura de la tarjeta",
        nscMaxWidth: "Ancho m\xE1ximo de la tarjeta",
        nscGap: "Espacio entre portada y texto",
        nscCoverSize: "Tama\xF1o de la portada",
        nscHpad: "Padding horizontal de la tarjeta",
        nscVpad: "Padding vertical de la tarjeta",
        nscGapPlayer: "Espacio hasta el reproductor",
        nscBorderRadius: "Radio de esquina de la tarjeta",
        nscCoverRadius: "Radio de la portada NSC"
      }
    },
    pt: {
      settingsTitle: "Configura\xE7\xF5es do Glowify",
      title: "Configura\xE7\xF5es do Glowify",
      accentColor: "Cor de destaque do bot\xE3o:",
      glowEffectMode: "Modo de brilho:",
      glowColor: "Cor do brilho:",
      outlineColor: "Cor do contorno:",
      background: "Fundo:",
      apbackground: "Fundo da p\xE1gina do artista:",
      playerWidth: "Largura do player:",
      playerRadius: "Raio do canto do player:",
      backgroundBlur: "Desfoque do fundo:",
      backgroundBrightness: "Brilho do fundo (%):",
      transparentWidth: "Largura dos controles transparentes:",
      transparentHeight: "Altura dos controles transparentes:",
      artistScrollBlur: "Desfoque de rolagem do artista (px):",
      artistScrollBrightness: "Brilho de rolagem do artista (%):",
      close: "Fechar",
      playlistHeaderBox: "Caixa do cabe\xE7alho da playlist:",
      playerCustomWidth: "Largura do player (%):",
      playerCustomHeight: "Altura do player (px):",
      chooseFile: "Escolher arquivo",
      enterUrl: "Insira a URL da imagem...",
      lyricsMode: "Tradu\xE7\xE3o/romaniza\xE7\xE3o da letra:",
      lyricsOptions: {
        off: "Desativado",
        translation: "Apenas tradu\xE7\xE3o",
        romanization: "Apenas romaniza\xE7\xE3o",
        both: "Tradu\xE7\xE3o + romaniza\xE7\xE3o"
      },
      dropdown: {
        default: "Padr\xE3o",
        custom: "Personalizado",
        dynamic: "Din\xE2mico",
        animated: "Animado",
        theme: "Tema",
        none: "Nenhum",
        show: "Mostrar",
        hide: "Ocultar",
        url: "URL",
        left: "Esquerda",
        right: "Direita"
      },
      sections: {
        accent: "Destaque",
        glow: "Brilho",
        background: "Fundo",
        artist: "Artista",
        player: "Player",
        playlist: "Playlist",
        lyrics: "Letras",
        transparent: "Controles Transparentes",
        nextSongCard: "Cart\xE3o da pr\xF3xima m\xFAsica"
      },
      glowOnOff: { on: "Ligado", off: "Desligado" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "Largura (px):",
        height: "Altura (px):",
        marginBottom: "Margem inferior (px):",
        marginLeft: "Margem esquerda (px):",
        borderRadius: "Raio da borda da capa (px):"
      },
      nextSongCard: {
        show: "Cart\xE3o da pr\xF3xima m\xFAsica:",
        position: "Posi\xE7\xE3o:",
        height: "Altura do cart\xE3o (px):",
        maxWidth: "Largura m\xE1xima (px):",
        gap: "Espa\xE7o (px):",
        coverSize: "Tamanho da capa (px):",
        hpad: "Padding Horizontal (px):",
        vpad: "Padding Vertical (px):",
        gapPlayer: "Espa\xE7o at\xE9 o player (px):",
        borderRadius: "Raio da borda (px):",
        coverRadius: "Raio da capa (px):"
      },
      tooltips: {
        accentColor: "Cor dos bot\xF5es e elementos interativos",
        glowEffectMode: "Ativar ou desativar o efeito de brilho",
        glowColor: "Personalizar a cor do brilho",
        outlineColor: "Personalizar a cor do contorno no modo sem brilho",
        background: "Escolher modo de imagem de fundo",
        apbackground: "Personalizar o fundo da p\xE1gina do artista",
        playerWidth: "Alterar a largura do player",
        playerRadius: "Arredondamento dos cantos do player",
        backgroundBlur: "Intensidade do desfoque do fundo",
        backgroundBrightness: "Brilho da imagem de fundo",
        transparentWidth: "Largura dos controles transparentes",
        transparentHeight: "Altura dos controles transparentes",
        artistScrollBlur: "Desfoque ao rolar nas p\xE1ginas de artistas",
        artistScrollBrightness: "Brilho ao rolar nas p\xE1ginas de artistas",
        playlistHeaderBox: "Mostrar/ocultar a caixa do cabe\xE7alho da playlist",
        lyricsMode: "Modo de tradu\xE7\xE3o e romaniza\xE7\xE3o das letras",
        playerCustomWidth: "Largura personalizada do player em percentual",
        playerCustomHeight: "Altura personalizada do player em pixels",
        comfyCoverArtEnabled: "Mostrar/ocultar capa no player",
        comfyCoverArtWidth: "Largura da imagem da capa",
        comfyCoverArtHeight: "Altura da imagem da capa",
        comfyCoverArtMarginBottom: "Deslocamento da margem inferior",
        comfyCoverArtMarginLeft: "Deslocamento da margem esquerda",
        comfyCoverArtBorderRadius: "Raio da borda da capa",
        nscShow: "Mostrar/ocultar o cart\xE3o da pr\xF3xima m\xFAsica",
        nscPosition: "Posi\xE7\xE3o do cart\xE3o (esq./dir.)",
        nscHeight: "Altura do cart\xE3o",
        nscMaxWidth: "Largura m\xE1xima do cart\xE3o",
        nscGap: "Espa\xE7o entre capa e texto",
        nscCoverSize: "Tamanho da capa",
        nscHpad: "Padding horizontal do cart\xE3o",
        nscVpad: "Padding vertical do cart\xE3o",
        nscGapPlayer: "Dist\xE2ncia at\xE9 o player",
        nscBorderRadius: "Raio dos cantos do cart\xE3o",
        nscCoverRadius: "Raio da capa NSC"
      }
    },
    tr: {
      settingsTitle: "Glowify Ayarlar\u0131",
      title: "Glowify Ayarlar\u0131",
      accentColor: "D\xFC\u011Fme vurgu rengi:",
      glowEffectMode: "Parlama modu:",
      glowColor: "Parlama rengi:",
      outlineColor: "\xC7er\xE7eve vurgu rengi:",
      background: "Arka plan:",
      apbackground: "Sanat\xE7\u0131 Sayfas\u0131 Arka Plan\u0131:",
      playerWidth: "Oynat\u0131c\u0131 geni\u015Fli\u011Fi:",
      playerRadius: "Oynat\u0131c\u0131 k\xF6\u015Fe yuvarlama:",
      backgroundBlur: "Arka plan bulan\u0131kl\u0131\u011F\u0131:",
      backgroundBrightness: "Arka plan parlakl\u0131\u011F\u0131 (%):",
      transparentWidth: "\u015Eeffaf kontroller geni\u015Fli\u011Fi:",
      transparentHeight: "\u015Eeffaf kontroller y\xFCksekli\u011Fi:",
      artistScrollBlur: "Sanat\xE7\u0131 kayd\u0131rma bulan\u0131kl\u0131\u011F\u0131 (px):",
      artistScrollBrightness: "Sanat\xE7\u0131 kayd\u0131rma parlakl\u0131\u011F\u0131 (%):",
      close: "Kapat",
      playlistHeaderBox: "\xC7alma listesi ba\u015Fl\u0131k kutusu:",
      playerCustomWidth: "Oynat\u0131c\u0131 geni\u015Fli\u011Fi (%):",
      playerCustomHeight: "Oynat\u0131c\u0131 y\xFCksekli\u011Fi (px):",
      chooseFile: "Dosya se\xE7",
      enterUrl: "Resim URL'si girin...",
      lyricsMode: "S\xF6z \xE7eviri/romanizasyon:",
      lyricsOptions: {
        off: "Kapal\u0131",
        translation: "Yaln\u0131zca \xE7eviri",
        romanization: "Yaln\u0131zca romanizasyon",
        both: "\xC7eviri + romanizasyon"
      },
      dropdown: {
        default: "Varsay\u0131lan",
        custom: "\xD6zel",
        dynamic: "Dinamik",
        animated: "Animasyonlu",
        theme: "Tema",
        none: "Hi\xE7biri",
        show: "G\xF6ster",
        hide: "Gizle",
        url: "URL",
        left: "Sol",
        right: "Sa\u011F"
      },
      sections: {
        accent: "Aksan",
        glow: "Parlama",
        background: "Arka Plan",
        artist: "Sanat\xE7\u0131",
        player: "Oynat\u0131c\u0131",
        playlist: "\xC7alma Listesi",
        lyrics: "S\xF6zler",
        transparent: "\u015Eeffaf Kontroller",
        nextSongCard: "Sonraki \u015Eark\u0131 Kart\u0131"
      },
      glowOnOff: { on: "A\xE7\u0131k", off: "Kapal\u0131" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "Geni\u015Flik (px):",
        height: "Y\xFCkseklik (px):",
        marginBottom: "Alt bo\u015Fluk (px):",
        marginLeft: "Sol bo\u015Fluk (px):",
        borderRadius: "Kapak K\xF6\u015Fe Yuvarlakl\u0131\u011F\u0131 (px):"
      },
      nextSongCard: {
        show: "Sonraki \u015Fark\u0131 kart\u0131:",
        position: "Konum:",
        height: "Kart y\xFCksekli\u011Fi (px):",
        maxWidth: "Maks. geni\u015Flik (px):",
        gap: "Bo\u015Fluk (px):",
        coverSize: "Kapak boyutu (px):",
        hpad: "Yatay Dolgu (px):",
        vpad: "Dikey Dolgu (px):",
        gapPlayer: "Oynat\u0131c\u0131ya mesafe (px):",
        borderRadius: "K\xF6\u015Fe yuvarlama (px):",
        coverRadius: "Kapak yar\u0131\xE7ap\u0131 (px):"
      },
      tooltips: {
        accentColor: "D\xFC\u011Fme ve etkile\u015Fimli \xF6\u011Felerin rengi",
        glowEffectMode: "Parlama efektini a\xE7/kapat",
        glowColor: "Parlama efekti rengini \xF6zelle\u015Ftir",
        outlineColor: "Parlama kapal\u0131 modunda \xE7er\xE7eve rengini \xF6zelle\u015Ftir",
        background: "Arka plan resmi modunu se\xE7",
        apbackground: "Sanat\xE7\u0131 sayfas\u0131 arka plan\u0131n\u0131 \xF6zelle\u015Ftir",
        playerWidth: "Oynat\u0131c\u0131 geni\u015Fli\u011Fini de\u011Fi\u015Ftir",
        playerRadius: "Oynat\u0131c\u0131 k\xF6\u015Fe yuvarlamas\u0131",
        backgroundBlur: "Arka plan bulan\u0131kl\u0131\u011F\u0131n\u0131n g\xFCc\xFC",
        backgroundBrightness: "Arka plan resminin parlakl\u0131\u011F\u0131",
        transparentWidth: "\u015Eeffaf pencere kontrollerinin geni\u015Fli\u011Fi",
        transparentHeight: "\u015Eeffaf pencere kontrollerinin y\xFCksekli\u011Fi",
        artistScrollBlur: "Sanat\xE7\u0131 sayfalar\u0131nda kayd\u0131rma bulan\u0131kl\u0131\u011F\u0131",
        artistScrollBrightness: "Sanat\xE7\u0131 sayfalar\u0131nda kayd\u0131rma parlakl\u0131\u011F\u0131",
        playlistHeaderBox: "\xC7alma listesi ba\u015Fl\u0131k kutusunu g\xF6ster/gizle",
        lyricsMode: "S\xF6zler i\xE7in \xE7eviri ve romanizasyon modu",
        playerCustomWidth: "Y\xFCzde olarak \xF6zel oynat\u0131c\u0131 geni\u015Fli\u011Fi",
        playerCustomHeight: "Piksel olarak \xF6zel oynat\u0131c\u0131 y\xFCksekli\u011Fi",
        comfyCoverArtEnabled: "Oynat\u0131c\u0131da kapak resmini g\xF6ster/gizle",
        comfyCoverArtWidth: "Kapak resmi geni\u015Fli\u011Fi",
        comfyCoverArtHeight: "Kapak resmi y\xFCksekli\u011Fi",
        comfyCoverArtMarginBottom: "Alt kenar bo\u015Flu\u011Fu",
        comfyCoverArtMarginLeft: "Sol kenar bo\u015Flu\u011Fu",
        comfyCoverArtBorderRadius: "Cover-K\xF6\u015Fe yuvarlakl\u0131\u011F\u0131",
        nscShow: "Sonraki \u015Fark\u0131 kart\u0131n\u0131 g\xF6ster/gizle",
        nscPosition: "Kart konumu (sol/sa\u011F)",
        nscHeight: "Kart y\xFCksekli\u011Fi",
        nscMaxWidth: "Kart\u0131n maksimum geni\u015Fli\u011Fi",
        nscGap: "Kapak ile metin aras\u0131ndaki bo\u015Fluk",
        nscCoverSize: "Kapak boyutu",
        nscHpad: "Kart\u0131n yatay dolgusu",
        nscVpad: "Kart\u0131n dikey dolgusu",
        nscGapPlayer: "Oynat\u0131c\u0131ya mesafe",
        nscBorderRadius: "Kart\u0131n k\xF6\u015Fe yuvarlamas\u0131",
        nscCoverRadius: "NSC kapa\u011F\u0131n\u0131n yuvarlamas\u0131"
      }
    },
    hi: {
      settingsTitle: "Glowify \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938",
      title: "Glowify \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938",
      accentColor: "\u092C\u091F\u0928 \u090F\u0915\u094D\u0938\u0947\u0902\u091F \u0930\u0902\u0917:",
      glowEffectMode: "\u0917\u094D\u0932\u094B \u092E\u094B\u0921:",
      glowColor: "\u0917\u094D\u0932\u094B \u090F\u0915\u094D\u0938\u0947\u0902\u091F \u0930\u0902\u0917:",
      outlineColor: "\u0906\u0909\u091F\u0932\u093E\u0907\u0928 \u090F\u0915\u094D\u0938\u0947\u0902\u091F \u0930\u0902\u0917:",
      background: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F:",
      apbackground: "\u0915\u0932\u093E\u0915\u093E\u0930 \u092A\u0943\u0937\u094D\u0920 \u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F:",
      playerWidth: "\u092A\u094D\u0932\u0947\u092F\u0930 \u091A\u094C\u0921\u093C\u093E\u0908:",
      playerRadius: "\u092A\u094D\u0932\u0947\u092F\u0930 \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938:",
      backgroundBlur: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F \u0927\u0941\u0902\u0927\u0932\u093E\u092A\u0928:",
      backgroundBrightness: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F \u091A\u092E\u0915 (%):",
      transparentWidth: "\u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0915\u0902\u091F\u094D\u0930\u094B\u0932 \u091A\u094C\u0921\u093C\u093E\u0908:",
      transparentHeight: "\u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0915\u0902\u091F\u094D\u0930\u094B\u0932 \u090A\u0901\u091A\u093E\u0908:",
      artistScrollBlur: "\u0915\u0932\u093E\u0915\u093E\u0930 \u0938\u094D\u0915\u094D\u0930\u0949\u0932 \u0927\u0941\u0902\u0927\u0932\u093E\u092A\u0928 (px):",
      artistScrollBrightness: "\u0915\u0932\u093E\u0915\u093E\u0930 \u0938\u094D\u0915\u094D\u0930\u0949\u0932 \u091A\u092E\u0915 (%):",
      playlistHeaderBox: "\u092A\u094D\u0932\u0947\u0932\u093F\u0938\u094D\u091F \u0939\u0947\u0921\u0930 \u092C\u0949\u0915\u094D\u0938",
      playerCustomWidth: "\u092A\u094D\u0932\u0947\u092F\u0930 \u091A\u094C\u0921\u093C\u093E\u0908 (%):",
      playerCustomHeight: "\u092A\u094D\u0932\u0947\u092F\u0930 \u090A\u0901\u091A\u093E\u0908 (px):",
      chooseFile: "\u092B\u093C\u093E\u0907\u0932 \u091A\u0941\u0928\u0947\u0902",
      enterUrl: "\u091B\u0935\u093F URL \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902...",
      close: "\u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
      lyricsMode: "\u0932\u093F\u0930\u093F\u0915\u094D\u0938 \u0905\u0928\u0941\u0935\u093E\u0926/\u0930\u094B\u092E\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928:",
      lyricsOptions: {
        off: "\u092C\u0902\u0926",
        translation: "\u0915\u0947\u0935\u0932 \u0905\u0928\u0941\u0935\u093E\u0926",
        romanization: "\u0915\u0947\u0935\u0932 \u0930\u094B\u092E\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928",
        both: "\u0905\u0928\u0941\u0935\u093E\u0926 + \u0930\u094B\u092E\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928"
      },
      dropdown: {
        default: "\u0921\u093F\u092B\u093C\u0949\u0932\u094D\u091F",
        custom: "\u0915\u0938\u094D\u091F\u092E",
        dynamic: "\u0921\u093E\u092F\u0928\u0947\u092E\u093F\u0915",
        animated: "\u090F\u0928\u093F\u092E\u0947\u091F\u0947\u0921",
        theme: "\u0925\u0940\u092E",
        none: "\u0915\u094B\u0908 \u0928\u0939\u0940\u0902",
        show: "\u0926\u093F\u0916\u093E\u090F\u0901",
        hide: "\u091B\u093F\u092A\u093E\u090F\u0901",
        url: "URL",
        left: "\u092C\u093E\u090F\u0901",
        right: "\u0926\u093E\u090F\u0901"
      },
      sections: {
        accent: "\u090F\u0915\u094D\u0938\u0947\u0902\u091F",
        glow: "\u0917\u094D\u0932\u094B",
        background: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F",
        artist: "\u0915\u0932\u093E\u0915\u093E\u0930",
        player: "\u092A\u094D\u0932\u0947\u092F\u0930",
        playlist: "\u092A\u094D\u0932\u0947\u0932\u093F\u0938\u094D\u091F",
        lyrics: "\u0932\u093F\u0930\u093F\u0915\u094D\u0938",
        transparent: "\u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0915\u0902\u091F\u094D\u0930\u094B\u0932",
        nextSongCard: "\u0905\u0917\u0932\u093E \u0917\u093E\u0928\u093E \u0915\u093E\u0930\u094D\u0921"
      },
      glowOnOff: { on: "\u091A\u093E\u0932\u0942", off: "\u092C\u0902\u0926" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "\u091A\u094C\u0921\u093C\u093E\u0908 (px):",
        height: "\u090A\u0901\u091A\u093E\u0908 (px):",
        marginBottom: "\u0928\u0940\u091A\u0947 \u0915\u093E \u0905\u0902\u0924\u0930 (px):",
        marginLeft: "\u092C\u093E\u090F\u0901 \u0915\u093E \u0905\u0902\u0924\u0930 (px):",
        borderRadius: "\u0915\u0935\u0930 \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 (px):"
      },
      nextSongCard: {
        show: "\u0905\u0917\u0932\u093E \u0917\u093E\u0928\u093E \u0915\u093E\u0930\u094D\u0921:",
        position: "\u0938\u094D\u0925\u093F\u0924\u093F:",
        height: "\u0915\u093E\u0930\u094D\u0921 \u090A\u0901\u091A\u093E\u0908 (px):",
        maxWidth: "\u0905\u0927\u093F\u0915\u0924\u092E \u091A\u094C\u0921\u093C\u093E\u0908 (px):",
        gap: "\u0905\u0902\u0924\u0930 (px):",
        coverSize: "\u0915\u0935\u0930 \u0906\u0915\u093E\u0930 (px):",
        hpad: "\u0915\u094D\u0937\u0948\u0924\u093F\u091C \u092A\u0948\u0921\u093F\u0902\u0917 (px):",
        vpad: "\u0932\u0902\u092C\u0935\u0924 \u092A\u0948\u0921\u093F\u0902\u0917 (px):",
        gapPlayer: "\u092A\u094D\u0932\u0947\u092F\u0930 \u0938\u0947 \u0926\u0942\u0930\u0940 (px):",
        borderRadius: "\u0915\u094B\u0928\u0947 \u0915\u093E \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E (px):",
        coverRadius: "\u0915\u0935\u0930 \u0930\u0947\u0921\u093F\u092F\u0938 (px):"
      },
      tooltips: {
        accentColor: "\u092C\u091F\u0928 \u0914\u0930 \u0907\u0902\u091F\u0930\u0948\u0915\u094D\u091F\u093F\u0935 \u0924\u0924\u094D\u0935\u094B\u0902 \u0915\u093E \u0930\u0902\u0917",
        glowEffectMode: "\u0917\u094D\u0932\u094B \u092A\u094D\u0930\u092D\u093E\u0935 \u091A\u093E\u0932\u0942/\u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
        glowColor: "\u0917\u094D\u0932\u094B \u092A\u094D\u0930\u092D\u093E\u0935 \u0915\u093E \u0930\u0902\u0917 \u0905\u0928\u0941\u0915\u0942\u0932\u093F\u0924 \u0915\u0930\u0947\u0902",
        outlineColor: "\u0928\u094B-\u0917\u094D\u0932\u094B \u092E\u094B\u0921 \u092E\u0947\u0902 \u0906\u0909\u091F\u0932\u093E\u0907\u0928 \u0930\u0902\u0917 \u0905\u0928\u0941\u0915\u0942\u0932\u093F\u0924 \u0915\u0930\u0947\u0902",
        background: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F \u091B\u0935\u093F \u092E\u094B\u0921 \u091A\u0941\u0928\u0947\u0902",
        apbackground: "\u0915\u0932\u093E\u0915\u093E\u0930 \u092A\u0943\u0937\u094D\u0920 \u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F \u0905\u0928\u0941\u0915\u0942\u0932\u093F\u0924 \u0915\u0930\u0947\u0902",
        playerWidth: "\u092A\u094D\u0932\u0947\u092F\u0930 \u0915\u0940 \u091A\u094C\u0921\u093C\u093E\u0908 \u092C\u0926\u0932\u0947\u0902",
        playerRadius: "\u092A\u094D\u0932\u0947\u092F\u0930 \u0915\u094B\u0928\u094B\u0902 \u0915\u0940 \u0917\u094B\u0932\u093E\u0908",
        backgroundBlur: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F \u0927\u0941\u0902\u0927\u0932\u093E\u092A\u0928 \u0915\u0940 \u0924\u0940\u0935\u094D\u0930\u0924\u093E",
        backgroundBrightness: "\u092A\u0943\u0937\u094D\u0920\u092D\u0942\u092E\u093F \u091B\u0935\u093F \u0915\u0940 \u091A\u092E\u0915",
        transparentWidth: "\u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0935\u093F\u0902\u0921\u094B \u0915\u0902\u091F\u094D\u0930\u094B\u0932 \u0915\u0940 \u091A\u094C\u0921\u093C\u093E\u0908",
        transparentHeight: "\u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0935\u093F\u0902\u0921\u094B \u0915\u0902\u091F\u094D\u0930\u094B\u0932 \u0915\u0940 \u090A\u0901\u091A\u093E\u0908",
        artistScrollBlur: "\u0915\u0932\u093E\u0915\u093E\u0930 \u092A\u0943\u0937\u094D\u0920\u094B\u0902 \u092A\u0930 \u0938\u094D\u0915\u094D\u0930\u0949\u0932 \u0927\u0941\u0902\u0927\u0932\u093E\u092A\u0928",
        artistScrollBrightness: "\u0915\u0932\u093E\u0915\u093E\u0930 \u092A\u0943\u0937\u094D\u0920\u094B\u0902 \u092A\u0930 \u0938\u094D\u0915\u094D\u0930\u0949\u0932 \u091A\u092E\u0915",
        playlistHeaderBox: "\u092A\u094D\u0932\u0947\u0932\u093F\u0938\u094D\u091F \u0939\u0947\u0921\u0930 \u092C\u0949\u0915\u094D\u0938 \u0926\u093F\u0916\u093E\u090F\u0901/\u091B\u093F\u092A\u093E\u090F\u0901",
        lyricsMode: "\u0917\u0940\u0924 \u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u0941\u0935\u093E\u0926 \u0914\u0930 \u0930\u094B\u092E\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u092E\u094B\u0921",
        playerCustomWidth: "\u092A\u094D\u0930\u0924\u093F\u0936\u0924 \u092E\u0947\u0902 \u0915\u0938\u094D\u091F\u092E \u092A\u094D\u0932\u0947\u092F\u0930 \u091A\u094C\u0921\u093C\u093E\u0908",
        playerCustomHeight: "\u092A\u093F\u0915\u094D\u0938\u0947\u0932 \u092E\u0947\u0902 \u0915\u0938\u094D\u091F\u092E \u092A\u094D\u0932\u0947\u092F\u0930 \u090A\u0901\u091A\u093E\u0908",
        comfyCoverArtEnabled: "\u092A\u094D\u0932\u0947\u092F\u0930 \u092E\u0947\u0902 \u0915\u0935\u0930 \u0906\u0930\u094D\u091F \u0926\u093F\u0916\u093E\u090F\u0901/\u091B\u093F\u092A\u093E\u090F\u0901",
        comfyCoverArtWidth: "\u0915\u0935\u0930 \u0906\u0930\u094D\u091F \u091B\u0935\u093F \u0915\u0940 \u091A\u094C\u0921\u093C\u093E\u0908",
        comfyCoverArtHeight: "\u0915\u0935\u0930 \u0906\u0930\u094D\u091F \u091B\u0935\u093F \u0915\u0940 \u090A\u0901\u091A\u093E\u0908",
        comfyCoverArtMarginBottom: "\u0928\u0940\u091A\u0947 \u0915\u093E \u0911\u092B\u0938\u0947\u091F",
        comfyCoverArtMarginLeft: "\u092C\u093E\u090F\u0901 \u0915\u093E \u0911\u092B\u0938\u0947\u091F",
        comfyCoverArtBorderRadius: "\u0915\u0935\u0930 \u092C\u0949\u0930\u094D\u0921\u0930 \u0930\u0947\u0921\u093F\u092F\u0938",
        nscShow: "\u0905\u0917\u0932\u093E \u0917\u093E\u0928\u093E \u0915\u093E\u0930\u094D\u0921 \u0926\u093F\u0916\u093E\u090F\u0901/\u091B\u093F\u092A\u093E\u090F\u0901",
        nscPosition: "\u0915\u093E\u0930\u094D\u0921 \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F (\u092C\u093E\u090F\u0901/\u0926\u093E\u090F\u0901)",
        nscHeight: "\u0915\u093E\u0930\u094D\u0921 \u0915\u0940 \u090A\u0901\u091A\u093E\u0908",
        nscMaxWidth: "\u0915\u093E\u0930\u094D\u0921 \u0915\u0940 \u0905\u0927\u093F\u0915\u0924\u092E \u091A\u094C\u0921\u093C\u093E\u0908",
        nscGap: "\u0915\u0935\u0930 \u0914\u0930 \u091F\u0947\u0915\u094D\u0938\u094D\u091F \u0915\u0947 \u092C\u0940\u091A \u0915\u093E \u0905\u0902\u0924\u0930",
        nscCoverSize: "\u0915\u0935\u0930 \u091B\u0935\u093F \u0915\u093E \u0906\u0915\u093E\u0930",
        nscHpad: "\u0915\u093E\u0930\u094D\u0921 \u0915\u093E \u0915\u094D\u0937\u0948\u0924\u093F\u091C \u092A\u0948\u0921\u093F\u0902\u0917",
        nscVpad: "\u0915\u093E\u0930\u094D\u0921 \u0915\u093E \u0932\u0902\u092C\u0935\u0924 \u092A\u0948\u0921\u093F\u0902\u0917",
        nscGapPlayer: "\u092A\u094D\u0932\u0947\u092F\u0930 \u0924\u0915 \u0915\u0940 \u0926\u0942\u0930\u0940",
        nscBorderRadius: "\u0915\u093E\u0930\u094D\u0921 \u0915\u093E \u0915\u094B\u0928\u093E \u0924\u094D\u0930\u093F\u091C\u094D\u092F\u093E",
        nscCoverRadius: "NSC \u0915\u0935\u0930 \u0930\u0947\u0921\u093F\u092F\u0938"
      }
    },
    sv: {
      settingsTitle: "Glowify Inst\xE4llningar",
      title: "Glowify Inst\xE4llningar",
      accentColor: "Knappens accentf\xE4rg:",
      glowEffectMode: "Gl\xF6dl\xE4ge:",
      glowColor: "Gl\xF6dens accentf\xE4rg:",
      outlineColor: "Konturens accentf\xE4rg:",
      background: "Bakgrund:",
      apbackground: "Artistsidans bakgrund:",
      playerWidth: "Spelarbredd:",
      playerRadius: "Spelarens kantradie:",
      backgroundBlur: "Bakgrundsosk\xE4rpa:",
      backgroundBrightness: "Bakgrundsljusstyrka (%):",
      transparentWidth: "Transparenta kontroller bredd:",
      transparentHeight: "Transparenta kontroller h\xF6jd:",
      artistScrollBlur: "Artistrullning osk\xE4rpa (px):",
      artistScrollBrightness: "Artistrullning ljusstyrka (%):",
      close: "St\xE4ng",
      playlistHeaderBox: "Spellistans rubrikruta:",
      playerCustomWidth: "Spelarbredd (%):",
      playerCustomHeight: "Spelarh\xF6jd (px):",
      chooseFile: "V\xE4lj fil",
      enterUrl: "Ange bild-URL...",
      lyricsMode: "Text\xF6vers\xE4ttning/romanisering:",
      lyricsOptions: {
        off: "Av",
        translation: "Endast \xF6vers\xE4ttning",
        romanization: "Endast romanisering",
        both: "\xD6vers\xE4ttning + romanisering"
      },
      dropdown: {
        default: "Standard",
        custom: "Anpassad",
        dynamic: "Dynamisk",
        animated: "Animerad",
        theme: "Tema",
        none: "Ingen",
        show: "Visa",
        hide: "D\xF6lj",
        url: "URL",
        left: "V\xE4nster",
        right: "H\xF6ger"
      },
      sections: {
        accent: "Accent",
        glow: "Gl\xF6d",
        background: "Bakgrund",
        artist: "Artist",
        player: "Spelare",
        playlist: "Spellista",
        lyrics: "Texter",
        transparent: "Transparenta Kontroller",
        nextSongCard: "N\xE4sta l\xE5t-kort"
      },
      glowOnOff: { on: "P\xE5", off: "Av" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "Bredd (px):",
        height: "H\xF6jd (px):",
        marginBottom: "Marginal nedtill (px):",
        marginLeft: "Marginal v\xE4nster (px):",
        borderRadius: "Omslagets kantradie (px):"
      },
      nextSongCard: {
        show: "N\xE4sta l\xE5t-kort:",
        position: "Position:",
        height: "Korth\xF6jd (px):",
        maxWidth: "Max bredd (px):",
        gap: "Mellanrum (px):",
        coverSize: "Omslagsstorlek (px):",
        hpad: "Horisontell Utfyllnad (px):",
        vpad: "Vertikal Utfyllnad (px):",
        gapPlayer: "Avst\xE5nd till spelare (px):",
        borderRadius: "H\xF6rnradie (px):",
        coverRadius: "Omslagsradie (px):"
      },
      tooltips: {
        accentColor: "F\xE4rg p\xE5 knappar och interaktiva element",
        glowEffectMode: "Sl\xE5 p\xE5/av gl\xF6deffekten",
        glowColor: "Anpassa gl\xF6deffektens f\xE4rg",
        outlineColor: "Anpassa konturf\xE4rgen i icke-gl\xF6dl\xE4ge",
        background: "V\xE4lj bakgrundsbildl\xE4ge",
        apbackground: "Anpassa artistsidans bakgrund",
        playerWidth: "\xC4ndra spelarens bredd",
        playerRadius: "Avrundning av spelarens h\xF6rn",
        backgroundBlur: "Styrka p\xE5 bakgrundsosk\xE4rpan",
        backgroundBrightness: "Ljusstyrka p\xE5 bakgrundsbilden",
        transparentWidth: "Bredd p\xE5 transparenta f\xF6nsterkontroller",
        transparentHeight: "H\xF6jd p\xE5 transparenta f\xF6nsterkontroller",
        artistScrollBlur: "Osk\xE4rpa vid rullning p\xE5 artistsidor",
        artistScrollBrightness: "Ljusstyrka vid rullning p\xE5 artistsidor",
        playlistHeaderBox: "Visa/d\xF6lj spellistans rubrikruta",
        lyricsMode: "\xD6vers\xE4ttnings- och romaniseringsl\xE4ge f\xF6r texter",
        playerCustomWidth: "Anpassad spelarbredd i procent",
        playerCustomHeight: "Anpassad spelarh\xF6jd i pixlar",
        comfyCoverArtEnabled: "Visa/d\xF6lj omslag i spelaren",
        comfyCoverArtWidth: "Bredd p\xE5 omslagsbilden",
        comfyCoverArtHeight: "H\xF6jd p\xE5 omslagsbilden",
        comfyCoverArtMarginBottom: "F\xF6rskjutning nedtill",
        comfyCoverArtMarginLeft: "F\xF6rskjutning v\xE4nster",
        comfyCoverArtBorderRadius: "Kantradie f\xF6r omslaget",
        nscShow: "Visa/d\xF6lj n\xE4sta l\xE5t-kort",
        nscPosition: "Kortets position (v\xE4nster/h\xF6ger)",
        nscHeight: "Kortets h\xF6jd",
        nscMaxWidth: "Kortets maximala bredd",
        nscGap: "Mellanrum mellan omslag och text",
        nscCoverSize: "Omslagsstorlek",
        nscHpad: "Kortets horisontella utfyllnad",
        nscVpad: "Kortets vertikala utfyllnad",
        nscGapPlayer: "Avst\xE5nd till spelaren",
        nscBorderRadius: "H\xF6rnradie p\xE5 kortet",
        nscCoverRadius: "NSC-omslagets h\xF6rnradie"
      }
    },
    ja: {
      settingsTitle: "Glowify \u8A2D\u5B9A",
      title: "Glowify \u8A2D\u5B9A",
      accentColor: "\u30DC\u30BF\u30F3\u30A2\u30AF\u30BB\u30F3\u30C8\u30AB\u30E9\u30FC:",
      glowEffectMode: "\u30B0\u30ED\u30FC\u30E2\u30FC\u30C9:",
      glowColor: "\u30B0\u30ED\u30FC\u30A2\u30AF\u30BB\u30F3\u30C8\u30AB\u30E9\u30FC:",
      outlineColor: "\u30A2\u30A6\u30C8\u30E9\u30A4\u30F3\u30A2\u30AF\u30BB\u30F3\u30C8\u30AB\u30E9\u30FC:",
      background: "\u80CC\u666F:",
      apbackground: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8\u30DA\u30FC\u30B8\u306E\u80CC\u666F:",
      playerWidth: "\u30D7\u30EC\u30FC\u30E4\u30FC\u5E45:",
      playerRadius: "\u30D7\u30EC\u30FC\u30E4\u30FC\u306E\u89D2\u4E38:",
      backgroundBlur: "\u80CC\u666F\u306E\u307C\u304B\u3057:",
      backgroundBrightness: "\u80CC\u666F\u306E\u660E\u308B\u3055 (%):",
      transparentWidth: "\u900F\u660E\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u5E45:",
      transparentHeight: "\u900F\u660E\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u9AD8\u3055:",
      artistScrollBlur: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8\u30B9\u30AF\u30ED\u30FC\u30EB\u307C\u304B\u3057 (px):",
      artistScrollBrightness: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8\u30B9\u30AF\u30ED\u30FC\u30EB\u660E\u308B\u3055 (%):",
      close: "\u9589\u3058\u308B",
      playlistHeaderBox: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8\u30D8\u30C3\u30C0\u30FC\u30DC\u30C3\u30AF\u30B9:",
      playerCustomWidth: "\u30D7\u30EC\u30FC\u30E4\u30FC\u5E45 (%):",
      playerCustomHeight: "\u30D7\u30EC\u30FC\u30E4\u30FC\u9AD8\u3055 (px):",
      chooseFile: "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E",
      enterUrl: "\u753B\u50CFURL\u3092\u5165\u529B...",
      lyricsMode: "\u6B4C\u8A5E\u306E\u7FFB\u8A33/\u30ED\u30FC\u30DE\u5B57\u5316:",
      lyricsOptions: {
        off: "\u30AA\u30D5",
        translation: "\u7FFB\u8A33\u306E\u307F",
        romanization: "\u30ED\u30FC\u30DE\u5B57\u306E\u307F",
        both: "\u7FFB\u8A33 + \u30ED\u30FC\u30DE\u5B57"
      },
      dropdown: {
        default: "\u30C7\u30D5\u30A9\u30EB\u30C8",
        custom: "\u30AB\u30B9\u30BF\u30E0",
        dynamic: "\u30C0\u30A4\u30CA\u30DF\u30C3\u30AF",
        animated: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3",
        theme: "\u30C6\u30FC\u30DE",
        none: "\u306A\u3057",
        show: "\u8868\u793A",
        hide: "\u975E\u8868\u793A",
        url: "URL",
        left: "\u5DE6",
        right: "\u53F3"
      },
      sections: {
        accent: "\u30A2\u30AF\u30BB\u30F3\u30C8",
        glow: "\u30B0\u30ED\u30FC",
        background: "\u80CC\u666F",
        artist: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8",
        player: "\u30D7\u30EC\u30FC\u30E4\u30FC",
        playlist: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8",
        lyrics: "\u6B4C\u8A5E",
        transparent: "\u900F\u660E\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB",
        nextSongCard: "\u6B21\u306E\u66F2\u30AB\u30FC\u30C9"
      },
      glowOnOff: { on: "\u30AA\u30F3", off: "\u30AA\u30D5" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "\u5E45 (px):",
        height: "\u9AD8\u3055 (px):",
        marginBottom: "\u4E0B\u30DE\u30FC\u30B8\u30F3 (px):",
        marginLeft: "\u5DE6\u30DE\u30FC\u30B8\u30F3 (px):",
        borderRadius: "\u30AB\u30D0\u30FC\u306E\u89D2\u4E38 (px):"
      },
      nextSongCard: {
        show: "\u6B21\u306E\u66F2\u30AB\u30FC\u30C9:",
        position: "\u4F4D\u7F6E:",
        height: "\u30AB\u30FC\u30C9\u306E\u9AD8\u3055 (px):",
        maxWidth: "\u6700\u5927\u5E45 (px):",
        gap: "\u9593\u9694 (px):",
        coverSize: "\u30AB\u30D0\u30FC\u30B5\u30A4\u30BA (px):",
        hpad: "\u6C34\u5E73\u30D1\u30C7\u30A3\u30F3\u30B0 (px):",
        vpad: "\u5782\u76F4\u30D1\u30C7\u30A3\u30F3\u30B0 (px):",
        gapPlayer: "\u30D7\u30EC\u30FC\u30E4\u30FC\u3068\u306E\u9593\u9694 (px):",
        borderRadius: "\u89D2\u4E38 (px):",
        coverRadius: "\u30AB\u30D0\u30FC\u306E\u89D2\u4E38 (px):"
      },
      tooltips: {
        accentColor: "\u30DC\u30BF\u30F3\u3068\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6\u8981\u7D20\u306E\u8272",
        glowEffectMode: "\u30B0\u30ED\u30FC\u52B9\u679C\u306E\u30AA\u30F3/\u30AA\u30D5",
        glowColor: "\u30B0\u30ED\u30FC\u52B9\u679C\u306E\u8272\u3092\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA",
        outlineColor: "\u30B0\u30ED\u30FC\u7121\u52B9\u6642\u306E\u30A2\u30A6\u30C8\u30E9\u30A4\u30F3\u306E\u8272\u3092\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA",
        background: "\u80CC\u666F\u753B\u50CF\u30E2\u30FC\u30C9\u3092\u9078\u629E",
        apbackground: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8\u30DA\u30FC\u30B8\u306E\u80CC\u666F\u3092\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA",
        playerWidth: "\u30D7\u30EC\u30FC\u30E4\u30FC\u306E\u5E45\u3092\u5909\u66F4",
        playerRadius: "\u30D7\u30EC\u30FC\u30E4\u30FC\u306E\u89D2\u306E\u4E38\u307F",
        backgroundBlur: "\u80CC\u666F\u306E\u307C\u304B\u3057\u306E\u5F37\u3055",
        backgroundBrightness: "\u80CC\u666F\u753B\u50CF\u306E\u660E\u308B\u3055",
        transparentWidth: "\u900F\u660E\u30A6\u30A3\u30F3\u30C9\u30A6\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u306E\u5E45",
        transparentHeight: "\u900F\u660E\u30A6\u30A3\u30F3\u30C9\u30A6\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u306E\u9AD8\u3055",
        artistScrollBlur: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8\u30DA\u30FC\u30B8\u3067\u306E\u30B9\u30AF\u30ED\u30FC\u30EB\u6642\u306E\u307C\u304B\u3057",
        artistScrollBrightness: "\u30A2\u30FC\u30C6\u30A3\u30B9\u30C8\u30DA\u30FC\u30B8\u3067\u306E\u30B9\u30AF\u30ED\u30FC\u30EB\u6642\u306E\u660E\u308B\u3055",
        playlistHeaderBox: "\u30D7\u30EC\u30A4\u30EA\u30B9\u30C8\u30D8\u30C3\u30C0\u30FC\u30DC\u30C3\u30AF\u30B9\u306E\u8868\u793A/\u975E\u8868\u793A",
        lyricsMode: "\u6B4C\u8A5E\u306E\u7FFB\u8A33\u3068\u30ED\u30FC\u30DE\u5B57\u5316\u30E2\u30FC\u30C9",
        playerCustomWidth: "\u30AB\u30B9\u30BF\u30E0\u30D7\u30EC\u30FC\u30E4\u30FC\u5E45\uFF08\u30D1\u30FC\u30BB\u30F3\u30C8\uFF09",
        playerCustomHeight: "\u30AB\u30B9\u30BF\u30E0\u30D7\u30EC\u30FC\u30E4\u30FC\u9AD8\u3055\uFF08\u30D4\u30AF\u30BB\u30EB\uFF09",
        comfyCoverArtEnabled: "\u30D7\u30EC\u30FC\u30E4\u30FC\u306E\u30AB\u30D0\u30FC\u30A2\u30FC\u30C8\u3092\u8868\u793A/\u975E\u8868\u793A",
        comfyCoverArtWidth: "\u30AB\u30D0\u30FC\u30A2\u30FC\u30C8\u753B\u50CF\u306E\u5E45",
        comfyCoverArtHeight: "\u30AB\u30D0\u30FC\u30A2\u30FC\u30C8\u753B\u50CF\u306E\u9AD8\u3055",
        comfyCoverArtMarginBottom: "\u4E0B\u306E\u30AA\u30D5\u30BB\u30C3\u30C8",
        comfyCoverArtMarginLeft: "\u5DE6\u306E\u30AA\u30D5\u30BB\u30C3\u30C8",
        comfyCoverArtBorderRadius: "\u30AB\u30D0\u30FC\u306E\u89D2\u4E38",
        nscShow: "\u6B21\u306E\u66F2\u30AB\u30FC\u30C9\u3092\u8868\u793A/\u975E\u8868\u793A",
        nscPosition: "\u30AB\u30FC\u30C9\u306E\u4F4D\u7F6E\uFF08\u5DE6/\u53F3\uFF09",
        nscHeight: "\u30AB\u30FC\u30C9\u306E\u9AD8\u3055",
        nscMaxWidth: "\u30AB\u30FC\u30C9\u306E\u6700\u5927\u5E45",
        nscGap: "\u30AB\u30D0\u30FC\u3068\u30C6\u30AD\u30B9\u30C8\u306E\u9593\u9694",
        nscCoverSize: "\u30AB\u30D0\u30FC\u753B\u50CF\u306E\u30B5\u30A4\u30BA",
        nscHpad: "\u30AB\u30FC\u30C9\u306E\u6C34\u5E73\u30D1\u30C7\u30A3\u30F3\u30B0",
        nscVpad: "\u30AB\u30FC\u30C9\u306E\u5782\u76F4\u30D1\u30C7\u30A3\u30F3\u30B0",
        nscGapPlayer: "\u30D7\u30EC\u30FC\u30E4\u30FC\u3068\u306E\u8DDD\u96E2",
        nscBorderRadius: "\u30AB\u30FC\u30C9\u306E\u89D2\u4E38",
        nscCoverRadius: "NSC\u30AB\u30D0\u30FC\u306E\u89D2\u4E38"
      }
    },
    zh: {
      settingsTitle: "Glowify \u8BBE\u7F6E",
      title: "Glowify \u8BBE\u7F6E",
      accentColor: "\u6309\u94AE\u5F3A\u8C03\u8272:",
      glowEffectMode: "\u53D1\u5149\u6A21\u5F0F:",
      glowColor: "\u53D1\u5149\u5F3A\u8C03\u8272:",
      outlineColor: "\u8F6E\u5ED3\u5F3A\u8C03\u8272:",
      background: "\u80CC\u666F:",
      apbackground: "\u827A\u4EBA\u9875\u9762\u80CC\u666F:",
      playerWidth: "\u64AD\u653E\u5668\u5BBD\u5EA6:",
      playerRadius: "\u64AD\u653E\u5668\u5706\u89D2:",
      backgroundBlur: "\u80CC\u666F\u6A21\u7CCA:",
      backgroundBrightness: "\u80CC\u666F\u4EAE\u5EA6 (%):",
      transparentWidth: "\u900F\u660E\u63A7\u4EF6\u5BBD\u5EA6:",
      transparentHeight: "\u900F\u660E\u63A7\u4EF6\u9AD8\u5EA6:",
      artistScrollBlur: "\u827A\u4EBA\u6EDA\u52A8\u6A21\u7CCA (px):",
      artistScrollBrightness: "\u827A\u4EBA\u6EDA\u52A8\u4EAE\u5EA6 (%):",
      close: "\u5173\u95ED",
      playlistHeaderBox: "\u64AD\u653E\u5217\u8868\u6807\u9898\u6846:",
      playerCustomWidth: "\u64AD\u653E\u5668\u5BBD\u5EA6 (%):",
      playerCustomHeight: "\u64AD\u653E\u5668\u9AD8\u5EA6 (px):",
      chooseFile: "\u9009\u62E9\u6587\u4EF6",
      enterUrl: "\u8F93\u5165\u56FE\u7247URL...",
      lyricsMode: "\u6B4C\u8BCD\u7FFB\u8BD1/\u7F57\u9A6C\u5316:",
      lyricsOptions: {
        off: "\u5173\u95ED",
        translation: "\u4EC5\u7FFB\u8BD1",
        romanization: "\u4EC5\u7F57\u9A6C\u5316",
        both: "\u7FFB\u8BD1 + \u7F57\u9A6C\u5316"
      },
      dropdown: {
        default: "\u9ED8\u8BA4",
        custom: "\u81EA\u5B9A\u4E49",
        dynamic: "\u52A8\u6001",
        animated: "\u52A8\u753B",
        theme: "\u4E3B\u9898",
        none: "\u65E0",
        show: "\u663E\u793A",
        hide: "\u9690\u85CF",
        url: "URL",
        left: "\u5DE6",
        right: "\u53F3"
      },
      sections: {
        accent: "\u5F3A\u8C03",
        glow: "\u53D1\u5149",
        background: "\u80CC\u666F",
        artist: "\u827A\u4EBA",
        player: "\u64AD\u653E\u5668",
        playlist: "\u64AD\u653E\u5217\u8868",
        lyrics: "\u6B4C\u8BCD",
        transparent: "\u900F\u660E\u63A7\u4EF6",
        nextSongCard: "\u4E0B\u4E00\u9996\u6B4C\u66F2\u5361\u7247"
      },
      glowOnOff: { on: "\u5F00", off: "\u5173" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "\u5BBD\u5EA6 (px):",
        height: "\u9AD8\u5EA6 (px):",
        marginBottom: "\u4E0B\u8FB9\u8DDD (px):",
        marginLeft: "\u5DE6\u8FB9\u8DDD (px):",
        borderRadius: "\u5C01\u9762\u5706\u89D2 (px):"
      },
      nextSongCard: {
        show: "\u4E0B\u4E00\u9996\u6B4C\u66F2\u5361\u7247:",
        position: "\u4F4D\u7F6E:",
        height: "\u5361\u7247\u9AD8\u5EA6 (px):",
        maxWidth: "\u6700\u5927\u5BBD\u5EA6 (px):",
        gap: "\u95F4\u8DDD (px):",
        coverSize: "\u5C01\u9762\u5927\u5C0F (px):",
        hpad: "\u6C34\u5E73\u5185\u8FB9\u8DDD (px):",
        vpad: "\u5782\u76F4\u5185\u8FB9\u8DDD (px):",
        gapPlayer: "\u4E0E\u64AD\u653E\u5668\u95F4\u8DDD (px):",
        borderRadius: "\u5706\u89D2 (px):",
        coverRadius: "\u5C01\u9762\u5706\u89D2 (px):"
      },
      tooltips: {
        accentColor: "\u6309\u94AE\u548C\u4EA4\u4E92\u5143\u7D20\u7684\u989C\u8272",
        glowEffectMode: "\u5F00\u542F\u6216\u5173\u95ED\u53D1\u5149\u6548\u679C",
        glowColor: "\u81EA\u5B9A\u4E49\u53D1\u5149\u6548\u679C\u989C\u8272",
        outlineColor: "\u81EA\u5B9A\u4E49\u65E0\u53D1\u5149\u6A21\u5F0F\u4E0B\u7684\u8F6E\u5ED3\u989C\u8272",
        background: "\u9009\u62E9\u80CC\u666F\u56FE\u7247\u6A21\u5F0F",
        apbackground: "\u81EA\u5B9A\u4E49\u827A\u4EBA\u9875\u9762\u80CC\u666F",
        playerWidth: "\u66F4\u6539\u64AD\u653E\u5668\u5BBD\u5EA6",
        playerRadius: "\u64AD\u653E\u5668\u5706\u89D2\u5F27\u5EA6",
        backgroundBlur: "\u80CC\u666F\u6A21\u7CCA\u5F3A\u5EA6",
        backgroundBrightness: "\u80CC\u666F\u56FE\u7247\u4EAE\u5EA6",
        transparentWidth: "\u900F\u660E\u7A97\u53E3\u63A7\u4EF6\u5BBD\u5EA6",
        transparentHeight: "\u900F\u660E\u7A97\u53E3\u63A7\u4EF6\u9AD8\u5EA6",
        artistScrollBlur: "\u827A\u4EBA\u9875\u9762\u6EDA\u52A8\u65F6\u7684\u6A21\u7CCA",
        artistScrollBrightness: "\u827A\u4EBA\u9875\u9762\u6EDA\u52A8\u65F6\u7684\u4EAE\u5EA6",
        playlistHeaderBox: "\u663E\u793A/\u9690\u85CF\u64AD\u653E\u5217\u8868\u6807\u9898\u6846",
        lyricsMode: "\u6B4C\u8BCD\u7FFB\u8BD1\u548C\u7F57\u9A6C\u5316\u6A21\u5F0F",
        playerCustomWidth: "\u81EA\u5B9A\u4E49\u64AD\u653E\u5668\u5BBD\u5EA6\uFF08\u767E\u5206\u6BD4\uFF09",
        playerCustomHeight: "\u81EA\u5B9A\u4E49\u64AD\u653E\u5668\u9AD8\u5EA6\uFF08\u50CF\u7D20\uFF09",
        comfyCoverArtEnabled: "\u5728\u64AD\u653E\u5668\u4E2D\u663E\u793A/\u9690\u85CF\u5C01\u9762",
        comfyCoverArtWidth: "\u5C01\u9762\u56FE\u7247\u5BBD\u5EA6",
        comfyCoverArtHeight: "\u5C01\u9762\u56FE\u7247\u9AD8\u5EA6",
        comfyCoverArtMarginBottom: "\u4E0B\u65B9\u504F\u79FB",
        comfyCoverArtMarginLeft: "\u5DE6\u65B9\u504F\u79FB",
        comfyCoverArtBorderRadius: "\u5C01\u9762\u5706\u89D2",
        nscShow: "\u663E\u793A/\u9690\u85CF\u4E0B\u4E00\u9996\u6B4C\u66F2\u5361\u7247",
        nscPosition: "\u5361\u7247\u4F4D\u7F6E\uFF08\u5DE6/\u53F3\uFF09",
        nscHeight: "\u5361\u7247\u9AD8\u5EA6",
        nscMaxWidth: "\u5361\u7247\u6700\u5927\u5BBD\u5EA6",
        nscGap: "\u5C01\u9762\u548C\u6587\u5B57\u4E4B\u95F4\u7684\u95F4\u8DDD",
        nscCoverSize: "\u5C01\u9762\u56FE\u7247\u5927\u5C0F",
        nscHpad: "\u5361\u7247\u6C34\u5E73\u5185\u8FB9\u8DDD",
        nscVpad: "\u5361\u7247\u5782\u76F4\u5185\u8FB9\u8DDD",
        nscGapPlayer: "\u5230\u64AD\u653E\u5668\u7684\u8DDD\u79BB",
        nscBorderRadius: "\u5361\u7247\u5706\u89D2",
        nscCoverRadius: "NSC\u5C01\u9762\u5706\u89D2"
      }
    },
    ko: {
      settingsTitle: "Glowify \uC124\uC815",
      title: "Glowify \uC124\uC815",
      accentColor: "\uBC84\uD2BC \uAC15\uC870 \uC0C9\uC0C1:",
      glowEffectMode: "\uAE00\uB85C\uC6B0 \uBAA8\uB4DC:",
      glowColor: "\uAE00\uB85C\uC6B0 \uAC15\uC870 \uC0C9\uC0C1:",
      outlineColor: "\uC544\uC6C3\uB77C\uC778 \uAC15\uC870 \uC0C9\uC0C1:",
      background: "\uBC30\uACBD:",
      apbackground: "\uC544\uD2F0\uC2A4\uD2B8 \uD398\uC774\uC9C0 \uBC30\uACBD:",
      playerWidth: "\uD50C\uB808\uC774\uC5B4 \uB108\uBE44:",
      playerRadius: "\uD50C\uB808\uC774\uC5B4 \uBAA8\uC11C\uB9AC \uBC18\uACBD:",
      backgroundBlur: "\uBC30\uACBD \uBE14\uB7EC:",
      backgroundBrightness: "\uBC30\uACBD \uBC1D\uAE30 (%):",
      transparentWidth: "\uD22C\uBA85 \uCEE8\uD2B8\uB864 \uB108\uBE44:",
      transparentHeight: "\uD22C\uBA85 \uCEE8\uD2B8\uB864 \uB192\uC774:",
      artistScrollBlur: "\uC544\uD2F0\uC2A4\uD2B8 \uC2A4\uD06C\uB864 \uBE14\uB7EC (px):",
      artistScrollBrightness: "\uC544\uD2F0\uC2A4\uD2B8 \uC2A4\uD06C\uB864 \uBC1D\uAE30 (%):",
      close: "\uB2EB\uAE30",
      playlistHeaderBox: "\uD50C\uB808\uC774\uB9AC\uC2A4\uD2B8 \uD5E4\uB354 \uBC15\uC2A4:",
      playerCustomWidth: "\uD50C\uB808\uC774\uC5B4 \uB108\uBE44 (%):",
      playerCustomHeight: "\uD50C\uB808\uC774\uC5B4 \uB192\uC774 (px):",
      chooseFile: "\uD30C\uC77C \uC120\uD0DD",
      enterUrl: "\uC774\uBBF8\uC9C0 URL \uC785\uB825...",
      lyricsMode: "\uAC00\uC0AC \uBC88\uC5ED/\uB85C\uB9C8\uC790 \uD45C\uAE30:",
      lyricsOptions: {
        off: "\uB044\uAE30",
        translation: "\uBC88\uC5ED\uB9CC",
        romanization: "\uB85C\uB9C8\uC790\uB9CC",
        both: "\uBC88\uC5ED + \uB85C\uB9C8\uC790"
      },
      dropdown: {
        default: "\uAE30\uBCF8",
        custom: "\uC0AC\uC6A9\uC790 \uC9C0\uC815",
        dynamic: "\uB2E4\uC774\uB0B4\uBBF9",
        animated: "\uC560\uB2C8\uBA54\uC774\uC158",
        theme: "\uD14C\uB9C8",
        none: "\uC5C6\uC74C",
        show: "\uD45C\uC2DC",
        hide: "\uC228\uAE30\uAE30",
        url: "URL",
        left: "\uC67C\uCABD",
        right: "\uC624\uB978\uCABD"
      },
      sections: {
        accent: "\uAC15\uC870",
        glow: "\uAE00\uB85C\uC6B0",
        background: "\uBC30\uACBD",
        artist: "\uC544\uD2F0\uC2A4\uD2B8",
        player: "\uD50C\uB808\uC774\uC5B4",
        playlist: "\uD50C\uB808\uC774\uB9AC\uC2A4\uD2B8",
        lyrics: "\uAC00\uC0AC",
        transparent: "\uD22C\uBA85 \uCEE8\uD2B8\uB864",
        nextSongCard: "\uB2E4\uC74C \uACE1 \uCE74\uB4DC"
      },
      glowOnOff: { on: "\uCF1C\uAE30", off: "\uB044\uAE30" },
      comfyCoverArt: {
        enabled: "Comfy Cover Art:",
        width: "\uB108\uBE44 (px):",
        height: "\uB192\uC774 (px):",
        marginBottom: "\uD558\uB2E8 \uC5EC\uBC31 (px):",
        marginLeft: "\uC88C\uCE21 \uC5EC\uBC31 (px):",
        borderRadius: "\uCEE4\uBC84 \uBAA8\uC11C\uB9AC \uBC18\uACBD (px):"
      },
      nextSongCard: {
        show: "\uB2E4\uC74C \uACE1 \uCE74\uB4DC:",
        position: "\uC704\uCE58:",
        height: "\uCE74\uB4DC \uB192\uC774 (px):",
        maxWidth: "\uCD5C\uB300 \uB108\uBE44 (px):",
        gap: "\uAC04\uACA9 (px):",
        coverSize: "\uCEE4\uBC84 \uD06C\uAE30 (px):",
        hpad: "\uAC00\uB85C \uD328\uB529 (px):",
        vpad: "\uC138\uB85C \uD328\uB529 (px):",
        gapPlayer: "\uD50C\uB808\uC774\uC5B4\uC640\uC758 \uAC04\uACA9 (px):",
        borderRadius: "\uBAA8\uC11C\uB9AC \uBC18\uACBD (px):",
        coverRadius: "\uCEE4\uBC84 \uBC18\uACBD (px):"
      },
      tooltips: {
        accentColor: "\uBC84\uD2BC \uBC0F \uC778\uD130\uB799\uD2F0\uBE0C \uC694\uC18C\uC758 \uC0C9\uC0C1",
        glowEffectMode: "\uAE00\uB85C\uC6B0 \uD6A8\uACFC \uCF1C\uAE30/\uB044\uAE30",
        glowColor: "\uAE00\uB85C\uC6B0 \uD6A8\uACFC \uC0C9\uC0C1 \uC0AC\uC6A9\uC790 \uC9C0\uC815",
        outlineColor: "\uAE00\uB85C\uC6B0 \uBE44\uD65C\uC131 \uBAA8\uB4DC\uC5D0\uC11C \uC544\uC6C3\uB77C\uC778 \uC0C9\uC0C1 \uC0AC\uC6A9\uC790 \uC9C0\uC815",
        background: "\uBC30\uACBD \uC774\uBBF8\uC9C0 \uBAA8\uB4DC \uC120\uD0DD",
        apbackground: "\uC544\uD2F0\uC2A4\uD2B8 \uD398\uC774\uC9C0 \uBC30\uACBD \uC0AC\uC6A9\uC790 \uC9C0\uC815",
        playerWidth: "\uD50C\uB808\uC774\uC5B4 \uB108\uBE44 \uBCC0\uACBD",
        playerRadius: "\uD50C\uB808\uC774\uC5B4 \uBAA8\uC11C\uB9AC \uB465\uAE00\uAE30",
        backgroundBlur: "\uBC30\uACBD \uBE14\uB7EC \uAC15\uB3C4",
        backgroundBrightness: "\uBC30\uACBD \uC774\uBBF8\uC9C0 \uBC1D\uAE30",
        transparentWidth: "\uD22C\uBA85 \uCC3D \uCEE8\uD2B8\uB864 \uB108\uBE44",
        transparentHeight: "\uD22C\uBA85 \uCC3D \uCEE8\uD2B8\uB864 \uB192\uC774",
        artistScrollBlur: "\uC544\uD2F0\uC2A4\uD2B8 \uD398\uC774\uC9C0 \uC2A4\uD06C\uB864 \uC2DC \uBE14\uB7EC",
        artistScrollBrightness: "\uC544\uD2F0\uC2A4\uD2B8 \uD398\uC774\uC9C0 \uC2A4\uD06C\uB864 \uC2DC \uBC1D\uAE30",
        playlistHeaderBox: "\uD50C\uB808\uC774\uB9AC\uC2A4\uD2B8 \uD5E4\uB354 \uBC15\uC2A4 \uD45C\uC2DC/\uC228\uAE30\uAE30",
        lyricsMode: "\uAC00\uC0AC \uBC88\uC5ED \uBC0F \uB85C\uB9C8\uC790 \uD45C\uAE30 \uBAA8\uB4DC",
        playerCustomWidth: "\uC0AC\uC6A9\uC790 \uC9C0\uC815 \uD50C\uB808\uC774\uC5B4 \uB108\uBE44 (\uD37C\uC13C\uD2B8)",
        playerCustomHeight: "\uC0AC\uC6A9\uC790 \uC9C0\uC815 \uD50C\uB808\uC774\uC5B4 \uB192\uC774 (\uD53D\uC140)",
        comfyCoverArtEnabled: "\uD50C\uB808\uC774\uC5B4\uC5D0\uC11C \uCEE4\uBC84 \uC544\uD2B8 \uD45C\uC2DC/\uC228\uAE30\uAE30",
        comfyCoverArtWidth: "\uCEE4\uBC84 \uC544\uD2B8 \uC774\uBBF8\uC9C0 \uB108\uBE44",
        comfyCoverArtHeight: "\uCEE4\uBC84 \uC544\uD2B8 \uC774\uBBF8\uC9C0 \uB192\uC774",
        comfyCoverArtMarginBottom: "\uD558\uB2E8 \uC624\uD504\uC14B",
        comfyCoverArtMarginLeft: "\uC88C\uCE21 \uC624\uD504\uC14B",
        comfyCoverArtBorderRadius: "\uCEE4\uBC84 \uBAA8\uC11C\uB9AC \uBC18\uACBD",
        nscShow: "\uB2E4\uC74C \uACE1 \uCE74\uB4DC \uD45C\uC2DC/\uC228\uAE30\uAE30",
        nscPosition: "\uCE74\uB4DC \uC704\uCE58 (\uC67C\uCABD/\uC624\uB978\uCABD)",
        nscHeight: "\uCE74\uB4DC \uB192\uC774",
        nscMaxWidth: "\uCE74\uB4DC \uCD5C\uB300 \uB108\uBE44",
        nscGap: "\uCEE4\uBC84\uC640 \uD14D\uC2A4\uD2B8 \uC0AC\uC774 \uAC04\uACA9",
        nscCoverSize: "\uCEE4\uBC84 \uC774\uBBF8\uC9C0 \uD06C\uAE30",
        nscHpad: "\uCE74\uB4DC \uAC00\uB85C \uD328\uB529",
        nscVpad: "\uCE74\uB4DC \uC138\uB85C \uD328\uB529",
        nscGapPlayer: "\uD50C\uB808\uC774\uC5B4\uAE4C\uC9C0\uC758 \uAC70\uB9AC",
        nscBorderRadius: "\uCE74\uB4DC \uBAA8\uC11C\uB9AC \uBC18\uACBD",
        nscCoverRadius: "NSC \uCEE4\uBC84 \uBAA8\uC11C\uB9AC \uBC18\uACBD"
      }
    }
  };
  function getTranslation() {
    var _a, _b;
    const clientLocale = (((_b = (_a = Spicetify == null ? void 0 : Spicetify.Platform) == null ? void 0 : _a.Session) == null ? void 0 : _b.locale) || navigator.language || "en").split("-")[0];
    const lang = glowifyTranslations[clientLocale] ? clientLocale : "en";
    return glowifyTranslations[lang];
  }
  var GLOWIFY_GEAR_HOST_SELECTOR = ".vRrKblnUUQV5eMbvUdv8";
  function ensureGlowifyGearStyle() {
    if (document.getElementById("glowify-gear-style")) return;
    const style = document.createElement("style");
    style.id = "glowify-gear-style";
    style.textContent = `
    #glowify-settings-gear-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--text-subdued);
      margin-inline-end: -13px;
      z-index: 2;
      align-self: center;
    }
    #glowify-settings-gear-btn:hover { color: var(--text-base); }
    #glowify-settings-gear-btn:focus-visible {
      outline: 2px solid var(--spice-button, var(--glowify-accent));
      outline-offset: 2px;
    }
    #glowify-settings-gear-btn svg { width: 18px; height: 18px; display: block; }
  `;
    document.head.appendChild(style);
  }
  function getGearSvg() {
    return `
    <svg role="img" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="butt" stroke-linejoin="miter">
      <path vector-effect="non-scaling-stroke" d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
      <path vector-effect="non-scaling-stroke" d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
  `;
  }
  function ensureGlowifyGearButton(t) {
    var _a;
    const host = document.querySelector(GLOWIFY_GEAR_HOST_SELECTOR);
    if (!host) return false;
    if ((_a = host.querySelector) == null ? void 0 : _a.call(host, "#glowify-settings-gear-btn")) return true;
    ensureGlowifyGearStyle();
    ensureSettingsUiStyle();
    const btn = document.createElement("button");
    btn.id = "glowify-settings-gear-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", t.settingsTitle);
    btn.innerHTML = getGearSvg();
    btn.style.setProperty("-webkit-app-region", "no-drag");
    btn.style.pointerEvents = "auto";
    let gearTooltipEl = null;
    btn.addEventListener("mouseenter", () => {
      if (gearTooltipEl) return;
      gearTooltipEl = document.createElement("div");
      gearTooltipEl.className = "glowifyTooltipPopup";
      gearTooltipEl.textContent = t.settingsTitle || "Glowify Settings";
      document.body.appendChild(gearTooltipEl);
      const r = btn.getBoundingClientRect();
      let left = r.left + r.width / 2;
      let top = r.bottom + 6;
      if (top + 40 > window.innerHeight - 4) top = r.top - 40 - 6;
      gearTooltipEl.style.left = left + "px";
      gearTooltipEl.style.top = top + "px";
    });
    btn.addEventListener("mouseleave", () => {
      if (gearTooltipEl) {
        gearTooltipEl.remove();
        gearTooltipEl = null;
      }
    });
    btn.addEventListener("click", () => {
      if (typeof window.showGlowifySettingsMenu === "function") window.showGlowifySettingsMenu();
    });
    host.insertBefore(btn, host.firstChild);
    return true;
  }
  function initGlowifyGearInjection(t) {
    const tryInsert = () => {
      try {
        ensureGlowifyGearButton(t);
      } catch (e) {
      }
    };
    tryInsert();
    const anyWin = window;
    if (!anyWin._glowifyGearInsertTimer) {
      const startedAt = Date.now();
      anyWin._glowifyGearInsertTimer = setInterval(() => {
        const host = document.querySelector(GLOWIFY_GEAR_HOST_SELECTOR);
        const hasBtn = !!document.querySelector("#glowify-settings-gear-btn");
        if (hasBtn || Date.now() - startedAt > 1e4) {
          clearInterval(anyWin._glowifyGearInsertTimer);
          anyWin._glowifyGearInsertTimer = null;
          return;
        }
        if (host) tryInsert();
      }, 200);
    }
    if (!anyWin._glowifyGearObserver) {
      anyWin._glowifyGearObserver = new MutationObserver(() => {
        if (anyWin._glowifyGearObserver._debounce) clearTimeout(anyWin._glowifyGearObserver._debounce);
        anyWin._glowifyGearObserver._debounce = setTimeout(() => {
          tryInsert();
          anyWin._glowifyGearObserver._debounce = null;
        }, 60);
      });
      anyWin._glowifyGearObserver.observe(document.body, { childList: true, subtree: true });
    }
  }
  var React;
  var ReactDOM;
  var GLOWIFY_DISCORD_URL = "https://discord.gg/QRMnrgjhvq";
  var GLOWIFY_GITHUB_URL = "https://github.com/NMWplays/Glowify";
  function openExternalLink(url) {
    if (!url) return;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      try {
        location.href = url;
      } catch (e2) {
      }
    }
  }
  function getDiscordIcon() {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        "aria-hidden": "true",
        focusable: "false"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" })
    );
  }
  function getGithubIcon() {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 98 96",
        fill: "currentColor",
        "aria-hidden": "true",
        focusable: "false"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        }
      )
    );
  }
  function ensureSettingsUiStyle() {
    if (document.getElementById("glowify-settings-ui-style")) return;
    const style = document.createElement("style");
    style.id = "glowify-settings-ui-style";
    style.textContent = `
    .glowifySettingsPanel {
      width: min(560px, 92vw);
      min-width: 0;
      padding: 18px 0 20px;
      border-radius: 20px;
      color: white;
      background: transparent;
      backdrop-filter: blur(2rem);
      -webkit-backdrop-filter: blur(2rem);
      box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color));
      position: relative;
      isolation: isolate;
      will-change: transform, opacity;
      height: min(60vh, calc(100vh - 80px));
      max-height: min(60vh, calc(100vh - 80px));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      transition: opacity .4s cubic-bezier(.16, 1, .3, 1), transform .4s cubic-bezier(.16, 1, .3, 1);
    }
    #glowify-settings-react-overlay.glowify-overlay-visible .glowifySettingsPanel {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .glowifySettingsHeader {
      position: relative;
      z-index: 10;
      margin: 0 0 14px 0;
      -webkit-backdrop-filter: blur(2rem) saturate(1.25) brightness(1.08);
      padding: 10px 12px;
      border-radius: 0;
      background: transparent;
      overflow: hidden;
      isolation: isolate;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .glowifySettingsTitle { margin: 0; text-align: center; font-weight: 700; position: relative; z-index: 1; }
    .glowifyHeaderActions {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 1;
    }
    .glowifyHeaderActionBtn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      box-shadow: none !important;
      background: #00000057 !important;
      padding: 0;
      transition: background-color 0.2s ease;
    }
    .glowifyHeaderActionBtn:hover { background: var(--accent-color) !important; }
    .glowifyHeaderActionBtn svg { width: 16px; height: 16px; display: block; }
    .glowifyCloseBtn { font-size: 18px; }
    .glowifySettingsBody {
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      /* Safe padding so large outer glows don't get clipped by the scroll container */
      padding: 34px;
      padding-top: 20px;
      padding-bottom: 10px;
      scrollbar-gutter: stable;
      margin-bottom: -20px;
      will-change: box-shadow, backdrop-filter;
    }
    .glowifyRow { display: flex; align-items: center; justify-content: flex-start; gap: 10px; width: 100%; margin: 10px 0; flex-wrap: wrap; }
    .glowifyLabel { min-width: 140px; text-align: left; flex: 1 1 140px; }
    .glowifyRowControls {
      display: flex;
      gap: 10px;
      flex: 0 0 auto;
      margin-left: auto;
      justify-content: flex-end;
      flex-wrap: nowrap;
      min-width: 0;
      max-width: 100%;
    }
    .glowifyStackedControls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
      min-width: 0;
      margin-left: auto;
      max-width: 100%;
    }
    .glowifyRowControls > * { flex: 0 0 auto; min-width: 0; }
    .glowifyControlSurface { background: transparent; border: none; border-radius: 12px; color: white; box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color)); }
    .glowifySelectBtn {
      appearance: none;
      padding: 6px 10px;
      cursor: pointer;
      min-width: 0;
      width: auto;
      max-width: 260px;
      text-align: left;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      white-space: nowrap;
    }
    .glowifySelectLabel { overflow: hidden; text-overflow: ellipsis; }
    .glowifySelectChevron { width: 14px; height: 14px; flex: 0 0 14px; position: relative; }
    .glowifySelectChevron::before {
      content: "";
      position: absolute;
      left: 4px;
      top: 3px;
      width: 6px;
      height: 6px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg);
      transform-origin: 50% 50%;
      transition: transform 160ms ease;
      will-change: transform;
    }
    .glowifySelectBtn.isOpen .glowifySelectChevron::before { transform: rotate(-135deg); }
    .glowifySelectBtn:focus-visible { outline: 2px solid var(--spice-button, var(--glowify-accent, var(--accent-color))); outline-offset: 2px; }
    .glowifySelectMenu {
      position: fixed;
      z-index: 999999;
      background: transparent;
      backdrop-filter: blur(2rem);
      -webkit-backdrop-filter: blur(2rem);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color));
      color: white;
      width: max-content;
    }
    .glowifySelectItem {
      padding: 8px 10px;
      cursor: pointer;
      user-select: none;
      color: white;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      transition: background-color 0.2s ease;
    }
    .glowifySelectItem:hover { background: var(--glowify-glow-accent); }

    .glowifyPopover {
      position: fixed;
      z-index: 1000000;
      border-radius: 17px;
      overflow: hidden;
      background: #00000057;
      backdrop-filter: blur(2rem);
      -webkit-backdrop-filter: blur(2rem);
      box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color));
      color: white;
      align-items: center;
      width: fit-content;
    }
    .glowifyColorPicker {
      padding: 10px 15px 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 230px;
      align-self: center;
    }
    .glowifyColorPreviewRow { display: flex; align-items: center; gap: 10px; }
    .glowifyColorPreviewRow { margin-left: 17px; }
    .glowifyColorPreview { width: 34px; height: 34px; border-radius: 10px; flex: 0 0 34px; }
    .glowifyHexInput { width: 120px; padding: 6px 8px; text-transform: uppercase; }

    /* react-colorful styling (inline, because we don't import CSS files here) */
    .react-colorful {
      width: 200px;
      height: 200px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      user-select: none;
      touch-action: none;
      align-self: center;
    }
    .react-colorful__saturation {
      position: relative;
      flex: 1 1 auto;
      border-radius: 15px !important;
      overflow: visible !important;
      cursor: crosshair;
      /* No bottom border look */
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.10),
        inset 1px 0 0 rgba(255, 255, 255, 0.10),
        inset -1px 0 0 rgba(255, 255, 255, 0.10);
    }
    .react-colorful__saturation .react-colorful__interactive { border-radius: 15px !important; }
    .react-colorful__saturation-white,
    .react-colorful__saturation-black { border-radius: 15px !important; }
    .react-colorful__saturation-white,
    .react-colorful__saturation-black {
      position: absolute;
      inset: 0;
    }
    .react-colorful__saturation-white {
      background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    }
    .react-colorful__saturation-black {
      background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    }
    .react-colorful__interactive {
      position: absolute;
      inset: 0;
      outline: none;
    }
    .react-colorful__pointer {
      position: absolute;
      z-index: 2;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.0);
      box-shadow: 0 0 0 3px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.95);
    }
    .react-colorful__hue {
      position: relative;
      height: 12px;
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(to right,
        #ff0000 0%,
        #ffff00 16%,
        #00ff00 33%,
        #00ffff 50%,
        #0000ff 66%,
        #ff00ff 83%,
        #ff0000 100%
      );
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.10);
    }
    .react-colorful__hue .react-colorful__interactive { border-radius: 10px; }

    /* Some react-colorful builds expose the last control wrapper as this class */
    .react-colorful__last-control { border-radius: 10px !important; overflow: visible !important; }
    .react-colorful__last-control .react-colorful__interactive { border-radius: 10px !important; }
    .react-colorful__hue-pointer {
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: rgba(255,255,255,0.95);
      box-shadow: 0 0 0 3px rgba(0,0,0,0.35);
    }
    .glowifyInline { display: flex; align-items: center; gap: 6px; }
    .glowifyStepperBtn { width: 24px; height: 24px; border-radius: 9px; cursor: pointer; transition: background-color 0.2s ease; }
    .glowifyStepperBtn:hover { background: var(--accent-color) !important; }
    .glowifyNumberInput { width: 74px; padding: 5px 6px; text-align: center; }
    .glowifySubBlock { margin-left: 0; display: flex; flex-direction: column; gap: 8px; }
    .glowifyActionBtn { padding: 6px 10px; cursor: pointer; }
    .glowifyIndentedBtn { margin-left: 31px; }
    .glowifyColorSwatch { width: 20px; height: 20px; border-radius: 6px; box-shadow: 0 0 25px 8px var(--glowify-glow-accent); }

    .glowifySection {
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .glowifySectionTitle {
      margin: 0;
      padding: 10px 12px;
      text-align: center;
      font-weight: 700;
      border-radius: 14px;
      background: #00000057;
      box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color));
    }
    .glowifySectionBody {
      padding: 10px;
      border-radius: 14px;
      background: #00000057;
      box-shadow: 0 0 25px 8px var(--glowify-glow-accent, var(--accent-color));
    }
    .glowifySectionBody .glowifyRow { margin: 8px 0; }
    .glowifyTextInput { width: 100%; padding: 6px 10px; border: none; border-radius: 12px; font-size: 13px; color: #fff; background: transparent; outline: none; }
    .glowifyTextInput::placeholder { color: rgba(255,255,255,0.4); }

    .glowifyTooltipIcon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: transparent;
      color: rgba(255,255,255,0.45);
      font-size: 10px;
      font-weight: 700;
      cursor: help;
      margin-left: 5px;
      flex-shrink: 0;
      user-select: none;
      line-height: 1;
      vertical-align: middle;
      transition: color 0.15s ease;
    }
    .glowifyTooltipIcon:hover { background: transparent; color: #fff; }
    .glowifyTooltipPopup {
      position: fixed;
      z-index: 1000001;
      padding: 4px 10px;
      border-radius: 10px;
      background: transparent;
      backdrop-filter: blur(2rem);
      -webkit-backdrop-filter: blur(2rem);
      color: #fff;
      font-size: 12px;
      line-height: 1.35;
      pointer-events: none;
      white-space: normal;
      word-break: break-word;
      width: max-content;
      text-align: center;
      transform: translateX(-50%);
      box-shadow: 0 0 18px 5px var(--glowify-glow-accent, var(--accent-color, rgba(30,215,96,0.35)));
    }
  `;
    document.head.appendChild(style);
  }
  function useOutsideClick(open, onClose, refs) {
    React.useEffect(() => {
      if (!open) return;
      const handler = (ev) => {
        for (const r of refs) {
          const node = r == null ? void 0 : r.current;
          if (node && node.contains(ev.target)) return;
        }
        onClose();
      };
      document.addEventListener("mousedown", handler, true);
      return () => document.removeEventListener("mousedown", handler, true);
    }, [open, onClose]);
  }
  function ButtonTooltip(props) {
    const wrapRef = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    const useLayout = React.useLayoutEffect || React.useEffect;
    useLayout(() => {
      if (!show) return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      let left = r.left + r.width / 2;
      let top = r.bottom + 6;
      if (top + 40 > window.innerHeight - 4) top = r.top - 40 - 6;
      setPos({ left, top });
    }, [show]);
    const popup = show && pos ? /* @__PURE__ */ React.createElement("div", { className: "glowifyTooltipPopup", style: { left: `${pos.left}px`, top: `${pos.top}px` } }, props.text) : null;
    return /* @__PURE__ */ React.createElement(
      "span",
      {
        ref: wrapRef,
        style: { display: "inline-flex" },
        onMouseEnter: () => setShow(true),
        onMouseLeave: () => {
          setShow(false);
          setPos(null);
        }
      },
      props.children,
      popup && ((ReactDOM == null ? void 0 : ReactDOM.createPortal) ? ReactDOM.createPortal(popup, document.body) : popup)
    );
  }
  function Tooltip(props) {
    if (!props.text) return null;
    const iconRef = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    const useLayout = React.useLayoutEffect || React.useEffect;
    useLayout(() => {
      if (!show) return;
      const recalc = () => {
        const el = iconRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        let left = r.left + r.width / 2;
        let top = r.top - 40 - 6;
        if (top < 4) top = r.bottom + 6;
        setPos({ left, top });
      };
      recalc();
      return void 0;
    }, [show]);
    React.useEffect(() => {
      var _a, _b;
      if (!show) return;
      const hide = () => {
        setShow(false);
        setPos(null);
      };
      const body = (_b = (_a = iconRef.current) == null ? void 0 : _a.closest) == null ? void 0 : _b.call(_a, ".glowifySettingsBody");
      if (body) body.addEventListener("scroll", hide, { passive: true });
      return () => {
        if (body) body.removeEventListener("scroll", hide);
      };
    }, [show]);
    const popup = show && pos ? /* @__PURE__ */ React.createElement("div", { className: "glowifyTooltipPopup", style: { left: `${pos.left}px`, top: `${pos.top}px` } }, props.text) : null;
    return /* @__PURE__ */ React.createElement(
      "span",
      {
        ref: iconRef,
        className: "glowifyTooltipIcon",
        onMouseEnter: () => setShow(true),
        onMouseLeave: () => {
          setShow(false);
          setPos(null);
        }
      },
      "?",
      popup && ((ReactDOM == null ? void 0 : ReactDOM.createPortal) ? ReactDOM.createPortal(popup, document.body) : popup)
    );
  }
  function normalizeHexColor(input) {
    const raw = (input || "").trim();
    const m2 = /^#?([0-9a-fA-F]{6})$/.exec(raw);
    if (!m2) return null;
    return ("#" + m2[1]).toUpperCase();
  }
  function ColorPicker(props) {
    const btnRef = React.useRef(null);
    const popRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    const normalized = normalizeHexColor(props.value) || "#1DB954";
    const [hex, setHex] = React.useState(normalized);
    React.useEffect(() => {
      const next = normalizeHexColor(props.value);
      if (!next || next === hex) return;
      setHex(next);
    }, [props.value]);
    useOutsideClick(open, () => setOpen(false), [btnRef, popRef]);
    const useLayout = React.useLayoutEffect || React.useEffect;
    useLayout(() => {
      if (!open) return;
      const recalc = () => {
        var _a, _b, _c, _d, _e;
        const btn = btnRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const margin = 6;
        const panel = (_a = btn.closest) == null ? void 0 : _a.call(btn, ".glowifySettingsPanel");
        const body = (_c = (_b = panel == null ? void 0 : panel.querySelector) == null ? void 0 : _b.call(panel, ".glowifySettingsBody")) != null ? _c : null;
        const bounds = (body == null ? void 0 : body.getBoundingClientRect) ? body.getBoundingClientRect() : panel ? panel.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
        const controls = (_e = (_d = btn.closest) == null ? void 0 : _d.call(btn, ".glowifyRowControls")) != null ? _e : null;
        const anchorRect = controls ? controls.getBoundingClientRect() : r;
        const inView = anchorRect.bottom > bounds.top + 4 && anchorRect.top < bounds.bottom - 4;
        if (!inView) {
          setPos(null);
          setOpen(false);
          return;
        }
        const minWidth = 230;
        const wantedWidth = Math.max(minWidth, Math.round(anchorRect.width));
        const maxPossible = Math.max(0, bounds.right - bounds.left - 16);
        const width = Math.min(wantedWidth, maxPossible);
        const top = r.bottom + margin;
        let left = anchorRect.right - width;
        const minLeft = bounds.left + 8;
        const maxLeft = bounds.right - width - 8;
        left = Math.min(Math.max(left, minLeft), maxLeft);
        const belowSpace = bounds.bottom - top - 8;
        const maxHeight = Math.max(160, Math.min(290, belowSpace));
        setPos({ left, top, minWidth: width, maxHeight });
      };
      recalc();
      window.addEventListener("resize", recalc);
      window.addEventListener("scroll", recalc, true);
      const onKeyDown = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKeyDown, true);
      return () => {
        window.removeEventListener("resize", recalc);
        window.removeEventListener("scroll", recalc, true);
        document.removeEventListener("keydown", onKeyDown, true);
      };
    }, [open]);
    const commitHex = (raw) => {
      const next = normalizeHexColor(raw);
      if (!next) return;
      setHex(next);
      props.onChange(next);
    };
    const popover = open && pos ? /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: popRef,
        className: "glowifyPopover",
        style: {
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          minWidth: `${pos.minWidth}px`,
          maxHeight: `${pos.maxHeight}px`,
          overflowY: "auto"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "glowifyColorPicker" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyColorPreviewRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyColorPreview", style: { background: hex } }), /* @__PURE__ */ React.createElement(
        "input",
        {
          className: "glowifyControlSurface glowifyHexInput",
          value: hex,
          onChange: (e) => setHex(e.target.value.toUpperCase()),
          onBlur: () => commitHex(hex),
          onKeyDown: (e) => {
            if (e.key === "Enter") e.target.blur();
          },
          inputMode: "text",
          spellCheck: false
        }
      )), /* @__PURE__ */ React.createElement(
        Z,
        {
          color: hex,
          onChange: (c2) => {
            const next = normalizeHexColor(c2) || hex;
            setHex(next);
            props.onChange(next);
          }
        }
      ))
    ) : null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        ref: btnRef,
        type: "button",
        className: "glowifyControlSurface glowifyActionBtn",
        onClick: () => {
          setPos(null);
          setOpen((v2) => !v2);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "glowifyInline" }, /* @__PURE__ */ React.createElement("span", { className: "glowifyColorSwatch", style: { background: normalized } }), normalized)
    ), popover && ((ReactDOM == null ? void 0 : ReactDOM.createPortal) ? ReactDOM.createPortal(popover, document.body) : popover));
  }
  function Select(props) {
    var _a, _b;
    const btnRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    useOutsideClick(open, () => setOpen(false), [btnRef, menuRef]);
    React.useEffect(() => {
      var _a2;
      if (!open) return;
      const btn = btnRef.current;
      const body = (_a2 = btn == null ? void 0 : btn.closest) == null ? void 0 : _a2.call(btn, ".glowifySettingsBody");
      if (!body) return;
      const prev = body.style.overflowY;
      body.style.overflowY = "hidden";
      return () => {
        body.style.overflowY = prev;
      };
    }, [open]);
    const current = (_a = props.options.find((o) => o.value === props.value)) != null ? _a : props.options[0];
    const useLayout = React.useLayoutEffect || React.useEffect;
    useLayout(() => {
      if (!open) return;
      const measureMenuWidth = (btn) => {
        const probe = document.createElement("span");
        const cs = getComputedStyle(btn);
        probe.style.position = "fixed";
        probe.style.left = "-9999px";
        probe.style.top = "-9999px";
        probe.style.visibility = "hidden";
        probe.style.whiteSpace = "nowrap";
        probe.style.boxSizing = "border-box";
        probe.style.fontFamily = cs.fontFamily;
        probe.style.fontSize = cs.fontSize;
        probe.style.fontWeight = cs.fontWeight;
        probe.style.letterSpacing = cs.letterSpacing;
        probe.style.padding = "8px 10px";
        document.body.appendChild(probe);
        let max = 0;
        for (const o of props.options) {
          probe.textContent = o.label;
          max = Math.max(max, probe.getBoundingClientRect().width);
        }
        probe.remove();
        return Math.ceil(max + 28);
      };
      const recalc = () => {
        var _a2, _b2, _c;
        const btn = btnRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const margin = 6;
        const panel = (_a2 = btn.closest) == null ? void 0 : _a2.call(btn, ".glowifySettingsPanel");
        const body = (_c = (_b2 = panel == null ? void 0 : panel.querySelector) == null ? void 0 : _b2.call(panel, ".glowifySettingsBody")) != null ? _c : null;
        const bounds = (body == null ? void 0 : body.getBoundingClientRect) ? body.getBoundingClientRect() : panel ? panel.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
        const wantedWidth = measureMenuWidth(btn);
        const maxPossible = Math.max(0, bounds.right - bounds.left - 16);
        const width = Math.min(wantedWidth, maxPossible);
        const top = r.bottom + margin;
        const inView = r.bottom > bounds.top + 4 && r.top < bounds.bottom - 4;
        if (!inView) {
          setPos(null);
          setOpen(false);
          return;
        }
        let left = r.right - width;
        const minLeft = bounds.left + 8;
        const maxLeft = bounds.right - width - 8;
        left = Math.min(Math.max(left, minLeft), maxLeft);
        const belowSpace = bounds.bottom - top - 8;
        const maxHeight = Math.max(120, Math.min(240, belowSpace));
        setPos({ left, top, width, maxHeight });
      };
      recalc();
      window.addEventListener("resize", recalc);
      window.addEventListener("scroll", recalc, true);
      return () => {
        window.removeEventListener("resize", recalc);
        window.removeEventListener("scroll", recalc, true);
      };
    }, [open]);
    const menu = open && pos ? /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: menuRef,
        className: "glowifySelectMenu",
        style: {
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: `${pos.width}px`,
          maxHeight: `${pos.maxHeight}px`,
          overflowY: "auto",
          transform: void 0
        }
      },
      props.options.map((o) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: o.value,
          className: "glowifySelectItem",
          onClick: () => {
            setOpen(false);
            props.onChange(o.value);
          }
        },
        o.label
      ))
    ) : null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        ref: btnRef,
        type: "button",
        className: `glowifyControlSurface glowifySelectBtn${open ? " isOpen" : ""}`,
        onClick: () => {
          setPos(null);
          setOpen((v2) => !v2);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "glowifySelectLabel" }, (_b = current == null ? void 0 : current.label) != null ? _b : props.value),
      /* @__PURE__ */ React.createElement("span", { className: "glowifySelectChevron", "aria-hidden": "true" })
    ), menu && ((ReactDOM == null ? void 0 : ReactDOM.createPortal) ? ReactDOM.createPortal(menu, document.body) : menu));
  }
  function Stepper(props) {
    const [text, setText] = React.useState(String(props.value));
    React.useEffect(() => {
      setText(String(props.value));
    }, [props.value]);
    const commit = (raw) => {
      const parsed = parseInt(raw, 10);
      if (!Number.isFinite(parsed)) {
        setText(String(props.value));
        return;
      }
      props.onChange(clamp(parsed, props.min, props.max));
    };
    return /* @__PURE__ */ React.createElement("div", { className: "glowifyInline" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyStepperBtn",
        onClick: () => props.onChange(clamp(props.value - 1, props.min, props.max))
      },
      "-"
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "glowifyControlSurface glowifyNumberInput",
        type: "text",
        inputMode: "numeric",
        value: text,
        onChange: (e) => setText(e.target.value),
        onBlur: () => commit(text),
        onKeyDown: (e) => {
          if (e.key === "Enter") e.target.blur();
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyStepperBtn",
        onClick: () => props.onChange(clamp(props.value + 1, props.min, props.max))
      },
      "+"
    ));
  }
  function Section(props) {
    return /* @__PURE__ */ React.createElement("div", { className: "glowifySection" }, /* @__PURE__ */ React.createElement("div", { className: "glowifySectionTitle" }, props.title), /* @__PURE__ */ React.createElement("div", { className: "glowifySectionBody" }, props.children));
  }
  function SettingsContent(props) {
    var _a, _b, _c, _d, _e, _f;
    const t = getTranslation();
    const titles = t.sections || {
      accent: "Accent",
      glow: "Glow",
      background: "Background",
      artist: "Artist",
      player: "Player",
      playlist: "Playlist",
      lyrics: "Lyrics",
      transparent: "Transparent Controls"
    };
    const chooseFileLabel = t.chooseFile || "Choose file";
    const [accentMode, setAccentMode] = React.useState(readLS("glowify-accent-mode", "dynamic"));
    const [accentColor, setAccentColor] = React.useState(readLS("glowify-custom-color", "#1DB954"));
    const [glowMode, setGlowMode] = React.useState(readLS("glowify-glow-mode", "default"));
    const [glowColor, setGlowColor] = React.useState(readLS("glowify-glow-color", "#1DB954"));
    const [glowEffectEnabled, setGlowEffectEnabled] = React.useState(readLS("glowify-glow-effect-mode", "on") === "on");
    const [outlineMode, setOutlineMode] = React.useState(readLS("glowify-outline-mode", "default"));
    const [outlineColor, setOutlineColor] = React.useState(readLS("glowify-outline-color", "#1DB954"));
    const [bgMode, setBgMode] = React.useState(readLS("glowify-bg-mode", "dynamic"));
    const [bgUrl, setBgUrl] = React.useState(readLS("glowify-bg-url", ""));
    const [artistBgMode, setArtistBgMode] = React.useState(readLS("glowify-artist-bg-mode", "theme"));
    const [artistBgUrl, setArtistBgUrl] = React.useState(readLS("glowify-artist-bg-url", ""));
    const [playerWidthMode, setPlayerWidthMode] = React.useState(readLS("glowify-player-width", "default"));
    const [playerCustomW, setPlayerCustomW] = React.useState(readNum("glowify-player-custom-width", DEFAULT_CUSTOM_WIDTH));
    const [playerCustomH, setPlayerCustomH] = React.useState(readNum("glowify-player-custom-height", DEFAULT_CUSTOM_HEIGHT));
    const [playlistHeader, setPlaylistHeader] = React.useState(readLS("glowify-playlist-header-mode", "show"));
    const [lyricsMode, setLyricsMode] = React.useState(readLS("glowify-lyrics-mode", "romanization"));
    const [playerRadius, setPlayerRadiusState] = React.useState(readNum("glowify-player-radius", 30));
    const [bgBlur, setBgBlurState] = React.useState(readNum("glowify-bg-blur", 7));
    const [bgBrightness, setBgBrightnessState] = React.useState(readNum("glowify-bg-brightness", 45));
    const [tcW, setTcW] = React.useState(readNum("glowify-tc-width", 135));
    const [tcH, setTcH] = React.useState(readNum("glowify-tc-height", 64));
    const [artistScrollBlur, setArtistScrollBlur] = React.useState(readNum("liquify-artist-scroll-blur", 15));
    const [artistScrollBrightness, setArtistScrollBrightness] = React.useState(readNum("liquify-artist-scroll-brightness", 70));
    const [ccaEnabled, setCcaEnabled] = React.useState(readLS(CCA_ENABLED_KEY, CCA_DEFAULTS.enabled));
    const [ccaWidth, setCcaWidth] = React.useState(readNum(CCA_WIDTH_KEY, CCA_DEFAULTS.width));
    const [ccaHeight, setCcaHeight] = React.useState(readNum(CCA_HEIGHT_KEY, CCA_DEFAULTS.height));
    const [ccaMb, setCcaMb] = React.useState(readNum(CCA_MARGIN_BOTTOM_KEY, CCA_DEFAULTS.marginBottom));
    const [ccaMl, setCcaMl] = React.useState(readNum(CCA_MARGIN_LEFT_KEY, CCA_DEFAULTS.marginLeft));
    const [ccaBr, setCcaBr] = React.useState(readNum(CCA_BORDER_RADIUS_KEY, CCA_DEFAULTS.borderRadius));
    const [nscShow, setNscShow] = React.useState(readLS(NSC_KEYS.show, NSC_DEFAULTS.show));
    const [nscPosition, setNscPosition] = React.useState(readLS(NSC_KEYS.position, NSC_DEFAULTS.position));
    const [nscHeight, setNscHeight] = React.useState(readNum(NSC_KEYS.height, NSC_DEFAULTS.height));
    const [nscMaxWidth, setNscMaxWidth] = React.useState(readNum(NSC_KEYS.maxWidth, NSC_DEFAULTS.maxWidth));
    const [nscGap, setNscGap] = React.useState(readNum(NSC_KEYS.gap, NSC_DEFAULTS.gap));
    const [nscCoverSize, setNscCoverSize] = React.useState(readNum(NSC_KEYS.coverSize, NSC_DEFAULTS.coverSize));
    const [nscHpad, setNscHpad] = React.useState(readNum(NSC_KEYS.hpad, NSC_DEFAULTS.hpad));
    const [nscVpad, setNscVpad] = React.useState(readNum(NSC_KEYS.vpad, NSC_DEFAULTS.vpad));
    const [nscGapPlayer, setNscGapPlayer] = React.useState(readNum(NSC_KEYS.gapPlayer, NSC_DEFAULTS.gapPlayer));
    const [nscBorderRadius, setNscBorderRadius] = React.useState(readNum(NSC_KEYS.borderRadius, NSC_DEFAULTS.borderRadius));
    const [nscCoverRadius, setNscCoverRadius] = React.useState(readNum(NSC_KEYS.coverRadius, NSC_DEFAULTS.coverRadius));
    const unixLike = isUnixLikeOS();
    const bgFileRef = React.useRef(null);
    const artistFileRef = React.useRef(null);
    React.useEffect(() => {
      ensureSettingsUiStyle();
    }, []);
    const applyAccentMode = (mode) => {
      setAccentMode(mode);
      if (mode === "custom") {
        applyAccent(accentColor);
      } else if (mode === "dynamic") {
        lastDynamicColor = null;
        applyDynamicAccent();
      } else {
        resetAccentToDefault();
      }
    };
    const applyGlowMode = (mode) => {
      setGlowMode(mode);
      if (mode === "custom") applyGlowAccent(glowColor);
      else resetGlowAccentToDefault();
    };
    const handleGlowEffectToggle = (enabled) => {
      setGlowEffectEnabled(enabled);
      applyGlowEffectMode(enabled);
    };
    const applyBgMode = async (mode) => {
      var _a2;
      setBgMode(mode);
      localStorage.setItem("glowify-bg-mode", mode);
      if (mode === "custom") {
        const saved = localStorage.getItem("glowify-bg-image");
        if (!saved) {
          (_a2 = bgFileRef.current) == null ? void 0 : _a2.click();
          return;
        }
      }
      if (mode === "url") {
        const saved = localStorage.getItem("glowify-bg-url");
        if (!saved) return;
      }
      updateBackground();
    };
    const applyArtistMode = async (mode) => {
      var _a2, _b2, _c2;
      setArtistBgMode(mode);
      localStorage.setItem("glowify-artist-bg-mode", mode);
      if (mode === "custom") {
        const saved = localStorage.getItem("glowify-artist-bg-image");
        if (!saved) {
          (_a2 = artistFileRef.current) == null ? void 0 : _a2.click();
          return;
        }
      }
      if (mode === "url") {
        const saved = localStorage.getItem("glowify-artist-bg-url");
        if (!saved) return;
      }
      (_c2 = (_b2 = props.artistCtrl) == null ? void 0 : _b2.setMode) == null ? void 0 : _c2.call(_b2, mode);
    };
    const applyPlayerWidthMode = (mode) => {
      setPlayerWidthMode(mode);
      localStorage.setItem("glowify-player-width", mode);
      applyPlayerWidth(mode);
    };
    const applyPlayerCustom = (nextW, nextH) => {
      localStorage.setItem("glowify-player-custom-width", String(nextW));
      localStorage.setItem("glowify-player-custom-height", String(nextH));
      applyPlayerWidth("custom");
    };
    const applyRadius = (value) => {
      setPlayerRadiusState(value);
      applyPlayerRadius(value);
    };
    const applyPlaylistHeaderMode = (mode) => {
      setPlaylistHeader(mode);
      applyPlaylistHeader(mode);
    };
    const applyLyricsMode = (mode) => {
      setLyricsMode(mode);
      localStorage.setItem("glowify-lyrics-mode", mode);
      window.dispatchEvent(new Event("glowifyLyricsModeChange"));
    };
    const applyBlur = (value) => {
      setBgBlurState(value);
      applyBackgroundBlur(value);
    };
    const applyBgBrightness = (value) => {
      setBgBrightnessState(value);
      applyBackgroundBrightness(value);
    };
    const applyTransparent = (w2, h2) => {
      setTcW(w2);
      setTcH(h2);
      applyTransparentControls(w2, h2);
    };
    const applyCca = (key, value) => {
      localStorage.setItem(key, String(value));
      applyComfyCoverArt();
    };
    const nscSet = (key, value, setter) => {
      setter(value);
      localStorage.setItem(key, String(value));
      fireNscUpdate();
    };
    const tips = t.tooltips || {};
    return /* @__PURE__ */ React.createElement("div", { className: "glowifySettingsPanel" }, /* @__PURE__ */ React.createElement("div", { className: "glowifySettingsHeader" }, /* @__PURE__ */ React.createElement("h3", { className: "glowifySettingsTitle" }, t.title), /* @__PURE__ */ React.createElement("div", { className: "glowifyHeaderActions" }, /* @__PURE__ */ React.createElement(ButtonTooltip, { text: "Discord" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyHeaderActionBtn",
        "aria-label": "Discord",
        onClick: () => openExternalLink(GLOWIFY_DISCORD_URL)
      },
      getDiscordIcon()
    )), /* @__PURE__ */ React.createElement(ButtonTooltip, { text: "GitHub" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyHeaderActionBtn",
        "aria-label": "GitHub",
        onClick: () => openExternalLink(GLOWIFY_GITHUB_URL)
      },
      getGithubIcon()
    )), /* @__PURE__ */ React.createElement(ButtonTooltip, { text: t.close || "Close" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyHeaderActionBtn glowifyCloseBtn",
        "aria-label": t.close || "Close",
        onClick: props.onClose
      },
      "\xD7"
    )))), /* @__PURE__ */ React.createElement("div", { className: "glowifySettingsBody" }, /* @__PURE__ */ React.createElement(Section, { title: titles.accent }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.accentColor, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.accentColor })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRowControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: accentMode,
        options: [
          { value: "default", label: t.dropdown.default },
          { value: "custom", label: t.dropdown.custom },
          { value: "dynamic", label: t.dropdown.dynamic }
        ],
        onChange: applyAccentMode
      }
    ), accentMode === "custom" && /* @__PURE__ */ React.createElement(
      ColorPicker,
      {
        value: accentColor,
        onChange: (next) => {
          setAccentColor(next);
          localStorage.setItem("glowify-custom-color", next);
          applyAccent(next);
        }
      }
    )))), /* @__PURE__ */ React.createElement(Section, { title: titles.glow }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.glowEffectMode, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.glowEffectMode })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRowControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: glowEffectEnabled ? "on" : "off",
        options: [
          { value: "on", label: ((_a = t.glowOnOff) == null ? void 0 : _a.on) || "On" },
          { value: "off", label: ((_b = t.glowOnOff) == null ? void 0 : _b.off) || "Off" }
        ],
        onChange: (v2) => handleGlowEffectToggle(v2 === "on")
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.glowColor, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.glowColor })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRowControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: glowMode,
        options: [
          { value: "default", label: t.dropdown.default },
          { value: "custom", label: t.dropdown.custom }
        ],
        onChange: applyGlowMode
      }
    ), glowMode === "custom" && /* @__PURE__ */ React.createElement(
      ColorPicker,
      {
        value: glowColor,
        onChange: (next) => {
          setGlowColor(next);
          localStorage.setItem("glowify-glow-color", next);
          applyGlowAccent(next);
        }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.outlineColor || "Outline Accent Color:", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.outlineColor })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRowControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: outlineMode,
        options: [
          { value: "default", label: t.dropdown.default },
          { value: "custom", label: t.dropdown.custom }
        ],
        onChange: (v2) => {
          setOutlineMode(v2);
          if (v2 === "custom") {
            applyOutlineAccent(outlineColor);
          } else {
            resetOutlineAccentToDefault();
          }
        }
      }
    ), outlineMode === "custom" && /* @__PURE__ */ React.createElement(
      ColorPicker,
      {
        value: outlineColor,
        onChange: (next) => {
          setOutlineColor(next);
          applyOutlineAccent(next);
        }
      }
    )))), /* @__PURE__ */ React.createElement(Section, { title: titles.background }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.background, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.background })), /* @__PURE__ */ React.createElement("div", { className: "glowifyStackedControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: bgMode,
        options: [
          { value: "dynamic", label: t.dropdown.dynamic },
          { value: "animated", label: t.dropdown.animated },
          { value: "custom", label: t.dropdown.custom },
          { value: "url", label: t.dropdown.url || "URL" }
        ],
        onChange: (m2) => void applyBgMode(m2)
      }
    ), bgMode === "custom" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyActionBtn",
        onClick: () => {
          var _a2;
          return (_a2 = bgFileRef.current) == null ? void 0 : _a2.click();
        }
      },
      chooseFileLabel
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: bgFileRef,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: async (e) => {
          var _a2;
          const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
          if (!file) return;
          await applyCustomBackground(file);
        }
      }
    )), bgMode === "url" && /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "glowifyControlSurface glowifyTextInput",
        placeholder: t.enterUrl || "Enter image URL...",
        value: bgUrl,
        onChange: (e) => {
          const val = e.target.value;
          setBgUrl(val);
          localStorage.setItem("glowify-bg-url", val);
          if (val) updateBackground();
        }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.backgroundBlur, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.backgroundBlur })), /* @__PURE__ */ React.createElement(Stepper, { value: bgBlur, min: 0, max: 100, onChange: applyBlur })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.backgroundBrightness || "Background Brightness:", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.backgroundBrightness })), /* @__PURE__ */ React.createElement(Stepper, { value: bgBrightness, min: 0, max: 200, onChange: applyBgBrightness }))), /* @__PURE__ */ React.createElement(Section, { title: titles.artist }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.apbackground, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.apbackground })), /* @__PURE__ */ React.createElement("div", { className: "glowifyStackedControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: artistBgMode,
        options: [
          { value: "theme", label: t.dropdown.theme },
          { value: "none", label: t.dropdown.none },
          { value: "custom", label: t.dropdown.custom },
          { value: "url", label: t.dropdown.url || "URL" }
        ],
        onChange: (m2) => void applyArtistMode(m2)
      }
    ), artistBgMode === "custom" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "glowifyControlSurface glowifyActionBtn",
        onClick: () => {
          var _a2;
          return (_a2 = artistFileRef.current) == null ? void 0 : _a2.click();
        }
      },
      chooseFileLabel
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: artistFileRef,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: async (e) => {
          var _a2, _b2, _c2;
          const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
          if (!file) return;
          await applyCustomArtistBackground(file);
          (_c2 = (_b2 = props.artistCtrl) == null ? void 0 : _b2.applySavedModeIfArtist) == null ? void 0 : _c2.call(_b2);
        }
      }
    )), artistBgMode === "url" && /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "glowifyControlSurface glowifyTextInput",
        placeholder: t.enterUrl || "Enter image URL...",
        value: artistBgUrl,
        onChange: (e) => {
          var _a2, _b2;
          const val = e.target.value;
          setArtistBgUrl(val);
          localStorage.setItem("glowify-artist-bg-url", val);
          if (val) (_b2 = (_a2 = props.artistCtrl) == null ? void 0 : _a2.setMode) == null ? void 0 : _b2.call(_a2, "url");
        }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.artistScrollBlur || "Artist Scroll Blur (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.artistScrollBlur })), /* @__PURE__ */ React.createElement(Stepper, { value: artistScrollBlur, min: 0, max: 100, onChange: (v2) => {
      setArtistScrollBlur(v2);
      applyArtistScrollEffect(v2, artistScrollBrightness);
    } })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.artistScrollBrightness || "Artist Scroll Brightness (%):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.artistScrollBrightness })), /* @__PURE__ */ React.createElement(Stepper, { value: artistScrollBrightness, min: 0, max: 100, onChange: (v2) => {
      setArtistScrollBrightness(v2);
      applyArtistScrollEffect(artistScrollBlur, v2);
    } }))), /* @__PURE__ */ React.createElement(Section, { title: titles.player }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.playerWidth, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.playerWidth })), /* @__PURE__ */ React.createElement(
      Select,
      {
        value: playerWidthMode,
        options: [
          { value: "default", label: t.dropdown.default },
          { value: "theme", label: t.dropdown.theme },
          { value: "custom", label: t.dropdown.custom }
        ],
        onChange: applyPlayerWidthMode
      }
    )), playerWidthMode === "custom" && /* @__PURE__ */ React.createElement("div", { className: "glowifySubBlock" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.playerCustomWidth, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.playerCustomWidth })), /* @__PURE__ */ React.createElement(
      Stepper,
      {
        value: playerCustomW,
        min: 0,
        max: 100,
        onChange: (v2) => {
          setPlayerCustomW(v2);
          applyPlayerCustom(v2, playerCustomH);
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.playerCustomHeight, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.playerCustomHeight })), /* @__PURE__ */ React.createElement(
      Stepper,
      {
        value: playerCustomH,
        min: 0,
        max: 300,
        onChange: (v2) => {
          setPlayerCustomH(v2);
          applyPlayerCustom(playerCustomW, v2);
        }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.playerRadius, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.playerRadius })), /* @__PURE__ */ React.createElement(Stepper, { value: playerRadius, min: 0, max: 100, onChange: applyRadius })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.comfyCoverArt || {}).enabled || "Comfy Cover Art:", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.comfyCoverArtEnabled })), /* @__PURE__ */ React.createElement(
      Select,
      {
        value: ccaEnabled,
        options: [
          { value: "show", label: t.dropdown.show },
          { value: "hide", label: t.dropdown.hide }
        ],
        onChange: (v2) => {
          setCcaEnabled(v2);
          applyCca(CCA_ENABLED_KEY, v2);
        }
      }
    )), ccaEnabled === "show" && /* @__PURE__ */ React.createElement("div", { className: "glowifySubBlock" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.comfyCoverArt || {}).width || "Width (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.comfyCoverArtWidth })), /* @__PURE__ */ React.createElement(Stepper, { value: ccaWidth, min: 16, max: 200, onChange: (v2) => {
      setCcaWidth(v2);
      applyCca(CCA_WIDTH_KEY, v2);
    } })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.comfyCoverArt || {}).height || "Height (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.comfyCoverArtHeight })), /* @__PURE__ */ React.createElement(Stepper, { value: ccaHeight, min: 16, max: 200, onChange: (v2) => {
      setCcaHeight(v2);
      applyCca(CCA_HEIGHT_KEY, v2);
    } })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.comfyCoverArt || {}).marginBottom || "Margin Bottom (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.comfyCoverArtMarginBottom })), /* @__PURE__ */ React.createElement(Stepper, { value: ccaMb, min: -50, max: 200, onChange: (v2) => {
      setCcaMb(v2);
      applyCca(CCA_MARGIN_BOTTOM_KEY, v2);
    } })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.comfyCoverArt || {}).marginLeft || "Margin Left (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.comfyCoverArtMarginLeft })), /* @__PURE__ */ React.createElement(Stepper, { value: ccaMl, min: -50, max: 200, onChange: (v2) => {
      setCcaMl(v2);
      applyCca(CCA_MARGIN_LEFT_KEY, v2);
    } }))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.comfyCoverArt || {}).borderRadius || "Cover Border Radius (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.comfyCoverArtBorderRadius })), /* @__PURE__ */ React.createElement(Stepper, { value: ccaBr, min: 0, max: 100, onChange: (v2) => {
      setCcaBr(v2);
      applyCca(CCA_BORDER_RADIUS_KEY, v2);
    } }))), /* @__PURE__ */ React.createElement(Section, { title: titles.playlist }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.playlistHeaderBox, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.playlistHeaderBox })), /* @__PURE__ */ React.createElement(
      Select,
      {
        value: playlistHeader,
        options: [
          { value: "show", label: t.dropdown.show },
          { value: "hide", label: t.dropdown.hide }
        ],
        onChange: applyPlaylistHeaderMode
      }
    ))), /* @__PURE__ */ React.createElement(Section, { title: titles.lyrics }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.lyricsMode || "Lyrics-\xDCbersetzung/Romanisierung:", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.lyricsMode })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRowControls" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: lyricsMode,
        options: [
          { value: "off", label: ((_c = t.lyricsOptions) == null ? void 0 : _c.off) || "Aus" },
          { value: "translation", label: ((_d = t.lyricsOptions) == null ? void 0 : _d.translation) || "Nur \xDCbersetzung" },
          { value: "romanization", label: ((_e = t.lyricsOptions) == null ? void 0 : _e.romanization) || "Nur Romanisierung" },
          { value: "both", label: ((_f = t.lyricsOptions) == null ? void 0 : _f.both) || "\xDCbersetzung + Romanisierung" }
        ],
        onChange: applyLyricsMode
      }
    )))), /* @__PURE__ */ React.createElement(Section, { title: titles.nextSongCard || "Next Song Card" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).show || "Next Song Card:", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscShow })), /* @__PURE__ */ React.createElement(
      Select,
      {
        value: nscShow,
        options: [
          { value: "show", label: t.dropdown.show },
          { value: "hide", label: t.dropdown.hide }
        ],
        onChange: (v2) => nscSet(NSC_KEYS.show, v2, setNscShow)
      }
    )), nscShow === "show" && /* @__PURE__ */ React.createElement("div", { className: "glowifySubBlock" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).position || "Position:", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscPosition })), /* @__PURE__ */ React.createElement(
      Select,
      {
        value: nscPosition,
        options: [
          { value: "left", label: t.dropdown.left || "Left" },
          { value: "right", label: t.dropdown.right || "Right" }
        ],
        onChange: (v2) => nscSet(NSC_KEYS.position, v2, setNscPosition)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).height || "Card Height (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscHeight })), /* @__PURE__ */ React.createElement(Stepper, { value: nscHeight, min: 32, max: 200, onChange: (v2) => nscSet(NSC_KEYS.height, v2, setNscHeight) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).maxWidth || "Card Max Width (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscMaxWidth })), /* @__PURE__ */ React.createElement(Stepper, { value: nscMaxWidth, min: 100, max: 600, onChange: (v2) => nscSet(NSC_KEYS.maxWidth, v2, setNscMaxWidth) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).gap || "Gap (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscGap })), /* @__PURE__ */ React.createElement(Stepper, { value: nscGap, min: 0, max: 24, onChange: (v2) => nscSet(NSC_KEYS.gap, v2, setNscGap) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).coverSize || "Cover Size (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscCoverSize })), /* @__PURE__ */ React.createElement(Stepper, { value: nscCoverSize, min: 16, max: 128, onChange: (v2) => nscSet(NSC_KEYS.coverSize, v2, setNscCoverSize) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).hpad || "H Padding (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscHpad })), /* @__PURE__ */ React.createElement(Stepper, { value: nscHpad, min: 0, max: 32, onChange: (v2) => nscSet(NSC_KEYS.hpad, v2, setNscHpad) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).vpad || "V Padding (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscVpad })), /* @__PURE__ */ React.createElement(Stepper, { value: nscVpad, min: 0, max: 32, onChange: (v2) => nscSet(NSC_KEYS.vpad, v2, setNscVpad) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).gapPlayer || "Gap to Player (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscGapPlayer })), /* @__PURE__ */ React.createElement(Stepper, { value: nscGapPlayer, min: 0, max: 40, onChange: (v2) => nscSet(NSC_KEYS.gapPlayer, v2, setNscGapPlayer) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).borderRadius || "Border Radius (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscBorderRadius })), /* @__PURE__ */ React.createElement(Stepper, { value: nscBorderRadius, min: 0, max: 50, onChange: (v2) => nscSet(NSC_KEYS.borderRadius, v2, setNscBorderRadius) })), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, (t.nextSongCard || {}).coverRadius || "Cover Radius (px):", /* @__PURE__ */ React.createElement(Tooltip, { text: tips.nscCoverRadius })), /* @__PURE__ */ React.createElement(Stepper, { value: nscCoverRadius, min: 0, max: 50, onChange: (v2) => nscSet(NSC_KEYS.coverRadius, v2, setNscCoverRadius) })))), /* @__PURE__ */ React.createElement(Section, { title: titles.transparent }, /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.transparentWidth, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.transparentWidth })), /* @__PURE__ */ React.createElement("div", { style: { opacity: unixLike ? 0.5 : 1, pointerEvents: unixLike ? "none" : "auto" } }, /* @__PURE__ */ React.createElement(Stepper, { value: tcW, min: 50, max: 400, onChange: (v2) => applyTransparent(v2, tcH) }))), /* @__PURE__ */ React.createElement("div", { className: "glowifyRow" }, /* @__PURE__ */ React.createElement("div", { className: "glowifyLabel" }, t.transparentHeight, /* @__PURE__ */ React.createElement(Tooltip, { text: tips.transparentHeight })), /* @__PURE__ */ React.createElement("div", { style: { opacity: unixLike ? 0.5 : 1, pointerEvents: unixLike ? "none" : "auto" } }, /* @__PURE__ */ React.createElement(Stepper, { value: tcH, min: 20, max: 300, onChange: (v2) => applyTransparent(tcW, v2) }))))));
  }
  function openSettingsModal(artistCtrl) {
    ensureSettingsUiStyle();
    const t = getTranslation();
    const existing = document.getElementById("glowify-settings-react-overlay");
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.id = "glowify-settings-react-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "99999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "transparent";
    overlay.style.overflow = "hidden";
    overlay.style.padding = "24px";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("glowify-overlay-visible");
        const panel = overlay.querySelector(".glowifySettingsPanel");
        const onEnd = () => {
          panel == null ? void 0 : panel.removeEventListener("transitionend", onEnd);
          try {
            ReactDOM.unmountComponentAtNode(overlay.querySelector("div"));
          } catch (e2) {
          }
          document.querySelectorAll("body > .glowifyTooltipPopup").forEach((el) => el.remove());
          overlay.remove();
        };
        if (panel) panel.addEventListener("transitionend", onEnd);
        setTimeout(onEnd, 500);
      }
    });
    document.body.appendChild(overlay);
    const root = document.createElement("div");
    overlay.appendChild(root);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add("glowify-overlay-visible");
      });
    });
    const onClose = () => {
      overlay.classList.remove("glowify-overlay-visible");
      document.querySelectorAll("body > .glowifyTooltipPopup").forEach((el) => el.remove());
      const panel = overlay.querySelector(".glowifySettingsPanel");
      const onEnd = () => {
        panel == null ? void 0 : panel.removeEventListener("transitionend", onEnd);
        try {
          ReactDOM.unmountComponentAtNode(root);
        } catch (e) {
        }
        document.querySelectorAll("body > .glowifyTooltipPopup").forEach((el) => el.remove());
        overlay.remove();
      };
      if (panel) panel.addEventListener("transitionend", onEnd);
      setTimeout(onEnd, 500);
    };
    ReactDOM.render(/* @__PURE__ */ React.createElement(SettingsContent, { onClose, artistCtrl }), root);
  }
  async function awaitSpicetifyReact() {
    while (!(Spicetify == null ? void 0 : Spicetify.React) || !(Spicetify == null ? void 0 : Spicetify.ReactDOM)) await sleep(200);
    React = Spicetify.React;
    ReactDOM = Spicetify.ReactDOM;
  }
  (async function initGlowifyStandaloneTs() {
    const anyWin = window;
    if (anyWin.glowifyStandaloneTsInitialized) return;
    anyWin.glowifyStandaloneTsInitialized = true;
    await awaitSpicetifyReact();
    const savedGlowMode = localStorage.getItem("glowify-glow-mode") || "default";
    const savedGlowColor = localStorage.getItem("glowify-glow-color") || "#1DB954";
    if (savedGlowMode === "custom") applyGlowAccent(savedGlowColor);
    else resetGlowAccentToDefault();
    const savedAccentMode = localStorage.getItem("glowify-accent-mode") || "dynamic";
    const savedAccentColor = localStorage.getItem("glowify-custom-color") || "#1DB954";
    if (savedAccentMode === "custom") applyAccent(savedAccentColor);
    else if (savedAccentMode === "dynamic") applyDynamicAccent();
    else resetAccentToDefault();
    applySavedBackground();
    ensurePlayerApplied();
    ensureTransparentControlsApplied();
    ensureBackgroundBlurApplied();
    ensureBackgroundBrightnessApplied();
    ensureGlowEffectModeApplied();
    ensureOutlineAccentApplied();
    applySavedPlaylistHeader();
    ensureArtistScrollEffectApplied();
    ensureComfyCoverArtApplied();
    if (!anyWin.glowifyDynamicObserverTs) {
      anyWin.glowifyDynamicObserverTs = new MutationObserver(() => {
        const mode = localStorage.getItem("glowify-accent-mode");
        if (mode === "dynamic") applyDynamicAccent();
      });
      anyWin.glowifyDynamicObserverTs.observe(document.body, { attributes: true, subtree: true });
    }
    const artistCtrl = installArtistBackgroundController();
    window.showGlowifySettingsMenu = () => {
      try {
        openSettingsModal(artistCtrl);
      } catch (e) {
        console.error("Glowify settings open failed", e);
      }
    };
    initGlowifyGearInjection(getTranslation());
    installPlaylistIndicatorVisualizer();
    installHomeScreenVisualizer();
    installLyricsTranslator();
    installLyricsEnhancer();
    installNextSongCard();
  })();
})();
