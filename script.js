/* ---------- Ange Thrift shared logic ---------- */
const FB_PAGE_URL = "https://www.facebook.com/angethriftstore";
const MESSENGER_URL = "https://m.me/angethriftstore";
const ORDER_EMAIL = "angelynf07@gmail.com";
const PHONE_DISPLAY = "+63 945 280 2917";

/* ---- Cart storage (falls back to in-memory if storage is blocked) ---- */
const CartStore = (() => {
  let memory = [];
  let useMemory = false;
  try {
    const test = "__ange_test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
  } catch (e) {
    useMemory = true;
  }

  function read() {
    if (useMemory) return memory;
    try {
      return JSON.parse(localStorage.getItem("ange_cart") || "[]");
    } catch (e) {
      return [];
    }
  }
  function write(items) {
    if (useMemory) {
      memory = items;
      return;
    }
    try {
      localStorage.setItem("ange_cart", JSON.stringify(items));
    } catch (e) {
      useMemory = true;
      memory = items;
    }
  }
  return { read, write };
})();

function getCart() {
  return CartStore.read();
}
function saveCart(items) {
  CartStore.write(items);
  updateCartCount();
}
function addToCart(product) {
  const items = getCart();
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ ...product, qty: 1 });
  }
  saveCart(items);
  showToast(`Added "${product.name}" to your bag`);
}
function removeFromCart(id) {
  const items = getCart().filter((i) => i.id !== id);
  saveCart(items);
  renderCartDrawer();
}
function cartTotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
function updateCartCount() {
  const items = getCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = count));
}

/* ---- Toast ---- */
function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* ---- Mobile nav ---- */
function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav.main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

/* ---- Cart drawer ---- */
function initCartDrawer() {
  const drawer = document.querySelector(".cart-drawer");
  const overlay = document.querySelector(".overlay");
  if (!drawer || !overlay) return;

  document.querySelectorAll("[data-open-cart]").forEach((btn) =>
    btn.addEventListener("click", () => {
      renderCartDrawer();
      drawer.classList.add("open");
      overlay.classList.add("open");
    })
  );
  document.querySelectorAll("[data-close-cart]").forEach((btn) =>
    btn.addEventListener("click", closeCartDrawer)
  );
  overlay.addEventListener("click", closeCartDrawer);
}
function closeCartDrawer() {
  document.querySelector(".cart-drawer")?.classList.remove("open");
  document.querySelector(".overlay")?.classList.remove("open");
}
function renderCartDrawer() {
  const container = document.querySelector(".cart-items");
  const footer = document.querySelector(".cart-footer");
  if (!container) return;
  const items = getCart();

  if (items.length === 0) {
    container.innerHTML = `<div class="cart-empty">Your bag is empty.<br>Head to the shop and find your next favorite fit ♥</div>`;
    if (footer) footer.style.display = "none";
    return;
  }
  if (footer) footer.style.display = "block";

  container.innerHTML = items
    .map(
      (i) => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}">
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <div class="price">₱${i.price.toLocaleString()} × ${i.qty}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${i.id}')">Remove</button>
      </div>
    </div>`
    )
    .join("");

  const totalEl = document.querySelector(".cart-total-value");
  if (totalEl) totalEl.textContent = `₱${cartTotal(items).toLocaleString()}`;
}

/* ---- Checkout modal ---- */
function initCheckout() {
  const openBtns = document.querySelectorAll("[data-open-checkout]");
  const overlay = document.querySelector(".modal-overlay");
  if (!overlay) return;

  openBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const items = getCart();
      if (items.length === 0) {
        showToast("Your bag is empty — add an item first");
        return;
      }
      buildOrderSummary();
      overlay.classList.add("open");
    })
  );
  document.querySelectorAll("[data-close-checkout]").forEach((btn) =>
    btn.addEventListener("click", () => overlay.classList.remove("open"))
  );
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  const copyBtn = document.querySelector("[data-copy-order]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = document.querySelector(".order-summary")?.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        const note = document.querySelector(".copy-note");
        if (note) {
          note.textContent = "Copied! Paste it in your Messenger chat.";
          note.classList.add("copied");
        }
      } catch (e) {
        showToast("Couldn't copy automatically — select the text manually");
      }
    });
  }

  const msgBtn = document.querySelector("[data-checkout-messenger]");
  if (msgBtn) msgBtn.addEventListener("click", () => window.open(MESSENGER_URL, "_blank"));

  const emailBtn = document.querySelector("[data-checkout-email]");
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      const items = getCart();
      const name = document.querySelector("#buyer-name")?.value || "";
      const contact = document.querySelector("#buyer-contact")?.value || "";
      const body = buildOrderText(items, name, contact);
      const subject = encodeURIComponent("New order from Ange Thrift website");
      window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    });
  }
}

function buildOrderText(items, name, contact) {
  const lines = items.map((i) => `• ${i.name} — ₱${i.price.toLocaleString()} × ${i.qty}`);
  const total = cartTotal(items);
  return [
    `Hi Ange Thrift! I'd like to order:`,
    ``,
    ...lines,
    ``,
    `Total: ₱${total.toLocaleString()}`,
    ``,
    name ? `Name: ${name}` : `Name: `,
    contact ? `Contact / Address: ${contact}` : `Contact / Address: `,
  ].join("\n");
}

function buildOrderSummary() {
  const items = getCart();
  const name = document.querySelector("#buyer-name")?.value || "";
  const contact = document.querySelector("#buyer-contact")?.value || "";
  const summaryEl = document.querySelector(".order-summary");
  if (summaryEl) summaryEl.textContent = buildOrderText(items, name, contact);

  const nameInput = document.querySelector("#buyer-name");
  const contactInput = document.querySelector("#buyer-contact");
  [nameInput, contactInput].forEach((input) => {
    if (input && !input._boundRefresh) {
      input.addEventListener("input", buildOrderSummary);
      input._boundRefresh = true;
    }
  });
}

/* ---- Email subscribe ----
   Uses Formspree (free, no backend needed) so every signup arrives as an
   email straight to angelynf07@gmail.com. Replace SUBSCRIBE_FORM_ENDPOINT
   below with your own Formspree form URL — see README.md for the 2-minute setup. */
const SUBSCRIBE_FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

function initSubscribeForm() {
  const form = document.getElementById("subscribe-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("subscribe-email");
    const email = emailInput.value.trim();
    if (!email) return;

    const button = form.querySelector("button");
    const originalText = button.textContent;
    button.textContent = "Sending...";
    button.disabled = true;

    try {
      if (SUBSCRIBE_FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
        throw new Error("not configured");
      }
      const res = await fetch(SUBSCRIBE_FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error("request failed");
      showToast("You're subscribed! We'll email you about new finds.");
      emailInput.value = "";
    } catch (err) {
      showToast("Sign-up form isn't connected yet — see README.md to finish setup.");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

/* ---- Init on load ---- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initMobileNav();
  initCartDrawer();
  initCheckout();
  initSubscribeForm();
});
