/**
 * DIVYA SARAN — PORTFOLIO PRESENTATION INTERACTION CONTROLLER
 * Handles View modes, Presentation navigation, Table of Contents jumping,
 * In-browser live editing & image uploading, and persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const body = document.body;
  const slides = Array.from(document.querySelectorAll('.slide-frame'));
  const btnViewStream = document.getElementById('btnViewStream');
  const btnViewSlide = document.getElementById('btnViewSlide');
  const btnViewGrid = document.getElementById('btnViewGrid');
  
  const navPrev = document.getElementById('navPrev');
  const navNext = document.getElementById('navNext');
  const slideIndicator = document.getElementById('slideIndicator');
  
  const btnToggleEdit = document.getElementById('btnToggleEdit');
  const editBtnText = document.getElementById('editBtnText');
  const btnPrint = document.getElementById('btnPrint');
  
  let currentSlideIndex = 0;
  let isEditMode = false;

  // -------------------------------------------------------------------------
  // 1. View Mode Switching
  // -------------------------------------------------------------------------
  function setViewMode(mode) {
    body.classList.remove('view-stream', 'view-slide', 'view-grid');
    if (btnViewStream) btnViewStream.classList.remove('active');
    if (btnViewSlide) btnViewSlide.classList.remove('active');
    if (btnViewGrid) btnViewGrid.classList.remove('active');

    if (mode === 'stream') {
      body.classList.add('view-stream');
      if (btnViewStream) btnViewStream.classList.add('active');
      slides.forEach(slide => slide.classList.remove('active-slide'));
    } else if (mode === 'slide') {
      body.classList.add('view-slide');
      if (btnViewSlide) btnViewSlide.classList.add('active');
      showSlide(currentSlideIndex);
    } else if (mode === 'grid') {
      body.classList.add('view-grid');
      if (btnViewGrid) btnViewGrid.classList.add('active');
      slides.forEach(slide => slide.classList.remove('active-slide'));
    }

    localStorage.setItem('divya_portfolio_view_mode', mode);
  }

  if (btnViewStream) btnViewStream.addEventListener('click', () => setViewMode('stream'));
  if (btnViewSlide) btnViewSlide.addEventListener('click', () => setViewMode('slide'));
  if (btnViewGrid) btnViewGrid.addEventListener('click', () => setViewMode('grid'));

  // -------------------------------------------------------------------------
  // 2. Presentation Deck Navigation
  // -------------------------------------------------------------------------
  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    currentSlideIndex = index;
    slides.forEach((s, idx) => {
      s.classList.toggle('active-slide', idx === currentSlideIndex);
    });

    const activeSlide = slides[currentSlideIndex];
    if (activeSlide && typeof setActiveNav === 'function') {
      setActiveNav(activeSlide.id);
    }

    const slideNumStr = String(currentSlideIndex + 1).padStart(2, '0');
    const totalStr = String(slides.length).padStart(2, '0');
    slideIndicator.textContent = `Slide ${slideNumStr} / ${totalStr}`;

    // scroll to top smoothly when in slide mode
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      showSlide(currentSlideIndex + 1);
    } else {
      showSlide(0); // loop to start
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      showSlide(currentSlideIndex - 1);
    } else {
      showSlide(slides.length - 1); // loop to end
    }
  }

  navNext.addEventListener('click', nextSlide);
  navPrev.addEventListener('click', prevSlide);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    // Avoid hijacking arrows when user is actively editing text
    if (document.activeElement && document.activeElement.isContentEditable) {
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      if (body.classList.contains('view-slide')) {
        e.preventDefault();
        nextSlide();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (body.classList.contains('view-slide')) {
        e.preventDefault();
        prevSlide();
      }
    }
  });

  // -------------------------------------------------------------------------
  // 3. Navigation Bar Controller (Home, About, Education, Skills, Experience, Work, Contact)
  // -------------------------------------------------------------------------
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const brandLogoBtn = document.getElementById('brandLogoBtn');

  function setActiveNav(targetId) {
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('data-slide-target') === targetId || link.getAttribute('href') === `#${targetId}`;
      link.classList.toggle('active', isTarget);
      if (isTarget) {
        try {
          link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (err) {
          // fallback if scrollIntoView options unsupported
        }
      }
    });
  }

  function navigateToSlide(targetId, slideIndex) {
    if (body.classList.contains('view-slide')) {
      // In Presentation mode: switch directly to that slide index
      showSlide(slideIndex);
      setActiveNav(targetId);
    } else {
      // In All Pages / Grid mode: smooth scroll with sticky header offset
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const toolbar = document.getElementById('appToolbar');
        const toolbarHeight = toolbar ? toolbar.offsetHeight : 70;
        const targetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - (toolbarHeight + 18);
        window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
        setActiveNav(targetId);

        // Grid mode: provide quick visual focus pulse
        if (body.classList.contains('view-grid')) {
          targetElement.style.transition = 'box-shadow 0.3s, border-color 0.3s';
          targetElement.style.borderColor = 'var(--color-rose-primary)';
          targetElement.style.boxShadow = '0 0 35px var(--color-rose-glow)';
          setTimeout(() => {
            targetElement.style.borderColor = '';
            targetElement.style.boxShadow = '';
          }, 1400);
        }
      }
    }
  }

  // Bind clicks on all navigation links
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-slide-target');
      const slideIndex = parseInt(link.getAttribute('data-index') || idx, 10);
      navigateToSlide(targetId, slideIndex);
    });
  });

  if (brandLogoBtn) {
    brandLogoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSlide('slide-01', 0);
    });
  }

  // Scroll Spy: Automatically updates active nav bar as the user scrolls in stream/grid modes
  window.addEventListener('scroll', () => {
    if (body.classList.contains('view-slide')) return;
    
    const scrollPosition = window.pageYOffset + 140;
    for (let i = slides.length - 1; i >= 0; i--) {
      const slide = slides[i];
      if (slide && slide.offsetTop <= scrollPosition) {
        setActiveNav(slide.id);
        break;
      }
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 4. Live In-Browser Text Customization & LocalStorage
  // -------------------------------------------------------------------------
  const editableFields = document.querySelectorAll('.editable-field');

  // Load saved content from localStorage if available (v2 for resume updates)
  editableFields.forEach((field, i) => {
    const saved = localStorage.getItem(`divya_v2_edit_${i}`);
    if (saved !== null) {
      field.innerHTML = saved;
    }

    // Save on blur or input
    field.addEventListener('input', () => {
      localStorage.setItem(`divya_v2_edit_${i}`, field.innerHTML);
    });
  });

  function toggleEditMode() {
    isEditMode = !isEditMode;
    body.classList.toggle('edit-mode-active', isEditMode);
    btnToggleEdit.classList.toggle('active-mode', isEditMode);

    editableFields.forEach(field => {
      field.contentEditable = isEditMode ? 'true' : 'false';
    });

    if (isEditMode) {
      editBtnText.textContent = 'Save / Done';
    } else {
      editBtnText.textContent = 'Live Edit';
    }
  }

  btnToggleEdit.addEventListener('click', toggleEditMode);

  // -------------------------------------------------------------------------
  // 5. Image File Replacers (Instant local photo preview)
  // -------------------------------------------------------------------------
  function setupImageUploader(inputId, imgId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    if (!input || !img) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          img.src = loadEvent.target.result;
          try {
            localStorage.setItem(`divya_img_v3_${imgId}`, loadEvent.target.result);
          } catch (err) {
            console.warn('Image too large for localStorage, showing in session only.');
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Check if previously uploaded in v3
    const savedImg = localStorage.getItem(`divya_img_v3_${imgId}`);
    if (savedImg) {
      img.src = savedImg;
    }
  }

  setupImageUploader('inputReplaceHero', 'heroModelImg');
  setupImageUploader('inputReplaceIntro', 'introBannerImg');
  setupImageUploader('inputReplaceAbout', 'aboutImg');
  setupImageUploader('inputReplaceEdu', 'eduCropImg');

  // -------------------------------------------------------------------------
  // 6. Resume Modal Controller & View Options
  // -------------------------------------------------------------------------
  const resumeModal = document.getElementById('resumeModal');
  const btnCloseResumeModal = document.getElementById('btnCloseResumeModal');
  const btnPrintModalResume = document.getElementById('btnPrintModalResume');
  const openResumeButtons = [
    document.getElementById('btnOpenResume'),
    document.getElementById('heroResumeBtn'),
    document.getElementById('aboutResumeBtn'),
    document.getElementById('contactResumeBtn')
  ];

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('modal-open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove('modal-open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  openResumeButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', openResume);
  });

  if (btnCloseResumeModal) {
    btnCloseResumeModal.addEventListener('click', closeResume);
  }

  // Backdrop click closes modal
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('modal-open')) {
      closeResume();
    }
  });

  // Print modal resume specifically
  if (btnPrintModalResume) {
    btnPrintModalResume.addEventListener('click', () => {
      document.body.classList.add('printing-resume');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-resume');
      }, 600);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Image Lightbox Controller (Full-Size Creative Inspection)
  // -------------------------------------------------------------------------
  const imageLightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  window.openLightbox = function(src, caption) {
    if (!imageLightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption && caption) {
      lightboxCaption.textContent = caption;
    }
    imageLightbox.classList.add('lightbox-open');
    imageLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    if (!imageLightbox) return;
    imageLightbox.classList.remove('lightbox-open');
    imageLightbox.setAttribute('aria-hidden', 'true');
    if (!resumeModal || !resumeModal.classList.contains('modal-open')) {
      document.body.style.overflow = '';
    }
  };

  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener('click', window.closeLightbox);
  }

  if (imageLightbox) {
    imageLightbox.addEventListener('click', (e) => {
      if (e.target === imageLightbox) {
        window.closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageLightbox && imageLightbox.classList.contains('lightbox-open')) {
      window.closeLightbox();
    }
  });

  // -------------------------------------------------------------------------
  // 9. Video Reel Lightbox Controller (Instagram Video Playing)
  // -------------------------------------------------------------------------
  const videoLightbox = document.getElementById('videoLightbox');
  const reelVideoIframe = document.getElementById('reelVideoIframe');
  const videoReelTitle = document.getElementById('videoReelTitle');
  const videoDirectLink = document.getElementById('videoDirectLink');
  const btnCloseVideoLightbox = document.getElementById('btnCloseVideoLightbox');

  window.openVideoReel = function(reelCode, title, directUrl) {
    if (!videoLightbox || !reelVideoIframe) return;
    // Load official Instagram Embed player
    reelVideoIframe.src = `https://www.instagram.com/reel/${reelCode}/embed/`;
    if (videoReelTitle && title) {
      videoReelTitle.textContent = title;
    }
    if (videoDirectLink && directUrl) {
      videoDirectLink.href = directUrl;
    }
    videoLightbox.classList.add('lightbox-open');
    videoLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoReel = function() {
    if (!videoLightbox || !reelVideoIframe) return;
    // Stop playback by clearing src
    reelVideoIframe.src = '';
    videoLightbox.classList.remove('lightbox-open');
    videoLightbox.setAttribute('aria-hidden', 'true');
    if (!resumeModal || !resumeModal.classList.contains('modal-open')) {
      document.body.style.overflow = '';
    }
  };

  if (btnCloseVideoLightbox) {
    btnCloseVideoLightbox.addEventListener('click', window.closeVideoReel);
  }

  if (videoLightbox) {
    videoLightbox.addEventListener('click', (e) => {
      if (e.target === videoLightbox) {
        window.closeVideoReel();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoLightbox && videoLightbox.classList.contains('lightbox-open')) {
      window.closeVideoReel();
    }
  });

  // -------------------------------------------------------------------------
  // 7. General Deck Print
  // -------------------------------------------------------------------------
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // Restore preferred view mode (default: stream = all full uniform size)
  const savedMode = localStorage.getItem('divya_portfolio_view_mode') || 'stream';
  setViewMode(savedMode);
  showSlide(0);
});
