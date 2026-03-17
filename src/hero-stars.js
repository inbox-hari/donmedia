document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".usborne-header");
  if (!header) {
    return;
  }

  const existing = header.querySelector(".hero-star-field");
  if (existing) {
    return;
  }

  const starField = document.createElement("div");
  starField.className = "hero-star-field";
  starField.setAttribute("aria-hidden", "true");

  const colors = [
    "#ec4899", // pink
    "#f97316", // orange
    "#3b82f6", // blue
    "#22c55e", // green
    "#a855f7", // purple
    "#facc15", // yellow
  ];

  const starCount = 18 + Math.floor(Math.random() * 7);
  const columns = 5;
  const rows = Math.ceil(starCount / columns);
  const startTop = 8;
  const startLeft = 6;
  const usableTop = 72;
  const usableLeft = 88;
  const cellHeight = usableTop / rows;
  const cellWidth = usableLeft / columns;

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    star.className = "hero-star";

    const row = Math.floor(i / columns);
    const col = i % columns;
    const jitterX = (Math.random() - 0.5) * cellWidth * 0.6;
    const jitterY = (Math.random() - 0.5) * cellHeight * 0.6;
    const size = (6 + Math.random() * 6) * 1.2;
    const top = startTop + row * cellHeight + cellHeight / 2 + jitterY;
    const left = startLeft + col * cellWidth + cellWidth / 2 + jitterX;
    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 2;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.max(2, Math.min(96, top))}%`;
    star.style.left = `${Math.max(2, Math.min(96, left))}%`;
    star.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    starField.appendChild(star);
  }

  header.appendChild(starField);
});
