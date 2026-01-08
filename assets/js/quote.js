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

  // Build cart items summary
  let cartSummary = '';
  let total = 0;
  cart.forEach((item) => {
    cartSummary += `- ${item.title} x${item.qty} @ $${item.price}\n`;
    total += item.price * item.qty;
  });
  cartSummary += `\nTotal: $${total.toFixed(2)}`;

  // Submit to Formspree
  try {
    if (status) {
      status.textContent = 'Sending...';
      status.style.color = 'var(--muted)';
    }

    const response = await fetch('https://formspree.io/f/xojvgoww', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        notes: notes,
        cart_items: cartSummary
      })
    });

    if (response.ok) {
      if (status) {
        status.textContent = 'Quote request sent! We\'ll be in touch soon.';
        status.style.color = '#2f6b3b';
      }
      // Clear the cart after successful submission
      localStorage.removeItem('quoteCart');
      renderCart();
      updateQuoteCount();
      // Reset the form
      document.getElementById('quote-form').reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    if (status) {
      status.textContent = 'Something went wrong. Please try again or email us at info@sandypeakwoodcraft.com';
      status.style.color = '#b6452c';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const form = document.getElementById('quote-form');
  if (form) form.addEventListener('submit', handleSubmit);
});