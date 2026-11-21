const PRODUCTS = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        emoji: "🎧",
        description: "Comfortable wireless headphones for music and everyday listening."
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 3299,
        emoji: "⌚",
        description: "A clean, everyday smartwatch-inspired accessory."
    },
    {
        id: 3,
        name: "Classic Sneakers",
        category: "Fashion",
        price: 1899,
        emoji: "👟",
        description: "Versatile sneakers designed for everyday comfort."
    },
    {
        id: 4,
        name: "Everyday Backpack",
        category: "Fashion",
        price: 1299,
        emoji: "🎒",
        description: "A practical backpack for classes, work and travel."
    },
    {
        id: 5,
        name: "Ceramic Table Lamp",
        category: "Home",
        price: 1599,
        emoji: "💡",
        description: "A warm accent lamp to brighten up your favourite corner."
    },
    {
        id: 6,
        name: "Coffee Mug Set",
        category: "Home",
        price: 699,
        emoji: "☕",
        description: "A simple mug set for your daily coffee or tea."
    },
    {
        id: 7,
        name: "Minimal Wallet",
        category: "Accessories",
        price: 899,
        emoji: "👛",
        description: "A compact wallet with a minimal everyday design."
    },
    {
        id: 8,
        name: "Sunglasses",
        category: "Accessories",
        price: 1199,
        emoji: "🕶️",
        description: "A classic accessory to complete your look."
    }
];

const money = value => "₹" + value.toLocaleString("en-IN");

const getCart = () =>
    JSON.parse(localStorage.getItem("shopease-cart") || "[]");

const saveCart = cart => {
    localStorage.setItem("shopease-cart", JSON.stringify(cart));
    updateCartCount();
};

function updateCartCount() {
    const count = getCart().reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = count;
    });
}

function productCard(product) {
    return `
        <article class="product-card">
            <div class="product-image">${product.emoji}</div>

            <div class="product-info">
                <span class="product-category">${product.category}</span>

                <h3>${product.name}</h3>

                <p class="product-category">
                    ${product.description}
                </p>

                <div class="product-bottom">
                    <span class="price">${money(product.price)}</span>

                    <button class="add-btn"
                        onclick="addToCart(${product.id})">
                        Add to cart +
                    </button>
                </div>
            </div>
        </article>
    `;
}

