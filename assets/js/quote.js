function renderCart() {
  const cartEl = document.getElementById('cart');
  if (!cartEl) return;
  const cart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
  
  if (cart.length === 0) {
    cartEl.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <p style="margin-bottom: 1rem; color: var(--muted);">Your quote cart is empty.</p>
        <p style="margin-bottom: 1rem;">Add items from the store to get started:</p>
        <div style="display: grid; gap: 0.8rem; margin-top: 1rem;">
          <a href="store.html" class="btn primary" style="text-decoration: none;">Browse Store Items</a>
          <p style="font-size: 0.9rem; color: var(--muted);">or</p>
          <a href="projects.html" class="btn ghost" style="text-decoration: none;">View Custom Projects</a>
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--accent-soft); border-radius: 12px;">
          <p style="font-size: 0.9rem; margin: 0;"><strong>Popular items:</strong> Laser Pointers ($40), Measuring Sets ($100), Cheese Planes ($35)</p>
        </div>
      </div>
    `;
    return;
  }

  let html = '<table class="quote-table"><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>';
  let total = 0;
  cart.forEach((item, idx) => {
    html += `<tr data-idx="${idx}"><td>${item.title}</td><td>${item.qty}</td><td>$${item.price.toFixed(2)}</td><td><button class="remove-item" data-idx="${idx}">Remove</button></td></tr>`;
    total += item.price * item.qty;
  });
  html += `</tbody></table><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
  cartEl.innerHTML = html;

  cartEl.querySelectorAll('.remove-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      cart.splice(idx, 1);
      localStorage.setItem('quoteCart', JSON.stringify(cart));
      renderCart();
      updateQuoteCount();
    });
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  const cart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
  const status = document.getElementById('quote-status');
  
  if (cart.length === 0) {
    if (status) {
      status.textContent = 'Please add items to your quote before sending.';
      status.style.color = '#b6452c';
    }
    return;
  }

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const notes = document.getElementById('notes').value;

  // Check if required fields are filled
  if (!name || !email) {
    if (status) {
      status.textContent = 'Please fill in your name and email.';
      status.style.color = '#b6452c';
    }
    return;
  }

  let body = `Quote request from ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AItems:%0D%0A`;
  let total = 0;
  cart.forEach((item) => {
    body += `- ${item.title} x${item.qty} @ $${item.price}%0D%0A`;
    total += item.price * item.qty;
  });
  body += `%0D%0ATotal: $${total.toFixed(2)}%0D%0A%0D%0ANotes:%0D%0A${notes}`;

  const recipient = 'info@sandypeakwoodcraft.com';
  const subject = encodeURIComponent('Quote Request - Sandy Peak Woodcraft');
  
  // Try to open mailto
  try {
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    
    // Show success message after a short delay
    setTimeout(() => {
      if (status) {
        status.textContent = 'Email client opened! If nothing happened, please email us directly at info@sandypeakwoodcraft.com';
        status.style.color = '#2f6b3b';
      }
    }, 500);
  } catch (error) {
    // Fallback if mailto fails
    if (status) {
      status.textContent = 'Please email your quote to info@sandypeakwoodcraft.com';
      status.style.color = '#b6452c';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const form = document.getElementById('quote-form');
  if (form) form.addEventListener('submit', handleSubmit);
});