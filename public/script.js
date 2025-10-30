const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0
});

const productState = new Map();
const cartState = new Map();

const grids = document.querySelectorAll('[data-products-grid]');
const cartToggleButtons = document.querySelectorAll('[data-cart-toggle]');
const cartPanel = document.querySelector('[data-cart-panel]');
const cartBody = document.querySelector('[data-cart-body]');
const cartSubtotal = document.querySelector('[data-cart-subtotal]');
const cartCount = document.querySelector('[data-cart-count]');
const checkoutButtons = document.querySelectorAll('[data-open-checkout]');
const overlay = document.querySelector('[data-overlay]');
const overlayClose = document.querySelector('[data-close-overlay]');
const checkoutForm = document.querySelector('[data-checkout-form]');
const checkoutStatus = document.querySelector('[data-checkout-status]');
const checkoutHelper = document.querySelector('[data-checkout-helper]');
const toast = document.querySelector('[data-toast]');
const yearSpan = document.querySelector('[data-current-year]');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

async function fetchProducts() {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Unable to load products at this time.');
  }

  const { products } = await response.json();
  products.forEach((product) => productState.set(product.id, product));
  return products;
}

function buildBadgeList(badges = []) {
  if (!badges || badges.length === 0) return '';
  return `\n      <ul class="badge-list">${badges
        .map((badge) => `<li>${badge}</li>`)
        .join('')} </ul>`;
}

function buildProductCard(product) {
  const priceLabel = currencyFormatter.format(product.price);
  const classes = ['collection-card'];
  if (product.collection === 'souvenirs') {
    classes.splice(0, classes.length, 'souvenir-card');
  }

  const meta = [];
  if (product.sizes) {
    meta.push(`<div><dt>Sizes</dt><dd>${product.sizes.join(' · ')}</dd></div>`);
  }
  if (product.colors) {
    meta.push(`<div><dt>Colours</dt><dd>${product.colors.join(' · ')}</dd></div>`);
  }

  const body = `
    <div class="card-body">
      <div class="card-header">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
      <p class="card-price">${priceLabel}</p>
      ${meta.length > 0 ? `<dl>${meta.join('')}</dl>` : ''}
      ${buildBadgeList(product.badges)}
      <button class="cta ghost" data-action="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `;

  if (product.collection === 'souvenirs') {
    return `
      <article class="${classes.join(' ')}">
        <div class="card-header">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="card-price">${priceLabel}</div>
        ${buildBadgeList(product.badges)}
        <button class="cta" data-action="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
      </article>
    `;
  }

  return `
    <article class="${classes.join(' ')}">
      <div class="card-media ${product.mediaClass ?? ''}" role="img" aria-label="${product.name}"></div>
      ${body}
    </article>
  `;
}

