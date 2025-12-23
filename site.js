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

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.querySelector('img');
      if (!target) return;
      img.src = target.src;
      img.alt = target.alt || '';
      if (caption) {
        caption.textContent = item.dataset.caption || target.alt || '';
      }
      lightbox.hidden = false;
    });
  });

  document.getElementById('close-lightbox')?.addEventListener('click', () => {
    lightbox.hidden = true;
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.hidden = true;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      lightbox.hidden = true;
    }
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
  wireContactForm();
  setYear();
});
