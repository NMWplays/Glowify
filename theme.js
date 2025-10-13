(async function () {
  while (!Spicetify?.Player || !Spicetify?.Player?.data) {
    await new Promise((r) => setTimeout(r, 300));
  }

  const root = document.querySelector(".Root__top-container");
  if (!root) {
    console.error("Root__top-container nicht gefunden!");
    return;
  }

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
        resolve(`rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`);
      };
      img.onerror = () => resolve("rgb(30,215,96)");
    });
  }

  async function updateBackgroundAndAccent() {
    const url = getCoverUrl();
    if (!url) return;

    root.style.setProperty("--image_url", `url("${url}")`);

    const color = await getDominantColor(url);
    document.documentElement.style.setProperty("--accent-color", color);
  }

  updateBackgroundAndAccent();

  Spicetify.Player.addEventListener("songchange", updateBackgroundAndAccent);
})();