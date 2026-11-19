/**
 * QUẢN LÝ GIỎ HÀNG & MÃ KHUYẾN MÃI - URBANVIBE STREETWEAR STUDIO (DEMO 4)
 */

const CART_STORAGE_KEY = 'urbanvibe_cart';
const COUPON_STORAGE_KEY = 'urbanvibe_coupon';

const AVAILABLE_COUPONS = {
    'STREET100': {
        code: 'STREET100',
        discountType: 'fixed',
        value: 100000,
        minOrder: 600000,
        description: 'Giảm ngay 100.000₫ cho đơn Streetwear từ 600.000₫'
    },
    'DROP15': {
        code: 'DROP15',
        discountType: 'percentage',
        value: 15,
        maxDiscount: 200000,
        minOrder: 500000,
        description: 'Giảm 15% tối đa 200.000₫ cho thành viên VIP Drop'
    },
    'FREESHIP': {
        code: 'FREESHIP',
        discountType: 'shipping',
        value: 30000,
        minOrder: 300000,
        description: 'Miễn phí giao hàng hỏa tốc (giảm 30.000₫)'
    }
};

function getCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
        updateCartBadges();
    } catch (e) {
        console.error("Lỗi lưu giỏ hàng:", e);
    }
}

function addToCart(product, quantity = 1, options = {}) {
    if (!product) return;
    if (typeof product === 'string') {
        product = typeof getProductById === 'function' ? getProductById(product) : (typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(p => p.id === product) : null);
    }
    if (!product) return;

    let cart = getCart();
    const size = options.size || (product.sizes ? product.sizes[0] : 'Free Size');
    const color = options.color || (product.colors ? product.colors[0] : 'Tiêu chuẩn');
    const cartItemId = `${product.id}_${size}_${color}`.replace(/\s+/g, '_');

    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            cartItemId,
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            quantity: quantity
        });
    }

    saveCart(cart);

    showToast({
        title: "Đã thêm vào giỏ hàng!",
        message: `Đã chọn "${product.name}" (${size})`,
        type: "success"
    });
}

function updateCartQuantity(cartItemId, newQty) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    if (itemIndex > -1) {
        if (newQty <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQty;
        }
        saveCart(cart);
    }
}

function removeFromCart(cartItemId) {
    let cart = getCart();
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart(cart);
    showToast({
        title: "Đã xóa sản phẩm",
        message: "Sản phẩm đã được loại khỏi giỏ hàng",
        type: "info"
    });
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
    updateCartBadges();
}

function getAppliedCoupon() {
    try {
        const stored = localStorage.getItem(COUPON_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function applyCoupon(code) {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    const coupon = AVAILABLE_COUPONS[cleanCode];

    if (!coupon) {
        return { success: false, message: 'Mã ưu đãi không hợp lệ hoặc đã hết lượt dùng.' };
    }

    const { subtotal } = calculateTotals();
    if (subtotal < coupon.minOrder) {
        return {
            success: false,
            message: `Mã ${coupon.code} chỉ áp dụng cho đơn từ ${formatCurrency(coupon.minOrder)}.`
        };
    }

    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    window.dispatchEvent(new CustomEvent('couponUpdated', { detail: { coupon } }));
    return { success: true, message: `Áp dụng thành công mã ${coupon.code}!` };
}

function removeCoupon() {
    localStorage.removeItem(COUPON_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('couponUpdated', { detail: { coupon: null } }));
}

function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Phí ship: Miễn phí nếu trên 500.000₫, dưới 500k là 30.000₫
    let shipping = subtotal > 0 && subtotal < 500000 ? 30000 : 0;
    let discount = 0;

    const coupon = getAppliedCoupon();
    if (coupon && subtotal >= coupon.minOrder) {
        if (coupon.discountType === 'fixed') {
            discount = coupon.value;
        } else if (coupon.discountType === 'percentage') {
            discount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || 999999999);
        } else if (coupon.discountType === 'shipping') {
            discount = Math.min(shipping, coupon.value);
            shipping = Math.max(0, shipping - coupon.value);
        }
    }

    const total = Math.max(0, subtotal + shipping - discount);

    return {
        subtotal,
        shipping,
        discount,
        total,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        coupon
    };
}

function updateCartBadges() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.textContent = totalCount;
        if (totalCount > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function showToast({ title, message, type = 'info' }) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-4 opacity-0 ${
        type === 'success' 
            ? 'bg-zinc-900 border-amber-400 text-white shadow-amber-400/20' 
            : type === 'error'
            ? 'bg-zinc-900 border-red-500 text-white'
            : 'bg-zinc-900 border-zinc-700 text-white'
    }`;

    const icon = type === 'success' 
        ? '<i class="fa-solid fa-circle-check text-amber-400 text-lg mt-0.5"></i>' 
        : type === 'error'
        ? '<i class="fa-solid fa-triangle-exclamation text-red-500 text-lg mt-0.5"></i>'
        : '<i class="fa-solid fa-circle-info text-zinc-400 text-lg mt-0.5"></i>';

    toast.innerHTML = `
        ${icon}
        <div class="flex-1">
            <h4 class="font-black text-xs uppercase tracking-wider text-amber-400">${title}</h4>
            <p class="text-xs text-zinc-300 mt-0.5 leading-relaxed">${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-white text-xs font-bold p-1">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
