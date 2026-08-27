document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. NAVEGACIÓN ENTRE PESTAÑAS Y CONTROL DE IMÁGENES/BOTÓN VOLVER
  // ==========================================
  const btnInfo = document.getElementById("btn-info");
  const btnPersonal = document.getElementById("btn-personal");
  const btnBack = document.getElementById("btn-back");

  const viewPortfolio = document.getElementById("view-portfolio");
  const viewInfo = document.getElementById("view-info");
  const viewPersonal = document.getElementById("view-personal");

  const portraitImg = document.querySelector(".img-portrait");
  const textOverlayImg = document.getElementById("text-overlay");
  const poemText = document.querySelector(".poem-text");

  // Rutas de imágenes de Retrato
  const FOTO_PRINCIPAL = "imagenes/retrato2.avif";
  const FOTO_INFO = "imagenes/retrato3.avif";

  // Rutas de imágenes de Texto Overlay
  const FOTO_TEXTO_PRINCIPAL = "imagenes/texto2.avif";
  const FOTO_TEXTO_INFO = "imagenes/texto.avif";

  function switchTab(viewToShow) {
    if (!viewPortfolio || !viewInfo || !viewPersonal) return;

    // 1. Ocultar todas las pestañas
    viewPortfolio.classList.add("hidden");
    viewInfo.classList.add("hidden");
    viewPersonal.classList.add("hidden");

    // 2. Mostrar la vista seleccionada
    viewToShow.classList.remove("hidden");

    // 3. Poema: solo visible en Portfolio (Principal)
    if (poemText) {
      if (viewToShow === viewPortfolio) {
        poemText.classList.remove("hidden");
      } else {
        poemText.classList.add("hidden");
      }
    }

    // 4. Cambios según la pestaña activa (Retrato, Texto Overlay y Botón Volver)
    if (viewToShow === viewPortfolio) {
      if (portraitImg) portraitImg.src = FOTO_PRINCIPAL;
      if (textOverlayImg) textOverlayImg.src = FOTO_TEXTO_PRINCIPAL;
      if (btnBack) btnBack.classList.add("hidden");
    } else if (viewToShow === viewInfo) {
      if (portraitImg) portraitImg.src = FOTO_INFO;
      if (textOverlayImg) textOverlayImg.src = FOTO_TEXTO_INFO;
      if (btnBack) btnBack.classList.remove("hidden");
    } else {
      // Vista Archivo / Personal
      if (btnBack) btnBack.classList.remove("hidden");
    }
  }

  if (btnInfo) btnInfo.addEventListener("click", (e) => { e.preventDefault(); switchTab(viewInfo); });
  if (btnPersonal) btnPersonal.addEventListener("click", (e) => { e.preventDefault(); switchTab(viewPersonal); });
  if (btnBack) btnBack.addEventListener("click", (e) => { e.preventDefault(); switchTab(viewPortfolio); });


  // ==========================================
  // 2. CAMBIO DE IMÁGENES / GALERÍAS (AUTOMÁTICO + CLICK)
  // ==========================================
  const localProjectFiles = {
    "gallery-proj-1": [
      "imagenes/catalogo.webp"
    ],
    "gallery-proj-2": [
      "imagenes/Logo oh la la.avif",
      "imagenes/mobile oh la la.avif",
      "imagenes/oh la la.avif"
    ],
    "gallery-proj-3": [
      "imagenes/eseda-05.webp",
      "imagenes/eseda-03.avif",
      "imagenes/eseda-02.avif",
      "imagenes/eseda-01.avif",
      "imagenes/eseda-04.avif"
    ],
    "gallery-proj-4": [
      "imagenes/webarchivo.webp"
    ],
    "gallery-proj-5": [
      "imagenes/esmorzarfest.webp",
      "imagenes/esmorzarfest-2.webp",
      "imagenes/esmorzar fest-01.avif",
      "imagenes/esmorzar fest-02.avif",
      "imagenes/esmorzar fest-03.avif"
    ],

    "gallery-proj-7": [
      "imagenes/hibia-01.avif",
      "imagenes/hibia.webp",
      "imagenes/hibia-03.avif",
      "imagenes/hibia-04.avif",
      "imagenes/hibia-05.avif"
    ]
  };

  const AUTO_SLIDE_SPEED = 3000; 

  Object.keys(localProjectFiles).forEach(galleryId => {
    const galleryElement = document.getElementById(galleryId);
    if (!galleryElement) return;

    const imgTag = galleryElement.querySelector(".active-image");
    const frame = galleryElement.querySelector(".slide-frame");
    const files = localProjectFiles[galleryId];

    if (!imgTag || !files || files.length <= 1) return;

    let fileIndex = 0;
    let autoSlideInterval;

    function nextImage() {
      fileIndex = (fileIndex + 1) % files.length;
      imgTag.src = files[fileIndex];
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextImage, AUTO_SLIDE_SPEED);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      nextImage();
      startAutoSlide();
    }

    startAutoSlide();

    if (frame) {
      frame.addEventListener("click", resetAutoSlide);
    }
  });


  // ==========================================
  // 3. ARRASTRAR + PELLIZCO TÁCTIL (MÓVIL/TABLET) + AUDIO
  // ==========================================
  function makeDraggableAndResizable(element) {
    if (!element) return;
    
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initialLeft, initialTop;
    let currentScale = 1;

    // Comprueba si estamos en vista escritorio
    const isDesktop = () => window.innerWidth > 900;

    // --- A) ARRASTRE CON RATÓN (PC) ---
    element.addEventListener("mousedown", (e) => {
      if (!isDesktop()) return;
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      
      initialLeft = element.offsetLeft;
      initialTop = element.offsetTop;
      
      element.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging || !isDesktop()) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }
      
      element.style.left = `${initialLeft + dx}px`;
      element.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // --- B) TÁCTIL: PELLIZCO Y ARRASTRE ---
    let initialPinchDistance = null;

    element.addEventListener("touchstart", (e) => {
      if (isDesktop() && e.touches.length === 1) {
        isDragging = true;
        hasMoved = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = element.offsetLeft;
        initialTop = element.offsetTop;
        element.style.zIndex = 1000;
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    element.addEventListener("touchmove", (e) => {
      if (!isDesktop() && e.touches.length === 1) return;

      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
      } else if (e.touches.length === 2 && initialPinchDistance) {
        const currentPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const zoomFactor = currentPinchDistance / initialPinchDistance;
        let tempScale = currentScale * zoomFactor;
        tempScale = Math.min(Math.max(0.5, tempScale), 2.5);

        element.style.transform = `scale(${tempScale})`;
      }
    }, { passive: true });

    element.addEventListener("touchend", (e) => {
      if (e.touches.length < 2 && initialPinchDistance) {
        const transformMatrix = window.getComputedStyle(element).transform;
        if (transformMatrix !== 'none') {
          const values = transformMatrix.split('(')[1].split(')')[0].split(',');
          currentScale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
        }
        initialPinchDistance = null;
      }
      isDragging = false;
    });

    // --- C) CONTROL DE AUDIO EN VÍDEOS ---
    const video = element.querySelector("video.sound-video");
    if (video) {
      element.addEventListener("click", () => {
        if (!hasMoved) {
          video.muted = !video.muted;
          if (video.paused) video.play();
        }
      });
    }
  }

  // Activar arrastre en el logo y pósters
  const logo = document.getElementById("draggableLogo");
  if (logo) makeDraggableAndResizable(logo);

  document.querySelectorAll(".draggable-poster").forEach(poster => {
    makeDraggableAndResizable(poster);
  });

});