function addToCart(id) {
    const cart = getCart();

    const found = cart.find(item => item.id === id);

    if (found) {
        found.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    saveCart(cart);

    alert("Product added to your cart!");
}


// PRODUCT DISPLAY AND FILTER FUNCTION
function renderProducts() {

    const container = document.getElementById("all-products");

    if (!container) return;

    const search = document.getElementById("search-input");
    const category = document.getElementById("category-filter");
    const sort = document.getElementById("sort-filter");

    const clearButton = document.getElementById("clear-filters");

    const params = new URLSearchParams(location.search);

    if (params.has("category")) {
        const requestedCategory = params.get("category");

        if (["Electronics", "Fashion", "Home", "Accessories"].includes(requestedCategory)) {
            category.value = requestedCategory;
        }
    }

    // Display products based on selected filters
    function draw() {

        let list = PRODUCTS.filter(p =>
            (category.value === "All" || p.category === category.value) &&
            (`${p.name} ${p.category} ${p.description}`)
                .toLowerCase()
                .includes(search.value.toLowerCase())
        );

        // Sort products by price or name
        if (sort.value === "low") {
            list.sort((a, b) => a.price - b.price);
        }

        if (sort.value === "high") {
            list.sort((a, b) => b.price - a.price);
        }

        if (sort.value === "name") {
            list.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Update product count
        document.getElementById("result-count").textContent =
            `${list.length} product(s) found`;

        // Display products or empty message
        container.innerHTML = list.length
            ? list.map(productCard).join("")
            : `
                <div class="empty-state">
                    <div class="empty-icon">🔎</div>
                    <h3>No products found</h3>
                    <p>Try another search or category.</p>
                </div>
            `;
    }

    // Search and filter event listeners
    search.addEventListener("input", draw);
    category.addEventListener("change", draw);
    sort.addEventListener("change", draw);

    // NEW FEATURE: CLEAR FILTERS
    clearButton.addEventListener("click", function () {

        // Clear search text
        search.value = "";

        // Reset category
        category.value = "All";

        // Reset sorting
        sort.value = "featured";

        // Display all products again
        draw();
    });

    draw();
}


// SHOPPING CART FUNCTION
function renderCart() {

    const root = document.getElementById("cart-content");

    if (!root) return;

    const cart = getCart();

    const items = cart.map(item => ({
        ...item,
        product: PRODUCTS.find(p => p.id === item.id)
    })).filter(item => item.product);

    if (!items.length) {
        root.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛍️</div>
                <h2>Your cart is waiting.</h2>
                <p>You haven't added anything yet. Explore the shop to find something you like.</p>
                <a class="btn btn-dark" href="products.html">
                    Browse products
                </a>
            </div>
        `;
        return;
    }

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    root.innerHTML = `
        <div class="cart-layout">
            <div class="cart-list">
                ${items.map(item => `
                    <div class="cart-row">
                        <div class="cart-thumb">
                            ${item.product.emoji}
                        </div>

                        <div>
                            <h3>${item.product.name}</h3>
                            <small>${money(item.product.price)} each</small>

                            <div class="quantity">
                                <button onclick="changeQuantity(${item.id},-1)">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQuantity(${item.id},1)">+</button>
                            </div>
                        </div>

                        <div>
                            <strong>
                                ${money(item.product.price * item.quantity)}
                            </strong>
                            <br>
                            <button class="remove-btn"
                                onclick="removeItem(${item.id})">
                                Remove
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>

            <aside class="summary">
                <h3>Order summary</h3>

                <div class="summary-line">
                    <span>Subtotal</span>
                    <span>${money(total)}</span>
                </div>

                <div class="summary-line">
                    <span>Delivery</span>
                    <span>Free</span>
                </div>

                <div class="summary-line summary-total">
                    <span>Total</span>
                    <span>${money(total)}</span>
                </div>

                <a class="btn btn-dark" href="checkout.html">
                    Continue to checkout
                </a>
            </aside>
        </div>
    `;
}

function changeQuantity(id, delta) {

    const cart = getCart();

    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity += delta;
    }

    saveCart(cart.filter(p => p.quantity > 0));

    renderCart();
}

function removeItem(id) {

    saveCart(getCart().filter(p => p.id !== id));

    renderCart();
}


// CHECKOUT FUNCTION
function renderCheckout() {

    const root = document.getElementById("checkout-content");

    if (!root) return;

    const cart = getCart();

    const items = cart.map(item => ({
        ...item,
        product: PRODUCTS.find(p => p.id === item.id)
    })).filter(item => item.product);

    if (!items.length) {
        root.innerHTML = `
            <div class="empty-state">
                <h2>Your cart is empty</h2>
                <p>Add products before proceeding to checkout.</p>
                <a class="btn btn-dark" href="products.html">
                    Browse products
                </a>
            </div>
        `;
        return;
    }

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    root.innerHTML = `
        <div class="checkout-layout">

            <form class="checkout-form" id="checkout-form">

                <h2>Delivery details</h2>

                <div class="notice">
                    Demo only: this form does not process payments or send your information to a server.
                </div>

                <div class="form-field">
                    <label for="customer-name">Full name</label>
                    <input id="customer-name" required placeholder="Your name">
                </div>

                <div class="form-field">
                    <label for="customer-email">Email address</label>
                    <input id="customer-email" type="email" required placeholder="you@example.com">
                </div>

                <div class="form-field">
                    <label for="customer-address">Delivery address</label>
                    <textarea id="customer-address" required placeholder="Enter your delivery address"></textarea>
                </div>

                <button class="btn btn-dark" type="submit">
                    Place demo order
                </button>

            </form>

            <aside class="summary">
                <h3>Your order</h3>

                ${items.map(item => `
                    <div class="summary-line">
                        <span>
                            ${item.product.name} × ${item.quantity}
                        </span>
                        <span>
                            ${money(item.product.price * item.quantity)}
                        </span>
                    </div>
                `).join("")}

                <div class="summary-line">
                    <span>Delivery</span>
                    <span>Free</span>
                </div>

                <div class="summary-line summary-total">
                    <span>Total</span>
                    <span>${money(total)}</span>
                </div>

            </aside>
        </div>
    `;

    document.getElementById("checkout-form")
        .addEventListener("submit", event => {

            event.preventDefault();

            const name = document.getElementById("customer-name").value.trim();

            const orderId = "SE" + Date.now().toString().slice(-7);

            localStorage.removeItem("shopease-cart");

            updateCartCount();

            root.innerHTML = `
                <div class="success-box">
                    <div class="check">✓</div>

                    <span class="eyebrow">ORDER CONFIRMED</span>

                    <h2>Thank you, ${escapeHTML(name)}!</h2>

                    <p>
                        Your demo order <strong>${orderId}</strong>
                        has been placed successfully.
                        <br>
                        This is a frontend demonstration;
                        no real order or payment was processed.
                    </p>

                    <a class="btn btn-dark" href="products.html">
                        Continue shopping
                    </a>
                </div>
            `;
        });
}


// HTML ESCAPE FUNCTION
function escapeHTML(value) {

    return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}


// INITIALIZE WEBSITE
document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    const featured = document.getElementById("featured-products");

    if (featured) {
        featured.innerHTML = PRODUCTS.slice(0, 4)
            .map(productCard)
            .join("");
    }

    renderProducts();
    renderCart();
    renderCheckout();

});
