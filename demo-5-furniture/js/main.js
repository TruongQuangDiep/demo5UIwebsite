/**
 * NordicLiving - Main Application & SPA Controller (Demo 5)
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initApp();
    setupSPARouter();
    runPageSpecificScripts();
});

let cachedHeaderHtml = null;
let cachedFooterHtml = null;

// 1. Quản lý nạp Components (Header & Footer) có Caching chống nhấp nháy / reload
async function loadComponents() {
    const isSubfolder = window.location.pathname.includes('/chitietsanpham/');
    const basePath = isSubfolder ? '../components/' : './components/';

    const headerEl = document.getElementById('site-header-container');
    const footerEl = document.getElementById('site-footer-container');

    try {
        if (headerEl && !headerEl.hasChildNodes()) {
            if (!cachedHeaderHtml) {
                const hRes = await fetch(basePath + 'header.html');
                if (hRes.ok) cachedHeaderHtml = await hRes.text();
            }
            if (cachedHeaderHtml) {
                headerEl.innerHTML = cachedHeaderHtml;
            }
        }

        if (footerEl && !footerEl.hasChildNodes()) {
            if (!cachedFooterHtml) {
                const fRes = await fetch(basePath + 'footer.html');
                if (fRes.ok) cachedFooterHtml = await fRes.text();
            }
            if (cachedFooterHtml) {
                footerEl.innerHTML = cachedFooterHtml;
            }
        }
    } catch (e) {
        console.error('Lỗi nạp components:', e);
    }
}

// 2. Chuẩn hóa đường dẫn tương đối khi chuyển qua lại giữa root và chitietsanpham/
function fixComponentLinks() {
    const isSubfolder = window.location.pathname.includes('/chitietsanpham/');
    const allLinks = document.querySelectorAll('#site-header-container a[href], #site-footer-container a[href]');
    allLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
        
        const clean = href.replace(/^(\.\.\/)+/, '');
        if (isSubfolder) {
            a.setAttribute('href', '../' + clean);
        } else {
            a.setAttribute('href', clean);
        }
    });
}

function initApp() {
    fixComponentLinks();
    initMobileMenu();
    initGlobalSearch();
    highlightActiveNav();
    if (typeof updateHeaderCartBadge === 'function') {
        updateHeaderCartBadge();
    }
}

function initMobileMenu() {
    window.toggleMobileMenu = function() {
        const drawer = document.getElementById('mobile-menu-drawer');
        if (drawer) {
            drawer.classList.toggle('hidden');
        }
    };
}

function initGlobalSearch() {
    document.querySelectorAll('.header-search-form').forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            if (input && input.value.trim()) {
                const isSubfolder = window.location.pathname.includes('/chitietsanpham/');
                const target = (isSubfolder ? '../sanpham.html' : 'sanpham.html') + '?search=' + encodeURIComponent(input.value.trim());
                navigateTo(target);
            }
        };
    });
}

function highlightActiveNav(targetPathname) {
    const pathname = targetPathname || window.location.pathname;
    let currentFile = pathname.substring(pathname.lastIndexOf('/') + 1);
    if (!currentFile || currentFile === '') currentFile = 'index.html';

    const isSubdir = pathname.includes('/chitietsanpham/');

    const navLinks = document.querySelectorAll('#site-header nav a, #mobile-menu-drawer a');
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;

        const cleanHref = href.split('?')[0].split('#')[0].replace(/^(\.\.\/)+/, '');
        
        let isActive = false;
        if (cleanHref === currentFile) {
            isActive = true;
        } else if ((currentFile === 'index.html' || currentFile === '') && (cleanHref === 'index.html' || cleanHref === '')) {
            isActive = true;
        } else if (isSubdir && cleanHref === 'sanpham.html') {
            isActive = true;
        }

        const icon = link.querySelector('i');

        if (isActive) {
            link.classList.remove('text-stone-700', 'text-stone-600', 'text-stone-400');
            link.classList.add('text-amber-800', 'font-black');
            if (icon) {
                icon.classList.remove('text-stone-400');
                icon.classList.add('text-amber-700');
            }
        } else {
            link.classList.remove('text-amber-800', 'font-black');
            link.classList.add('text-stone-700');
            if (icon) {
                if (icon.classList.contains('fa-tag')) {
                    icon.classList.add('text-amber-600');
                } else {
                    icon.classList.remove('text-amber-700');
                    icon.classList.add('text-stone-400');
                }
            }
        }
    });
}

// 3. Single Page Application (SPA) Router - Chuyển trang mượt mà không tải lại Header
function setupSPARouter() {
    if (window.location.protocol === 'file:') return;

    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            return;
        }

        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.origin === window.location.origin) {
            e.preventDefault();
            highlightActiveNav(targetUrl.pathname);
            navigateTo(targetUrl.href);
        }
    });

    window.addEventListener('popstate', () => {
        loadPage(window.location.href, false);
    });
}

function navigateTo(url) {
    if (window.location.protocol === 'file:') {
        window.location.href = url;
        return;
    }
    loadPage(url, true);
}

async function loadPage(url, pushState = true) {
    showProgressBar();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newMain = doc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.style.opacity = '0';
            currentMain.style.transition = 'opacity 0.15s ease';

            setTimeout(async () => {
                document.title = doc.title;
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.className = newMain.className;
                currentMain.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Đồng bộ Breadcrumb nếu có
                const newBreadcrumb = doc.querySelector('div.bg-stone-100.border-b.border-stone-200');
                const curBreadcrumb = document.querySelector('div.bg-stone-100.border-b.border-stone-200');
                if (newBreadcrumb && curBreadcrumb) {
                    curBreadcrumb.outerHTML = newBreadcrumb.outerHTML;
                } else if (newBreadcrumb && !curBreadcrumb) {
                    currentMain.parentNode.insertBefore(newBreadcrumb.cloneNode(true), currentMain);
                } else if (!newBreadcrumb && curBreadcrumb) {
                    curBreadcrumb.remove();
                }

                if (pushState) {
                    window.history.pushState(null, '', url);
                }

                await loadComponents();
                initApp();
                runPageSpecificScripts();

                hideProgressBar();
            }, 150);
        } else {
            window.location.href = url;
            return;
        }

        const mobileDrawer = document.getElementById('mobile-menu-drawer');
        if (mobileDrawer) mobileDrawer.classList.add('hidden');

    } catch (err) {
        console.warn("SPA navigation fallback:", err);
        window.location.href = url;
    }
}

function showProgressBar() {
    let bar = document.getElementById('spa-progress-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'spa-progress-bar';
        bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 z-[9999] transition-all duration-300';
        document.body.appendChild(bar);
    }
    bar.style.width = '0%';
    bar.style.opacity = '1';
    setTimeout(() => { bar.style.width = '70%'; }, 50);
}

function hideProgressBar() {
    const bar = document.getElementById('spa-progress-bar');
    if (bar) {
        bar.style.width = '100%';
        setTimeout(() => {
            bar.style.opacity = '0';
            setTimeout(() => { bar.style.width = '0%'; }, 200);
        }, 200);
    }
}

// 4. Khởi chạy logic tương tác đặc thù theo từng trang
function runPageSpecificScripts() {
    const path = window.location.pathname;

    if (path.includes('sanpham.html')) {
        initProductsPage();
    } else if (path.includes('giohang.html')) {
        initCartPage();
    } else if (path.includes('thanhtoan.html')) {
        initCheckoutPage();
    } else if (path.includes('khuyenmai.html')) {
        initKhuyenMaiPage();
    } else if (path.includes('chitietsanpham/') || document.getElementById('detail-qty')) {
        initProductDetailPage();
    } else if (path.includes('index.html') || path.endsWith('/demo-5-furniture/') || path.endsWith('/demo-5-furniture') || path === '' || path === '/') {
        initHomePage();
    }
}

// --- TRANG CHỦ (INDEX.HTML) ---
function initHomePage() {
    const grid = document.getElementById('featured-products-grid');
    if (grid && typeof PRODUCTS !== 'undefined') {
        grid.innerHTML = PRODUCTS.slice(0, 4).map(p => renderProductCard(p, false)).join('');
    }
}

// --- TRANG BỘ SƯU TẬP (SANPHAM.HTML) ---
function initProductsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    const catEl = document.getElementById('filter-category');
    const searchEl = document.getElementById('search-input-page');
    const priceEl = document.getElementById('filter-price');
    const sortEl = document.getElementById('sort-order');

    if (catParam && catEl) catEl.value = catParam;
    if (searchParam && searchEl) searchEl.value = searchParam;

    function applyFilters() {
        if (typeof PRODUCTS === 'undefined') return;

        const category = catEl ? catEl.value : 'all';
        const price = priceEl ? priceEl.value : 'all';
        const sort = sortEl ? sortEl.value : 'default';
        const search = searchEl ? searchEl.value.toLowerCase().trim() : '';

        let filtered = PRODUCTS.filter(p => {
            if (category !== 'all' && p.category !== category) return false;
            
            if (price === 'under5m' && p.price >= 5000000) return false;
            if (price === '5m-15m' && (p.price < 5000000 || p.price > 15000000)) return false;
            if (price === 'over15m' && p.price <= 15000000) return false;

            if (search && !p.name.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) {
                return false;
            }

            return true;
        });

        // Sắp xếp
        if (sort === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        // Render kết quả
        const grid = document.getElementById('products-grid');
        const empty = document.getElementById('no-products-msg');
        const countEl = document.getElementById('results-count');

        if (countEl) countEl.textContent = `Đang hiển thị ${filtered.length} mẫu nội thất`;

        if (grid && empty) {
            if (filtered.length === 0) {
                grid.innerHTML = '';
                empty.classList.remove('hidden');
            } else {
                empty.classList.add('hidden');
                grid.innerHTML = filtered.map(p => renderProductCard(p, false)).join('');
            }
        }
    }

    window.applyFilters = applyFilters;
    window.resetFilters = function() {
        if (catEl) catEl.value = 'all';
        if (priceEl) priceEl.value = 'all';
        if (sortEl) sortEl.value = 'default';
        if (searchEl) searchEl.value = '';
        applyFilters();
    };

    if (catEl) catEl.onchange = applyFilters;
    if (priceEl) priceEl.onchange = applyFilters;
    if (sortEl) sortEl.onchange = applyFilters;
    if (searchEl) searchEl.oninput = applyFilters;

    applyFilters();
}

// --- TRANG ƯU ĐÃI (KHUYENMAI.HTML) ---
function initKhuyenMaiPage() {
    const grid = document.getElementById('deals-grid');
    if (grid && typeof PRODUCTS !== 'undefined') {
        grid.innerHTML = PRODUCTS.slice(0, 4).map(p => renderProductCard(p, false)).join('');
    }

    window.copyVoucher = function(code, btn) {
        navigator.clipboard.writeText(code).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Đã chép!';
            btn.className = 'bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm';
            if (typeof showToast === 'function') showToast(`Đã sao chép mã giảm giá: ${code}`);
            setTimeout(() => {
                btn.textContent = originalText;
                btn.className = 'bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm';
            }, 2000);
        }).catch(() => {
            prompt("Sao chép mã voucher:", code);
        });
    };
}

// --- TRANG GIỎ HÀNG (GIOHANG.HTML) ---
function initCartPage() {
    function renderCartPage() {
        if (typeof getCart !== 'function') return;
        const cart = getCart();
        const emptyState = document.getElementById('cart-empty-state');
        const activeState = document.getElementById('cart-active-state');
        const container = document.getElementById('cart-items-container');

        if (!cart || cart.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (activeState) activeState.classList.add('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (activeState) activeState.classList.remove('hidden');

        if (container) {
            container.innerHTML = cart.map((item, index) => `
                <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 group">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-200 flex-shrink-0">
                    
                    <div class="flex-1 text-center sm:text-left space-y-1">
                        <h4 class="font-serif font-bold text-stone-900 text-sm sm:text-base leading-snug">
                            <a href="chitietsanpham/${item.slug}.html" class="hover:text-amber-800 transition">${item.name}</a>
                        </h4>
                        <div class="flex flex-wrap gap-2 justify-center sm:justify-start text-[11px] text-stone-500 pt-0.5">
                            <span class="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">Chất liệu: <strong class="text-stone-700">${item.material}</strong></span>
                            <span class="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">Kích thước: <strong class="text-stone-700">${item.size}</strong></span>
                        </div>
                        <div class="text-amber-800 font-serif font-bold text-sm sm:text-base pt-1">
                            ${formatPrice(item.price)}
                        </div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50 shadow-inner">
                        <button onclick="handleUpdateQty(${index}, -1)" class="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition font-bold text-sm">-</button>
                        <span class="w-10 text-center font-bold text-xs text-stone-800">${item.quantity}</span>
                        <button onclick="handleUpdateQty(${index}, 1)" class="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition font-bold text-sm">+</button>
                    </div>

                    <!-- Item Total & Delete -->
                    <div class="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span class="font-serif font-bold text-stone-900 text-sm sm:text-base">${formatPrice(item.price * item.quantity)}</span>
                        <button onclick="handleRemoveItem(${index})" class="text-xs text-stone-400 hover:text-red-600 transition">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        updateSummaryBox();
    }

    function updateSummaryBox() {
        if (typeof getCartTotals !== 'function') return;
        const totals = getCartTotals();
        const subtotalEl = document.getElementById('summary-subtotal');
        const discountEl = document.getElementById('summary-discount');
        const shippingEl = document.getElementById('summary-shipping');
        const totalEl = document.getElementById('summary-total');

        if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
        if (discountEl) discountEl.textContent = totals.discount > 0 ? `-${formatPrice(totals.discount)}` : '0₫';
        if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'Miễn phí' : formatPrice(totals.shipping);
        if (totalEl) totalEl.textContent = formatPrice(totals.total);

        const couponTag = document.getElementById('applied-coupon-tag');
        const descText = document.getElementById('coupon-desc-text');
        if (totals.appliedCoupon) {
            if (couponTag) couponTag.classList.remove('hidden');
            if (descText) descText.textContent = `${totals.appliedCoupon.code}: ${totals.appliedCoupon.description}`;
        } else {
            if (couponTag) couponTag.classList.add('hidden');
        }
    }

    window.renderCartPage = renderCartPage;
    window.handleUpdateQty = function(index, delta) {
        if (typeof updateQuantity === 'function') {
            updateQuantity(index, delta);
            renderCartPage();
        }
    };
    window.handleRemoveItem = function(index) {
        if (typeof removeFromCart === 'function') {
            removeFromCart(index);
            renderCartPage();
        }
    };
    window.applyVoucherCart = function() {
        const input = document.getElementById('coupon-input');
        if (!input || typeof applyCoupon !== 'function') return;
        const res = applyCoupon(input.value);
        if (typeof showToast === 'function') showToast(res.message);
        if (res.success) {
            input.value = '';
            renderCartPage();
        }
    };
    window.removeVoucherCart = function() {
        if (typeof removeCoupon === 'function') {
            removeCoupon();
            if (typeof showToast === 'function') showToast('Đã gỡ mã giảm giá');
            renderCartPage();
        }
    };

    renderCartPage();
}

// --- TRANG THANH TOÁN (THANHTOAN.HTML) ---
function initCheckoutPage() {
    if (typeof getCart !== 'function') return;
    const cart = getCart();

    if (!cart || cart.length === 0) {
        if (typeof showToast === 'function') showToast('Giỏ hàng trống! Đang chuyển về trang mua sắm...');
        navigateTo('sanpham.html');
        return;
    }

    const itemsContainer = document.getElementById('checkout-items-container');
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-stone-200">
                <div class="flex-1 min-w-0">
                    <h5 class="font-serif font-bold text-stone-900 text-xs truncate">${item.name}</h5>
                    <p class="text-[10px] text-stone-500">${item.material} • ${item.size}</p>
                    <p class="text-[11px] text-stone-600">SL: ${item.quantity} × <strong class="text-amber-800">${formatPrice(item.price)}</strong></p>
                </div>
                <span class="font-serif font-bold text-stone-900 text-xs">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }

    if (typeof getCartTotals === 'function') {
        const totals = getCartTotals();
        const subtotalEl = document.getElementById('checkout-subtotal');
        const discountEl = document.getElementById('checkout-discount');
        const shippingEl = document.getElementById('checkout-shipping');
        const totalEl = document.getElementById('checkout-total');
        const qrAmountEl = document.getElementById('modal-qr-amount');

        if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
        if (discountEl) discountEl.textContent = totals.discount > 0 ? `-${formatPrice(totals.discount)}` : '0₫';
        if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'Miễn phí' : formatPrice(totals.shipping);
        if (totalEl) totalEl.textContent = formatPrice(totals.total);
        if (qrAmountEl) qrAmountEl.textContent = formatPrice(totals.total);
    }

    window.closeVietQrModal = function() {
        const modal = document.getElementById('vietqr-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.simulatePaymentSuccess = function() {
        window.closeVietQrModal();
        if (typeof clearCart === 'function') clearCart();
        const successModal = document.getElementById('order-success-modal');
        if (successModal) successModal.classList.remove('hidden');
    };

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.onsubmit = function(e) {
            e.preventDefault();
            const method = document.querySelector('input[name="payment_method"]:checked')?.value || 'COD';
            if (method === 'VIETQR') {
                const qrModal = document.getElementById('vietqr-modal');
                const totals = typeof getCartTotals === 'function' ? getCartTotals() : { total: 0 };
                const qrImg = document.getElementById('vietqr-image');
                if (qrImg) {
                    qrImg.src = `https://api.vietqr.io/image/970436-998811223344-9w4H6vN.jpg?accountName=CTCP%20NORDICLIVING%20VIET%20NAM&amount=${totals.total}&addInfo=NDL%20${Math.floor(10000 + Math.random() * 90000)}`;
                }
                if (qrModal) qrModal.classList.remove('hidden');
            } else {
                if (typeof clearCart === 'function') clearCart();
                const successModal = document.getElementById('order-success-modal');
                if (successModal) successModal.classList.remove('hidden');
            }
        };
    }
}

// --- TRANG CHI TIẾT SẢN PHẨM (CHITIETSANPHAM/*.HTML) ---
window.selectedMaterial = '';
window.selectedSize = '';
window.currentDetailQty = 1;

window.changeMainImage = function(url, btn) {
    const img = document.getElementById('main-product-img');
    if (img) img.src = url;
    document.querySelectorAll('.thumbnail-btn').forEach(b => {
        b.classList.remove('border-amber-700');
        b.classList.add('border-stone-200');
    });
    if (btn) {
        btn.classList.remove('border-stone-200');
        btn.classList.add('border-amber-700');
    }
};

window.selectMaterial = function(val, btn) {
    window.selectedMaterial = val;
    const el = document.getElementById('selected-material-text');
    if (el) el.textContent = val;
    document.querySelectorAll('.mat-btn').forEach(b => {
        b.className = 'mat-btn py-2.5 px-3.5 rounded-xl border text-xs uppercase tracking-wider transition border-stone-200 text-stone-700 hover:border-amber-700 font-medium';
    });
    if (btn) {
        btn.className = 'mat-btn py-2.5 px-3.5 rounded-xl border text-xs uppercase tracking-wider transition border-2 border-amber-800 bg-amber-50 text-amber-900 font-bold';
    }
};

window.selectSize = function(val, btn) {
    window.selectedSize = val;
    const el = document.getElementById('selected-size-text');
    if (el) el.textContent = val;
    document.querySelectorAll('.size-btn').forEach(b => {
        b.className = 'size-btn py-2.5 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:border-amber-700 font-medium text-xs uppercase tracking-wider transition';
    });
    if (btn) {
        btn.className = 'size-btn py-2.5 px-3.5 rounded-xl border-2 border-amber-800 bg-amber-50 text-amber-900 font-bold text-xs uppercase tracking-wider transition';
    }
};

window.changeQty = function(delta) {
    const input = document.getElementById('detail-qty');
    let val = parseInt(input ? input.value : (window.currentDetailQty || 1), 10) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    window.currentDetailQty = val;
    if (input) input.value = val;
};

window.handleAddToCartClick = function() {
    let product = null;
    const hiddenIdEl = document.getElementById('current-product-id');
    if (hiddenIdEl && hiddenIdEl.value && typeof getProductById === 'function') {
        product = getProductById(hiddenIdEl.value);
    }
    if (!product && typeof getProductBySlug === 'function') {
        const slug = window.location.pathname.split('/').pop().replace('.html', '');
        product = getProductBySlug(slug);
    }
    if (!product && typeof PRODUCTS !== 'undefined') {
        const h1 = document.querySelector('h1');
        if (h1) {
            const title = h1.textContent.trim().toLowerCase();
            product = PRODUCTS.find(p => title.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(title));
        }
    }
    if (!product && typeof PRODUCTS !== 'undefined' && PRODUCTS.length > 0) {
        product = PRODUCTS[0];
    }
    if (product && typeof addToCart === 'function') {
        const qtyInput = document.getElementById('detail-qty');
        const qty = parseInt(qtyInput ? qtyInput.value : (window.currentDetailQty || 1), 10) || 1;
        const matEl = document.getElementById('selected-material-text');
        const material = (matEl ? matEl.textContent.trim() : window.selectedMaterial) || 'Gỗ tự nhiên';
        const sizeEl = document.getElementById('selected-size-text');
        const size = (sizeEl ? sizeEl.textContent.trim() : window.selectedSize) || 'Tiêu chuẩn';
        addToCart(product, qty, { material, size });
    } else {
        console.warn("Không tìm thấy sản phẩm để thêm vào giỏ hàng");
    }
};

window.handleBuyNowClick = function() {
    window.handleAddToCartClick();
    const isSubdir = window.location.pathname.includes('/chitietsanpham/');
    const target = isSubdir ? '../giohang.html' : 'giohang.html';
    navigateTo(target);
};

window.switchTab = function(tab) {
    const btnDesc = document.getElementById('tab-btn-desc');
    const btnSpecs = document.getElementById('tab-btn-specs');
    const contentDesc = document.getElementById('tab-content-desc');
    const contentSpecs = document.getElementById('tab-content-specs');

    if (tab === 'desc') {
        if (btnDesc) btnDesc.className = 'pb-3 border-b-2 border-amber-800 text-amber-800 font-bold text-xs uppercase tracking-wider';
        if (btnSpecs) btnSpecs.className = 'pb-3 border-b-2 border-transparent text-stone-400 hover:text-stone-800 font-bold text-xs uppercase tracking-wider transition';
        if (contentDesc) contentDesc.classList.remove('hidden');
        if (contentSpecs) contentSpecs.classList.add('hidden');
    } else {
        if (btnSpecs) btnSpecs.className = 'pb-3 border-b-2 border-amber-800 text-amber-800 font-bold text-xs uppercase tracking-wider';
        if (btnDesc) btnDesc.className = 'pb-3 border-b-2 border-transparent text-stone-400 hover:text-stone-800 font-bold text-xs uppercase tracking-wider transition';
        if (contentSpecs) contentSpecs.classList.remove('hidden');
        if (contentDesc) contentDesc.classList.add('hidden');
    }
};

function initProductDetailPage() {
    const slug = window.location.pathname.split('/').pop().replace('.html', '');
    const currentProduct = typeof getProductBySlug === 'function' ? getProductBySlug(slug) : null;

    // Reset số lượng
    window.currentDetailQty = 1;
    const qtyInput = document.getElementById('detail-qty');
    if (qtyInput) qtyInput.value = 1;

    // Đọc chất liệu & size
    const matEl = document.getElementById('selected-material-text');
    if (matEl) window.selectedMaterial = matEl.textContent.trim();
    const sizeEl = document.getElementById('selected-size-text');
    if (sizeEl) window.selectedSize = sizeEl.textContent.trim();

    // Hiển thị sản phẩm liên quan
    const relGrid = document.getElementById('related-products-grid');
    if (relGrid && typeof PRODUCTS !== 'undefined') {
        const prodId = currentProduct ? currentProduct.id : '';
        const rels = PRODUCTS.filter(x => x.id !== prodId).slice(0, 4);
        relGrid.innerHTML = rels.map(x => renderProductCard(x, true)).join('');
    }
}

// 5. Helpers
function renderProductCard(product, isSubfolder = false) {
    const detailUrl = (isSubfolder ? '' : 'chitietsanpham/') + product.slug + '.html';
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

    return `
        <div class="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-700/40 transition duration-300 flex flex-col">
            <div class="relative overflow-hidden aspect-[4/3] bg-stone-100">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                
                ${discountPercent > 0 ? `
                    <span class="absolute top-3 left-3 bg-red-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-md shadow-sm">
                        -${discountPercent}%
                    </span>
                ` : ''}

                ${product.badge ? `
                    <span class="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/20">
                        ${product.badge}
                    </span>
                ` : ''}

                <!-- Quick Action Button Overlay -->
                <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
                    <button onclick="addToCart('${product.id}', 1)" class="flex-1 bg-stone-900/95 hover:bg-amber-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl backdrop-blur-md shadow-md flex items-center justify-center gap-1.5 transition">
                        <i class="fa-solid fa-cart-plus text-amber-400"></i> Thêm Giỏ Hàng
                    </button>
                    <a href="${detailUrl}" class="w-10 h-10 bg-white/95 hover:bg-stone-100 text-stone-900 rounded-xl flex items-center justify-center transition shadow-md">
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </a>
                </div>
            </div>

            <div class="p-5 flex flex-col flex-1">
                <div class="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <span class="uppercase tracking-widest text-[10px] font-bold text-amber-800">${getCategoryName(product.category)}</span>
                    <div class="flex items-center text-amber-500">
                        <i class="fa-solid fa-star text-[11px]"></i>
                        <span class="ml-1 font-bold text-stone-800 text-[11px]">${product.rating}</span>
                        <span class="text-stone-400 text-[10px] ml-0.5">(${product.reviews})</span>
                    </div>
                </div>

                <h3 class="font-serif font-bold text-stone-900 text-base group-hover:text-amber-800 transition line-clamp-2 leading-snug">
                    <a href="${detailUrl}">${product.name}</a>
                </h3>

                <p class="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    ${product.description}
                </p>

                <div class="mt-auto pt-4 flex items-baseline justify-between border-t border-stone-100">
                    <div>
                        <span class="text-lg font-serif font-bold text-stone-900">${formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price ? `
                            <span class="text-xs text-stone-400 line-through ml-1.5">${formatPrice(product.originalPrice)}</span>
                        ` : ''}
                    </div>
                    <span class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <i class="fa-solid fa-shield-halved text-[10px]"></i> BH 5 năm
                    </span>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(catId) {
    if (typeof CATEGORIES === 'undefined') return 'Nội thất';
    const c = CATEGORIES.find(item => item.id === catId);
    return c ? c.name : 'Nội thất';
}
