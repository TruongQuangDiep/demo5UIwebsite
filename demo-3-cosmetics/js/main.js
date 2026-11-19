/**
 * MAIN INTERACTION & SPA ROUTER - GLOWAURA BEAUTY (DEMO 3)
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initApp();
    setupSPARouter();
    runPageSpecificScripts();
});

let cachedHeaderHtml = null;
let cachedFooterHtml = null;

async function loadComponents() {
    const isSubdir = window.location.pathname.includes('/chitietsanpham/');
    const basePath = isSubdir ? '../components/' : 'components/';

    const headerContainer = document.getElementById('site-header-container');
    const footerContainer = document.getElementById('site-footer-container');

    if (headerContainer) {
        headerContainer.classList.add('sticky', 'top-0', 'z-50', 'w-full');
    }

    if (headerContainer && !headerContainer.hasChildNodes()) {
        if (!cachedHeaderHtml) {
            try {
                const res = await fetch(basePath + 'header.html');
                if (res.ok) cachedHeaderHtml = await res.text();
            } catch (e) {
                console.warn("Lỗi tải component header:", e);
            }
        }
        if (cachedHeaderHtml) {
            headerContainer.innerHTML = cachedHeaderHtml;
        }
    }

    if (footerContainer && !footerContainer.hasChildNodes()) {
        if (!cachedFooterHtml) {
            try {
                const res = await fetch(basePath + 'footer.html');
                if (res.ok) cachedFooterHtml = await res.text();
            } catch (e) {
                console.warn("Lỗi tải component footer:", e);
            }
        }
        if (cachedFooterHtml) {
            footerContainer.innerHTML = cachedFooterHtml;
        }
    }
}

function fixComponentLinks() {
    const isSubdir = window.location.pathname.includes('/chitietsanpham/');
    const allLinks = document.querySelectorAll('#site-header-container a, #site-footer-container a');
    
    allLinks.forEach(a => {
        let href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;
        
        let clean = href.replace(/^(\.\.\/)+/, '');
        if (isSubdir) {
            a.setAttribute('href', '../' + clean);
        } else {
            a.setAttribute('href', clean);
        }
    });
}

function initApp() {
    fixComponentLinks();
    setupMobileMenu();
    setupHeaderScroll();
    setupSearchForms();
    setupNewsletterForms();
    initFlashSaleCountdown();
    highlightActiveNav();
    if (typeof updateCartBadges === 'function') {
        updateCartBadges();
    }
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        const newBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);

        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !newBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

function setupHeaderScroll() {
    window.removeEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', handleHeaderScroll);
}

function handleHeaderScroll() {
    const header = document.getElementById('site-header');
    const container = document.getElementById('site-header-container');
    if (!header) return;
    if (window.scrollY > 15) {
        if (container) container.classList.add('shadow-xl');
        header.classList.add('bg-white/95', 'backdrop-blur-md');
    } else {
        if (container) container.classList.remove('shadow-xl');
    }
}

function setupSearchForms() {
    const searchForms = document.querySelectorAll('.header-search-form');
    searchForms.forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="text"], input[type="search"]');
            if (input && input.value.trim()) {
                const query = encodeURIComponent(input.value.trim());
                const isSubdir = window.location.pathname.includes('/chitietsanpham/');
                const targetUrl = isSubdir ? `../sanpham.html?search=${query}` : `sanpham.html?search=${query}`;
                navigateTo(new URL(targetUrl, window.location.href).href);
            }
        };
    });
}

function setupNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                if (typeof showToast === 'function') {
                    showToast({
                        title: "Đăng ký thành công!",
                        message: `Voucher giảm 100.000₫ đã được gửi tới ${input.value}`,
                        type: "success"
                    });
                }
                input.value = '';
            }
        };
    });
}

let countdownInterval = null;
function initFlashSaleCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    let totalSeconds = (7 * 3600) + (35 * 60) + 18;

    countdownInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            return;
        }
        totalSeconds--;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
}

function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#site-header nav a, #mobile-menu a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        const cleanHref = linkHref.split('?')[0].split('/').pop();
        
        if (cleanHref === currentPath || (currentPath === '' && cleanHref === 'index.html')) {
            link.classList.add('text-amber-600', 'font-bold');
            link.classList.remove('text-stone-600');
        } else {
            link.classList.remove('text-amber-600', 'font-bold');
            link.classList.add('text-stone-600');
        }
    });
}

// =========================================================================
// SPA ROUTER
// =========================================================================
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
        if (!response.ok) throw new Error("Network error");

        const htmlText = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        document.title = newDoc.title;

        const currentMain = document.querySelector('main');
        const newMain = newDoc.querySelector('main');

        if (currentMain && newMain) {
            currentMain.style.opacity = '0';
            currentMain.style.transform = 'translateY(6px)';
            currentMain.style.transition = 'all 0.15s ease';

            setTimeout(async () => {
                currentMain.parentNode.replaceChild(newMain, currentMain);
                newMain.style.opacity = '0';
                newMain.style.transform = 'translateY(6px)';
                newMain.style.transition = 'all 0.2s ease';

                requestAnimationFrame(() => {
                    newMain.style.opacity = '1';
                    newMain.style.transform = 'translateY(0)';
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });

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

        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');

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
        bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500 z-[9999] transition-all duration-300';
        bar.style.width = '0%';
        document.body.appendChild(bar);
    }
    bar.style.opacity = '1';
    bar.style.width = '40%';
    setTimeout(() => { bar.style.width = '75%'; }, 100);
}

function hideProgressBar() {
    const bar = document.getElementById('spa-progress-bar');
    if (bar) {
        bar.style.width = '100%';
        setTimeout(() => {
            bar.style.opacity = '0';
            setTimeout(() => { bar.style.width = '0%'; }, 200);
        }, 150);
    }
}

// =========================================================================
// PAGE SCRIPTS
// =========================================================================
function runPageSpecificScripts() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';

    if (pageName === '' || pageName === 'index.html') {
        renderIndexPage();
    } else if (pageName === 'sanpham.html') {
        renderProductsPage();
    } else if (pageName === 'khuyenmai.html') {
        renderKhuyenMaiPage();
    } else if (pageName === 'giohang.html') {
        renderCartPageDynamic();
    } else if (pageName === 'thanhtoan.html') {
        renderCheckoutPageDynamic();
    } else if (path.includes('/chitietsanpham/') || (pageName.endsWith('.html') && pageName.includes('-'))) {
        renderDetailPageDynamic();
    } else if (pageName === 'lienhe.html') {
        initContactPageDynamic();
    } else if (pageName === 'dangnhap.html') {
        initLoginPageDynamic();
    } else if (pageName === 'dangky.html') {
        initRegisterPageDynamic();
    }
}

// --- TRANG CHỦ ---
function renderIndexPage() {
    if (typeof PRODUCTS === 'undefined') return;

    const flashGrid = document.getElementById('flash-sale-grid');
    if (flashGrid) {
        const flashItems = getFlashSaleProducts().slice(0, 4);
        flashGrid.innerHTML = flashItems.map(p => createProductCardHtml(p, true)).join('');
    }

    const featGrid = document.getElementById('featured-products-grid');
    if (featGrid) {
        const featItems = getFeaturedProducts().slice(0, 6);
        featGrid.innerHTML = featItems.map(p => createProductCardHtml(p)).join('');
    }
}

function createProductCardHtml(p, isFlash = false) {
    const isSubdir = window.location.pathname.includes('/chitietsanpham/');
    const detailLink = isSubdir ? `${p.slug}.html` : `chitietsanpham/${p.slug}.html`;

    return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col justify-between group">
            <div class="relative overflow-hidden bg-stone-50 p-4">
                <a href="${detailLink}" class="block overflow-hidden rounded-2xl h-56 relative">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    ${p.discount ? `<span class="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md">-${p.discount}%</span>` : ''}
                    ${p.badge ? `<span class="absolute top-2 right-2 bg-stone-900/90 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">${p.badge}</span>` : ''}
                </a>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <div class="flex items-center gap-1 text-amber-500 text-xs mb-1">
                        <i class="fa-solid fa-star"></i>
                        <span class="font-bold text-stone-800 text-xs">${p.rating}</span>
                        <span class="text-stone-400 text-[10px]">(${p.reviewsCount})</span>
                    </div>
                    <h3 class="font-serif font-bold text-stone-900 text-sm hover:text-amber-700 transition line-clamp-2 leading-snug">
                        <a href="${detailLink}">${p.name}</a>
                    </h3>
                    <p class="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">${p.shortDesc}</p>
                </div>

                <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                        <div class="text-xs text-stone-400 line-through">${p.originalPrice ? formatCurrency(p.originalPrice) : ''}</div>
                        <div class="text-base font-extrabold text-amber-700">${formatCurrency(p.price)}</div>
                    </div>
                    <button onclick="quickAddToCart('${p.id}')" class="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-amber-400 flex items-center justify-center transition shadow-sm" title="Thêm vào giỏ">
                        <i class="fa-solid fa-bag-shopping text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- TRANG SẢN PHẨM ---
function renderProductsPage() {
    if (typeof PRODUCTS === 'undefined') return;

    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('products-count');
    const categoryFilter = document.getElementById('filter-category');
    const priceFilter = document.getElementById('filter-price');
    const sortSelect = document.getElementById('sort-select');

    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search') || '';
    const categoryParam = urlParams.get('category') || 'all';

    if (categoryFilter && categoryParam !== 'all') {
        categoryFilter.value = categoryParam;
    }

    const searchInput = document.getElementById('search-input-page');
    if (searchInput && searchParam) {
        searchInput.value = searchParam;
    }

    function applyFilters() {
        let filtered = [...PRODUCTS];

        const selectedCat = categoryFilter ? categoryFilter.value : categoryParam;
        if (selectedCat && selectedCat !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCat);
        }

        const selectedPrice = priceFilter ? priceFilter.value : 'all';
        if (selectedPrice === 'under-500') {
            filtered = filtered.filter(p => p.price < 500000);
        } else if (selectedPrice === '500-1000') {
            filtered = filtered.filter(p => p.price >= 500000 && p.price <= 1000000);
        } else if (selectedPrice === 'over-1000') {
            filtered = filtered.filter(p => p.price > 1000000);
        }

        const currentSearch = searchInput ? searchInput.value.trim().toLowerCase() : searchParam.toLowerCase();
        if (currentSearch) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(currentSearch) || 
                p.shortDesc.toLowerCase().includes(currentSearch)
            );
        }

        const sortBy = sortSelect ? sortSelect.value : 'popular';
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        if (countEl) countEl.textContent = `${filtered.length} sản phẩm mỹ phẩm`;

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-stone-200 p-8">
                    <div class="w-16 h-16 rounded-full bg-stone-100 text-stone-400 text-3xl flex items-center justify-center mx-auto mb-3">
                        <i class="fa-solid fa-sparkles"></i>
                    </div>
                    <h3 class="font-bold text-stone-800 text-base">Chưa tìm thấy sản phẩm phù hợp</h3>
                    <p class="text-xs text-stone-500 mt-1">Vui lòng thử tìm kiếm với từ khóa khác</p>
                    <button onclick="resetFilters()" class="mt-4 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition">
                        Đặt lại bộ lọc
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(p => createProductCardHtml(p)).join('');
    }

    if (categoryFilter) categoryFilter.onchange = applyFilters;
    if (priceFilter) priceFilter.onchange = applyFilters;
    if (sortSelect) sortSelect.onchange = applyFilters;
    if (searchInput) searchInput.oninput = applyFilters;

    window.resetFilters = function() {
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (sortSelect) sortSelect.value = 'popular';
        if (searchInput) searchInput.value = '';
        applyFilters();
    };

    applyFilters();
}

// --- TRANG KHUYẾN MÃI ---
function renderKhuyenMaiPage() {
    if (typeof PRODUCTS === 'undefined') return;

    const promoGrid = document.getElementById('promo-products-grid');
    if (promoGrid) {
        const discounted = PRODUCTS.filter(p => p.discount > 0);
        promoGrid.innerHTML = discounted.map(p => createProductCardHtml(p, true)).join('');
    }
}

// --- TRANG GIỎ HÀNG ---
function renderCartPageDynamic() {
    if (typeof getCart !== 'function') return;

    const cart = getCart();
    const emptyView = document.getElementById('empty-cart-view');
    const activeView = document.getElementById('active-cart-view');
    const itemsList = document.getElementById('cart-items-list');
    const countBadge = document.getElementById('cart-items-count-badge');

    if (!emptyView || !activeView || !itemsList) return;

    if (!cart || cart.length === 0) {
        emptyView.classList.remove('hidden');
        activeView.classList.add('hidden');
        return;
    }

    emptyView.classList.add('hidden');
    activeView.classList.remove('hidden');

    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (countBadge) countBadge.textContent = `${totalCount} sản phẩm`;

    itemsList.innerHTML = cart.map(item => `
        <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 group">
            <a href="chitietsanpham/${item.slug}.html" class="w-20 h-20 bg-stone-100 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-200">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition">
            </a>

            <div class="flex-1 text-center sm:text-left">
                <h4 class="font-serif font-bold text-sm text-stone-900 hover:text-amber-700 transition">
                    <a href="chitietsanpham/${item.slug}.html">${item.name}</a>
                </h4>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                    <span class="bg-amber-50 text-amber-800 text-[11px] px-2 py-0.5 rounded font-medium">${item.capacity}</span>
                    <span class="bg-stone-100 text-stone-600 text-[11px] px-2 py-0.5 rounded">${item.skinType}</span>
                </div>
                <div class="sm:hidden font-extrabold text-amber-700 text-sm mt-2">
                    ${formatCurrency(item.price)}
                </div>
            </div>

            <div class="hidden sm:block text-right">
                <p class="text-xs text-stone-400">Đơn giá</p>
                <p class="font-bold text-sm text-stone-700">${formatCurrency(item.price)}</p>
            </div>

            <div class="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity - 1}); renderCartPageDynamic();" class="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition font-bold text-sm">-</button>
                <span class="w-9 h-8 flex items-center justify-center font-bold text-xs text-stone-800">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity + 1}); renderCartPageDynamic();" class="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition font-bold text-sm">+</button>
            </div>

            <div class="text-right min-w-[100px]">
                <p class="hidden sm:block text-xs text-stone-400">Thành tiền</p>
                <p class="font-extrabold text-sm text-amber-700">${formatCurrency(item.price * item.quantity)}</p>
            </div>

            <button onclick="removeFromCart('${item.cartItemId}'); renderCartPageDynamic();" class="p-2 text-stone-400 hover:text-rose-600 transition" title="Xóa">
                <i class="fa-regular fa-trash-can text-sm"></i>
            </button>
        </div>
    `).join('');

    updateSummaryDisplay();
}

function updateSummaryDisplay() {
    if (typeof calculateCartTotals !== 'function') return;
    const totals = calculateCartTotals();

    const subtotalEl = document.getElementById('summary-subtotal');
    const discRow = document.getElementById('summary-discount-row');
    const discEl = document.getElementById('summary-discount');
    const shipEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (discRow && discEl) {
        if (totals.discount > 0) {
            discRow.classList.remove('hidden');
            discEl.textContent = `-${formatCurrency(totals.discount)}`;
        } else {
            discRow.classList.add('hidden');
        }
    }
    if (shipEl) {
        shipEl.textContent = totals.shipping === 0 ? 'Miễn phí toàn quốc' : formatCurrency(totals.shipping);
    }
    if (totalEl) totalEl.textContent = formatCurrency(totals.finalTotal);
}

// --- TRANG THANH TOÁN ---
function renderCheckoutPageDynamic() {
    if (typeof getCart !== 'function') return;
    const cart = getCart();
    const listEl = document.getElementById('checkout-items-list');
    if (!listEl) return;

    if (!cart || cart.length === 0) {
        listEl.innerHTML = `<p class="text-xs text-stone-500 py-4 text-center">Giỏ hàng của bạn đang trống. <a href="sanpham.html" class="text-amber-700 underline font-bold">Mua sắm ngay</a></p>`;
        return;
    }

    listEl.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0">
            <div class="flex-1 min-w-0">
                <h4 class="text-xs font-serif font-bold text-stone-900 truncate">${item.name}</h4>
                <p class="text-[10px] text-stone-500">${item.capacity} • ${item.skinType} (SL: ${item.quantity})</p>
            </div>
            <span class="text-xs font-bold text-stone-800 flex-shrink-0">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    const totals = calculateCartTotals();
    const subtotalEl = document.getElementById('co-subtotal');
    const discRow = document.getElementById('co-discount-row');
    const discEl = document.getElementById('co-discount');
    const shipEl = document.getElementById('co-shipping');
    const totalEl = document.getElementById('co-total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (discRow && discEl) {
        if (totals.discount > 0) {
            discRow.classList.remove('hidden');
            discEl.textContent = `-${formatCurrency(totals.discount)}`;
        } else {
            discRow.classList.add('hidden');
        }
    }
    if (shipEl) shipEl.textContent = totals.shipping === 0 ? 'Miễn phí' : formatCurrency(totals.shipping);
    if (totalEl) totalEl.textContent = formatCurrency(totals.finalTotal);

    const radios = document.querySelectorAll('input[name="payment_method"]');
    const qrBox = document.getElementById('vietqr-preview-box');

    radios.forEach(radio => {
        radio.onchange = () => {
            document.querySelectorAll('.payment-radio-option').forEach(opt => {
                opt.classList.remove('border-amber-600', 'bg-amber-50/40');
                opt.classList.add('border-stone-200');
            });

            radio.closest('label').classList.add('border-amber-600', 'bg-amber-50/40');
            radio.closest('label').classList.remove('border-stone-200');

            if (radio.value === 'VIETQR') {
                if (qrBox) qrBox.classList.remove('hidden');
            } else {
                if (qrBox) qrBox.classList.add('hidden');
            }
        };
    });

    const form = document.getElementById('checkout-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const currentCart = getCart();
            if (!currentCart || currentCart.length === 0) {
                alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước.");
                return;
            }

            const name = document.getElementById('cust-name').value;
            const phone = document.getElementById('cust-phone').value;
            const address = document.getElementById('cust-address').value;
            const orderCode = 'GA-' + Math.floor(10000 + Math.random() * 90000);

            document.getElementById('success-order-code').textContent = '#' + orderCode;
            document.getElementById('success-cust-name').textContent = name;
            document.getElementById('success-cust-phone').textContent = phone;
            document.getElementById('success-cust-addr').textContent = address;
            document.getElementById('success-total-amount').textContent = formatCurrency(totals.finalTotal);

            clearCart();
            document.getElementById('order-success-modal').classList.remove('hidden');
        };
    }
}

// --- TRANG CHI TIẾT SẢN PHẨM ---
function renderDetailPageDynamic() {
    if (typeof PRODUCTS === 'undefined') return;
    const relatedContainer = document.getElementById('related-products-grid');
    if (relatedContainer) {
        const currentSlug = window.location.pathname.split('/').pop().replace('.html', '');
        const related = PRODUCTS.filter(p => p.slug !== currentSlug).slice(0, 4);
        relatedContainer.innerHTML = related.map(p => createProductCardHtml(p)).join('');
    }
}

// --- TRANG LIÊN HỆ ---
function initContactPageDynamic() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            showToast({
                title: "Đã gửi thông tin tư vấn da!",
                message: `Cảm ơn ${name}! Chuyên viên da liễu GlowAura sẽ liên hệ phân tích phác đồ da trong 20 phút.`,
                type: "success"
            });
            form.reset();
        };
    }
}

// --- TRANG ĐĂNG NHẬP ---
function initLoginPageDynamic() {
    const form = document.getElementById('login-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const account = document.getElementById('login-account').value;
            showToast({
                title: "Đăng nhập thành công!",
                message: `Chào mừng ${account} quay trở lại GlowAura Beauty.`,
                type: "success"
            });
            setTimeout(() => {
                navigateTo('index.html');
            }, 1200);
        };
    }
}

// --- TRANG ĐĂNG KÝ ---
function initRegisterPageDynamic() {
    const form = document.getElementById('register-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const p1 = document.getElementById('reg-pwd').value;
            const p2 = document.getElementById('reg-pwd-confirm').value;
            if (p1 !== p2) {
                alert("Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại!");
                return;
            }
            const name = document.getElementById('reg-name').value;
            showToast({
                title: "Đăng ký thành viên thành công!",
                message: `Chào mừng ${name}! Voucher 100.000₫ đã sẵn sàng trong tài khoản.`,
                type: "success"
            });
            setTimeout(() => {
                navigateTo('dangnhap.html');
            }, 1500);
        };
    }
}

// =========================================================================
// GLOBAL HELPERS
// =========================================================================
window.selectedCapacity = "50ml (Tiết kiệm)";
window.selectedSkinType = "Mọi loại da";
window.currentDetailQty = 1;

window.changeMainImage = function(src, btn) {
    const mainImg = document.getElementById('main-product-img');
    if (mainImg) mainImg.src = src;
    document.querySelectorAll('.thumbnail-btn').forEach(b => {
        b.classList.remove('border-amber-600');
        b.classList.add('border-transparent');
    });
    if (btn) {
        btn.classList.add('border-amber-600');
        btn.classList.remove('border-transparent');
    }
};

window.selectCapacity = function(val, btn) {
    window.selectedCapacity = val;
    const txt = document.getElementById('selected-capacity-text');
    if (txt) txt.textContent = val;
    document.querySelectorAll('.capacity-btn').forEach(b => {
        b.classList.remove('border-amber-600', 'bg-amber-50', 'text-amber-800', 'font-bold');
        b.classList.add('border-stone-200', 'text-stone-700', 'font-medium');
    });
    if (btn) {
        btn.classList.add('border-amber-600', 'bg-amber-50', 'text-amber-800', 'font-bold');
        btn.classList.remove('border-stone-200', 'text-stone-700', 'font-medium');
    }
};

window.selectSkinType = function(val, btn) {
    window.selectedSkinType = val;
    const txt = document.getElementById('selected-skintype-text');
    if (txt) txt.textContent = val;
    document.querySelectorAll('.skintype-btn').forEach(b => {
        b.classList.remove('border-amber-600', 'bg-amber-50', 'text-amber-800', 'font-bold');
        b.classList.add('border-stone-200', 'text-stone-700', 'font-medium');
    });
    if (btn) {
        btn.classList.add('border-amber-600', 'bg-amber-50', 'text-amber-800', 'font-bold');
        btn.classList.remove('border-stone-200', 'text-stone-700', 'font-medium');
    }
};

window.changeQty = function(delta) {
    window.currentDetailQty = Math.max(1, Math.min(10, (window.currentDetailQty || 1) + delta));
    const input = document.getElementById('detail-qty');
    if (input) input.value = window.currentDetailQty;
};

window.switchTab = function(tab) {
    const descBtn = document.getElementById('tab-btn-desc');
    const ingredBtn = document.getElementById('tab-btn-ingred');
    const descContent = document.getElementById('tab-content-desc');
    const ingredContent = document.getElementById('tab-content-ingred');

    if (tab === 'desc') {
        if (descBtn) descBtn.className = "pb-3 border-b-2 border-amber-600 text-amber-700 font-bold";
        if (ingredBtn) ingredBtn.className = "pb-3 border-b-2 border-transparent text-stone-500 hover:text-stone-900 font-bold";
        if (descContent) descContent.classList.remove('hidden');
        if (ingredContent) ingredContent.classList.add('hidden');
    } else {
        if (ingredBtn) ingredBtn.className = "pb-3 border-b-2 border-amber-600 text-amber-700 font-bold";
        if (descBtn) descBtn.className = "pb-3 border-b-2 border-transparent text-stone-500 hover:text-stone-900 font-bold";
        if (ingredContent) ingredContent.classList.remove('hidden');
        if (descContent) descContent.classList.add('hidden');
    }
};

window.handleAddToCartClick = function() {
    const currentSlug = window.location.pathname.split('/').pop().replace('.html', '');
    const prod = (typeof getProductBySlug === 'function') ? getProductBySlug(currentSlug) : null;
    if (prod && typeof addToCart === 'function') {
        addToCart(prod, window.currentDetailQty || 1, { capacity: window.selectedCapacity, skinType: window.selectedSkinType });
    }
};

window.handleBuyNowClick = function() {
    window.handleAddToCartClick();
    navigateTo('../thanhtoan.html');
};

window.handleApplyCoupon = function() {
    const input = document.getElementById('coupon-input');
    const alertEl = document.getElementById('coupon-alert');
    if (!input || typeof applyCoupon !== 'function') return;

    const res = applyCoupon(input.value);
    if (alertEl) {
        alertEl.classList.remove('hidden');
        if (res.success) {
            alertEl.className = "mt-2 text-[11px] p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-between";
            alertEl.innerHTML = `
                <span><i class="fa-solid fa-check mr-1"></i> ${res.message}</span>
                <button onclick="handleRemoveCoupon()" class="text-xs text-emerald-800 font-bold hover:underline">Hủy</button>
            `;
        } else {
            alertEl.className = "mt-2 text-[11px] p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200";
            alertEl.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-1"></i> ${res.message}`;
        }
    }
    renderCartPageDynamic();
};

window.handleRemoveCoupon = function() {
    if (typeof removeAppliedCoupon === 'function') removeAppliedCoupon();
    const alertEl = document.getElementById('coupon-alert');
    if (alertEl) alertEl.classList.add('hidden');
    const input = document.getElementById('coupon-input');
    if (input) input.value = '';
    renderCartPageDynamic();
};

window.handleClearCart = function() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?")) {
        if (typeof clearCart === 'function') clearCart();
        renderCartPageDynamic();
    }
};

window.quickAddToCart = function(productId) {
    if (typeof getProductById === 'function' && typeof addToCart === 'function') {
        const product = getProductById(productId);
        if (product) addToCart(product, 1);
    }
};

window.copyVoucher = function(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast({
                title: "Đã sao chép mã voucher!",
                message: `Mã "${code}" đã sẵn sàng. Dán vào giỏ hàng để nhận ưu đãi.`,
                type: "success"
            });
        }).catch(() => {
            showToast({
                title: "Mã ưu đãi:",
                message: `Mã của bạn là: ${code}`,
                type: "success"
            });
        });
    } else {
        showToast({
            title: "Mã ưu đãi:",
            message: `Mã của bạn là: ${code}`,
            type: "success"
        });
    }
};

window.togglePasswordVisibility = function(inputId = 'login-password', iconId = 'eye-icon') {
    const pwdInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);
    if (!pwdInput || !eyeIcon) return;
    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        pwdInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
};

window.openForgotModal = function() {
    const modal = document.getElementById('forgot-modal');
    if (modal) modal.classList.remove('hidden');
};

window.closeForgotModal = function() {
    const modal = document.getElementById('forgot-modal');
    if (modal) modal.classList.add('hidden');
};

window.sendForgotEmail = function() {
    const emailEl = document.getElementById('forgot-email');
    if (emailEl && emailEl.value) {
        window.closeForgotModal();
        if (typeof showToast === 'function') {
            showToast({
                title: "Đã gửi email khôi phục",
                message: `Hướng dẫn đổi mật khẩu đã gửi tới ${emailEl.value}`,
                type: "success"
            });
        }
    }
};

window.handleSocialLogin = function(provider) {
    if (typeof showToast === 'function') {
        showToast({
            title: `Đăng nhập ${provider} thành công!`,
            message: "Chào mừng bạn đến với GlowAura Beauty.",
            type: "success"
        });
    }
    setTimeout(() => {
        navigateTo('index.html');
    }, 1200);
};