function renderProducts(products) {
  const grouped = products.reduce((acc, product) => {
    const key = product.collection;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {});

  grids.forEach((grid) => {
    const collection = grid.getAttribute('data-products-grid');
    const items = grouped[collection] ?? [];

    if (items.length === 0) {
      grid.innerHTML = '<p class="empty-state">New pieces arrive soon. Join our waitlist to be the first to know.</p>';
      return;
    }

    grid.innerHTML = items.map((product) => buildProductCard(product)).join('');
  });
}

function toggleCart(forceState) {
  if (typeof forceState === 'boolean') {
    cartPanel.classList.toggle('is-open', forceState);
  } else {
    cartPanel.classList.toggle('is-open');
  }

  cartPanel.setAttribute('aria-hidden', (!cartPanel.classList.contains('is-open')).toString());
}

function formatSubtotal() {
  let total = 0;
  cartState.forEach(({ quantity, product }) => {
    total += quantity * product.price;
  });
  return currencyFormatter.format(total);
}

function updateCartSummary() {
  const items = Array.from(cartState.values());

  if (items.length === 0) {
    cartBody.innerHTML = '<p class="empty-state">Your cart is waiting to be filled with IIT Varanasi heritage.</p>';
    cartSubtotal.textContent = currencyFormatter.format(0);
    cartCount.textContent = '0';
    checkoutButtons.forEach((btn) => btn.setAttribute('disabled', ''));
    return;
  }

  const rows = items
    .map(({ product, quantity }) => {
      return `
        <article class="cart-line" data-cart-line="${product.id}">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="line-price">${currencyFormatter.format(product.price)} each</span>
          </div>
          <div class="cart-line__actions">
            <label>
              Qty
              <input type="number" min="1" value="${quantity}" data-cart-quantity="${product.id}" />
            </label>
            <button type="button" class="link" data-remove-item="${product.id}">Remove</button>
          </div>
        </article>
      `;
    })
    .join('');

  cartBody.innerHTML = rows;
  cartSubtotal.textContent = formatSubtotal();

  const totalQuantity = items.reduce((count, item) => count + item.quantity, 0);
  cartCount.textContent = String(totalQuantity);
  checkoutButtons.forEach((btn) => btn.removeAttribute('disabled'));
}

function handleAddToCart(event) {
  const button = event.target.closest('[data-action="add-to-cart"]');
  if (!button) return;

  const productId = button.getAttribute('data-product-id');
  const product = productState.get(productId);
  if (!product) return;

  const line = cartState.get(productId) ?? { product, quantity: 0 };
  line.quantity += 1;
  cartState.set(productId, line);
  updateCartSummary();
  toggleCart(true);
  showToast(`${product.name} added to cart.`);
}

function handleCartInteraction(event) {
  const quantityInput = event.target.closest('input[data-cart-quantity]');
  if (quantityInput) {
    const id = quantityInput.getAttribute('data-cart-quantity');
    const newQty = Number.parseInt(quantityInput.value, 10);
    if (Number.isNaN(newQty) || newQty < 1) {
      quantityInput.value = cartState.get(id)?.quantity ?? 1;
      return;
    }
    cartState.set(id, { product: productState.get(id), quantity: newQty });
    updateCartSummary();
    return;
  }

  const removeButton = event.target.closest('[data-remove-item]');
  if (removeButton) {
    const id = removeButton.getAttribute('data-remove-item');
    cartState.delete(id);
    updateCartSummary();
    if (cartState.size === 0) {
      toggleCart(false);
    }
    showToast('Removed from cart.');
  }
}

async function submitCheckout(event) {
  event.preventDefault();
  if (cartState.size === 0) return;

  const formData = new FormData(checkoutForm);
  const payload = {
    customer: {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim() || undefined,
      address: formData.get('address')?.toString().trim() || undefined
    },
    items: Array.from(cartState.values()).map(({ product, quantity }) => ({
      id: product.id,
      quantity
    }))
  };

  checkoutForm.setAttribute('aria-busy', 'true');
  checkoutStatus.hidden = true;
  checkoutStatus.className = 'checkout-status';
  checkoutHelper.textContent = 'Processing your order…';

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message ?? 'We could not complete your order.');
    }

    checkoutStatus.hidden = false;
    checkoutStatus.classList.add('is-success');
    checkoutStatus.innerHTML = `
      <h3>Order Confirmed</h3>
      <p>Confirmation ID <strong>${data.orderId}</strong>. Our concierge will reach out shortly.</p>
      <ul>${data.summary
        .map(
          (line) => `
            <li>
              ${line.quantity} × ${line.name}
              <span>${currencyFormatter.format(line.lineTotal)}</span>
            </li>
          `
        )
        .join('')}</ul>
      <p class="grand-total">Grand total ${currencyFormatter.format(data.totals.grandTotal)}</p>
    `;

    checkoutForm.reset();
    cartState.clear();
    updateCartSummary();
    toggleCart(false);
    showToast('Your order has been placed. Thank you.');
  } catch (error) {
    checkoutStatus.hidden = false;
    checkoutStatus.classList.add('is-error');
    checkoutStatus.textContent = error.message;
  } finally {
    checkoutForm.removeAttribute('aria-busy');
    checkoutHelper.textContent = 'By placing this order you agree to our concierge reaching out with a secured payment link.';
  }
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add('is-visible');
  setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.hidden = true;
  }, 2500);
}

function openOverlay() {
  if (cartState.size === 0) return;
  overlay.hidden = false;
  overlay.classList.add('is-visible');
  document.body.classList.add('no-scroll');
}

function closeOverlay() {
  overlay.hidden = true;
  overlay.classList.remove('is-visible');
  document.body.classList.remove('no-scroll');
}

fetchProducts()
  .then((products) => renderProducts(products))
  .catch((error) => {
    grids.forEach((grid) => {
      grid.innerHTML = `<p class="empty-state">${error.message}</p>`;
    });
  });

cartToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const willOpen = !cartPanel.classList.contains('is-open');
    toggleCart(willOpen);
  });
});

cartBody.addEventListener('input', handleCartInteraction);
cartBody.addEventListener('click', handleCartInteraction);

document.addEventListener('click', handleAddToCart);

checkoutButtons.forEach((button) => {
  button.addEventListener('click', openOverlay);
});

overlayClose?.addEventListener('click', closeOverlay);
overlay?.addEventListener('click', (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});

checkoutForm?.addEventListener('submit', submitCheckout);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && overlay?.classList.contains('is-visible')) {
    closeOverlay();
  }
});

updateCartSummary();
