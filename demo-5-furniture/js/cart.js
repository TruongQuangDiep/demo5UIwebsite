/**
 * NordicLiving - Cart & Storage Manager
 */

const CART_KEY = 'nordic_cart';
const COUPON_KEY = 'nordic_coupon';

const COUPONS = {
    'NORDIC500': {
        code: 'NORDIC500',
        type: 'fixed',
        value: 500000,
        minOrder: 5000000,
        description: 'Giảm 500.000₫ cho đơn hàng từ 5.000.000₫'
    },
    'FURNI10': {
        code: 'FURNI10',
        type: 'percent',
        value: 0.10,
        minOrder: 0,
        description: 'Giảm 10% tổng giá trị nội thất'
    },
    'FREESHIP': {
        code: 'FREESHIP',
        type: 'freeship',
        value: 300000,
        minOrder: 0,
        description: 'Miễn phí vận chuyển & lắp ráp chuyên nghiệp'
    }
};

function getCart() {
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Lỗi đọc giỏ hàng:', e);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateHeaderCartBadge();
    } catch (e) {
        console.error('Lỗi lưu giỏ hàng:', e);
    }
}

function addToCart(product, quantity = 1, options = {}) {
    let prodObj = product;
    if (typeof product === 'string') {
        if (typeof PRODUCTS !== 'undefined') {
            prodObj = PRODUCTS.find(p => p.id === product);
        }
    }

    if (!prodObj) {
        console.error('Không tìm thấy sản phẩm:', product);
        return;
    }

    const cart = getCart();
    const material = options.material || (prodObj.materials && prodObj.materials[0]) || 'Tiêu chuẩn';
    const size = options.size || (prodObj.sizes && prodObj.sizes[0]) || 'Kích thước chuẩn';

    const existingIndex = cart.findIndex(item => 
        item.id === prodObj.id && item.material === material && item.size === size
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: prodObj.id,
            name: prodObj.name,
            slug: prodObj.slug,
            price: prodObj.price,
            originalPrice: prodObj.originalPrice,
            image: prodObj.image,
            material: material,
            size: size,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`Đã thêm "${prodObj.name}" vào giỏ hàng`);
}

function updateCartQuantity(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
        showToast('Đã xóa sản phẩm khỏi giỏ hàng');
    }
    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    if (cart[index]) {
        const removed = cart.splice(index, 1)[0];
        saveCart(cart);
        showToast(`Đã xóa "${removed.name}" khỏi giỏ hàng`);
    }
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(COUPON_KEY);
    updateHeaderCartBadge();
}

function getActiveCoupon() {
    try {
        const code = localStorage.getItem(COUPON_KEY);
        return code && COUPONS[code] ? COUPONS[code] : null;
    } catch (e) {
        return null;
    }
}

function applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!COUPONS[cleanCode]) {
        return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }

    const coupon = COUPONS[cleanCode];
    const totals = getCartTotals(false);

    if (totals.subtotal < coupon.minOrder) {
        return {
            success: false,
            message: `Mã ${cleanCode} chỉ áp dụng cho đơn từ ${formatPrice(coupon.minOrder)}.`
        };
    }

    localStorage.setItem(COUPON_KEY, cleanCode);
    return { success: true, message: `Áp dụng thành công: ${coupon.description}` };
}

function removeCoupon() {
    localStorage.removeItem(COUPON_KEY);
}

function getCartTotals(applyDiscount = true) {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Giao hàng nội thất: Miễn phí nếu subtotal >= 5.000.000₫, hoặc 300.000₫ nếu dưới 5M
    let shipping = subtotal >= 5000000 || subtotal === 0 ? 0 : 300000;
    let discount = 0;

    const coupon = applyDiscount ? getActiveCoupon() : null;
    if (coupon && subtotal >= coupon.minOrder) {
        if (coupon.type === 'fixed') {
            discount = coupon.value;
        } else if (coupon.type === 'percent') {
            discount = Math.round(subtotal * coupon.value);
        } else if (coupon.type === 'freeship') {
            shipping = 0;
            discount = 300000;
        }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        discount,
        shipping,
        total,
        appliedCoupon: coupon
    };
}

function updateHeaderCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-stone-900 text-stone-100 border border-amber-600/50 shadow-xl px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-medium flex items-center space-x-3 transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto max-w-sm';
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-amber-400 text-base flex-shrink-0"></i>
        <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

document.addEventListener('DOMContentLoaded', updateHeaderCartBadge);
