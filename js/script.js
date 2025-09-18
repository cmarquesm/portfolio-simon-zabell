// =========================================
// Web desarrollada por Carlos Marqués Muñoz
// cmarques83.dev@gmail.com | Julio 2025
// =========================================
console.log(
  "%cWeb desarrollada por Carlos Marqués – marquésbasso@gmail.com",
  "color: gray; font-style: italic; font-size: 14px"
);

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const indicator = document.getElementById("timeline-indicator");

  fetch("obras.csv")
    .then((response) => response.text())
    .then((csv) => {
      const rows = csv.trim().split("\n").slice(1);
      const obras = [];

      rows.forEach((row) => {
        const partes = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (partes.length >= 3) {
          const archivo = partes[0].replace(/(^"|"$)/g, "").trim();
          const caption = partes[1].replace(/(^"|"$)/g, "").trim();
          const anio = partes[2].replace(/(^"|"$)/g, "").trim();
          obras.push({ archivo, caption, anio });
        }
      });

      const agrupadas = {};
      obras.forEach((obra) => {
        if (!agrupadas[obra.anio]) agrupadas[obra.anio] = [];
        agrupadas[obra.anio].push(obra);
      });

      const sortedYears = Object.keys(agrupadas)
        .map((y) => parseInt(y))
        .sort((a, b) => b - a)
        .map((y) => y.toString());

      sortedYears.forEach((anio) => {
        const yearGroup = document.createElement("div");
        yearGroup.classList.add("year-group");

        yearGroup.innerHTML += `<div class="year-label" id="year-${anio}" data-year="${anio}">${anio}</div><div class="spacer"></div>`;

        agrupadas[anio].forEach((obra) => {
          const esVideo = obra.archivo.endsWith(".mp4");
          const esYT = obra.archivo.startsWith("youtube/");

          const rutaImagen =
            (esVideo ? "video/" : esYT ? "" : "img/") +
            obra.archivo.split("/").map(encodeURIComponent).join("/");

          const claseExtra =
            obra.archivo === "2018/18tahi(6).webp" ||
            obra.archivo === "2024/24all (5).webp" ||
            obra.archivo === "video15dib.mp4" || obra.archivo.startsWith("youtube/")
              ? " full-span"
              : "";

          if (esVideo) {
            yearGroup.innerHTML += `
              <div class="item${claseExtra}" data-year="${anio}">
                <video controls preload="metadata" width="100%">
                  <source src="${rutaImagen}" type="video/mp4">
                  Tu navegador no soporta HTML5 video.
                </video>
                <p class="caption">${
                  obra.caption ? obra.caption + ". " + obra.anio : "&nbsp;"
                }</p>
              </div>`;
          } else if (esYT) {
            const ytID = obra.archivo.split("/")[1];
            yearGroup.innerHTML += `
              <div class="item${claseExtra}" data-year="${anio}">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/${ytID}"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
                <p class="caption">${
                  obra.caption ? obra.caption + ". " + obra.anio : "&nbsp;"
                }</p>
              </div>`;
          } else {

            const isFirstImageGlobal = grid.querySelectorAll("img").length === 0;
            const fetchAttr = isFirstImageGlobal ? 'fetchpriority="high"' : '';
            
            yearGroup.innerHTML += `
              <div class="item${claseExtra}" data-year="${anio}">
                <img src="${rutaImagen}" alt="${obra.caption}" loading="lazy">
                <p class="caption">${
                  obra.caption ? obra.caption + ". " + obra.anio : "&nbsp;"
                }</p>
              </div>`;
                }
          });

        grid.appendChild(yearGroup);
      });

      const items = document.querySelectorAll(".grid .item");
      const yearLabels = document.querySelectorAll(".grid .year-label");
      const observables = [...items, ...yearLabels];

      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");

      items.forEach((item) => {
        item.addEventListener("click", () => {
          const img = item.querySelector("img");
          lightboxImg.src = img.src;
          lightbox.classList.add("active");
        });
      });

      lightbox.addEventListener("click", () => {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
      });

      // Timeline dinámico
      if (indicator && items.length) {
        const observer = new IntersectionObserver(
          (entries) => {
            const visibles = entries.filter((entry) => entry.isIntersecting);
            if (visibles.length > 0) {
              const primero = visibles.sort(
                (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
              )[0];
              const year = primero.target.getAttribute("data-year");
              if (year && indicator.textContent !== year) {
                indicator.textContent = year;
              }
            }
          },
          {
            rootMargin: "0px 0px -20% 0px",
            threshold: 0,
          }
        );

        observables.forEach((el) => observer.observe(el));
      }

      const hero = document.querySelector(".hero");
      const body = document.body;

      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          body.classList.toggle("show-timeline", !entry.isIntersecting);
        });
      });

      if (hero) heroObserver.observe(hero);

      const spacer = document.createElement("div");
      spacer.style.height = "40vh";
      grid.appendChild(spacer);
    });
});
