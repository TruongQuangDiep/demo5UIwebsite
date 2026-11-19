/**
 * LOGIC GIỎ HÀNG & THÔNG BÁO - TECHPULSE STORE (DEMO 1)
 * Lưu trữ trong LocalStorage, đồng bộ trên toàn bộ các trang.
 */

const CART_STORAGE_KEY = 'techpulse_cart';
const COUPON_STORAGE_KEY = 'techpulse_applied_coupon';

// 1. Lấy danh sách sản phẩm trong giỏ hàng
function getCart() {
    try {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng từ localStorage:", e);
        return [];
    }
}

// 2. Lưu giỏ hàng vào LocalStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadges();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    } catch (e) {
        console.error("Lỗi lưu giỏ hàng:", e);
    }
}

// 3. Thêm sản phẩm vào giỏ
function addToCart(product, quantity = 1, options = {}) {
    if (!product) return;
    if (typeof product === 'string') {
        product = typeof getProductById === 'function' ? getProductById(product) : (typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(p => p.id === product) : null);
    }
    if (!product) return;
    
    const cart = getCart();
    const color = options.color || (product.colors && product.colors[0]) || 'Mặc định';
    const storage = options.storage || (product.storageOptions && product.storageOptions[0]) || '';
    
    // Tạo mã định danh duy nhất cho sản phẩm theo biến thể (id + color + storage)
    const cartItemId = `${product.id}-${color}-${storage}`;
    
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            cartItemId,
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            image: product.image,
            quantity: quantity,
            color: color,
            storage: storage
        });
    }
    
    saveCart(cart);
    
    // Hiển thị thông báo Toast đẹp mắt
    showToast({
        title: "Thêm giỏ hàng thành công!",
        message: `Đã thêm ${quantity}x "${product.name}"`,
        image: product.image
    });
}

// 4. Cập nhật số lượng sản phẩm
function updateCartQuantity(cartItemId, newQuantity) {
    let cart = getCart();
    newQuantity = parseInt(newQuantity);
    
    if (isNaN(newQuantity) || newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }
    
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
}

// 5. Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(cartItemId) {
    let cart = getCart();
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart(cart);
    showToast({
        title: "Đã xóa sản phẩm",
        message: "Sản phẩm đã được xóa khỏi giỏ hàng của bạn.",
        type: "warning"
    });
}

// 6. Xóa sạch giỏ hàng (Sau khi đặt hàng thành công)
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    updateCartBadges();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
}

// 7. Tính toán tổng tiền
function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Kiểm tra mã giảm giá
    const savedCoupon = getAppliedCoupon();
    let discount = 0;
    if (savedCoupon && subtotal > 0) {
        if (savedCoupon.type === 'percent') {
            discount = Math.round((subtotal * savedCoupon.value) / 100);
        } else {
            discount = savedCoupon.value;
        }
    }
    
    // Miễn phí ship cho đơn từ 1.000.000đ trở lên
    const shipping = (subtotal === 0 || subtotal >= 1000000) ? 0 : 30000;
    const finalTotal = Math.max(0, subtotal - discount + shipping);
    
    return {
        subtotal,
        discount,
        shipping,
        finalTotal,
        totalItems,
        coupon: savedCoupon
    };
}

// 8. Quản lý mã giảm giá (Mô phỏng)
const AVAILABLE_COUPONS = {
    'TECHPULSE10': { code: 'TECHPULSE10', type: 'percent', value: 10, label: 'Giảm 10% tổng đơn' },
    'FREESHIP': { code: 'FREESHIP', type: 'shipping', value: 30000, label: 'Miễn phí giao hàng' },
    'GIAM500K': { code: 'GIAM500K', type: 'fixed', value: 500000, label: 'Giảm 500.000đ' }
};

function applyCoupon(code) {
    if (!code) return { success: false, message: "Vui lòng nhập mã giảm giá!" };
    code = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[code];
    if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
        return { success: true, message: `Áp dụng thành công mã: ${coupon.label}`, coupon };
    } else {
        return { success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn (Thử mã: TECHPULSE10)" };
    }
}

function getAppliedCoupon() {
    try {
        const d = localStorage.getItem(COUPON_STORAGE_KEY);
        return d ? JSON.parse(d) : null;
    } catch {
        return null;
    }
}

function removeAppliedCoupon() {
    localStorage.removeItem(COUPON_STORAGE_KEY);
}

// 9. Cập nhật số lượng sản phẩm trên icon giỏ hàng của Header
function updateCartBadges() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

// 10. Hệ thống Toast thông báo tương tác cao cấp với Tailwind CSS
function showToast({ title = "Thông báo", message = "", type = "success", image = null }) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-3 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 transform transition-all duration-300 translate-y-10 opacity-0';
    
    let iconHtml = '';
    if (image) {
        iconHtml = `<img src="${image}" alt="${title}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-700 bg-white" />`;
    } else if (type === 'success') {
        iconHtml = `<div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-lg"><i class="fa-solid fa-check"></i></div>`;
    } else if (type === 'warning') {
        iconHtml = `<div class="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-lg"><i class="fa-solid fa-triangle-exclamation"></i></div>`;
    } else {
        iconHtml = `<div class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-lg"><i class="fa-solid fa-circle-info"></i></div>`;
    }
    
    toast.innerHTML = `
        ${iconHtml}
        <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-white truncate">${title}</h4>
            <p class="text-xs text-slate-300 line-clamp-2 mt-0.5">${message}</p>
        </div>
        <button class="text-slate-400 hover:text-white p-1 ml-1" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark text-sm"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Kích hoạt animation xuất hiện
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });
    
    // Tự động đóng sau 3.5s
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Khởi chạy cập nhật badge khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
});
