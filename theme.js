(async function () {
  while (!Spicetify?.Player || !Spicetify?.Player?.data) {
    await new Promise((r) => setTimeout(r, 300));
  }

  const root = document.querySelector(".Root__top-container");
  if (!root) return;

  const layerA = document.createElement("div");
  const layerB = document.createElement("div");
  layerA.classList.add("glowify-bg-layer", "layer-a");
  layerB.classList.add("glowify-bg-layer", "layer-b");
  root.prepend(layerA, layerB);

  let useA = true;

  let lastCustomImage = null;
  let lastBgMode = null;
  let lastCoverUrl = null;

  function getCoverUrl() {
    const raw = Spicetify.Player?.data?.item?.metadata?.image_url;
    if (!raw) return null;
    return raw.replace("spotify:image:", "https://i.scdn.co/image/");
  }

  function getDominantColor(url) {
    return new Promise((resolve) => {
      if (!url) return resolve("rgb(30,215,96)");
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        resolve(`rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`);
      };
      img.onerror = () => resolve("rgb(30,215,96)");
    });
  }

  function enhanceColor(rgb, saturationBoost = 1.7, lightnessBoost = 1.1) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    let r1 = r/255, g1 = g/255, b1 = b/255;
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
    let h, s, l = (max+min)/2;

    if(max === min) { h=s=0; }
    else {
      const d = max-min;
      s = l>0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r1: h=(g1-b1)/d + (g1<b1?6:0); break;
        case g1: h=(b1-r1)/d + 2; break;
        case b1: h=(r1-g1)/d + 4; break;
      }
      h /= 6;
    }

    s = Math.min(s*saturationBoost,1);
    l = Math.min(l*lightnessBoost,1);

    function hsl2rgb(p,q,t){
      if(t<0) t+=1;
      if(t>1) t-=1;
      if(t<1/6) return p + (q-p)*6*t;
      if(t<1/2) return q;
      if(t<2/3) return p + (q-p)*(2/3-t)*6;
      return p;
    }

    let r2,g2,b2;
    if(s===0){ r2=g2=b2=l; }
    else {
      const q = l<0.5 ? l*(1+s) : l+s-l*s;
      const p = 2*l - q;
      r2 = hsl2rgb(p,q,h+1/3);
      g2 = hsl2rgb(p,q,h);
      b2 = hsl2rgb(p,q,h-1/3);
    }

    return `rgb(${Math.round(r2*255)},${Math.round(g2*255)},${Math.round(b2*255)})`;
  }

  async function updateBackgroundAndAccent() {
    const bgMode = localStorage.getItem("glowify-bg-mode") || "dynamic";
    const customImage = localStorage.getItem("glowify-bg-image");
    const coverUrl = getCoverUrl();

    const changedCustom = bgMode !== lastBgMode || customImage !== lastCustomImage;
    const changedCover = coverUrl !== lastCoverUrl;
    if (!changedCustom && !changedCover) return;

    lastBgMode = bgMode;
    lastCustomImage = customImage;
    lastCoverUrl = coverUrl;

    let url;

    if(bgMode==="custom" && customImage){
      url = customImage;
      layerA.style.backgroundImage = `url("${url}")`;
      layerB.style.backgroundImage = `url("${url}")`;
      layerA.classList.add("active");
      layerB.classList.remove("active");
    } else if(coverUrl){
      url = coverUrl;
      if(useA){
        layerA.style.backgroundImage = `url("${url}")`;
        layerA.classList.add("active");
        layerB.classList.remove("active");
      } else {
        layerB.style.backgroundImage = `url("${url}")`;
        layerB.classList.add("active");
        layerA.classList.remove("active");
      }
      useA = !useA;
    }

    if(coverUrl){
      const color = await getDominantColor(coverUrl);
      const enhanced = enhanceColor(color, 1.7, 1.1);
      document.documentElement.style.setProperty("--accent-color", enhanced);
    }
  }

  updateBackgroundAndAccent();

  Spicetify.Player.addEventListener("songchange", updateBackgroundAndAccent);
  window.addEventListener("glowifyBackgroundChange", updateBackgroundAndAccent);

  setInterval(updateBackgroundAndAccent, 500);
})();