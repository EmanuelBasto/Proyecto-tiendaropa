// Products Array
const products = [
  { id: 1, title: "Autumn Hoodie", price: 264.9, image: "https://pangaia.com/cdn/shop/products/Recycled-Nylon-NW-Flwrdwn-Quilted-Collarless-Jacket-Cerulean-Blue-Female-1_bf4b2a54-8a7f-4174-bc49-8ef22b24bfdd.jpg?v=1666708230&width=1426" },
  { id: 2, title: "FUSION HOODIE", price: 295, image: "https://images.undiz.com/on/demandware.static/-/Sites-ZLIN-master/default/dw2264d914/merch/BTS/654206666_x.jpg?sw=1250" },
  { id: 3, title: "Chestnut Brown", price: 74.9, image: "https://www.laurieclaireboutique.com/cdn/shop/files/6418018.BRWN_1_900x_a2b7c62b-d08f-4a0e-bb3c-ae18b0e397ed_1445x.webp?v=1688608517" },
  { id: 4, title: "Nike Sportswear", price: 80, image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/sportswear-club-mens-french-terry-crew-neck-sweatshirt-tdFDRc.png" },
  { id: 5, title: "Champion BASIC", price: 48.99, image: "https://img01.ztat.net/article/spp-media-p1/7067458719b744fe81ffee62d3d0b912/abad421e7d8e47f08a2abc1c6ffe07dc.jpg?imwidth=1800" },
  { id: 6, title: "Cotton Hoodie", price: 395, image: "https://pangaia.com/cdn/shop/files/Reclaim-3.0-Hoodie-Reclaim-Jade-Womens-3.jpg?v=1693398673&width=1426" },
  { id: 7, title: "CLASSIC CREWNECK", price: 48.99, image: "https://img01.ztat.net/article/spp-media-p1/10cea44041564f81ac585fc6c8978907/c4c32dbc45dd4dbc9d15087c846538f2.jpg?imwidth=1800" },
  { id: 8, title: "TAPE HOODED", price: 79.99, image: "https://img01.ztat.net/article/spp-media-p1/d391f90be278469ebfdff731800cfccc/6d2101bd672f4e059501f01fe726f315.jpg?imwidth=1800" },
];

// Get elements
const productList = document.getElementById("productList");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Guardar carrito
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Renderizar productos
function renderProducts() {
  if (!productList) return;
  productList.innerHTML = products
    .map(
      (product) => `
      <div class="product">
        <img src="${product.image}" alt="${product.title}" class="product-img" />
        <div class="product-info">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <a class="add-to-cart" data-id="${product.id}">Add to cart</a>
        </div>
      </div>
      `
    )
    .join("");
}

// Renderizar carrito
function renderCartItems() {
  if (!cartItemsElement) return;
  cartItemsElement.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <h2 class="cart-item-title">${item.title}</h2>
          <input 
            class="cart-item-quantity" 
            type="number" 
            min="1" 
            value="${item.quantity}" 
            data-id="${item.id}"
          />
        </div>
        <h2 class="cart-item-price">$${item.price.toFixed(2)}</h2>
        <button class="remove-from-cart" data-id="${item.id}">Remove</button>
      </div>
      `
    )
    .join("");

  // Botones de eliminar
  document.querySelectorAll(".remove-from-cart").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });

  // Inputs de cantidad
  document.querySelectorAll(".cart-item-quantity").forEach((input) => {
    input.addEventListener("change", changeQuantity);
  });

  updateCartIcon();
  calculateCartTotal();
}

// Calcular total
function calculateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

// Cambiar cantidad
function changeQuantity(event) {
  const productId = parseInt(event.target.dataset.id);
  const quantity = parseInt(event.target.value);

  if (quantity > 0) {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity = quantity;
      saveToLocalStorage();
      calculateCartTotal();
      updateCartIcon();
    }
  }
}

// Agregar al carrito
function addToCart(productId) {
  const product = products.find((p) => p.id === parseInt(productId));
  if (!product) return;

  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveToLocalStorage();
  updateCartIcon();
  calculateCartTotal();
}

// Escuchar clicks en botones "Add to cart"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = e.target.dataset.id;
    addToCart(productId);
    e.target.textContent = "Added";
  }
});

// Remover del carrito
function removeFromCart(event) {
  const productId = parseInt(event.target.dataset.id);
  cart = cart.filter((item) => item.id !== productId);
  saveToLocalStorage();
  renderCartItems();
  updateCartIcon();
  calculateCartTotal();
}

// Actualizar icono del carrito
function updateCartIcon() {
  const cartIcon = document.querySelector("#cart-icon");
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartIcon) {
    cartIcon.setAttribute("data-quantity", quantity);
  }
}

// Inicializar según la página
if (window.location.pathname.includes("cart.html")) {
  renderCartItems();
} else {
  renderProducts();
}

//cart Icon Quantity
const cartIcon = document.getElementById('cart-icon')
function updateCartIcon(){
  const totalQuantity = cart.reduce((sum , item) => sum + item.quantity, 0);
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

updateCartIcon();

function updateCartIconOnCartChange(){
  updateCartIcon();
}

window.addEventListener('storage', updateCartIconOnCartChange);

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.getElementById("cart-icon");
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

updateCartIcon();
calculateCartTotal();
