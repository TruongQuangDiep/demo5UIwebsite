/**
 * QUẢN LÝ GIỎ HÀNG & MÃ KHUYẾN MÃI - GLOWAURA BEAUTY (DEMO 3)
 */

const CART_STORAGE_KEY = 'glowaura_cart';
const COUPON_STORAGE_KEY = 'glowaura_coupon';

const AVAILABLE_COUPONS = {
    'GLOW100K': {
        code: 'GLOW100K',
        discountType: 'fixed',
        value: 100000,
        minOrder: 600000,
        description: 'Giảm ngay 100.000₫ cho đơn mỹ phẩm từ 600.000₫'
    },
    'BEAUTY15': {
        code: 'BEAUTY15',
        discountType: 'percentage',
        value: 15,
        maxDiscount: 200000,
        minOrder: 500000,
        description: 'Giảm 15% tối đa 200.000₫ cho thành viên mới'
    },
    'FREESHIP': {
        code: 'FREESHIP',
        discountType: 'shipping',
        value: 30000,
        minOrder: 300000,
        description: 'Miễn phí giao hàng toàn quốc (trừ 30.000₫)'
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
    const capacity = options.capacity || (product.capacities ? product.capacities[0] : 'Tiêu chuẩn');
    const skinType = options.skinType || (product.skinTypes ? product.skinTypes[0] : 'Mọi loại da');
    const cartItemId = `${product.id}_${capacity}_${skinType}`.replace(/\s+/g, '_');

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
            capacity: capacity,
            skinType: skinType,
            quantity: quantity
        });
    }

    saveCart(cart);

    showToast({
        title: "Đã thêm vào giỏ hàng!",
        message: `Đã chọn "${product.name}" (${capacity})`,
        type: "success"
    });
}

function updateCartQuantity(cartItemId, newQty) {
    let cart = getCart();
    if (newQty <= 0) {
        removeFromCart(cartItemId);
        return;
    }
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (item) {
        item.quantity = newQty;
        saveCart(cart);
    }
}

function removeFromCart(cartItemId) {
    let cart = getCart();
    const itemToRemove = cart.find(i => i.cartItemId === cartItemId);
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart(cart);

    if (itemToRemove) {
        showToast({
            title: "Đã xóa sản phẩm",
            message: `Đã bỏ "${itemToRemove.name}" khỏi giỏ hàng`,
            type: "info"
        });
    }
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

function applyCoupon(couponCode) {
    const code = (couponCode || '').trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[code];

    if (!coupon) {
        return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
    }

    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (subtotal < coupon.minOrder) {
        return { 
            success: false, 
            message: `Mã ${code} chỉ áp dụng cho đơn mỹ phẩm từ ${formatCurrency(coupon.minOrder)}.` 
        };
    }

    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    return { success: true, message: `Áp dụng thành công mã ${code}!`, coupon };
}

function removeAppliedCoupon() {
    localStorage.removeItem(COUPON_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
}

function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = (subtotal === 0 || subtotal >= 500000) ? 0 : 30000;
    
    let discount = 0;
    const coupon = getAppliedCoupon();

    if (coupon && subtotal >= (coupon.minOrder || 0)) {
        if (coupon.discountType === 'fixed') {
            discount = coupon.value;
        } else if (coupon.discountType === 'percentage') {
            discount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity);
        } else if (coupon.discountType === 'shipping') {
            discount = Math.min(shipping, coupon.value);
        }
    }

    const finalTotal = Math.max(0, subtotal - discount + shipping);

    return {
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        shipping,
        discount,
        coupon,
        finalTotal
    };
}

function updateCartBadges() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
        b.textContent = totalCount;
        if (totalCount > 0) {
            b.classList.remove('hidden');
        } else {
            b.classList.add('hidden');
        }
    });
}

function showToast({ title, message, type = 'success' }) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transform transition-all duration-300 translate-y-4 opacity-0 ${
        type === 'success' 
            ? 'bg-stone-900/95 text-white border-amber-500/40' 
            : type === 'info' 
            ? 'bg-rose-950/95 text-white border-rose-500/40' 
            : 'bg-slate-900/95 text-white border-slate-700'
    }`;

    const icon = type === 'success' ? 'fa-solid fa-sparkles' : type === 'info' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i class="${icon}"></i>
        </div>
        <div class="flex-1 min-w-0">
            <h4 class="font-bold text-xs uppercase tracking-wide text-amber-300">${title}</h4>
            <p class="text-xs text-slate-200 mt-0.5 line-clamp-2 leading-relaxed">${message}</p>
        </div>
        <button class="text-white/60 hover:text-white text-xs p-1">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    toast.querySelector('button').onclick = () => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
    };

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => toast.remove(), 300);
        }
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
});
