// ==========================================
// CONFIGURACIÓN DEL NEGOCIO (EDITA AQUÍ)
// ==========================================
const CONFIG = {
  nombreNegocio: "Pollos Hermanos",
  // Incluye código de país sin '+' (Ej: 57 para Colombia, 52 para México, 34 para España)
  telefonoWhatsApp: "573001234567",
  moneda: "$"
};

// ==========================================
// CATÁLOGO DE PRODUCTOS
// ==========================================
const productos = [
  {
    id: 1,
    nombre: "Combo Hermanos Familiar",
    categoria: "combos",
    precio: 48000,
    descripcion: "8 presas de pollo broaster crujiente, 4 porciones de papas a la francesa, ensalada de repollo y gaseosa 1.5L.",
    imagen: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80",
    tag: "Más Vendido"
  },
  {
    id: 2,
    nombre: "Combo Personal Crujiente",
    categoria: "combos",
    precio: 18500,
    descripcion: "2 presas de pollo broaster dorado, papas a la francesa, panecillo de miel y bebida personal.",
    imagen: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80",
    tag: "Individual"
  },
  {
    id: 3,
    nombre: "Pollo Asado Entero",
    categoria: "asado",
    precio: 38000,
    descripcion: "Pollo entero marinado 24 horas y asado lentamente al carbón. Incluye arepas, papa salada y ají casero.",
    imagen: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80",
    tag: "Tradicional"
  },
  {
    id: 4,
    nombre: "Medio Pollo Asado",
    categoria: "asado",
    precio: 21000,
    descripcion: "Media porción de nuestro famoso pollo asado con papa salada, ensalada fresca y salsa de la casa.",
    imagen: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
    tag: "Clásico"
  },
  {
    id: 5,
    nombre: "12 Alitas BBQ o Picantes",
    categoria: "alitas",
    precio: 26000,
    descripcion: "12 alitas bañadas en salsa BBQ ahumada o Buffalo picante, acompañadas de bastones de apio y salsa ranch.",
    imagen: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
    tag: "Para Compartir"
  },
  {
    id: 6,
    nombre: "Hermanos Crispy Burger",
    categoria: "alitas",
    precio: 19500,
    descripcion: "Pechuga de pollo extra crujiente, queso cheddar fundido, pepinillos, lechuga y salsa secreta en pan brioche.",
    imagen: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=600&q=80",
    tag: "Especial"
  },
  {
    id: 7,
    nombre: "Limonada de Coco",
    categoria: "bebidas",
    precio: 7500,
    descripcion: "Refrescante limonada natural cremosa con crema de coco fría.",
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    tag: "Refrescante"
  },
  {
    id: 8,
    nombre: "Gaseosa Familiar 1.5L",
    categoria: "bebidas",
    precio: 6500,
    descripcion: "Elige entre Cola, Naranja o Manzana bien fría.",
    imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    tag: "Bebida"
  }
];

// ==========================================
// ESTADO Y ELEMENTOS DEL DOM
// ==========================================
let carrito = [];

const menuGrid = document.getElementById("menu-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const toast = document.getElementById("toast");

// Formatear moneda
function formatearPrecio(valor) {
  return CONFIG.moneda + valor.toLocaleString("es-CO");
}

// Renderizar productos
function renderizarMenu(categoria = "todos") {
  menuGrid.innerHTML = "";
  const filtrados = categoria === "todos"
    ? productos
    : productos.filter(p => p.categoria === categoria);

  filtrados.forEach(prod => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img" loading="lazy">
      <div class="product-info">
        <span class="product-tag">${prod.tag}</span>
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion}</p>
        <div class="product-footer">
          <span class="price">${formatearPrecio(prod.precio)}</span>
          <button class="add-btn" onclick="agregarAlCarrito(${prod.id})">
            <i class="fas fa-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Filtros
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarMenu(btn.dataset.category);
  });
});

// Funciones del carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
  mostrarToast(`Agregaste: ${producto.nombre}`);
}

function cambiarCantidad(id, delta) {
  const item = carrito.find(i => i.id === id);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.id !== id);
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = totalUnidades;

  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Tu carrito está vacío. ¡Agrega algo delicioso del menú!</p>`;
    cartTotalEl.textContent = formatearPrecio(0);
    return;
  }

  cartItemsContainer.innerHTML = "";
  let totalPrecio = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    totalPrecio += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.nombre}</h4>
        <span>${formatearPrecio(subtotal)}</span>
      </div>
      <div class="cart-controls">
        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
        <strong>${item.cantidad}</strong>
        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = formatearPrecio(totalPrecio);
}

// Notificación Toast
function mostrarToast(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// Abrir / Cerrar Drawer Carrito
document.getElementById("open-cart-btn").addEventListener("click", () => {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
});

function cerrarCarrito() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
}

document.getElementById("close-cart-btn").addEventListener("click", cerrarCarrito);
cartOverlay.addEventListener("click", cerrarCarrito);

// Menú móvil
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

// Enviar pedido a WhatsApp
document.getElementById("send-whatsapp-btn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Por favor agrega al menos un producto antes de enviar el pedido.");
    return;
  }

  const nombre = document.getElementById("customer-name").value.trim();
  const direccion = document.getElementById("customer-address").value.trim();
  const notas = document.getElementById("customer-notes").value.trim();

  if (!nombre || !direccion) {
    alert("Por favor ingresa tu nombre y dirección de entrega.");
    return;
  }

  let mensaje = `🍗 *NUEVO PEDIDO - ${CONFIG.nombreNegocio.toUpperCase()}* 🍗\n\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n`;
  if (notas) mensaje += `📝 *Notas:* ${notas}\n`;
  mensaje += `\n*Detalle del pedido:*\n`;

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• ${item.cantidad}x ${item.nombre} (${formatearPrecio(subtotal)})\n`;
  });

  mensaje += `\n💰 *TOTAL: ${formatearPrecio(total)}*`;

  const url = `https://wa.me/${CONFIG.telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

// Inicializar
renderizarMenu();