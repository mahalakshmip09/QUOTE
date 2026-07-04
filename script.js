// ------------------------------------------------------------------
// This script never needs to be edited when you add materials.
// It just reads every ".material-item" in the HTML and totals up
// the ones that are checked. Add new items in index.html only.
// ------------------------------------------------------------------

const rupee = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

const totalAmountEl = document.getElementById('totalAmount');
const emptyHintEl = document.getElementById('emptyHint');
const generateBtn = document.getElementById('generateBtn');

function calculateTotal() {
  const items = document.querySelectorAll('.material-item');
  let total = 0;
  let anyChecked = false;

  items.forEach((item) => {
    const checkbox = item.querySelector('.material-check');
    const qtyInput = item.querySelector('.material-qty');
    const price = parseFloat(item.dataset.price) || 0;

    if (checkbox.checked) {
      anyChecked = true;
      const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      total += price * qty;
    }
  });

  return { total, anyChecked };
}

function refreshTotal() {
  const { total, anyChecked } = calculateTotal();

  totalAmountEl.textContent = rupee(total);
  totalAmountEl.classList.add('pulse');
  setTimeout(() => totalAmountEl.classList.remove('pulse'), 180);

  emptyHintEl.style.display = anyChecked ? 'none' : 'block';
  generateBtn.disabled = !anyChecked;

  return total;
}

// Recalculate whenever a checkbox is toggled or a quantity changes
document.querySelectorAll('.material-item').forEach((item) => {
  const checkbox = item.querySelector('.material-check');
  const qtyInput = item.querySelector('.material-qty');

  checkbox.addEventListener('change', refreshTotal);
  qtyInput.addEventListener('input', refreshTotal);
});

// ------------------------------------------------------------------
// Customer-facing quotation overlay: shows ONLY the total amount,
// not the itemized list.
// ------------------------------------------------------------------

const overlay = document.getElementById('customerOverlay');
const quoteTotalValue = document.getElementById('quoteTotalValue');
const quoteMeta = document.getElementById('quoteMeta');
const closeOverlay = document.getElementById('closeOverlay');
const printBtn = document.getElementById('printBtn');

let quoteCounter = 1;

generateBtn.addEventListener('click', () => {
  const { total } = calculateTotal();
  quoteTotalValue.textContent = rupee(total);

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  quoteMeta.textContent = `Quotation #SL-${String(quoteCounter).padStart(4, '0')} · ${today}`;
  quoteCounter++;

  overlay.classList.add('open');
});

closeOverlay.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});

printBtn.addEventListener('click', () => window.print());

// Initialize on load
refreshTotal();
