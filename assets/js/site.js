function updateQuoteCount() {
  const cart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#quote-count').forEach((el) => {
    el.textContent = count;
  });
}

function ensureToast() {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  return toast;
}

function showToast(message) {
  const toast = ensureToast();
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function wireAddToQuote() {
  document.querySelectorAll('.add-quote').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const price = Number(btn.dataset.price || 0);
      addToQuote({ id, title, price });
      showToast(`${title} added to quote.`);
    });
  });
}

function addToQuote(item) {
  const cart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
  const found = cart.find((entry) => entry.id === item.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem('quoteCart', JSON.stringify(cart));
  updateQuoteCount();
}

function wireGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  let currentSlideshowItem = null;

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      let target;
      let captionText = item.dataset.caption || '';
      
      // Handle slideshow items - get the active slide
      if (item.classList.contains('gallery-slideshow')) {
        currentSlideshowItem = item;
        const activeSlide = item.querySelector('.slide.active');
        target = activeSlide?.querySelector('img');
      } else {
        currentSlideshowItem = null;
        target = item.querySelector('img');
      }
      
      if (!target) return;
      img.src = target.src;
      img.alt = target.alt || '';
      if (caption) {
        caption.textContent = captionText;
      }
      lightbox.hidden = false;
    });
  });

  function navigateSlideshowInLightbox(direction) {
    if (!currentSlideshowItem) return;
    
    const slides = currentSlideshowItem.querySelectorAll('.slide');
    const dots = currentSlideshowItem.querySelectorAll('.dot');
    const activeSlide = currentSlideshowItem.querySelector('.slide.active');
    const currentIndex = Array.from(slides).indexOf(activeSlide);
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;
    
    // Update slideshow
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));
    slides[nextIndex].classList.add('active');
    dots[nextIndex].classList.add('active');
    
    // Update lightbox image
    const newImg = slides[nextIndex].querySelector('img');
    img.src = newImg.src;
    img.alt = newImg.alt || '';
  }

  // Navigation buttons in lightbox
  document.getElementById('lightbox-prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateSlideshowInLightbox(-1);
  });

  document.getElementById('lightbox-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateSlideshowInLightbox(1);
  });

  // Keyboard navigation in lightbox
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    
    if (event.key === 'Escape') {
      lightbox.hidden = true;
    } else if (event.key === 'ArrowLeft') {
      navigateSlideshowInLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      navigateSlideshowInLightbox(1);
    }
  });

  document.getElementById('close-lightbox')?.addEventListener('click', () => {
    lightbox.hidden = true;
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.hidden = true;
    }
  });
}

function wireSlideshows() {
  document.querySelectorAll('.gallery-slideshow').forEach((item) => {
    const slides = item.querySelectorAll('.slide');
    const dots = item.querySelectorAll('.dot');
    const prevBtn = item.querySelector('.slide-prev');
    const nextBtn = item.querySelector('.slide-next');
    let currentSlide = 0;

    function showSlide(n) {
      currentSlide = (n + slides.length) % slides.length;
      slides.forEach((slide) => slide.classList.remove('active'));
      dots.forEach((dot) => dot.classList.remove('active'));
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide - 1);
    });

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide + 1);
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(Number(dot.dataset.dot) - 1);
      });
    });

    // Initialize first slide
    showSlide(0);
  });
}


function wireContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Please complete the required fields.';
        status.style.color = '#b6452c';
      }
      return;
    }
    const name = form.querySelector('[name="name"]').value.trim();
    if (status) {
      status.textContent = `Thanks ${name || 'there'}! We will be in touch shortly.`;
      status.style.color = '#2f6b3b';
    }
    form.reset();
  });
}

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateQuoteCount();
  wireAddToQuote();
  wireGalleryLightbox();
  wireSlideshows();
  wireContactForm();
  setYear();
});
