const pages = document.querySelectorAll(".page");
const book = document.getElementById("book");
let current = 0;
let isAnimating = false;

// Actualiza la vista según pantalla y posición
function updateView() {
  const isMobile = window.innerWidth < 768;
  const total = pages.length;
  pages.forEach(p => p.className = 'page'); // reset clases
  book.classList.remove("double");

  // Portada (página única)
  if(current === 0){
    pages[0].classList.add("active", "single");
    return;
  }

  // Contraportada (última página)
  if(current >= total - 1){
    pages[total - 1].classList.add("active", "single");
    return;
  }

  // Páginas intermedias (contenido)
  if(isMobile){
    pages[current]?.classList.add("active");
  } else {
    book.classList.add("double");
    pages[current]?.classList.add("left", "active");
    pages[current + 1]?.classList.add("right", "active");
  }
}

// Función para animar paso de página con slide+fade
function turnPage(forward=true){
  if(isAnimating) return;
  isAnimating = true;

  const isMobile = window.innerWidth < 768;
  const total = pages.length;
  let prevPage = pages[current];

  // Actualizamos índice
  if(forward){
    if(current === 0) current = 1; // Portada → primera doble
    else if(isMobile && current < total - 1) current++;
    else if(!isMobile && current < total - 2) current += 2;
  } else {
    if(isMobile && current > 0) current--;
    else if(!isMobile && current > 1) current -= 2;
    else current = 0; // volver a portada
  }

  const nextPage = pages[current];

  // Animación slide + fade
  if(prevPage){
    prevPage.classList.add(forward ? "slide-left-out" : "slide-right-out");
  }
  if(nextPage){
    nextPage.classList.add("active", forward ? "slide-left-in" : "slide-right-in");
  }

  setTimeout(()=>{
    pages.forEach(p=>{
      p.classList.remove("slide-left-in","slide-left-out","slide-right-in","slide-right-out");
    });
    updateView();
    isAnimating = false;
  },400); // duración rápida y fluida
}

// Navegación tocando la revista
book.addEventListener("click",(e)=>{
  const rect = book.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const isRight = x > rect.width/2;
  turnPage(isRight);
});

window.addEventListener("resize", updateView);
updateView();