/* ---------- Ange Thrift shared logic ---------- */
const FB_PAGE_URL = "https://www.facebook.com/angethriftstore";
const MESSENGER_URL = "https://m.me/angethriftstore";
const ORDER_EMAIL = "angelynf07@gmail.com";
const PHONE_DISPLAY = "+63 945 280 2917";

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

/* ---- Chatbot ---- */
const chatResponses = {
  "payment": "We accept the following payment methods:\n\n• GCash\n• PayPal\n• BPI\n\nAll payments are secure and convenient!",
  "shipping": "Here's our shipping info:\n\n• Meet-up in Lapu-Lapu City (COD available)\n• LBC, J&T, and other couriers: Payment first\n• Shipping fee is paid by the buyer\n• We ship nationwide across the Philippines!",
  "location": "We're located in:\n\n📍 Lapu-Lapu City, Cebu\n\nMeet-ups are available in this area!",
  "contact": "You can reach us through:\n\n💬 Facebook Messenger: m.me/angethriftstore\n📘 Facebook Page: facebook.com/angethriftstore\n\nWe typically respond within a few hours!",
  "cod": "Yes, we offer Cash on Delivery (COD) for meet-ups in Lapu-Lapu City!\n\nFor courier shipments (LBC, J&T, etc.), payment must be made first before we ship.",
  "default": "I can help you with:\n\n• Payment methods\n• Shipping information\n• Our location\n• How to contact us\n\nClick one of the buttons below or type your question!"
};

function getChatResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("payment") || lower.includes("gcash") || lower.includes("paypal") || lower.includes("paymaya")) {
    return chatResponses.payment;
  } else if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("courier") || lower.includes("lbc") || lower.includes("jnt")) {
    return chatResponses.shipping;
  } else if (lower.includes("location") || lower.includes("where") || lower.includes("address") || lower.includes("lapu")) {
    return chatResponses.location;
  } else if (lower.includes("contact") || lower.includes("message") || lower.includes("facebook") || lower.includes("messenger")) {
    return chatResponses.contact;
  } else if (lower.includes("cod") || lower.includes("cash on delivery") || lower.includes("meet")) {
    return chatResponses.cod;
  }
  return chatResponses.default;
}

function addChatMessage(text, isUser = false) {
  const messages = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.className = `chat-msg ${isUser ? "user" : "bot"}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function showQuickReplies() {
  const container = document.getElementById("chat-quick-replies");
  container.innerHTML = "";
  const topics = [
    { label: "Payment Methods", key: "payment" },
    { label: "Shipping Info", key: "shipping" },
    { label: "Location", key: "location" },
    { label: "Contact Us", key: "contact" }
  ];
  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.className = "chat-quick-btn";
    btn.textContent = topic.label;
    btn.addEventListener("click", () => {
      addChatMessage(topic.label, true);
      setTimeout(() => addChatMessage(chatResponses[topic.key]), 300);
    });
    container.appendChild(btn);
  });
}

function initChatbot() {
  const bubble = document.getElementById("chat-bubble");
  const chatWindow = document.getElementById("chat-window");
  const closeBtn = document.getElementById("chat-close");

  if (!bubble || !chatWindow || !closeBtn) return;

  bubble.addEventListener("click", () => {
    chatWindow.classList.toggle("open");
    if (chatWindow.classList.contains("open")) {
      addChatMessage("Hi! I'm here to help with any questions about Ange Thrift. What would you like to know?");
      showQuickReplies();
    }
  });

  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("open");
  });
}

/* ---- Init on load ---- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initChatbot();
});
