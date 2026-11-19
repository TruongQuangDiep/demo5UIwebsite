/**
 * MAIN INTERACTION & SPA ROUTER - URBANVIBE STREETWEAR STUDIO (DEMO 4)
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initApp();
    setupSPARouter();
    runPageSpecificScripts();
});

let cachedHeaderHtml = null;
let cachedFooterHtml = null;

// Tải components Header & Footer tự động từ thư mục components/
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

// Chuẩn hóa đường dẫn tương đối của các liên kết trong component theo thư mục hiện tại
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
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.onclick = () => {
            menu.classList.toggle('hidden');
        };
    }
}

function setupHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('shadow-xl', 'bg-zinc-950/98');
        } else {
            header.classList.remove('shadow-xl', 'bg-zinc-950/98');
        }
    });
}

function setupSearchForms() {
    document.querySelectorAll('.header-search-form').forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const query = input ? input.value.trim() : '';
            if (query) {
                const isSubdir = window.location.pathname.includes('/chitietsanpham/');
                const targetUrl = isSubdir ? `../sanpham.html?search=${encodeURIComponent(query)}` : `sanpham.html?search=${encodeURIComponent(query)}`;
                navigateTo(targetUrl);
            }
        };
    });
}

function setupNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                showToast({
                    title: "VIP Drop Club Access!",
                    message: `Cảm ơn bạn! Mã STREET100 (Giảm 100K) đã gửi tới ${input.value}.`,
                    type: "success"
                });
                input.value = '';
            }
        };
    });
}

function initFlashSaleCountdown() {
    const countdownEl = document.getElementById('flash-sale-countdown');
    if (!countdownEl) return;

    function update() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const diff = endOfDay - now;
        if (diff <= 0) return;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `
            <span class="px-2 py-1 rounded-md bg-amber-400 text-black font-black text-xs">${String(hours).padStart(2, '0')}</span>
            <span class="text-amber-400 font-bold">:</span>
            <span class="px-2 py-1 rounded-md bg-amber-400 text-black font-black text-xs">${String(mins).padStart(2, '0')}</span>
            <span class="text-amber-400 font-bold">:</span>
            <span class="px-2 py-1 rounded-md bg-amber-400 text-black font-black text-xs">${String(secs).padStart(2, '0')}</span>
        `;
    }

    update();
    setInterval(update, 1000);
}

function highlightActiveNav(targetPathname) {
    const pathname = targetPathname || window.location.pathname;
    let currentFile = pathname.substring(pathname.lastIndexOf('/') + 1);
    if (!currentFile || currentFile === '') currentFile = 'index.html';

    const isSubdir = pathname.includes('/chitietsanpham/');

    const navLinks = document.querySelectorAll('#site-header nav a, #mobile-menu a');
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
            link.classList.remove('text-white', 'text-zinc-200', 'text-zinc-300', 'text-zinc-400');
            link.classList.add('text-amber-400', 'font-black');
            if (icon) {
                icon.classList.remove('text-zinc-400', 'text-zinc-500');
                icon.classList.add('text-amber-400');
            }
        } else {
            link.classList.remove('text-amber-400', 'font-black');
            link.classList.add('text-white', 'font-bold');
            if (icon) {
                if (icon.classList.contains('fa-fire')) {
                    icon.classList.add('text-amber-400');
                } else {
                    icon.classList.remove('text-amber-400');
                    icon.classList.add('text-zinc-400');
                }
            }
        }
    });
}

// Single Page Application (SPA) Router
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

                // Đồng bộ thanh breadcrumb nếu có
                const newBreadcrumb = doc.querySelector('div.bg-\\[\\#181922\\], div.border-b.border-zinc-700\\/60');
                const curBreadcrumb = document.querySelector('div.bg-\\[\\#181922\\], div.border-b.border-zinc-700\\/60');
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
        bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 z-[9999] transition-all duration-300';
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

// Tạo thẻ HTML Card sản phẩm Streetwear
function createProductCardHtml(product, isDetailSubdir = false) {
    const detailLink = isDetailSubdir 
        ? `${product.slug}.html` 
        : `chitietsanpham/${product.slug}.html`;

    const defaultSize = product.sizes ? product.sizes[0] : 'Free Size';
    const defaultColor = product.colors ? product.colors[0] : 'Tiêu chuẩn';

    return `
        <div class="product-card group bg-[#1c1d27] border border-zinc-700/80 hover:border-amber-400/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-400/10 hover:-translate-y-1">
            <div class="relative overflow-hidden bg-[#14151c] aspect-[4/5]">
                <a href="${detailLink}" class="block w-full h-full">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                
                <!-- Discount Badge -->
                ${product.discount ? `<span class="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md">-${product.discount}%</span>` : ''}

                <!-- Category/Status Badge -->
                <span class="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    ${product.badge || 'Street Drop'}
                </span>

                <!-- Quick Action Overlay -->
                <div class="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onclick="addToCart('${product.id}', 1, { size: '${defaultSize}', color: '${defaultColor}' })" class="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-black/50 flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-cart-plus"></i> Thêm giỏ
                    </button>
                    <a href="${detailLink}" class="w-10 h-10 bg-zinc-900/90 hover:bg-white text-white hover:text-black rounded-xl flex items-center justify-center text-xs transition backdrop-blur-sm border border-zinc-700">
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <div class="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span class="uppercase font-bold tracking-wider text-amber-400">${product.category}</span>
                        <div class="flex items-center text-amber-400 text-xs">
                            <i class="fa-solid fa-star text-[10px] mr-1"></i>
                            <span class="font-bold">${product.rating}</span>
                            <span class="text-zinc-500 ml-1">(${product.reviewsCount})</span>
                        </div>
                    </div>
                    <a href="${detailLink}" class="font-bold text-sm text-white hover:text-amber-400 line-clamp-2 transition leading-snug">
                        ${product.name}
                    </a>
                </div>

                <div class="flex items-baseline justify-between pt-2 border-t border-zinc-800/80">
                    <div>
                        <span class="text-base font-black text-amber-400 tracking-tight">${formatCurrency(product.price)}</span>
                        ${product.originalPrice ? `<span class="text-xs text-zinc-500 line-through ml-2">${formatCurrency(product.originalPrice)}</span>` : ''}
                    </div>
                    <span class="text-[10px] text-zinc-400 font-semibold bg-zinc-800 px-2 py-0.5 rounded">Còn ${product.stock}c</span>
                </div>
            </div>
        </div>
    `;
}

// Kích hoạt logic theo trang
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
    } else if (path.includes('index.html') || path.endsWith('/demo-4-fashion/') || path.endsWith('/demo-4-fashion') || path === '' || path === '/') {
        initHomePage();
    }
}

// 1. TRANG CHỦ
function initHomePage() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (featuredGrid) {
        const featured = getFeaturedProducts().slice(0, 4);
        featuredGrid.innerHTML = featured.map(p => createProductCardHtml(p)).join('');
    }

    const flashGrid = document.getElementById('flash-sale-products-grid');
    if (flashGrid) {
        const flashProducts = getFlashSaleProducts().slice(0, 4);
        flashGrid.innerHTML = flashProducts.map(p => createProductCardHtml(p)).join('');
    }
}

// 2. TRANG BỘ SƯU TẬP (SANPHAM.HTML)
function initProductsPage() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || 'all';
    const initialSearch = urlParams.get('search') || '';

    const categorySelect = document.getElementById('filter-category');
    const priceSelect = document.getElementById('filter-price');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input-page');
    const countEl = document.getElementById('products-count');

    if (categorySelect) categorySelect.value = initialCategory;
    if (searchInput) searchInput.value = initialSearch;

    function renderFiltered() {
        let filtered = [...PRODUCTS];

        // Lọc danh mục
        const cat = categorySelect ? categorySelect.value : 'all';
        if (cat !== 'all') {
            filtered = filtered.filter(p => p.category === cat);
        }

        // Lọc mức giá
        const pr = priceSelect ? priceSelect.value : 'all';
        if (pr === 'under-500') {
            filtered = filtered.filter(p => p.price < 500000);
        } else if (pr === '500-1000') {
            filtered = filtered.filter(p => p.price >= 500000 && p.price <= 1000000);
        } else if (pr === 'over-1000') {
            filtered = filtered.filter(p => p.price > 1000000);
        }

        // Tìm kiếm theo từ khóa
        const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (keyword) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(keyword) || 
                p.shortDesc.toLowerCase().includes(keyword)
            );
        }

        // Sắp xếp
        const sort = sortSelect ? sortSelect.value : 'popular';
        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        if (countEl) countEl.textContent = `${filtered.length} sản phẩm Streetwear`;

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
                    <div class="w-16 h-16 rounded-full bg-zinc-800 text-zinc-400 text-3xl flex items-center justify-center mx-auto mb-3">
                        <i class="fa-solid fa-skull"></i>
                    </div>
                    <h3 class="font-black text-white text-base uppercase tracking-wider">Chưa tìm thấy mẫu Streetwear phù hợp</h3>
                    <p class="text-xs text-zinc-400 mt-1">Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                    <button onclick="resetFilters()" class="mt-4 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-xs font-black uppercase tracking-wider transition">
                        Đặt lại bộ lọc
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(p => createProductCardHtml(p)).join('');
    }

    if (categorySelect) categorySelect.onchange = renderFiltered;
    if (priceSelect) priceSelect.onchange = renderFiltered;
    if (sortSelect) sortSelect.onchange = renderFiltered;
    if (searchInput) searchInput.oninput = renderFiltered;

    window.resetFilters = () => {
        if (categorySelect) categorySelect.value = 'all';
        if (priceSelect) priceSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'popular';
        if (searchInput) searchInput.value = '';
        renderFiltered();
    };

    renderFiltered();
}

// 3. TRANG ƯU ĐÃI (KHUYENMAI.HTML)
function initKhuyenMaiPage() {
    const dealsGrid = document.getElementById('promo-deals-grid');
    if (dealsGrid) {
        const flashDeals = getFlashSaleProducts();
        dealsGrid.innerHTML = flashDeals.map(p => createProductCardHtml(p)).join('');
    }

    window.copyVoucherCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            showToast({
                title: "Đã sao chép voucher!",
                message: `Mã "${code}" đã lưu vào bộ nhớ tạm. Dán vào giỏ hàng để nhận ưu đãi!`,
                type: "success"
            });
        }).catch(() => {
            prompt("Sao chép mã voucher:", code);
        });
    };
}

// 4. TRANG GIỎ HÀNG (GIOHANG.HTML)
function initCartPage() {
    const tableBody = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const activeState = document.getElementById('cart-active-state');

    function renderCart() {
        const cart = getCart();

        if (cart.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (activeState) activeState.classList.add('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (activeState) activeState.classList.remove('hidden');

        if (tableBody) {
            tableBody.innerHTML = cart.map(item => `
                <tr class="border-b border-zinc-800">
                    <td class="py-4">
                        <div class="flex items-center gap-4">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded-xl border border-zinc-800 flex-shrink-0">
                            <div>
                                <h4 class="font-bold text-xs sm:text-sm text-white">${item.name}</h4>
                                <div class="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                                    <span class="bg-zinc-800 px-2 py-0.5 rounded text-amber-400 font-bold">${item.size}</span>
                                    <span>•</span>
                                    <span>${item.color}</span>
                                </div>
                                <p class="text-xs font-black text-amber-400 mt-1 sm:hidden">${formatCurrency(item.price)}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 text-center font-black text-zinc-300 text-xs hidden sm:table-cell">
                        ${formatCurrency(item.price)}
                    </td>
                    <td class="py-4 text-center">
                        <div class="inline-flex items-center border border-zinc-700 rounded-xl bg-zinc-950 overflow-hidden">
                            <button onclick="handleQtyChange('${item.cartItemId}', ${item.quantity - 1})" class="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition font-black">-</button>
                            <span class="w-8 text-center text-xs font-bold text-white">${item.quantity}</span>
                            <button onclick="handleQtyChange('${item.cartItemId}', ${item.quantity + 1})" class="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition font-black">+</button>
                        </div>
                    </td>
                    <td class="py-4 text-right font-black text-amber-400 text-xs hidden sm:table-cell">
                        ${formatCurrency(item.price * item.quantity)}
                    </td>
                    <td class="py-4 text-right">
                        <button onclick="removeFromCart('${item.cartItemId}'); renderCart();" class="text-zinc-500 hover:text-red-500 p-2 transition">
                            <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        updateSummaryDisplay();
    }

    function updateSummaryDisplay() {
        const { subtotal, shipping, discount, total, coupon } = calculateTotals();

        const subtotalEl = document.getElementById('summary-subtotal');
        const shippingEl = document.getElementById('summary-shipping');
        const discountRow = document.getElementById('summary-discount-row');
        const discountEl = document.getElementById('summary-discount');
        const totalEl = document.getElementById('summary-total');
        const couponTag = document.getElementById('applied-coupon-tag');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'MIỄN PHÍ' : formatCurrency(shipping);

        if (discount > 0 && coupon) {
            if (discountRow) discountRow.classList.remove('hidden');
            if (discountEl) discountEl.textContent = `-${formatCurrency(discount)}`;
            if (couponTag) {
                couponTag.classList.remove('hidden');
                couponTag.innerHTML = `
                    <span class="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
                        <i class="fa-solid fa-ticket"></i> ${coupon.code}: ${coupon.description}
                        <button onclick="removeCoupon(); renderCart();" class="ml-2 text-zinc-400 hover:text-red-400"><i class="fa-solid fa-xmark"></i></button>
                    </span>
                `;
            }
        } else {
            if (discountRow) discountRow.classList.add('hidden');
            if (couponTag) couponTag.classList.add('hidden');
        }

        if (totalEl) totalEl.textContent = formatCurrency(total);
    }

    window.handleQtyChange = (cartItemId, newQty) => {
        updateCartQuantity(cartItemId, newQty);
        renderCart();
    };

    window.handleApplyCoupon = (e) => {
        e.preventDefault();
        const input = document.getElementById('coupon-input');
        if (!input) return;

        const res = applyCoupon(input.value);
        if (res.success) {
            showToast({ title: "Thành công!", message: res.message, type: "success" });
            input.value = '';
            renderCart();
        } else {
            showToast({ title: "Thông báo", message: res.message, type: "error" });
        }
    };

    renderCart();
    window.renderCart = renderCart;
}

// 5. TRANG THANH TOÁN (THANHTOAN.HTML)
function initCheckoutPage() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast({
            title: "Giỏ hàng trống",
            message: "Vui lòng chọn sản phẩm trước khi tiến hành thanh toán",
            type: "error"
        });
        navigateTo('sanpham.html');
        return;
    }

    const { subtotal, shipping, discount, total, coupon } = calculateTotals();

    // Render items summary
    const itemsContainer = document.getElementById('checkout-items-list');
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between text-xs py-2 border-b border-zinc-800">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-14 object-cover rounded-lg border border-zinc-800">
                    <div>
                        <h5 class="font-bold text-white line-clamp-1">${item.name}</h5>
                        <p class="text-[10px] text-zinc-400">${item.size} • ${item.color} • SL: ${item.quantity}</p>
                    </div>
                </div>
                <span class="font-black text-amber-400">${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }

    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const discountEl = document.getElementById('checkout-discount');
    const totalEl = document.getElementById('checkout-total');
    const qrAmountEl = document.getElementById('qr-amount-text');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'MIỄN PHÍ' : formatCurrency(shipping);
    if (discountEl) discountEl.textContent = discount > 0 ? `-${formatCurrency(discount)}` : '0₫';
    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (qrAmountEl) qrAmountEl.textContent = formatCurrency(total);

    // Toggle VietQR preview
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const qrBox = document.getElementById('vietqr-preview-box');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'VIETQR') {
                if (qrBox) qrBox.classList.remove('hidden');
            } else {
                if (qrBox) qrBox.classList.add('hidden');
            }
        });
    });

    // Form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.onsubmit = (e) => {
            e.preventDefault();

            const name = document.getElementById('cust-name').value;
            const phone = document.getElementById('cust-phone').value;
            const address = document.getElementById('cust-address').value;
            const orderCode = 'UBV-' + Math.floor(100000 + Math.random() * 900000);

            // Hiển thị modal đặt hàng thành công
            const modal = document.getElementById('order-success-modal');
            if (modal) {
                document.getElementById('modal-order-code').textContent = orderCode;
                document.getElementById('modal-cust-name').textContent = name;
                document.getElementById('modal-total-amount').textContent = formatCurrency(total);
                modal.classList.remove('hidden');
            }

            clearCart();
        };
    }
}

// 6. TRANG CHI TIẾT SẢN PHẨM (CHITIETSANPHAM/*.HTML)
window.selectedSize = '';
window.selectedColor = '';
window.currentDetailQty = 1;

window.changeMainImage = function(url, btn) {
    const img = document.getElementById('main-product-img');
    if (img) img.src = url;
    document.querySelectorAll('.thumbnail-btn').forEach(b => {
        b.classList.remove('border-amber-400');
        b.classList.add('border-transparent');
    });
    if (btn) {
        btn.classList.remove('border-transparent');
        btn.classList.add('border-amber-400');
    }
};

window.selectSize = function(val, btn) {
    window.selectedSize = val;
    const el = document.getElementById('selected-size-text');
    if (el) el.textContent = val;
    document.querySelectorAll('.size-btn').forEach(b => {
        b.className = 'size-btn py-2.5 px-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold hover:border-amber-400 text-xs uppercase tracking-wider transition';
    });
    if (btn) {
        btn.className = 'size-btn py-2.5 px-3 rounded-xl border-2 border-amber-400 bg-amber-400/10 text-amber-400 font-black text-xs uppercase tracking-wider transition';
    }
};

window.selectColor = function(val, btn) {
    window.selectedColor = val;
    const el = document.getElementById('selected-color-text');
    if (el) el.textContent = val;
    document.querySelectorAll('.color-btn').forEach(b => {
        b.className = 'color-btn py-2 px-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold hover:border-amber-400 text-xs uppercase tracking-wider transition';
    });
    if (btn) {
        btn.className = 'color-btn py-2 px-3 rounded-xl border-2 border-amber-400 bg-amber-400/10 text-amber-400 font-black text-xs uppercase tracking-wider transition';
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
        const sizeEl = document.getElementById('selected-size-text');
        const size = (sizeEl ? sizeEl.textContent.trim() : window.selectedSize) || (product.sizes ? product.sizes[0] : 'Free Size');
        const colorEl = document.getElementById('selected-color-text');
        const color = (colorEl ? colorEl.textContent.trim() : window.selectedColor) || (product.colors ? product.colors[0] : 'Tiêu chuẩn');
        addToCart(product, qty, { size, color });
    } else {
        console.warn("Không tìm thấy sản phẩm hoặc hàm addToCart chưa sẵn sàng");
    }
};

window.handleBuyNowClick = function() {
    window.handleAddToCartClick();
    const isSubdir = window.location.pathname.includes('/chitietsanpham/');
    const targetUrl = isSubdir ? '../giohang.html' : 'giohang.html';
    if (typeof navigateTo === 'function') {
        navigateTo(targetUrl);
    } else {
        window.location.href = targetUrl;
    }
};

window.switchTab = function(tab) {
    const btnDesc = document.getElementById('tab-btn-desc');
    const btnSpecs = document.getElementById('tab-btn-specs');
    const contentDesc = document.getElementById('tab-content-desc');
    const contentSpecs = document.getElementById('tab-content-specs');

    if (tab === 'desc') {
        if (btnDesc) btnDesc.className = 'pb-3 border-b-2 border-amber-400 text-amber-400 font-black text-xs uppercase tracking-wider';
        if (btnSpecs) btnSpecs.className = 'pb-3 border-b-2 border-transparent text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition';
        if (contentDesc) contentDesc.classList.remove('hidden');
        if (contentSpecs) contentSpecs.classList.add('hidden');
    } else {
        if (btnSpecs) btnSpecs.className = 'pb-3 border-b-2 border-amber-400 text-amber-400 font-black text-xs uppercase tracking-wider';
        if (btnDesc) btnDesc.className = 'pb-3 border-b-2 border-transparent text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition';
        if (contentSpecs) contentSpecs.classList.remove('hidden');
        if (contentDesc) contentDesc.classList.add('hidden');
    }
};

function initProductDetailPage() {
    const slug = window.location.pathname.split('/').pop().replace('.html', '');
    const currentProduct = (typeof getProductBySlug === 'function') ? getProductBySlug(slug) : null;

    // Reset số lượng
    window.currentDetailQty = 1;
    const qtyInput = document.getElementById('detail-qty');
    if (qtyInput) qtyInput.value = 1;

    // Khởi tạo size & màu đã chọn
    const sizeEl = document.getElementById('selected-size-text');
    if (sizeEl) {
        window.selectedSize = sizeEl.textContent.trim();
    } else if (currentProduct && currentProduct.sizes && currentProduct.sizes.length > 0) {
        window.selectedSize = currentProduct.sizes[0];
    } else {
        window.selectedSize = 'Free Size';
    }

    const colorEl = document.getElementById('selected-color-text');
    if (colorEl) {
        window.selectedColor = colorEl.textContent.trim();
    } else if (currentProduct && currentProduct.colors && currentProduct.colors.length > 0) {
        window.selectedColor = currentProduct.colors[0];
    } else {
        window.selectedColor = 'Tiêu chuẩn';
    }

    // Hiển thị sản phẩm liên quan
    const relatedGrid = document.getElementById('related-products-grid');
    if (relatedGrid && typeof PRODUCTS !== 'undefined') {
        const related = PRODUCTS.filter(p => !slug || p.slug !== slug).slice(0, 4);
        relatedGrid.innerHTML = related.map(p => createProductCardHtml(p, true)).join('');
    }
}
