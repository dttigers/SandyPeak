function renderCart() {
  const cartEl = document.getElementById('cart');
  if (!cartEl) return;
  const cart = JSON.parse(localStorage.getItem('quoteCart') || '[]');
  if (cart.length === 0) {
    cartEl.innerHTML = '<p>Your quote is empty. Add items on the <a href="store.html">Store</a> page.</p>';
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

  let body = `Quote request from ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AItems:%0D%0A`;
  let total = 0;
  cart.forEach((item) => {
    body += `- ${item.title} x${item.qty} @ $${item.price}%0D%0A`;
    total += item.price * item.qty;
  });
  body += `%0D%0ATotal: $${total.toFixed(2)}%0D%0A%0D%0ANotes:%0D%0A${notes}`;

  const recipient = 'hello@sandypeakwoodcraft.com';
  const subject = encodeURIComponent('Quote Request - Sandy Peak Woodcraft');
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const form = document.getElementById('quote-form');
  if (form) form.addEventListener('submit', handleSubmit);
});
