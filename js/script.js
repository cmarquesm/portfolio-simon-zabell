// =========================================
// Web desarrollada por Carlos Marqués Muñoz
// marquesbasso@gmail.com | Julio 2025
// =========================================
console.log('%cWeb desarrollada por Carlos Marqués – marquésbasso@gmail.com', 'color: gray; font-style: italic; font-size: 14px');



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
          const rutaImagen =
            "img/" +
            obra.archivo.split("/").map(encodeURIComponent).join("/");
          yearGroup.innerHTML += `
          <div class="item" data-year="${anio}">
            <img src="${rutaImagen}" alt="${obra.caption}" loading="lazy">
            <p class="caption">${
              obra.caption ? obra.caption + ". " + obra.anio : "&nbsp;"
            }</p>
          </div>`;
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
