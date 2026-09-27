const tabua = document.getElementById("tabua");
const cartBtn = document.getElementById("cart-Btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeModalBtn = document.getElementById("close");
const cartCounter = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("next");
const addressInput = document.getElementById("cart-endre");
const paymentMethod = document.getElementById("payment-method");
const customizationInput = document.getElementById("customization");

let cart = [];


// ================================
// ABRIR / FECHAR CARRINHO
// ================================
cartBtn.addEventListener("click", () => {
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});


// ================================
// ADICIONAR PRODUTO
// ================================
tabua.addEventListener("click", (event) => {
    const parentButton = event.target.closest(".add-bt");

    if (!parentButton) return;

    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCartModal();
}


// ================================
// ATUALIZAR MODAL
// ================================
function updateCartModal() {
    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");

        cartItemElement.innerHTML = `
            <div style="margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">
                <p><strong>${item.name}</strong></p>
                <p>Quantidade: ${item.quantity}</p>
                <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>

                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // PERSONALIZAÇÃO
    if (customizationInput.checked) {
        total += 25;
    }

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
    });

    cartCounter.textContent = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);
}


// ================================
// REMOVER ITEM
// ================================
cartItemsContainer.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-btn")) return;

    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }

    updateCartModal();
}


// ================================
// ATUALIZAR TOTAL AO MARCAR PERSONALIZAÇÃO
// ================================
customizationInput.addEventListener("change", () => {
    updateCartModal();
});


// ================================
// FINALIZAR PEDIDO
// ================================
checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const address = addressInput.value.trim();
    const payment = paymentMethod.value;
    const customization = customizationInput.checked;

    if (address === "") {
        alert("Digite seu endereço!");
        return;
    }

    if (payment === "") {
        alert("Selecione a forma de pagamento!");
        return;
    }

    let message = `🛒 *NOVO PEDIDO*\n\n`;

    cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `Quantidade: ${item.quantity}\n`;
        message += `Valor: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    if (customization) {
        message += `🎨 Personalização: Sim (+ R$ 25,00)\n`;
    } else {
        message += `🎨 Personalização: Não\n`;
    }

    message += `\n💰 *Total:* R$ ${cartTotal.textContent}\n`;
    message += `📍 *Endereço:* ${address}\n`;
    message += `💳 *Pagamento:* ${payment}`;

    const phone = "5548999280165";

    const encodedMessage = encodeURIComponent(message);

    window.open(
        `https://wa.me/${phone}?text=${encodedMessage}`,
        "_blank"
    );

    clearCart();
});


// ================================
// LIMPAR CARRINHO
// ================================
function clearCart() {
    cart = [];

    addressInput.value = "";
    paymentMethod.value = "";
    customizationInput.checked = false;

    updateCartModal();

    cartModal.style.display = "none";
}