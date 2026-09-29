export function createFaviconAdmin() {
  const canvas =
    document.createElement("canvas");

  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  // Fondo
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fillStyle = "#ed142d";
  ctx.fill();

  // Antena
  ctx.beginPath();
  ctx.moveTo(32, 27);
  ctx.lineTo(32, 13);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0d0d1eff";
  ctx.stroke();

  // Punto rojo
  ctx.beginPath();
  ctx.arc(32, 12, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#09090c";
  ctx.fill();

  // Ondas
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#09090c";

  // Izquierda interior
  ctx.beginPath();
  ctx.arc(
    32,
    13,
    10,
    Math.PI * 0.75,
    Math.PI * 1.25
  );
  ctx.stroke();

  // Derecha interior
  ctx.beginPath();
  ctx.arc(
    32,
    13,
    10,
    -Math.PI * 0.25,
    Math.PI * 0.25
  );
  ctx.stroke();

  // Izquierda exterior
  ctx.beginPath();
  ctx.arc(
    32,
    13,
    16,
    Math.PI * 0.75,
    Math.PI * 1.25
  );
  ctx.stroke();

  // Derecha exterior
  ctx.beginPath();
  ctx.arc(
    32,
    13,
    16,
    -Math.PI * 0.25,
    Math.PI * 0.25
  );
  ctx.stroke();

  // S
  ctx.font = "900 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffff03";
  ctx.fillText("S", 32, 42);

  // Línea roja
  ctx.beginPath();
  ctx.moveTo(20, 55);
  ctx.lineTo(44, 55);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#ed142d";
  ctx.stroke();

  // Quitar favicon anterior
  document
    .querySelectorAll<HTMLLinkElement>(
      'link[rel*="icon"]'
    )
    .forEach((icon) => icon.remove());

  // Aplicar favicon Smonk
  const favicon =
    document.createElement("link");

  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href =
    canvas.toDataURL("image/png");

  document.head.appendChild(favicon);
}