
function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}
/**
 * MAIN INTERACTION & CLIENT-SIDE SPA ROUTER - TECHPULSE STORE (DEMO 1)
 * Chuyển trang mượt mà không load lại Header/Footer + Tự động tái kích hoạt dữ liệu trang.
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initApp();
    setupSPARouter();
    runPageSpecificScripts();
    refreshLucideIcons();
});

let cachedHeaderHtml = null;
let cachedFooterHtml = null;

// Tải components Header & Footer tự động từ thư mục components/
async function loadComponents() {
    const isSubdir = window.location.pathname.includes('/chitietsanpham/');
    const basePath = isSubdir ? '../components/' : 'components/';

    const headerContainer = document.getElementById('site-header-container');
    const footerContainer = document.getElementById('site-footer-container');

    // Luôn đảm bảo header container cố định trên cùng khi cuộn trang
    if (headerContainer) {
        headerContainer.classList.add('sticky', 'top-0', 'z-50', 'w-full');
    }

    // Nạp Header nếu container rỗng
    if (headerContainer && !headerContainer.hasChildNodes()) {
        if (!cachedHeaderHtml) {
            try {
                const res = await fetch(basePath + 'header.html?v=' + Date.now(), { cache: 'no-store' });
                if (res.ok) cachedHeaderHtml = await res.text();
            } catch (e) {
                console.warn("Lỗi tải component header:", e);
            }
        }
        if (cachedHeaderHtml) {
            headerContainer.innerHTML = cachedHeaderHtml;
        }
    }

    // Nạp Footer nếu container rỗng
    if (footerContainer && !footerContainer.hasChildNodes()) {
        if (!cachedFooterHtml) {
            try {
                const res = await fetch(basePath + 'footer.html?v=' + Date.now(), { cache: 'no-store' });
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

// Chuẩn hóa đường dẫn tương đối của các liên kết và hình ảnh trong component theo thư mục hiện tại
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

    const allImgs = document.querySelectorAll('#site-header-container img, #site-footer-container img');
    allImgs.forEach(img => {
        let src = img.getAttribute('src');
        if (!src || src.startsWith('http') || src.startsWith('data:')) return;
        let clean = src.replace(/^(\.\.\/)+/, '');
        if (isSubdir) {
            img.setAttribute('src', '../' + clean);
        } else {
            img.setAttribute('src', clean);
        }
    });
}

// Khởi tạo các tương tác dùng chung toàn trang
function initApp() {
    fixComponentLinks();
    refreshLucideIcons();
    setupMobileMenu();
    setupHeaderScroll();
    setupHeaderDropdowns();
    initSidebarMegaMenu();
    setupSearchForms();
    setupNewsletterForms();
    initFlashSaleCountdown();
    highlightActiveNav();
    if (typeof updateCartBadges === 'function') {
        updateCartBadges();
    }
    // Deduplicate floating actions and chat modals if injected from footer
    const floatingNodes = document.querySelectorAll('#floating-actions-container');
    if (floatingNodes.length > 1) {
        for (let i = 1; i < floatingNodes.length; i++) floatingNodes[i].remove();
    }
    const chatModalNodes = document.querySelectorAll('#ai-chat-modal');
    if (chatModalNodes.length > 1) {
        for (let i = 1; i < chatModalNodes.length; i++) chatModalNodes[i].remove();
    }
}

// 1. Mobile Menu Toggle
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

// 2. Header Scroll Shadow Effect
function setupHeaderScroll() {
    window.removeEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', handleHeaderScroll);
}

function handleHeaderScroll() {
    const header = document.getElementById('site-header');
    const container = document.getElementById('site-header-container');
    const backToTop = document.getElementById('back-to-top-btn');
    if (!header) return;

    if (window.scrollY > 15) {
        if (container) container.classList.add('shadow-xl');
        header.classList.add('shadow-lg');
    } else {
        if (container) container.classList.remove('shadow-xl');
        header.classList.remove('shadow-lg');
    }

    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.remove('hidden');
        } else {
            backToTop.classList.add('hidden');
        }
    }
}

// 2.1 CellphoneS Box-based Mega Menu Data & Rendering Engine
// Full CellphoneS Box-based Mega Menu Module

const MEGA_THUMB_SVGS = {
    // Laptop Usage Thumbnails
    'laptop-office': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#2563eb" stroke-width="1.6"/><path d="M1 18h22" stroke="#2563eb" stroke-width="1.6" stroke-linecap="round"/><path d="M7 8h6M7 11h10" stroke="#93c5fd" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    'laptop-gaming': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#dc2626" stroke-width="1.6"/><path d="M1 18h22" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/><path d="M8 10l2 2-2 2M16 10l-2 2 2 2" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'laptop-thin': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 17l16-9 4 1-16 9-4-1z" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 17l14-8" stroke="#34d399" stroke-width="1.4"/></svg>`,
    'laptop-graphic': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#7c3aed" stroke-width="1.6"/><path d="M1 18h22" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="10" r="3" stroke="#a78bfa" stroke-width="1.4"/></svg>`,
    'laptop-student': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#d97706" stroke-width="1.6"/><path d="M1 18h22" stroke="#d97706" stroke-width="1.6" stroke-linecap="round"/><path d="M12 7l4 2-4 2-4-2 4-2z" stroke="#fbbf24" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    'laptop-touch': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#0284c7" stroke-width="1.6"/><path d="M1 18h22" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round"/><path d="M12 9v4m-2-2h4" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'laptop-ai': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#d70018" stroke-width="1.6"/><path d="M1 18h22" stroke="#d70018" stroke-width="1.6" stroke-linecap="round"/><path d="M12 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#d70018"/></svg>`,
    'mac-cto': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C10.5 2 9.5 3 9.5 4.5c0 1.2.8 2.2 2 2.5 1.5.3 2.5-1 2.5-2.5C14 3.2 13.2 2 12 2z" fill="#475569"/><rect x="3" y="8" width="18" height="10" rx="1.5" stroke="#475569" stroke-width="1.6"/><path d="M1 20h22" stroke="#475569" stroke-width="1.6" stroke-linecap="round"/></svg>`,

    // Audio & Mic Thumbnails
    'audio-bluetooth': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="6" width="10" height="12" rx="3" stroke="#2563eb" stroke-width="1.6"/><path d="M10 6V4a2 2 0 0 1 4 0v2" stroke="#2563eb" stroke-width="1.5"/><circle cx="12" cy="12" r="1.5" fill="#3b82f6"/></svg>`,
    'audio-overear': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13v4a3 3 0 0 0 3 3h0a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3M21 13v4a3 3 0 0 1-3 3h0a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h3" stroke="#d70018" stroke-width="1.6"/><path d="M3 14V11a9 9 0 0 1 18 0v3" stroke="#d70018" stroke-width="1.6"/></svg>`,
    'audio-inear': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="10" r="4" stroke="#059669" stroke-width="1.6"/><path d="M8 14v6" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="10" r="4" stroke="#059669" stroke-width="1.6"/><path d="M16 14v6" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'audio-wired': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="8" r="3" stroke="#475569" stroke-width="1.6"/><path d="M9 11v4a3 3 0 0 0 6 0V5" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'audio-sport': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12a7 7 0 0 1 14 0" stroke="#ea580c" stroke-width="1.6" stroke-linecap="round"/><circle cx="5" cy="14" r="2.5" stroke="#ea580c" stroke-width="1.5"/><circle cx="19" cy="14" r="2.5" stroke="#ea580c" stroke-width="1.5"/></svg>`,
    'audio-gaming': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14V11a8 8 0 0 1 16 0v3" stroke="#7c3aed" stroke-width="1.6"/><rect x="2" y="13" width="4" height="6" rx="1.5" stroke="#7c3aed" stroke-width="1.5"/><rect x="18" y="13" width="4" height="6" rx="1.5" stroke="#7c3aed" stroke-width="1.5"/><path d="M6 18l5 2" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="#7c3aed"/></svg>`,
    'mic-clip': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="4" width="8" height="12" rx="3" stroke="#0284c7" stroke-width="1.6"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 18v3" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round"/><path d="M10 8h4" stroke="#38bdf8" stroke-width="1.4"/></svg>`,
    'mic-studio': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="3" width="8" height="10" rx="4" stroke="#d97706" stroke-width="1.6"/><path d="M5 9v1a7 7 0 0 0 14 0V9M12 17v4m-4 0h8" stroke="#d97706" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    'mic-live': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="6" height="11" rx="3" stroke="#d70018" stroke-width="1.6"/><path d="M6 10a6 6 0 0 0 12 0M12 16v5m-3 0h6" stroke="#d70018" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'mic-wireless': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 4l-3-3-3 3v4l3 3 3-3V4z" stroke="#475569" stroke-width="1.6" stroke-linejoin="round"/><path d="M10.5 9.5L6 18l3 3 8.5-4.5" stroke="#475569" stroke-width="1.5" stroke-linejoin="round"/></svg>`,

    // PC & Linh Kiện Thumbnails
    'pc-build': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#2563eb" stroke-width="1.6"/><circle cx="12" cy="8" r="2.5" stroke="#3b82f6" stroke-width="1.4"/><circle cx="12" cy="14" r="2.5" stroke="#3b82f6" stroke-width="1.4"/><path d="M8 18h8" stroke="#93c5fd" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    'pc-prebuilt': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="3" width="12" height="18" rx="2" stroke="#059669" stroke-width="1.6"/><line x1="9" y1="7" x2="15" y2="7" stroke="#34d399" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="1.5" fill="#059669"/></svg>`,
    'pc-aio': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#7c3aed" stroke-width="1.6"/><path d="M9 20h6M12 16v4" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    'pc-box': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="12" rx="2" stroke="#475569" stroke-width="1.6"/><circle cx="8" cy="12" r="1.5" fill="#475569"/><circle cx="12" cy="12" r="1.5" fill="#475569"/></svg>`,
    'pc-cpu': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="14" height="14" rx="2" stroke="#0284c7" stroke-width="1.6"/><rect x="8" y="8" width="8" height="8" rx="1" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.4"/><path d="M8 2v3M12 2v3M16 2v3M8 19v3M12 19v3M16 19v3M2 8h3M2 12h3M2 16h3M19 8h3M19 12h3M19 16h3" stroke="#0284c7" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    'pc-main': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#d97706" stroke-width="1.6"/><rect x="7" y="7" width="5" height="5" stroke="#d97706" stroke-width="1.4"/><path d="M15 7v10M7 15h5" stroke="#fbbf24" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    'pc-ram': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="18" height="8" rx="1" stroke="#059669" stroke-width="1.6"/><path d="M6 13h2M10 13h2M14 13h2M18 13h1" stroke="#34d399" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    'pc-storage': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="16" height="14" rx="2" stroke="#475569" stroke-width="1.6"/><circle cx="12" cy="12" r="3.5" stroke="#64748b" stroke-width="1.4"/><circle cx="12" cy="12" r="1" fill="#475569"/></svg>`,
    'pc-psu': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="16" height="14" rx="2" stroke="#dc2626" stroke-width="1.6"/><circle cx="11" cy="12" r="3.5" stroke="#f87171" stroke-width="1.4"/><path d="M17 9v6" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'pc-vga': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="10" rx="1.5" stroke="#7c3aed" stroke-width="1.6"/><circle cx="8" cy="12" r="2.5" stroke="#a78bfa" stroke-width="1.3"/><circle cx="14" cy="12" r="2.5" stroke="#a78bfa" stroke-width="1.3"/><path d="M2 10h1M2 14h1" stroke="#7c3aed" stroke-width="1.5"/></svg>`,
    'pc-cooler': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="#0284c7" stroke-width="1.6"/><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M6.3 17.7L17.7 6.3" stroke="#38bdf8" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    'pc-case': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#334155" stroke-width="1.6"/><path d="M8 7h8M8 11h8" stroke="#64748b" stroke-width="1.4" stroke-linecap="round"/></svg>`,

    // Monitor Thumbnails
    'monitor-gaming': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5c6-2 12-2 18 0v10c-6-2-12-2-18 0V5z" stroke="#dc2626" stroke-width="1.6"/><path d="M9 20h6M12 16v4" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    'monitor-office': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#2563eb" stroke-width="1.6"/><path d="M8 20h8M12 16v4" stroke="#2563eb" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    'monitor-graphic': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="#7c3aed" stroke-width="1.6"/><path d="M8 20h8M12 16v4" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="10" r="3" stroke="#a78bfa" stroke-width="1.3"/></svg>`,
    'monitor-code': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="3" width="12" height="16" rx="1.5" stroke="#059669" stroke-width="1.6"/><path d="M9 10l-1.5 1.5L9 13M15 10l1.5 1.5L15 13M8 21h8M12 19v2" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'monitor-portable': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="16" height="11" rx="1" stroke="#0284c7" stroke-width="1.6"/><path d="M3 18l18-1" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'monitor-arm': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20h4M7 20V12l6-4 4 3" stroke="#475569" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    // Gaming Gear & Office
    'gear-ps': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#2563eb" stroke-width="1.6"/><path d="M9 9h6M9 13h4" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'gear-rog': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="3" stroke="#dc2626" stroke-width="1.6"/><circle cx="7" cy="11" r="1.5" fill="#dc2626"/><circle cx="17" cy="13" r="1.5" fill="#dc2626"/><rect x="10" y="8" width="4" height="8" rx="1" fill="#fef2f2"/></svg>`,
    'gear-keyboard': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="2" stroke="#7c3aed" stroke-width="1.6"/><path d="M6 10h1M9 10h1M12 10h1M15 10h1M18 10h1M7 14h10" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'gear-mouse': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="4" width="10" height="16" rx="5" stroke="#059669" stroke-width="1.6"/><path d="M12 4v5" stroke="#059669" stroke-width="1.5"/></svg>`,
    'gear-gamepad': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 11H3a2 2 0 0 0-2 2v2a3 3 0 0 0 5 2l2-3h8l2 3a3 3 0 0 0 5-2v-2a2 2 0 0 0-2-2h-3" stroke="#d70018" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="12" r="1.5" fill="#d70018"/><circle cx="16" cy="12" r="1.5" fill="#d70018"/></svg>`,
    'office-printer': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9V4h12v5" stroke="#475569" stroke-width="1.5"/><rect x="3" y="9" width="18" height="9" rx="2" stroke="#475569" stroke-width="1.6"/><path d="M6 15v5h12v-5" stroke="#475569" stroke-width="1.5"/><circle cx="17" cy="12" r="1" fill="#475569"/></svg>`,
    'office-software': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#0284c7" stroke-width="1.6"/><path d="M8 8h8v8H8z" stroke="#38bdf8" stroke-width="1.4"/></svg>`,
    'office-tablet': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#d97706" stroke-width="1.6"/><path d="M17 19l4-9" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'office-calc': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#334155" stroke-width="1.6"/><rect x="7" y="6" width="10" height="3" rx="0.5" stroke="#64748b" stroke-width="1.2"/><path d="M8 12h1M11 12h1M15 12h1M8 15h1M11 15h1M15 15h1" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'office-decor': `<svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="15" width="18" height="4" rx="1" stroke="#7c3aed" stroke-width="1.6"/><path d="M5 15V8a2 2 0 0 1 2-2h3M12 15V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/></svg>`
};

const MEGA_MENU_DATA = {
    // 1. Điện thoại, Tablet (Ảnh 1)
    phone: {
        col1: [
            {
                title: "Hãng điện thoại",
                type: "brands",
                items: [
                    { name: "iPhone", logo: "apple", href: "sanpham.html?category=phone&brand=apple" },
                    { name: "SAMSUNG", href: "sanpham.html?category=phone&brand=samsung" },
                    { name: "oppo", href: "sanpham.html?category=phone&brand=oppo" },
                    { name: "xiaomi", href: "sanpham.html?category=phone&brand=xiaomi" },
                    { name: "TECNO", href: "sanpham.html?category=phone" },
                    { name: "HONOR", href: "sanpham.html?category=phone" },
                    { name: "nubia", href: "sanpham.html?category=phone" },
                    { name: "SONY", href: "sanpham.html?category=phone" },
                    { name: "NOKIA", href: "sanpham.html?category=phone" },
                    { name: "NOTHING", href: "sanpham.html?category=phone" },
                    { name: "Masstel", href: "sanpham.html?category=phone" },
                    { name: "HUAWEI", href: "sanpham.html?category=phone" },
                    { name: "MEIZU", href: "sanpham.html?category=phone" },
                    { name: "realme", href: "sanpham.html?category=phone" },
                    { name: "itel", href: "sanpham.html?category=phone" },
                    { name: "Infinix", href: "sanpham.html?category=phone" },
                    { name: "Điện thoại phổ thông", href: "sanpham.html?category=phone", span: 2 }
                ]
            },
            {
                title: "Mức giá điện thoại",
                type: "prices",
                items: [
                    { name: "Dưới 2 triệu", href: "sanpham.html?category=phone&maxPrice=2000000" },
                    { name: "Từ 2 - 4 triệu", href: "sanpham.html?category=phone&minPrice=2000000&maxPrice=4000000" },
                    { name: "Từ 4 - 7 triệu", href: "sanpham.html?category=phone&minPrice=4000000&maxPrice=7000000" },
                    { name: "Từ 7 - 13 triệu", href: "sanpham.html?category=phone&minPrice=7000000&maxPrice=13000000" },
                    { name: "Từ 13 - 20 triệu", href: "sanpham.html?category=phone&minPrice=13000000&maxPrice=20000000" },
                    { name: "Trên 20 triệu", href: "sanpham.html?category=phone&minPrice=20000000" }
                ]
            }
        ],
        col2: [
            {
                title: "Điện thoại HOT",
                type: "chips",
                items: [
                    { name: "iPhone 18 Pro Max", href: "sanpham.html?category=phone" },
                    { name: "iPhone 18 Pro", href: "sanpham.html?category=phone" },
                    { name: "iPhone 18 series", href: "sanpham.html?category=phone" },
                    { name: "iPhone Duo", href: "sanpham.html?category=phone" },
                    { name: "iPhone 17 Pro Max", href: "sanpham.html?category=phone" },
                    { name: "iPhone Air", href: "sanpham.html?category=phone" },
                    { name: "Samsung Galaxy S26 Series", href: "sanpham.html?category=phone", badge: "Hot" },
                    { name: "Samsung Galaxy Z8 Series", href: "sanpham.html?category=phone", badge: "Hot" },
                    { name: "OPPO Find X10", href: "sanpham.html?category=phone", badge: "Mới" },
                    { name: "Redmi Note 17", href: "sanpham.html?category=phone" },
                    { name: "Xiaomi 17T", href: "sanpham.html?category=phone" },
                    { name: "HONOR 600 5G", href: "sanpham.html?category=phone" },
                    { name: "TECNO Pova Curve 2", href: "sanpham.html?category=phone" },
                    { name: "Nubia Neo 5 5G", href: "sanpham.html?category=phone" },
                    { name: "Xiaomi POCO F9 Ultra", href: "sanpham.html?category=phone" },
                    { name: "Sony Xperia 1 VIII", href: "sanpham.html?category=phone" }
                ]
            }
        ],
        col3: [
            {
                title: "Hãng máy tính bảng",
                type: "brands",
                items: [
                    { name: "iPad", logo: "apple", href: "sanpham.html?category=tablet" },
                    { name: "SAMSUNG", href: "sanpham.html?category=tablet" },
                    { name: "xiaomi", href: "sanpham.html?category=tablet" },
                    { name: "HUAWEI", href: "sanpham.html?category=tablet" },
                    { name: "Lenovo", href: "sanpham.html?category=tablet" },
                    { name: "TECLAST", href: "sanpham.html?category=tablet" },
                    { name: "nubia", href: "sanpham.html?category=tablet" },
                    { name: "HONOR", href: "sanpham.html?category=tablet" },
                    { name: "oppo", href: "sanpham.html?category=tablet" },
                    { name: "Máy đọc sách", href: "sanpham.html?category=tablet" },
                    { name: "Kindle", href: "sanpham.html?category=tablet" },
                    { name: "BOOX", href: "sanpham.html?category=tablet" },
                    { name: "Xem thêm tất cả Tablet", href: "sanpham.html?category=tablet", span: 3, isAll: true }
                ]
            },
            {
                title: "Máy tính bảng HOT",
                type: "chips",
                items: [
                    { name: "iPad Pro M5", href: "sanpham.html?category=tablet" },
                    { name: "iPad Air M4", href: "sanpham.html?category=tablet" },
                    { name: "iPad A16", href: "sanpham.html?category=tablet" },
                    { name: "iPad mini 8", href: "sanpham.html?category=tablet", badge: "Mới" },
                    { name: "Galaxy Tab S12 Series", href: "sanpham.html?category=tablet", badge: "Hot" },
                    { name: "Galaxy Tab S11 Series", href: "sanpham.html?category=tablet", badge: "Hot" },
                    { name: "Lenovo Legion Tab Gen 5", href: "sanpham.html?category=tablet", span: 2 }
                ]
            }
        ]
    },

    // 2. Laptop (Ảnh 2)
    laptop: {
        col1: [
            {
                title: "Thương hiệu",
                type: "brands",
                items: [
                    { name: "MacBook", logo: "apple", href: "sanpham.html?category=laptop&brand=apple" },
                    { name: "ASUS", href: "sanpham.html?category=laptop&brand=asus" },
                    { name: "Lenovo", href: "sanpham.html?category=laptop&brand=lenovo" },
                    { name: "DELL", href: "sanpham.html?category=laptop&brand=dell" },
                    { name: "hp", href: "sanpham.html?category=laptop&brand=hp" },
                    { name: "acer", href: "sanpham.html?category=laptop&brand=acer" },
                    { name: "LG", href: "sanpham.html?category=laptop" },
                    { name: "msi", href: "sanpham.html?category=laptop" },
                    { name: "GIGABYTE", href: "sanpham.html?category=laptop" },
                    { name: "Microsoft Surface", href: "sanpham.html?category=laptop", span: 2 },
                    { name: "COLORFUL", href: "sanpham.html?category=laptop" },
                    { name: "THUNDEROBOT", href: "sanpham.html?category=laptop", span: 2 }
                ]
            },
            {
                title: "Phân khúc giá",
                type: "prices",
                items: [
                    { name: "Dưới 10 triệu", href: "sanpham.html?category=laptop&maxPrice=10000000" },
                    { name: "Từ 10 - 15 triệu", href: "sanpham.html?category=laptop&minPrice=10000000&maxPrice=15000000" },
                    { name: "Từ 15 - 20 triệu", href: "sanpham.html?category=laptop&minPrice=15000000&maxPrice=20000000" },
                    { name: "Từ 20 - 25 triệu", href: "sanpham.html?category=laptop&minPrice=20000000&maxPrice=25000000" },
                    { name: "Từ 25 - 30 triệu", href: "sanpham.html?category=laptop&minPrice=25000000&maxPrice=30000000" },
                    { name: "Trên 30 triệu", href: "sanpham.html?category=laptop&minPrice=30000000" }
                ]
            }
        ],
        col2: [
            {
                title: "Nhu cầu sử dụng",
                type: "cards",
                items: [
                    { name: "Văn phòng", thumb: "laptop-office", href: "sanpham.html?category=laptop" },
                    { name: "Gaming", thumb: "laptop-gaming", href: "sanpham.html?category=laptop" },
                    { name: "Mỏng nhẹ", thumb: "laptop-thin", href: "sanpham.html?category=laptop" },
                    { name: "Đồ họa - kỹ thuật", thumb: "laptop-graphic", href: "sanpham.html?category=laptop" },
                    { name: "Sinh viên", thumb: "laptop-student", href: "sanpham.html?category=laptop" },
                    { name: "Cảm ứng", thumb: "laptop-touch", href: "sanpham.html?category=laptop" },
                    { name: "Laptop AI", thumb: "laptop-ai", href: "sanpham.html?category=laptop", badge: "Hot", span: 2 },
                    { name: "Mac CTO - Nâng cấp theo cách của bạn", thumb: "mac-cto", href: "sanpham.html?category=laptop", span: 2 }
                ]
            }
        ],
        col3: [
            {
                title: "Dòng chip",
                type: "chips",
                items: [
                    { name: "Laptop Core i3", href: "sanpham.html?category=laptop" },
                    { name: "Laptop Core i5", href: "sanpham.html?category=laptop" },
                    { name: "Laptop Core i7", href: "sanpham.html?category=laptop" },
                    { name: "Laptop Core i9", href: "sanpham.html?category=laptop" },
                    { name: "Laptop Core U5", href: "sanpham.html?category=laptop" },
                    { name: "Laptop Core U7", href: "sanpham.html?category=laptop" },
                    { name: "Laptop Core U9", href: "sanpham.html?category=laptop" },
                    { name: "Apple M4 Series", href: "sanpham.html?category=laptop" },
                    { name: "Apple M5 Series", href: "sanpham.html?category=laptop" },
                    { name: "Apple M6 Series", href: "sanpham.html?category=laptop", badge: "Mới" },
                    { name: "A18 Pro", href: "sanpham.html?category=laptop", badge: "Mới" },
                    { name: "AMD Ryzen", href: "sanpham.html?category=laptop" },
                    { name: "Intel Core Ultra", href: "sanpham.html?category=laptop", badge: "Hot", span: 2 }
                ]
            },
            {
                title: "Kích thước màn hình",
                type: "chips",
                items: [
                    { name: "Laptop 13 inch", href: "sanpham.html?category=laptop" },
                    { name: "Laptop 14 inch", href: "sanpham.html?category=laptop" },
                    { name: "Laptop 15.6 inch", href: "sanpham.html?category=laptop" },
                    { name: "Laptop 16 inch", href: "sanpham.html?category=laptop" }
                ]
            }
        ]
    },

    // 3. Âm thanh, Mic thu âm (Ảnh 3)
    audio: {
        col1: [
            {
                title: "Chọn loại tai nghe",
                type: "cards",
                items: [
                    { name: "Bluetooth", thumb: "audio-bluetooth", href: "sanpham.html?category=accessory" },
                    { name: "Chụp tai", thumb: "audio-overear", href: "sanpham.html?category=accessory" },
                    { name: "Nhét tai", thumb: "audio-inear", href: "sanpham.html?category=accessory" },
                    { name: "Có dây", thumb: "audio-wired", href: "sanpham.html?category=accessory" },
                    { name: "Thể thao", thumb: "audio-sport", href: "sanpham.html?category=accessory" },
                    { name: "Gaming", thumb: "audio-gaming", href: "sanpham.html?category=accessory" }
                ],
                viewAll: { name: "Xem tất cả tai nghe", href: "sanpham.html?category=accessory" }
            },
            {
                title: "Mic",
                type: "cards",
                items: [
                    { name: "Mic cài áo", thumb: "mic-clip", href: "sanpham.html?category=accessory" },
                    { name: "Mic phòng thu, podcast", thumb: "mic-studio", href: "sanpham.html?category=accessory" },
                    { name: "Mic livestream", thumb: "mic-live", href: "sanpham.html?category=accessory" },
                    { name: "Micro không dây", thumb: "mic-wireless", href: "sanpham.html?category=accessory" }
                ]
            }
        ],
        col2: [
            {
                title: "Hãng tai nghe",
                type: "brands",
                items: [
                    { name: "AirPods", logo: "apple", href: "sanpham.html?category=accessory" },
                    { name: "SONY", href: "sanpham.html?category=accessory", badge: "Hot" },
                    { name: "JBL", href: "sanpham.html?category=accessory", badge: "Hot" },
                    { name: "SAMSUNG", href: "sanpham.html?category=accessory" },
                    { name: "Marshall", href: "sanpham.html?category=accessory" },
                    { name: "BOSE", href: "sanpham.html?category=accessory" },
                    { name: "ANKER", href: "sanpham.html?category=accessory" },
                    { name: "SENNHEISER", href: "sanpham.html?category=accessory" },
                    { name: "HUAWEI", href: "sanpham.html?category=accessory" },
                    { name: "xiaomi", href: "sanpham.html?category=accessory" },
                    { name: "HYPERX", href: "sanpham.html?category=accessory" },
                    { name: "ASUS", href: "sanpham.html?category=accessory" },
                    { name: "ALPHA WORKS", href: "sanpham.html?category=accessory" },
                    { name: "SHOKZ", href: "sanpham.html?category=accessory" },
                    { name: "baseus", href: "sanpham.html?category=accessory" },
                    { name: "HAVIT", href: "sanpham.html?category=accessory" }
                ]
            },
            {
                title: "Chọn theo giá",
                type: "prices",
                items: [
                    { name: "Tai nghe dưới 200K", href: "sanpham.html?category=accessory&maxPrice=200000" },
                    { name: "Tai nghe dưới 500K", href: "sanpham.html?category=accessory&maxPrice=500000" },
                    { name: "Tai nghe dưới 1 triệu", href: "sanpham.html?category=accessory&maxPrice=1000000" },
                    { name: "Tai nghe dưới 2 triệu", href: "sanpham.html?category=accessory&maxPrice=2000000" },
                    { name: "Tai nghe dưới 5 triệu", href: "sanpham.html?category=accessory&maxPrice=5000000" },
                    { name: "Trên 5 triệu", href: "sanpham.html?category=accessory&minPrice=5000000" }
                ]
            }
        ],
        col3: [
            {
                title: "Hãng loa",
                type: "brands",
                items: [
                    { name: "JBL", href: "sanpham.html?category=accessory", badge: "Hot" },
                    { name: "Marshall", href: "sanpham.html?category=accessory" },
                    { name: "harman/kardon", href: "sanpham.html?category=accessory" },
                    { name: "ACNOS", href: "sanpham.html?category=accessory" },
                    { name: "SAMSUNG", href: "sanpham.html?category=accessory" },
                    { name: "SONY", href: "sanpham.html?category=accessory" },
                    { name: "Arirang", href: "sanpham.html?category=accessory" },
                    { name: "ASTARGO", href: "sanpham.html?category=accessory" },
                    { name: "EDIFIER", href: "sanpham.html?category=accessory" },
                    { name: "BOSE", href: "sanpham.html?category=accessory" },
                    { name: "Tronsmart", href: "sanpham.html?category=accessory" },
                    { name: "ALPHA WORKS", href: "sanpham.html?category=accessory" }
                ]
            },
            {
                title: "Sản phẩm nổi bật",
                type: "chips",
                items: [
                    { name: "AirPods 5", href: "sanpham.html?category=accessory", badge: "Mới" },
                    { name: "AirPods Pro 3", href: "sanpham.html?category=accessory" },
                    { name: "AirPods 4", href: "sanpham.html?category=accessory" },
                    { name: "AirPods Max 2", href: "sanpham.html?category=accessory", badge: "Mới" },
                    { name: "Soundcore Liberty 5 Pro", href: "sanpham.html?category=accessory", span: 2 },
                    { name: "Soundcore Liberty 5 Pro Max", href: "sanpham.html?category=accessory", span: 2 },
                    { name: "Sony WF-1000XM6", href: "sanpham.html?category=accessory", badge: "Mới" },
                    { name: "Redmi Buds 8 Active", href: "sanpham.html?category=accessory" },
                    { name: "Huawei Freebuds Pro 5 (ANC)", href: "sanpham.html?category=accessory", badge: "Hot", span: 2 }
                ]
            }
        ]
    },

    // 4. PC, Màn hình, Máy in (Ảnh 4)
    pc: {
        col1: [
            {
                title: "Loại PC",
                type: "cards",
                items: [
                    { name: "Build PC", thumb: "pc-build", href: "sanpham.html?category=laptop" },
                    { name: "Cấu hình sẵn", thumb: "pc-prebuilt", href: "sanpham.html?category=laptop" },
                    { name: "All In One", thumb: "pc-aio", href: "sanpham.html?category=laptop" },
                    { name: "PC bộ", thumb: "pc-box", href: "sanpham.html?category=laptop" }
                ]
            },
            {
                title: "Chọn PC theo nhu cầu",
                type: "cards",
                items: [
                    { name: "Gaming", thumb: "laptop-gaming", href: "sanpham.html?category=laptop" },
                    { name: "Đồ họa", thumb: "laptop-graphic", href: "sanpham.html?category=laptop" },
                    { name: "Văn phòng", thumb: "laptop-office", href: "sanpham.html?category=laptop", span: 2 }
                ]
            },
            {
                title: "Linh kiện máy tính",
                type: "cards",
                items: [
                    { name: "CPU", thumb: "pc-cpu", href: "sanpham.html?category=laptop" },
                    { name: "Main", thumb: "pc-main", href: "sanpham.html?category=laptop" },
                    { name: "RAM", thumb: "pc-ram", href: "sanpham.html?category=laptop" },
                    { name: "Ổ cứng", thumb: "pc-storage", href: "sanpham.html?category=laptop" },
                    { name: "Nguồn", thumb: "pc-psu", href: "sanpham.html?category=laptop" },
                    { name: "VGA", thumb: "pc-vga", href: "sanpham.html?category=laptop" },
                    { name: "Tản nhiệt", thumb: "pc-cooler", href: "sanpham.html?category=laptop" },
                    { name: "Case", thumb: "pc-case", href: "sanpham.html?category=laptop" }
                ],
                viewAll: { name: "Xem tất cả linh kiện", href: "sanpham.html?category=laptop" }
            }
        ],
        col2: [
            {
                title: "Chọn màn hình theo hãng",
                type: "brands",
                items: [
                    { name: "ASUS", href: "sanpham.html?category=laptop" },
                    { name: "SAMSUNG", href: "sanpham.html?category=laptop" },
                    { name: "DELL", href: "sanpham.html?category=laptop" },
                    { name: "LG", href: "sanpham.html?category=laptop" },
                    { name: "msi", href: "sanpham.html?category=laptop" },
                    { name: "acer", href: "sanpham.html?category=laptop" },
                    { name: "xiaomi", href: "sanpham.html?category=laptop" },
                    { name: "ViewSonic", href: "sanpham.html?category=laptop" },
                    { name: "PHILIPS", href: "sanpham.html?category=laptop" },
                    { name: "AOC", href: "sanpham.html?category=laptop" },
                    { name: "dahua", href: "sanpham.html?category=laptop" },
                    { name: "VSP", href: "sanpham.html?category=laptop" }
                ]
            },
            {
                title: "Chọn màn hình theo nhu cầu",
                type: "cards",
                items: [
                    { name: "Gaming", thumb: "monitor-gaming", href: "sanpham.html?category=laptop" },
                    { name: "Văn phòng", thumb: "monitor-office", href: "sanpham.html?category=laptop" },
                    { name: "Đồ họa", thumb: "monitor-graphic", href: "sanpham.html?category=laptop" },
                    { name: "Lập trình", thumb: "monitor-code", href: "sanpham.html?category=laptop" },
                    { name: "Màn hình di động", thumb: "monitor-portable", href: "sanpham.html?category=laptop" },
                    { name: "Arm màn hình", thumb: "monitor-arm", href: "sanpham.html?category=laptop" }
                ],
                viewAll: { name: "Xem tất cả màn hình", href: "sanpham.html?category=laptop" }
            }
        ],
        col3: [
            {
                title: "Gaming Gear",
                type: "cards",
                items: [
                    { name: "PlayStation", thumb: "gear-ps", href: "sanpham.html?category=laptop" },
                    { name: "ROG Ally", thumb: "gear-rog", href: "sanpham.html?category=laptop" },
                    { name: "Bàn phím Gaming", thumb: "gear-keyboard", href: "sanpham.html?category=laptop" },
                    { name: "Chuột chơi game", thumb: "gear-mouse", href: "sanpham.html?category=laptop" },
                    { name: "Tai nghe Gaming", thumb: "audio-gaming", href: "sanpham.html?category=laptop" },
                    { name: "Tay cầm chơi Game", thumb: "gear-gamepad", href: "sanpham.html?category=laptop" }
                ],
                viewAll: { name: "Xem tất cả Gaming Gear", href: "sanpham.html?category=laptop" }
            },
            {
                title: "Thiết bị văn phòng",
                type: "cards",
                items: [
                    { name: "Máy in", thumb: "office-printer", href: "sanpham.html?category=laptop" },
                    { name: "Phần mềm", thumb: "office-software", href: "sanpham.html?category=laptop" },
                    { name: "Bảng vẽ điện tử", thumb: "office-tablet", href: "sanpham.html?category=laptop" },
                    { name: "Máy tính Casio", thumb: "office-calc", href: "sanpham.html?category=laptop" },
                    { name: "Decor bàn làm việc", thumb: "office-decor", href: "sanpham.html?category=laptop", span: 2 }
                ]
            }
        ]
    },

    // 5. Tivi, Điện máy / Gia dụng (Ảnh 5)
    smarthome: {
        col1: [
            {
                title: "Chọn hãng tivi",
                type: "brands",
                items: [
                    { name: "SAMSUNG", href: "sanpham.html" },
                    { name: "LG", href: "sanpham.html" },
                    { name: "xiaomi", href: "sanpham.html" },
                    { name: "coocaa", href: "sanpham.html" },
                    { name: "SONY", href: "sanpham.html" },
                    { name: "TCL", href: "sanpham.html" },
                    { name: "VSP", href: "sanpham.html" },
                    { name: "AQUA", href: "sanpham.html" },
                    { name: "Xem tất cả tivi", href: "sanpham.html", span: 1, isAll: true }
                ]
            },
            {
                title: "Chọn hãng tủ lạnh",
                type: "brands",
                items: [
                    { name: "LG", href: "sanpham.html" },
                    { name: "SAMSUNG", href: "sanpham.html" },
                    { name: "xiaomi", href: "sanpham.html" },
                    { name: "Panasonic", href: "sanpham.html" },
                    { name: "AQUA", href: "sanpham.html" },
                    { name: "TOSHIBA", href: "sanpham.html" },
                    { name: "Xem tất cả tủ lạnh", href: "sanpham.html", span: 3, isAll: true }
                ]
            },
            {
                title: "Chọn hãng tủ đông",
                type: "brands",
                items: [
                    { name: "TOSHIBA", href: "sanpham.html" },
                    { name: "Xem tất cả tủ đông", href: "sanpham.html", span: 2, isAll: true }
                ]
            }
        ],
        col2: [
            {
                title: "Chọn hãng máy giặt",
                type: "brands",
                items: [
                    { name: "LG", href: "sanpham.html" },
                    { name: "SAMSUNG", href: "sanpham.html" },
                    { name: "xiaomi", href: "sanpham.html" },
                    { name: "Panasonic", href: "sanpham.html" },
                    { name: "AQUA", href: "sanpham.html" },
                    { name: "TOSHIBA", href: "sanpham.html" },
                    { name: "Xem tất cả máy giặt", href: "sanpham.html", span: 3, isAll: true }
                ]
            },
            {
                title: "Chọn hãng máy sấy",
                type: "brands",
                items: [
                    { name: "LG", href: "sanpham.html" },
                    { name: "SAMSUNG", href: "sanpham.html" },
                    { name: "Panasonic", href: "sanpham.html" },
                    { name: "AQUA", href: "sanpham.html" },
                    { name: "TOSHIBA", href: "sanpham.html" },
                    { name: "Xem tất cả máy sấy", href: "sanpham.html", span: 3, isAll: true }
                ]
            },
            {
                title: "Chọn hãng máy rửa chén bát",
                type: "brands",
                items: [
                    { name: "BOSCH", href: "sanpham.html" },
                    { name: "Xem tất cả máy rửa chén", href: "sanpham.html", span: 2, isAll: true }
                ]
            }
        ],
        col3: [
            {
                title: "Chọn hãng máy lọc nước",
                type: "brands",
                items: [
                    { name: "KAROFI", href: "sanpham.html", badge: "Mới" },
                    { name: "LIVOTEC", href: "sanpham.html" },
                    { name: "Xem tất cả máy lọc", href: "sanpham.html", span: 3, isAll: true }
                ]
            },
            {
                title: "Chọn hãng máy lạnh",
                type: "brands",
                items: [
                    { name: "Panasonic", href: "sanpham.html" },
                    { name: "DAIKIN", href: "sanpham.html" },
                    { name: "SHARP", href: "sanpham.html" },
                    { name: "LG", href: "sanpham.html" },
                    { name: "AQUA", href: "sanpham.html" },
                    { name: "SAMSUNG", href: "sanpham.html" },
                    { name: "Casper", href: "sanpham.html" },
                    { name: "TCL", href: "sanpham.html" },
                    { name: "HITACHI", href: "sanpham.html" },
                    { name: "xiaomi", href: "sanpham.html" },
                    { name: "Xem tất cả máy lạnh", href: "sanpham.html", span: 2, isAll: true }
                ]
            }
        ]
    },

    // 6. Đồng hồ, Camera
    watch: {
        col1: [
            {
                title: "Hãng đồng hồ thông minh",
                type: "brands",
                items: [
                    { name: "Apple Watch", logo: "apple", href: "sanpham.html?category=smartwatch" },
                    { name: "SAMSUNG", href: "sanpham.html?category=smartwatch" },
                    { name: "Garmin", href: "sanpham.html?category=smartwatch", badge: "Hot" },
                    { name: "xiaomi", href: "sanpham.html?category=smartwatch" },
                    { name: "HUAWEI", href: "sanpham.html?category=smartwatch" },
                    { name: "Amazfit", href: "sanpham.html?category=smartwatch" },
                    { name: "Soundpeats", href: "sanpham.html?category=smartwatch" },
                    { name: "Kospet", href: "sanpham.html?category=smartwatch" },
                    { name: "Masstel", href: "sanpham.html?category=smartwatch" }
                ]
            },
            {
                title: "Đồng hồ theo nhu cầu",
                type: "cards",
                items: [
                    { name: "Thể thao chuyên nghiệp", thumb: "audio-sport", href: "sanpham.html?category=smartwatch" },
                    { name: "Đo nhịp tim, SpO2", thumb: "laptop-touch", href: "sanpham.html?category=smartwatch" },
                    { name: "Nghe gọi trên đồng hồ", thumb: "mic-clip", href: "sanpham.html?category=smartwatch" },
                    { name: "Trẻ em định vị", thumb: "gear-rog", href: "sanpham.html?category=smartwatch" }
                ]
            }
        ],
        col2: [
            {
                title: "Đồng hồ HOT",
                type: "chips",
                items: [
                    { name: "Apple Watch Ultra 2", href: "sanpham.html?category=smartwatch", badge: "Hot" },
                    { name: "Apple Watch Series 9", href: "sanpham.html?category=smartwatch" },
                    { name: "Galaxy Watch6 Classic", href: "sanpham.html?category=smartwatch" },
                    { name: "Garmin Fenix 7 Pro", href: "sanpham.html?category=smartwatch" },
                    { name: "Huawei Watch GT4", href: "sanpham.html?category=smartwatch", badge: "Hot" },
                    { name: "Amazfit Cheetah Pro", href: "sanpham.html?category=smartwatch" },
                    { name: "Xiaomi Band 8 Pro", href: "sanpham.html?category=smartwatch", span: 2 }
                ]
            },
            {
                title: "Mức giá đồng hồ",
                type: "prices",
                items: [
                    { name: "Dưới 1 triệu", href: "sanpham.html?category=smartwatch&maxPrice=1000000" },
                    { name: "Từ 1 - 3 triệu", href: "sanpham.html?category=smartwatch&minPrice=1000000&maxPrice=3000000" },
                    { name: "Từ 3 - 6 triệu", href: "sanpham.html?category=smartwatch&minPrice=3000000&maxPrice=6000000" },
                    { name: "Từ 6 - 10 triệu", href: "sanpham.html?category=smartwatch&minPrice=6000000&maxPrice=10000000" },
                    { name: "Trên 10 triệu", href: "sanpham.html?category=smartwatch&minPrice=10000000", span: 2 }
                ]
            }
        ],
        col3: [
            {
                title: "Camera & Flycam",
                type: "cards",
                items: [
                    { name: "Camera trong nhà 360", thumb: "office-software", href: "sanpham.html" },
                    { name: "Camera ngoài trời chống nước", thumb: "office-decor", href: "sanpham.html" },
                    { name: "Camera hành trình 4K", thumb: "gear-ps", href: "sanpham.html" },
                    { name: "Flycam & Gimbal", thumb: "gear-keyboard", href: "sanpham.html" }
                ]
            },
            {
                title: "Thương hiệu Camera",
                type: "brands",
                items: [
                    { name: "EZVIZ", href: "sanpham.html" },
                    { name: "IMOU", href: "sanpham.html" },
                    { name: "TP-Link", href: "sanpham.html" },
                    { name: "Xiaomi", href: "sanpham.html" },
                    { name: "70mai", href: "sanpham.html" },
                    { name: "DJI", href: "sanpham.html", badge: "Hot" }
                ]
            }
        ]
    },

    // 7. Phụ kiện, Cáp sạc
    accessory: {
        col1: [
            {
                title: "Phụ kiện sạc & Cáp",
                type: "cards",
                items: [
                    { name: "Củ sạc nhanh GaN", thumb: "laptop-touch", href: "sanpham.html?category=accessory" },
                    { name: "Cáp sạc Type-C / Lightning", thumb: "audio-wired", href: "sanpham.html?category=accessory" },
                    { name: "Pin sạc dự phòng", thumb: "pc-box", href: "sanpham.html?category=accessory" },
                    { name: "Sạc không dây MagSafe", thumb: "audio-bluetooth", href: "sanpham.html?category=accessory" }
                ]
            },
            {
                title: "Thương hiệu phụ kiện",
                type: "brands",
                items: [
                    { name: "Anker", href: "sanpham.html?category=accessory", badge: "Hot" },
                    { name: "Baseus", href: "sanpham.html?category=accessory" },
                    { name: "Ugreen", href: "sanpham.html?category=accessory", badge: "Hot" },
                    { name: "Aukey", href: "sanpham.html?category=accessory" },
                    { name: "Belkin", href: "sanpham.html?category=accessory" },
                    { name: "Innostyle", href: "sanpham.html?category=accessory" }
                ]
            }
        ],
        col2: [
            {
                title: "Bảo vệ & Thời trang",
                type: "cards",
                items: [
                    { name: "Ốp lưng iPhone / Samsung", thumb: "pc-case", href: "sanpham.html?category=accessory" },
                    { name: "Kính cường lực chống nhìn trộm", thumb: "monitor-portable", href: "sanpham.html?category=accessory" },
                    { name: "Balo & Túi chống sốc", thumb: "laptop-thin", href: "sanpham.html?category=accessory" },
                    { name: "Dây đeo Apple Watch", thumb: "gear-rog", href: "sanpham.html?category=accessory" }
                ]
            },
            {
                title: "Phụ kiện máy tính",
                type: "cards",
                items: [
                    { name: "Chuột không dây Silent", thumb: "gear-mouse", href: "sanpham.html?category=accessory" },
                    { name: "Bàn phím cơ Bluetooth", thumb: "gear-keyboard", href: "sanpham.html?category=accessory" },
                    { name: "Hub chuyển đổi 8 in 1", thumb: "pc-main", href: "sanpham.html?category=accessory" },
                    { name: "Giá đỡ tản nhiệt nhôm", thumb: "monitor-arm", href: "sanpham.html?category=accessory" }
                ]
            }
        ],
        col3: [
            {
                title: "Phụ kiện HOT",
                type: "chips",
                items: [
                    { name: "Củ sạc Anker 65W GaN", href: "sanpham.html?category=accessory", badge: "Hot" },
                    { name: "Cáp Ugreen 100W dù", href: "sanpham.html?category=accessory" },
                    { name: "Pin dự phòng 20000mAh", href: "sanpham.html?category=accessory" },
                    { name: "Ốp lưng UAG chuẩn quân đội", href: "sanpham.html?category=accessory" },
                    { name: "Chuột Logitech MX Master 3S", href: "sanpham.html?category=accessory", badge: "Hot", span: 2 },
                    { name: "Bàn phím cơ Aula F75 Pro", href: "sanpham.html?category=accessory", span: 2 }
                ]
            },
            {
                title: "Mức giá phụ kiện",
                type: "prices",
                items: [
                    { name: "Dưới 200K", href: "sanpham.html?category=accessory&maxPrice=200000" },
                    { name: "Từ 200K - 500K", href: "sanpham.html?category=accessory&minPrice=200000&maxPrice=500000" },
                    { name: "Từ 500K - 1 triệu", href: "sanpham.html?category=accessory&minPrice=500000&maxPrice=1000000" },
                    { name: "Trên 1 triệu", href: "sanpham.html?category=accessory&minPrice=1000000", span: 3 }
                ]
            }
        ]
    },

    // 8. Thu cũ đổi mới
    tradein: {
        col1: [
            {
                title: "Thu cũ đổi mới điện thoại",
                type: "chips",
                items: [
                    { name: "Thu cũ lên đời iPhone 16 Pro Max", href: "sanpham.html", badge: "Hot", span: 2 },
                    { name: "Thu cũ lên đời Galaxy S24 Ultra", href: "sanpham.html", badge: "Hot", span: 2 },
                    { name: "Thu cũ Xiaomi lên đời", href: "sanpham.html" },
                    { name: "Thu cũ OPPO / vivo", href: "sanpham.html" }
                ]
            },
            {
                title: "Quy trình 3 bước siêu tốc",
                type: "cards",
                items: [
                    { name: "Định giá online 30 giây", thumb: "office-calc", href: "sanpham.html" },
                    { name: "Kiểm tra máy tận nơi", thumb: "laptop-office", href: "sanpham.html" },
                    { name: "Lên đời trợ giá 3 triệu", thumb: "laptop-ai", href: "sanpham.html", badge: "Hot", span: 2 }
                ]
            }
        ],
        col2: [
            {
                title: "Thu cũ Laptop & Tablet",
                type: "chips",
                items: [
                    { name: "Thu cũ MacBook trợ giá 4 triệu", href: "sanpham.html", badge: "Hot", span: 2 },
                    { name: "Thu cũ iPad lên đời iPad Pro M4", href: "sanpham.html", span: 2 },
                    { name: "Thu cũ Laptop Gaming trợ giá 3.5 triệu", href: "sanpham.html", span: 2 }
                ]
            }
        ],
        col3: [
            {
                title: "Bảng giá thu cũ tham khảo",
                type: "prices",
                items: [
                    { name: "iPhone 14 Pro Max thu 18.5Tr", href: "sanpham.html" },
                    { name: "iPhone 13 Pro Max thu 13.2Tr", href: "sanpham.html" },
                    { name: "Galaxy S23 Ultra thu 14.8Tr", href: "sanpham.html" },
                    { name: "MacBook Air M1 thu 11.5Tr", href: "sanpham.html" }
                ]
            }
        ]
    },

    // 9. Khuyến Mãi Hot Deal
    promotions: {
        col1: [
            {
                title: "Khung giờ Flash Sale",
                type: "chips",
                items: [
                    { name: "9H - 11H: Săn Deal 1K", href: "khuyenmai.html", badge: "Hot", span: 2 },
                    { name: "14H - 16H: Phụ kiện giảm 70%", href: "khuyenmai.html", span: 2 },
                    { name: "20H - 22H: Flagship giảm 5 triệu", href: "khuyenmai.html", badge: "Hot", span: 2 }
                ]
            }
        ],
        col2: [
            {
                title: "Chương trình ưu đãi",
                type: "chips",
                items: [
                    { name: "Trợ giá lên đời đến 3 triệu", href: "khuyenmai.html", badge: "Hot", span: 2 },
                    { name: "Ưu đãi Học sinh - Sinh viên 5%", href: "khuyenmai.html", span: 2 },
                    { name: "Trả góp 0% 3 Không", href: "khuyenmai.html", badge: "Hot", span: 2 },
                    { name: "Thành viên Smember tích điểm 5%", href: "khuyenmai.html", span: 2 }
                ]
            }
        ],
        col3: [
            {
                title: "Deal hot theo ngành hàng",
                type: "chips",
                items: [
                    { name: "Điện thoại giảm sâu", href: "khuyenmai.html" },
                    { name: "Laptop tựu trường", href: "khuyenmai.html" },
                    { name: "Phụ kiện mua 1 tặng 1", href: "khuyenmai.html", badge: "Hot" },
                    { name: "Gia dụng giảm 40%", href: "khuyenmai.html" }
                ]
            }
        ]
    },

    // 10. Tin công nghệ TechPulse
    news: {
        col1: [
            {
                title: "Chuyên mục tin tức",
                type: "chips",
                items: [
                    { name: "Tin công nghệ 24h", href: "gioithieu.html", badge: "Hot", span: 2 },
                    { name: "Đánh giá & Review sản phẩm", href: "gioithieu.html", span: 2 },
                    { name: "Thủ thuật & Mẹo hay iOS/Android", href: "gioithieu.html", span: 2 },
                    { name: "Tư vấn chọn mua thông minh", href: "gioithieu.html", span: 2 }
                ]
            }
        ],
        col2: [
            {
                title: "Chủ đề đang HOT",
                type: "chips",
                items: [
                    { name: "So sánh iPhone 16 Pro Max vs S24 Ultra", href: "gioithieu.html", span: 2 },
                    { name: "Trải nghiệm tính năng Apple Intelligence", href: "gioithieu.html", badge: "Hot", span: 2 },
                    { name: "Top 5 laptop sinh viên đáng mua nhất", href: "gioithieu.html", span: 2 }
                ]
            }
        ],
        col3: [
            {
                title: "Kênh truyền thông",
                type: "chips",
                items: [
                    { name: "TechPulse Video Reviews", href: "gioithieu.html", span: 2 },
                    { name: "Podcast Công nghệ số", href: "gioithieu.html", span: 2 },
                    { name: "Diễn đàn trao đổi công nghệ", href: "gioithieu.html", span: 2 }
                ]
            }
        ]
    }
};

function renderBoxColumn(sections) {
    if (!sections || !Array.isArray(sections)) return '';
    return sections.map(sec => {
        let itemsHtml = '';
        if (sec.type === 'brands') {
            const gridItems = sec.items.map(item => {
                const appleIcon = item.logo === 'apple' ? '<i class="fa-brands fa-apple text-base mr-1"></i>' : '';
                const spanClass = item.span ? (item.span === 3 ? 'col-span-3' : 'col-span-2') : 'col-span-1';
                const allStyle = item.isAll ? 'text-amber-700 font-bold border-amber-300 bg-amber-50 hover:bg-amber-100/70' : 'text-neutral-800 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50 hover:shadow-sm';
                const badgeHtml = item.badge ? `<span class="bg-[#FDE047] text-slate-950 text-[8px] font-black px-1 py-0.5 rounded ml-1 leading-none uppercase border border-amber-300">${item.badge}</span>` : '';
                return `
                    <a href="${item.href}" class="${spanClass} border border-neutral-200/90 rounded-lg bg-white px-2 py-1.5 flex items-center justify-center text-xs font-semibold ${allStyle} transition cursor-pointer min-h-[32px] text-center">
                        ${appleIcon}<span>${item.name}</span>${badgeHtml}
                    </a>
                `;
            }).join('');
            itemsHtml = `<div class="grid grid-cols-3 gap-1.5">${gridItems}</div>`;
        } else if (sec.type === 'cards') {
            const gridItems = sec.items.map(item => {
                const thumb = MEGA_THUMB_SVGS[item.thumb] || '';
                const badgeHtml = item.badge ? `<span class="bg-[#FDE047] text-slate-950 text-[8px] font-black px-1 py-0.5 rounded ml-auto leading-none uppercase border border-amber-300">${item.badge}</span>` : '';
                const spanClass = item.span === 2 ? 'col-span-2' : 'col-span-1';
                return `
                    <a href="${item.href}" class="${spanClass} border border-neutral-200/90 rounded-lg bg-white p-1.5 flex items-center gap-2 text-xs font-semibold text-neutral-800 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50 hover:shadow-sm transition cursor-pointer min-h-[36px]">
                        ${thumb}
                        <span class="truncate">${item.name}</span>
                        ${badgeHtml}
                    </a>
                `;
            }).join('');
            itemsHtml = `<div class="grid grid-cols-2 gap-1.5">${gridItems}</div>`;
        } else if (sec.type === 'chips') {
            const gridItems = sec.items.map(item => {
                const badgeHtml = item.badge ? `<span class="bg-[#FDE047] text-slate-950 text-[8px] font-black px-1 py-0.5 rounded ml-auto leading-none uppercase border border-amber-300">${item.badge}</span>` : '';
                const spanClass = item.span === 2 ? 'col-span-2' : 'col-span-1';
                return `
                    <a href="${item.href}" class="${spanClass} border border-neutral-200/90 rounded-lg bg-white px-2.5 py-1.5 flex items-center justify-between text-xs font-semibold text-neutral-800 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50 hover:shadow-sm transition cursor-pointer min-h-[32px]">
                        <span class="truncate">${item.name}</span>
                        ${badgeHtml}
                    </a>
                `;
            }).join('');
            itemsHtml = `<div class="grid grid-cols-2 gap-1.5">${gridItems}</div>`;
        } else if (sec.type === 'prices') {
            const gridItems = sec.items.map(item => {
                const spanClass = item.span ? (item.span === 3 ? 'col-span-3' : 'col-span-2') : 'col-span-1';
                return `
                    <a href="${item.href}" class="${spanClass} border border-neutral-200/90 rounded-lg bg-white px-2 py-1.5 flex items-center justify-center text-[11px] font-medium text-neutral-700 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50 hover:shadow-sm transition cursor-pointer text-center">
                        ${item.name}
                    </a>
                `;
            }).join('');
            itemsHtml = `<div class="grid grid-cols-3 gap-1.5">${gridItems}</div>`;
        }

        const viewAllHtml = sec.viewAll ? `
            <div class="pt-1">
                <a href="${sec.viewAll.href}" class="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-amber-600 font-medium transition">
                    <span>${sec.viewAll.name}</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>
        ` : '';

        return `
            <div class="space-y-1.5">
                <h4 class="text-xs font-bold text-neutral-900 tracking-tight flex items-center gap-1">${sec.title}</h4>
                ${itemsHtml}
                ${viewAllHtml}
            </div>
        `;
    }).join('');
}

function renderMegaMenuContent(catKey) {
    const data = MEGA_MENU_DATA[catKey];
    if (!data) return '';

    const col1Html = renderBoxColumn(data.col1 || []);
    const col2Html = renderBoxColumn(data.col2 || []);
    const col3Html = renderBoxColumn(data.col3 || []);

    return `
        <div class="grid grid-cols-3 gap-5">
            <div class="space-y-4">${col1Html}</div>
            <div class="space-y-4">${col2Html}</div>
            <div class="space-y-4">${col3Html}</div>
        </div>
    `;
}



// Render authentic CellphoneS 3-column box-based flyout for header dropdown
function renderHeaderMegaContent(catKey) {
    return renderMegaMenuContent(catKey);
}

// 2.2 Header Dropdowns (CellphoneS Category & Location Picker with Auto-Hover)
function setupHeaderDropdowns() {
    const catWrapper = document.getElementById('category-dropdown-wrapper') || document.getElementById('category-dropdown-btn')?.parentElement;
    const catBtn = document.getElementById('category-dropdown-btn');
    const catMenu = document.getElementById('category-dropdown-menu');
    const headerMegaPanel = document.getElementById('header-mega-panel');
    let catTimer = null;

    if (catWrapper && catMenu) {
        // Tự động mở khi rê chuột (Hover)
        catWrapper.addEventListener('mouseenter', () => {
            clearTimeout(catTimer);
            catMenu.classList.remove('hidden');
            const chevron = document.getElementById('cat-chevron-icon');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        });

        // Tự động đóng khi rời chuột (với delay 180ms để không bị giật)
        catWrapper.addEventListener('mouseleave', () => {
            catTimer = setTimeout(() => {
                catMenu.classList.add('hidden');
                if (headerMegaPanel) headerMegaPanel.classList.add('hidden');
                const chevron = document.getElementById('cat-chevron-icon');
                if (chevron) chevron.style.transform = '';
            }, 180);
        });

        // Click dự phòng cho thiết bị cảm ứng
        if (catBtn) {
            catBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                catMenu.classList.toggle('hidden');
            });
        }

        // Subcategory flyout khi hover vào từng danh mục trong Header dropdown
        if (headerMegaPanel) {
            const headerItems = catMenu.querySelectorAll('.header-cat-item');
            let currentHeaderActive = null;
            const clearHeaderActive = () => {
                if (currentHeaderActive) {
                    currentHeaderActive.classList.remove('bg-amber-50', 'text-amber-700', 'font-bold', 'bg-red-50', 'text-red-600');
                    currentHeaderActive = null;
                }
            };
            headerItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const catKey = item.dataset.megaHeader;
                    clearHeaderActive();
                    if (catKey && MEGA_MENU_DATA[catKey]) {
                        item.classList.add('bg-amber-50', 'text-amber-700', 'font-bold');
                        currentHeaderActive = item;
                        headerMegaPanel.innerHTML = renderHeaderMegaContent(catKey);
                        headerMegaPanel.classList.remove('hidden');
                    } else {
                        headerMegaPanel.classList.add('hidden');
                    }
                });
            });
            catMenu.addEventListener('mouseleave', () => {
                clearHeaderActive();
            });
        }
    }

    const locWrapper = document.getElementById('location-picker-wrapper') || document.getElementById('location-picker-btn')?.parentElement;
    const locBtn = document.getElementById('location-picker-btn');
    const locMenu = document.getElementById('location-picker-menu');
    let locTimer = null;

    if (locWrapper && locMenu) {
        // Tự động mở khi rê chuột (Hover)
        locWrapper.addEventListener('mouseenter', () => {
            clearTimeout(locTimer);
            locMenu.classList.remove('hidden');
            const chevron = document.getElementById('loc-chevron-icon');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        });

        // Đóng khi rời chuột
        locWrapper.addEventListener('mouseleave', () => {
            locTimer = setTimeout(() => {
                locMenu.classList.add('hidden');
                const chevron = document.getElementById('loc-chevron-icon');
                if (chevron) chevron.style.transform = '';
            }, 180);
        });

        // Click toggle
        if (locBtn) {
            locBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                locMenu.classList.toggle('hidden');
            });
        }
    }

    const searchInput = document.getElementById('main-search-input');
    const suggestions = document.getElementById('search-suggestions-box');
    if (searchInput && suggestions) {
        searchInput.onfocus = () => suggestions.classList.remove('hidden');
        searchInput.oninput = () => suggestions.classList.remove('hidden');
    }

    document.addEventListener('click', (e) => {
        if (catMenu && !catMenu.contains(e.target) && catWrapper && !catWrapper.contains(e.target)) {
            catMenu.classList.add('hidden');
            if (headerMegaPanel) headerMegaPanel.classList.add('hidden');
        }
        if (locMenu && !locMenu.contains(e.target) && locWrapper && !locWrapper.contains(e.target)) {
            locMenu.classList.add('hidden');
        }
        if (suggestions && !suggestions.contains(e.target) && searchInput && !searchInput.contains(e.target)) {
            suggestions.classList.add('hidden');
        }
    });
}

// 2.3 Hero Left Sidebar Mega Menu (CellphoneS Hover Flyout trên trang chủ)
function initSidebarMegaMenu() {
    const sidebarWrapper = document.getElementById('hero-sidebar-wrapper');
    const megaPanel = document.getElementById('hero-mega-panel');
    const catItems = document.querySelectorAll('.sidebar-cat-item');

    if (!sidebarWrapper || !megaPanel || catItems.length === 0) return;

    let megaTimer = null;
    let currentActiveItem = null;

    const clearActiveState = () => {
        if (currentActiveItem) {
            currentActiveItem.classList.remove('bg-amber-50', 'text-amber-700', 'font-bold', 'bg-red-50', 'text-red-600');
            currentActiveItem = null;
        }
    };

    catItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            clearTimeout(megaTimer);
            const catKey = item.dataset.mega;
            if (!catKey || !MEGA_MENU_DATA[catKey]) {
                megaPanel.classList.add('hidden');
                clearActiveState();
                return;
            }

            clearActiveState();
            item.classList.add('bg-amber-50', 'text-amber-700', 'font-bold');
            currentActiveItem = item;

            megaPanel.innerHTML = renderMegaMenuContent(catKey);
            megaPanel.classList.remove('hidden');
        });

        item.addEventListener('mouseleave', () => {
            megaTimer = setTimeout(() => {
                megaPanel.classList.add('hidden');
                clearActiveState();
            }, 180);
        });
    });

    megaPanel.addEventListener('mouseenter', () => {
        clearTimeout(megaTimer);
    });

    megaPanel.addEventListener('mouseleave', () => {
        megaTimer = setTimeout(() => {
            megaPanel.classList.add('hidden');
            clearActiveState();
        }, 180);
    });

    sidebarWrapper.addEventListener('mouseenter', () => {
        clearTimeout(megaTimer);
    });

    sidebarWrapper.addEventListener('mouseleave', () => {
        megaTimer = setTimeout(() => {
            megaPanel.classList.add('hidden');
            clearActiveState();
        }, 180);
    });
}

window.selectLocation = function(city) {
    const textEl = document.getElementById('current-location-text');
    if (textEl) {
        textEl.textContent = city;
    }
    const locMenu = document.getElementById('location-picker-menu');
    if (locMenu) {
        locMenu.classList.add('hidden');
        const buttons = locMenu.querySelectorAll('button');
        buttons.forEach(btn => {
            const isMatch = btn.getAttribute('onclick')?.includes(city);
            if (isMatch) {
                btn.innerHTML = `${city} <i class="fa-solid fa-check text-red-600"></i>`;
            } else {
                const match = btn.getAttribute('onclick')?.match(/selectLocation\('([^']+)'\)/);
                const name = match ? match[1] : btn.textContent.trim();
                btn.innerHTML = `${name}`;
            }
        });
    }
    const chevron = document.getElementById('loc-chevron-icon');
    if (chevron) chevron.style.transform = '';

    // Logic kho hàng & phân vùng bảng giá CellphoneS (Trích xuất từ chunk page.js & layout.js)
    const isMienNam = city.includes('Hồ Chí Minh') || city.includes('Cần Thơ');
    const branchName = isMienNam ? 'Kho Diệu Phúc (Miền Nam)' : 'Kho HTV (Miền Bắc)';

    if (typeof showToast === 'function') {
        showToast({
            title: `Khu vực: ${city}`,
            message: `Đã áp dụng bảng giá & tồn kho ${branchName}. Giao nhanh 2H sẵn sàng!`,
            type: "info"
        });
    }
};

// Toggle Nhắc lịch săn sale (CellphoneS HotSale feature từ chunk 1670)
let saleReminderActive = false;
window.toggleSaleReminder = function() {
    saleReminderActive = !saleReminderActive;
    const btn = document.getElementById('sale-reminder-btn');
    const icon = document.getElementById('sale-reminder-icon');
    const text = document.getElementById('sale-reminder-text');

    if (saleReminderActive) {
        if (btn) {
            btn.className = 'px-2.5 py-1.5 rounded-xl bg-white text-red-600 text-xs font-bold transition flex items-center gap-1.5 border border-white whitespace-nowrap shadow-md';
        }
        if (icon) {
            icon.className = 'fa-solid fa-bell text-red-600 animate-bounce';
        }
        if (text) text.textContent = 'Đã bật nhắc lịch';
        if (typeof showToast === 'function') {
            showToast({
                title: "Nhắc lịch săn sale",
                message: "Đã bật nhắc lịch săn sale! Hệ thống sẽ thông báo trước giờ G 15 phút.",
                type: "success"
            });
        }
    } else {
        if (btn) {
            btn.className = 'px-2.5 py-1.5 rounded-xl bg-red-800/90 hover:bg-white hover:text-red-600 text-yellow-300 hover:text-red-600 text-xs font-bold transition flex items-center gap-1.5 border border-yellow-300/40 whitespace-nowrap shadow-sm';
        }
        if (icon) {
            icon.className = 'fa-regular fa-bell text-yellow-300';
        }
        if (text) text.textContent = 'Nhắc lịch săn sale';
        if (typeof showToast === 'function') {
            showToast({
                title: "Nhắc lịch săn sale",
                message: "Đã tắt nhắc lịch săn sale.",
                type: "info"
            });
        }
    }
};

// 3. Xử lý tìm kiếm nhanh trên Header
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
                navigateTo(targetUrl);
            }
        };
    });
}

// 4. Form đăng ký nhận tin (CellphoneS Subscription Modal từ chunk 8346)
function setupNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"], input[type="text"]');
            if (input && input.value.trim()) {
                if (typeof showToast === 'function') {
                    showToast({
                        title: "ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI",
                        message: `Nhận ngay Voucher giảm 10%! Mã ưu đãi độc quyền đã được gửi tới ${input.value.trim()}. Voucher sẽ có hiệu lực trong 24h.`,
                        type: "success"
                    });
                }
                input.value = '';
            }
        };
    });
}

// 5. Đồng hồ đếm ngược Flash Sale
let countdownInterval = null;
function initFlashSaleCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    let totalSeconds = (8 * 3600) + (45 * 60) + 30;

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

// 6. Highlight menu đang hoạt động
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#site-header nav a, #mobile-menu a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        const cleanHref = linkHref.split('?')[0].split('/').pop();
        
        if (cleanHref === currentPath || (currentPath === '' && cleanHref === 'index.html')) {
            link.classList.add('text-blue-400', 'font-semibold');
            link.classList.remove('text-slate-300');
        } else {
            link.classList.remove('text-blue-400');
            link.classList.add('text-slate-300');
        }
    });
}

// =========================================================================
// 7. CLIENT-SIDE SPA ROUTER (PJAX)
// Giữ nguyên Header & Footer, chỉ thay thế <main> và chạy lại script trang
// =========================================================================
function setupSPARouter() {
    if (window.location.protocol === 'file:') {
        return;
    }

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

                // Cập nhật URL trong thanh địa chỉ
                if (pushState) {
                    window.history.pushState(null, '', url);
                }

                // Cập nhật lại toàn bộ chức năng chung và nội dung của trang vừa chuyển tới
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
        console.warn("Lỗi tải trang bằng fetch SPA, fallback sang chuyển trang chuẩn:", err);
        window.location.href = url;
    }
}

function showProgressBar() {
    let bar = document.getElementById('top-loading-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'top-loading-bar';
        bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 z-50 transition-all duration-300';
        bar.style.width = '0%';
        document.body.appendChild(bar);
    }
    bar.style.opacity = '1';
    bar.style.width = '65%';
}

function hideProgressBar() {
    const bar = document.getElementById('top-loading-bar');
    if (bar) {
        bar.style.width = '100%';
        setTimeout(() => {
            bar.style.opacity = '0';
            setTimeout(() => { bar.style.width = '0%'; }, 200);
        }, 150);
    }
}

// =========================================================================
// 8. BỘ ĐIỀU PHỐI SCRIPTS CHO TỪNG TRANG (PAGE-SPECIFIC INITIALIZERS)
// Đảm bảo dữ liệu sản phẩm, giỏ hàng luôn được load đầy đủ dù là F5 hay chuyển trang SPA!
// =========================================================================
function runPageSpecificScripts() {
    const path = window.location.pathname.split('/').pop() || 'index.html';

    if (path === '' || path === 'index.html') {
        renderIndexPage();
    } else if (path === 'sanpham.html') {
        renderProductsPage();
    } else if (path === 'khuyenmai.html') {
        renderKhuyenMaiPage();
    } else if (path === 'giohang.html') {
        renderCartPageDynamic();
    } else if (path === 'thanhtoan.html') {
        renderCheckoutPageDynamic();
    } else if (path === 'lienhe.html') {
        initContactPageDynamic();
    } else if (path === 'dangnhap.html') {
        initLoginPageDynamic();
    } else if (path === 'dangky.html') {
        initRegisterPageDynamic();
    } else if (window.location.pathname.includes('/chitietsanpham/')) {
        renderDetailPageDynamic();
    }
}

// --- TRANG CHỦ (index.html) - CELLPHONES STYLE ---
let currentHeroSlide = 0;
let heroSlideTimer = null;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides || slides.length === 0) return;

    function showSlide(index) {
        const dots = document.querySelectorAll('.slider-dot');
        slides.forEach((s, i) => {
            if (i === index) {
                s.classList.remove('opacity-0', 'pointer-events-none');
                s.classList.add('opacity-100');
            } else {
                s.classList.remove('opacity-100');
                s.classList.add('opacity-0', 'pointer-events-none');
            }
        });
        dots.forEach((d, i) => {
            if (i === index) {
                d.className = 'slider-dot w-6 h-1.5 rounded-full bg-red-600 cursor-pointer transition-all';
            } else {
                d.className = 'slider-dot w-2 h-1.5 rounded-full bg-white/50 cursor-pointer transition-all';
            }
        });
        currentHeroSlide = index;
    }

    window.nextHeroSlide = function() {
        let next = (currentHeroSlide + 1) % slides.length;
        showSlide(next);
        resetTimer();
    };

    window.prevHeroSlide = function() {
        let prev = (currentHeroSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
        resetTimer();
    };

    function resetTimer() {
        if (heroSlideTimer) clearInterval(heroSlideTimer);
        heroSlideTimer = setInterval(() => {
            let next = (currentHeroSlide + 1) % slides.length;
            showSlide(next);
        }, 4000);
    }

    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
        dot.onclick = () => {
            showSlide(idx);
            resetTimer();
        };
    });

    showSlide(0);
    resetTimer();
}

// =============================================================================
// CELLPHONES AUTHENTIC 3-TAB MEGA PRODUCT SHOWCASE MODULE
// =============================================================================

const MEGA_SHOWCASE_DATA = {
    tabs: [
        {
            id: 'dealsoc',
            title: 'DEAL SỐC MỖI NGÀY',
            badgeImg: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/landing-page/hang-moi-ve/hotDueHome03.png',
            categories: [
                { id: 'phukien', name: 'Phụ kiện' },
                { id: 'dongho-amthanh', name: 'Đồng hồ, âm thanh' },
                { id: 'dienthoai', name: 'Điện thoại' },
                { id: 'maytinhbang', name: 'Máy tính bảng' },
                { id: 'laptop', name: 'Laptop' },
                { id: 'manhinh-pc', name: 'Màn hình, PC' },
                { id: 'dienmay-giadung', name: 'Điện máy, gia dụng' }
            ],
            subcategories: {
                phukien: [
                    { id: 'all', name: 'Tất cả', icon: '' },
                    { id: 'cu-cap', name: 'Củ cáp', icon: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/cap-sac-cap.png' },
                    { id: 'chuot-ban-phim', name: 'Chuột, bàn phím', icon: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/phu-kien-ban-phim-chuot.png' },
                    { id: 'pin-du-phong', name: 'Sạc dự phòng', icon: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/pin-du-phong-20000-mah.png' },
                    { id: 'camera', name: 'Camera', icon: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/camera-hanh-trinh-trong-nha.png' },
                    { id: 'pk-apple', name: 'Phụ kiện Apple', icon: 'https://cellphones.com.vn/media/wysiwyg/pk-apple-tai-nghe.png' },
                    { id: 'pk-tien-ich', name: 'Phụ kiện tiện ích', icon: 'https://cellphones.com.vn/media/wysiwyg/quat-cam-tay-new.png' },
                    { id: 'op-lung', name: 'Ốp lưng', icon: 'https://cellphones.com.vn/media/wysiwyg/op-bao-da-sam-sung-s24.png' },
                    { id: 'dan-man-hinh', name: 'Dán màn hình', icon: 'https://cellphones.com.vn/media/wysiwyg/dan-man-hinh-iphone-15.png' }
                ]
            },
            products: [
                {
                    id: 'ds-1',
                    category: 'phukien',
                    subcat: 'pk-apple',
                    name: 'Tai nghe Apple EarPods Lightning MWTY3ZA/A | Chính hãng Apple Việt Nam',
                    price: '510.000đ',
                    oldPrice: '790.000đ',
                    discount: 35,
                    installment: false,
                    brand: 'Apple',
                    specs: 'Lightning • Mic thoại',
                    smember: '5.000đ',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_3_3.png',
                    link: 'chitietsanpham/tai-nghe-sony-wh-1000xm5.html'
                },
                {
                    id: 'ds-2',
                    category: 'phukien',
                    subcat: 'camera',
                    name: 'DJI Pocket 3 Creator Combo',
                    price: '11.281.000đ',
                    oldPrice: '17.995.000đ',
                    discount: 37,
                    installment: true,
                    brand: 'DJI',
                    specs: '4K • ActiveTrack 6.0',
                    smember: '113.000đ',
                    promo: 'PMH 560,000 đ',
                    fastDelivery: true,
                    rating: '4.9',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-quay-chong-rung-dji-osmo-pocket-3-standard_1.jpg',
                    link: 'chitietsanpham/dong-ho-garmin-epix-pro-gen-2.html'
                },
                {
                    id: 'ds-3',
                    category: 'phukien',
                    subcat: 'cu-cap',
                    name: 'Cáp Mophie USB-C to USB-C 100W 3m',
                    price: '490.000đ',
                    oldPrice: '690.000đ',
                    discount: 29,
                    installment: false,
                    brand: 'mophie',
                    specs: '100W • Type-C • 3 mét',
                    smember: '25.000đ',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/c/a/cap-type-c-to-type-c-mophie-100w-3m_1_.png',
                    link: 'chitietsanpham/tai-nghe-airpods-pro-2.html'
                },
                {
                    id: 'ds-4',
                    category: 'phukien',
                    subcat: 'chuot-ban-phim',
                    name: 'Bàn phím cơ gaming E-Dra EK398X Beta đen xám',
                    price: '690.000đ',
                    oldPrice: '890.000đ',
                    discount: 22,
                    installment: false,
                    brand: 'E-DRA',
                    specs: 'Full-size 99 phím • LED RGB',
                    smember: '14.000đ',
                    fastDelivery: true,
                    rating: '',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/b/a/ban-phim-co-gaming-e-dra-ek398x-beta-den-xam_1_.png',
                    link: 'chitietsanpham/macbook-pro-m3.html'
                },
                {
                    id: 'ds-5',
                    category: 'phukien',
                    subcat: 'chuot-ban-phim',
                    name: 'Chuột Gaming Logitech G502 Hero',
                    price: '920.000đ',
                    oldPrice: '1.390.000đ',
                    discount: 34,
                    installment: false,
                    brand: 'logitech',
                    specs: 'DPI 25600 • 2.1 mét • LED RGB',
                    smember: '18.000đ',
                    student: '92.000đ',
                    fastDelivery: true,
                    rating: '4.9',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/c/h/chuot-choi-game-co-day-logitech-g502-hero.png',
                    link: 'chitietsanpham/laptop-asus-rog-strix-g16.html'
                },
                {
                    id: 'ds-6',
                    category: 'phukien',
                    subcat: 'pin-du-phong',
                    name: 'Pin sạc dự phòng Anker A1695 25.000mAh 165W',
                    price: '1.500.000đ',
                    oldPrice: '2.850.000đ',
                    discount: 47,
                    installment: false,
                    brand: 'Anker',
                    specs: '25.000mAh • 165W Cáp rút',
                    smember: '75.000đ',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/p/i/pin-sac-du-phong-anker-a1695-25000mah-165w-kem-cap-rut-gon.png',
                    link: 'chitietsanpham/tai-nghe-airpods-pro-2.html'
                },
                {
                    id: 'ds-7',
                    category: 'phukien',
                    subcat: 'op-lung',
                    name: 'Ốp lưng iPhone 16 Pro Max Spigen Crystal Hybrid With Magsafe',
                    price: '805.000đ',
                    oldPrice: '1.150.000đ',
                    discount: 30,
                    installment: false,
                    brand: 'Spigen',
                    specs: 'MagSafe • Chống sốc 2M',
                    smember: '40.000đ',
                    fastDelivery: true,
                    rating: '4.8',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_524_4.png',
                    link: 'chitietsanpham/iphone-15-pro-max.html'
                },
                {
                    id: 'ds-8',
                    category: 'phukien',
                    subcat: 'camera',
                    name: 'Camera IP 360 độ 3MP Imou IPC-A32EP',
                    price: '380.000đ',
                    oldPrice: '700.000đ',
                    discount: 46,
                    installment: false,
                    brand: 'IMOU',
                    specs: '3MP 2K • Xoay 360 • Đàm thoại',
                    smember: '8.000đ',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-imou-ipc-a32e-khong-day-3mp_2.png',
                    link: 'chitietsanpham/dong-ho-garmin-epix-pro-gen-2.html'
                }
            ]
        },
        {
            id: 'hottrend',
            title: 'SẢN PHẨM HOT TREND',
            badgeImg: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/landing-page/hang-moi-ve/hotTrendHome02.png',
            categories: [
                { id: 'goc-hoc', name: 'NÂNG CẤP GÓC HỌC', icon: 'fa-solid fa-laptop' },
                { id: 'tram-am-thanh', name: 'TRẠM ÂM THANH', icon: 'fa-solid fa-headphones' },
                { id: 'qua-khoe-xinh', name: 'QUÀ KHỎE XINH', icon: 'fa-solid fa-heart-pulse' },
                { id: 'an-ninh', name: 'AN NINH', icon: 'fa-solid fa-video' }
            ],
            subcategories: {},
            products: [
                {
                    id: 'ht-1',
                    category: 'goc-hoc',
                    name: 'Laptop Lenovo LOQ 15IRH11E 83Y9003VVN',
                    price: '26.990.000đ',
                    oldPrice: '36.990.000đ',
                    discount: 27,
                    installment: true,
                    specs: 'CORE 5-205H RTX 3050 • 8GB 512GB 15.3" WUXGA',
                    smember: '270.000đ',
                    student: '1.000.000đ',
                    promo: 'Nhận Voucher 500K - mua ngay Robot hút bụi lau nhà, Tivi, Tủ...',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_-_2025-07-24t135827.221.png',
                    link: 'chitietsanpham/laptop-lenovo-legion-5-pro.html'
                },
                {
                    id: 'ht-2',
                    category: 'goc-hoc',
                    name: 'Màn hình gaming ASUS TUF VG27AQ5F 27 inch',
                    price: '4.990.000đ',
                    oldPrice: '5.490.000đ',
                    discount: 9,
                    installment: true,
                    specs: 'G-SYNC 0.3ms FreeSync • 27 inch 220 Hz 2K',
                    smember: '100.000đ',
                    student: '249.500đ',
                    fastDelivery: false,
                    rating: '',
                    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/g/a/gaming_8_74_.png',
                    link: 'chitietsanpham/laptop-asus-rog-strix-g16.html'
                },
                {
                    id: 'ht-3',
                    category: 'goc-hoc',
                    name: 'Màn hình Gaming LG UltraGear 27G411A-B 27 inch',
                    price: '2.790.000đ',
                    oldPrice: '3.990.000đ',
                    discount: 30,
                    installment: false,
                    specs: 'G-SYNC 1ms FreeSync • 27 inch 144 Hz FHD',
                    smember: '56.000đ',
                    student: '139.500đ',
                    fastDelivery: false,
                    rating: '5',
                    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/laptop-asus-rog-strix-g16.html'
                },
                {
                    id: 'ht-4',
                    category: 'goc-hoc',
                    name: 'Màn hình MSI Pro MP242L 24 inch',
                    price: '1.890.000đ',
                    oldPrice: '2.140.000đ',
                    discount: 12,
                    installment: false,
                    specs: '1ms • 24 inch 100 Hz Full HD',
                    smember: '38.000đ',
                    student: '94.500đ',
                    fastDelivery: true,
                    rating: '',
                    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/macbook-pro-m3.html'
                },
                {
                    id: 'ht-5',
                    category: 'goc-hoc',
                    name: 'Laptop HP 14-EM0023AU D0BG7PA',
                    price: '21.990.000đ',
                    oldPrice: '23.990.000đ',
                    discount: 8,
                    installment: true,
                    specs: 'R5-7520U AMD Radeon • 16GB 512GB 14" FHD',
                    smember: '220.000đ',
                    student: '1.000.000đ',
                    promo: 'Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 18 tháng',
                    fastDelivery: true,
                    rating: '',
                    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/macbook-pro-m3.html'
                }
            ]
        },
        {
            id: 'hangmoive',
            title: 'HÀNG MỚI VỀ',
            badgeImg: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/landing-page/hang-moi-ve/newArrivalHome.png',
            categories: [
                { id: 'dien-thoai-tablet', name: 'ĐIỆN THOẠI - MÁY TÍNH BẢNG' },
                { id: 'may-tinh-vp', name: 'MÁY TÍNH - THIẾT BỊ VĂN PHÒNG' },
                { id: 'dong-ho-am-thanh', name: 'ĐỒNG HỒ - ÂM THANH' },
                { id: 'gia-dung', name: 'GIA DỤNG - THIẾT BỊ LÀM ĐẸP' },
                { id: 'dien-may', name: 'ĐIỆN MÁY' },
                { id: 'phu-kien', name: 'PHỤ KIỆN' }
            ],
            subcategories: {},
            products: [
                {
                    id: 'hm-1',
                    category: 'dien-thoai-tablet',
                    isNew: true,
                    name: 'OPPO Find X10 5G 12GB 256GB',
                    price: '34.990.000đ',
                    oldPrice: '',
                    discount: 0,
                    installment: true,
                    specs: 'Hasselblad Camera • Pin 5800mAh',
                    smember: '350.000đ',
                    promo: 'Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/samsung-s24-ultra.html'
                },
                {
                    id: 'hm-2',
                    category: 'dien-thoai-tablet',
                    isNew: true,
                    name: 'OPPO Find X10 Pro Max 16GB 512GB',
                    price: '49.990.000đ',
                    oldPrice: '',
                    discount: 0,
                    installment: true,
                    specs: 'Snapdragon 8 Gen 4 • Màn hình 2K+ 120Hz',
                    smember: '500.000đ',
                    promo: 'Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/iphone-15-pro-max.html'
                },
                {
                    id: 'hm-3',
                    category: 'dien-thoai-tablet',
                    isNew: true,
                    name: 'OPPO Pad Mini Wifi 8GB 256GB',
                    price: '24.990.000đ',
                    oldPrice: '',
                    discount: 0,
                    installment: true,
                    specs: 'Thiết kế kim loại siêu mỏng • Màn hình 2K',
                    smember: '250.000đ',
                    student: '300.000đ',
                    promo: 'Tặng Bao da Oppo Pad Mini (Opc2505) Tím (Quà tặng không quy đổi)',
                    fastDelivery: false,
                    rating: '',
                    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/ipad-pro-m4.html'
                },
                {
                    id: 'hm-4',
                    category: 'dien-thoai-tablet',
                    isNew: true,
                    name: 'Samsung Galaxy S25 Ultra 512GB',
                    price: '33.990.000đ',
                    oldPrice: '',
                    discount: 0,
                    installment: true,
                    specs: 'Galaxy AI 2026 • Khung Titan mới',
                    smember: '400.000đ',
                    promo: 'Trả góp 0% - 0đ phụ phí - 0đ trả trước',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/samsung-s24-ultra.html'
                },
                {
                    id: 'hm-5',
                    category: 'dien-thoai-tablet',
                    isNew: true,
                    name: 'MacBook Air M4 16GB 256GB',
                    price: '27.990.000đ',
                    oldPrice: '',
                    discount: 0,
                    installment: true,
                    specs: 'Apple Silicon M4 • Pin 18 giờ liên tục',
                    smember: '300.000đ',
                    student: '500.000đ',
                    fastDelivery: true,
                    rating: '5',
                    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop',
                    link: 'chitietsanpham/macbook-pro-m3.html'
                }
            ]
        }
    ]
};

let currentMegaTab = 'dealsoc';
let currentMegaCat = 'phukien';
let currentMegaSubcat = 'all';

function initMegaTrendShowcase() {
    const section = document.getElementById('mega-showcase-section');
    if (!section) return;

    renderMegaTabs();
    renderMegaCategories();
    renderMegaSubcategories();
    renderMegaProducts();

    const track = document.getElementById('mega-products-track');
    if (track && !track.dataset.arrowBound) {
        track.dataset.arrowBound = 'true';
        track.addEventListener('scroll', updateMegaCarouselArrows, { passive: true });
        window.addEventListener('resize', updateMegaCarouselArrows);
    }
}

function renderMegaTabs() {
    const tabDealsoc = document.getElementById('mega-tab-dealsoc');
    const tabHottrend = document.getElementById('mega-tab-hottrend');
    const tabHangmoive = document.getElementById('mega-tab-hangmoive');
    if (!tabDealsoc || !tabHottrend || !tabHangmoive) return;

    const tabsMap = {
        dealsoc: tabDealsoc,
        hottrend: tabHottrend,
        hangmoive: tabHangmoive
    };

    const activeBtnClass = "group/tab rounded-t-large md:rounded-t-1x-large relative flex min-w-20 flex-1 cursor-pointer items-center justify-center overflow-hidden text-center pointer-events-none z-10 border-2 border-b-0! border-[#609AFA] bg-[#EFF5FF] md:border-[3px]";
    const inactiveBtnClass = "group/tab rounded-t-large md:rounded-t-1x-large relative flex min-w-20 flex-1 cursor-pointer items-center justify-center overflow-hidden text-center border-0 border-b-2 border-transparent border-b-[#609AFA] bg-[#F7F7F8] shadow-[inset_-1px_0_10px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.03)] transition-opacity duration-300 md:border-b-[3px] xl:pt-0.75";

    MEGA_SHOWCASE_DATA.tabs.forEach(tab => {
        const btn = tabsMap[tab.id];
        if (!btn) return;
        const isActive = tab.id === currentMegaTab;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.className = isActive ? activeBtnClass : inactiveBtnClass;

        const titleSpan = btn.querySelector('.tab-title');
        const badgeSpan = btn.querySelector('.tab-badge');

        if (titleSpan) {
            titleSpan.className = isActive
                ? "tab-title xs:text-[14px] xs:leading-4 block text-[12px] leading-3.5 font-extrabold text-[#1E97EE] uppercase max-md:px-1 max-md:py-2 max-md:whitespace-pre-line md:text-[2.3vw] xl:pt-1 xl:text-[28px] absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out pointer-events-none scale-90 opacity-0"
                : "tab-title xs:text-[14px] xs:leading-4 block text-[12px] leading-3.5 font-extrabold text-[#1E97EE] uppercase max-md:px-1 max-md:py-2 max-md:whitespace-pre-line md:text-[2.3vw] xl:pt-1 xl:text-[28px] absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out scale-100 opacity-100 group-hover/tab:opacity-70";
        }

        if (badgeSpan) {
            badgeSpan.className = isActive
                ? "tab-badge flex items-center justify-center px-1 py-2 transition-all duration-300 ease-in-out md:py-1 scale-100 opacity-100"
                : "tab-badge flex items-center justify-center px-1 py-2 transition-all duration-300 ease-in-out md:py-1 scale-90 opacity-0";
        }
    });
}

function renderMegaCategories() {
    const row1 = document.getElementById('mega-subcats-row-1');
    if (!row1) return;

    const currentTabData = MEGA_SHOWCASE_DATA.tabs.find(t => t.id === currentMegaTab);
    if (!currentTabData) return;

    row1.innerHTML = currentTabData.categories.map(cat => {
        const isActive = cat.id === currentMegaCat;
        const activeClass = isActive
            ? 'border-[#3B82F6] bg-[#EFF5FF] text-[#2570EB] font-bold shadow-xs'
            : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#3B82F6] hover:text-[#2570EB] font-medium';
        return `
            <button onclick="selectMegaCategory('${cat.id}')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${activeClass}">
                ${cat.icon ? `<i class="${cat.icon} text-xs"></i>` : ''}
                <span>${cat.name}</span>
            </button>
        `;
    }).join('');
}

function renderMegaSubcategories() {
    const row2 = document.getElementById('mega-subcats-row-2');
    if (!row2) return;

    const currentTabData = MEGA_SHOWCASE_DATA.tabs.find(t => t.id === currentMegaTab);
    const subcats = (currentTabData && currentTabData.subcategories) ? currentTabData.subcategories[currentMegaCat] : null;

    if (!subcats || subcats.length === 0) {
        row2.innerHTML = '';
        row2.classList.add('hidden');
        return;
    }

    row2.classList.remove('hidden');
    row2.innerHTML = subcats.map(sub => {
        const isActive = sub.id === currentMegaSubcat;
        const activeClass = isActive
            ? 'border-[#3B82F6] bg-[#EFF5FF] text-[#2570EB] font-bold shadow-xs'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#3B82F6] font-semibold';
        return `
            <button onclick="selectMegaSubcategory('${sub.id}')" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs ${activeClass}">
                ${sub.icon ? `<img src="${sub.icon}" alt="${sub.name}" class="w-4 h-4 object-contain">` : ''}
                <span>${sub.name}</span>
            </button>
        `;
    }).join('');
}

function renderMegaProducts() {
    const track = document.getElementById('mega-products-track');
    if (!track) return;

    const currentTabData = MEGA_SHOWCASE_DATA.tabs.find(t => t.id === currentMegaTab);
    if (!currentTabData) return;

    let items = currentTabData.products;
    if (currentMegaCat) {
        const filteredByCat = items.filter(p => p.category === currentMegaCat);
        if (filteredByCat.length > 0) items = filteredByCat;
    }
    if (currentMegaSubcat && currentMegaSubcat !== 'all') {
        const filteredBySub = items.filter(p => p.subcat === currentMegaSubcat);
        if (filteredBySub.length > 0) items = filteredBySub;
    }

    track.innerHTML = items.map(p => `
        <div class="product-card-item w-[175px] sm:w-[210px] md:w-[225px] flex-shrink-0 bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-lg border border-slate-100 flex flex-col justify-between transition-all duration-300 relative group">
            <div>
                ${p.discount > 0 ? `
                <div class="absolute top-0 left-3 flex px-2 py-0.5 items-center justify-center text-[10px] font-bold text-white z-10 rounded-b-md shadow-xs" style="background: linear-gradient(135deg, #d70018 0%, #e45464 100%);">
                    Giảm ${p.discount}%
                </div>` : ''}

                ${p.installment ? `
                <span class="absolute top-2 right-2 bg-[#EFF6FF] text-[#2563EB] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#BFDBFE] z-10">
                    Trả góp 0%
                </span>` : ''}

                <a href="${p.link || '#'}" class="block aspect-square w-full p-2 mb-2 overflow-hidden">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300">
                </a>

                ${p.isNew ? `
                <div class="mb-1">
                    <span class="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.5 rounded">Hàng mới về</span>
                </div>` : ''}

                ${p.specs ? `
                <div class="text-[10px] text-slate-500 font-medium mb-1 truncate" title="${p.specs}">
                    ${p.specs}
                </div>` : ''}

                <h3 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 min-h-[34px] group-hover:text-blue-600 transition leading-snug">
                    <a href="${p.link || '#'}">${p.name}</a>
                </h3>

                <div class="flex items-baseline gap-1.5 my-1.5">
                    <span class="text-sm sm:text-base font-extrabold text-[#D70018]">${p.price}</span>
                    ${p.oldPrice ? `<span class="text-[10px] sm:text-xs text-slate-400 line-through">${p.oldPrice}</span>` : ''}
                </div>

                ${p.smember ? `
                <div class="bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit mb-1">
                    Smember giảm đến ${p.smember}
                </div>` : ''}

                ${p.student ? `
                <div class="bg-[#FAF5FF] text-[#6B21A8] text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit mb-1">
                    S-Student giảm thêm ${p.student}
                </div>` : ''}

                ${p.promo ? `
                <div class="bg-slate-50 border border-slate-200 text-[10px] text-slate-600 p-1 rounded line-clamp-2 mb-1 font-medium">
                    ${p.promo}
                </div>` : ''}
            </div>

            <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                    ${p.fastDelivery ? `
                    <span class="bg-[#EFF6FF] text-[#2563EB] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#BFDBFE] flex items-center gap-1">
                        <i class="fa-solid fa-truck-fast text-[8px]"></i> 2 Giờ
                    </span>` : ''}
                    ${p.rating ? `
                    <span class="text-amber-500 text-[10px] font-bold flex items-center gap-0.5">
                        <i class="fa-solid fa-star text-[9px]"></i> ${p.rating}
                    </span>` : ''}
                </div>
                <button onclick="toggleMegaWishlist(this, '${p.id}')" class="text-blue-500 hover:text-red-500 p-1 transition" title="Yêu thích">
                    <i class="fa-regular fa-heart text-sm"></i>
                </button>
            </div>
        </div>
    `).join('');

    track.scrollTo({ left: 0, behavior: 'instant' });
    setTimeout(updateMegaCarouselArrows, 30);
    setTimeout(updateMegaCarouselArrows, 150);
}

function updateMegaCarouselArrows() {
    const track = document.getElementById('mega-products-track');
    const prevBtn = document.getElementById('mega-btn-prev');
    const nextBtn = document.getElementById('mega-btn-next');
    if (!track || !prevBtn || !nextBtn) return;

    const scrollLeft = Math.ceil(track.scrollLeft);
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

    // Can scroll left only if not at the beginning
    const canScrollLeft = scrollLeft > 6;
    // Can scroll right only if there is overflow and not at the end
    const canScrollRight = maxScroll > 6 && scrollLeft < (maxScroll - 6);

    if (canScrollLeft) {
        prevBtn.classList.remove('hidden');
        prevBtn.classList.add('flex');
    } else {
        prevBtn.classList.add('hidden');
        prevBtn.classList.remove('flex');
    }

    if (canScrollRight) {
        nextBtn.classList.remove('hidden');
        nextBtn.classList.add('flex');
    } else {
        nextBtn.classList.add('hidden');
        nextBtn.classList.remove('flex');
    }
}
window.updateMegaCarouselArrows = updateMegaCarouselArrows;

window.selectMegaTab = function(tabId) {
    currentMegaTab = tabId;
    const tabData = MEGA_SHOWCASE_DATA.tabs.find(t => t.id === tabId);
    if (tabData && tabData.categories && tabData.categories.length > 0) {
        currentMegaCat = tabData.categories[0].id;
    } else {
        currentMegaCat = '';
    }
    currentMegaSubcat = 'all';

    renderMegaTabs();
    renderMegaCategories();
    renderMegaSubcategories();
    renderMegaProducts();
};

window.selectMegaCategory = function(catId) {
    currentMegaCat = catId;
    currentMegaSubcat = 'all';
    renderMegaCategories();
    renderMegaSubcategories();
    renderMegaProducts();
};

window.selectMegaSubcategory = function(subcatId) {
    currentMegaSubcat = subcatId;
    renderMegaSubcategories();
    renderMegaProducts();
};

window.scrollMegaCarousel = function(direction) {
    const track = document.getElementById('mega-products-track');
    if (!track) return;

    const firstCard = track.querySelector('.product-card-item');
    const cardWidth = firstCard ? (firstCard.offsetWidth + 12) : 230;
    const cardsToScroll = track.clientWidth > 900 ? 3 : (track.clientWidth > 600 ? 2 : 1);
    const scrollAmount = cardWidth * cardsToScroll;

    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

    setTimeout(updateMegaCarouselArrows, 100);
    setTimeout(updateMegaCarouselArrows, 250);
    setTimeout(updateMegaCarouselArrows, 450);
};

window.toggleMegaWishlist = function(btn, productId) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-red-500');
        if (typeof showToastNotification === 'function') {
            showToastNotification('Đã thêm vào danh sách yêu thích!');
        }
    } else {
        icon.classList.remove('fa-solid', 'text-red-500');
        icon.classList.add('fa-regular');
    }
};

let currentTrendTab = 'dealsoc';
let currentTrendCat = 'all';

window.switchTrendTab = function(tabName) {
    currentTrendTab = tabName;
    const tabDealsoc = document.getElementById('tab-trend-dealsoc');
    const tabHottrend = document.getElementById('tab-trend-hottrend');
    const tabHangmoive = document.getElementById('tab-trend-hangmoive');

    [tabDealsoc, tabHottrend, tabHangmoive].forEach(btn => {
        if (!btn) return;
        btn.className = 'pb-3 border-b-2 border-transparent text-slate-600 hover:text-red-600 font-bold text-sm sm:text-base whitespace-nowrap transition flex items-center gap-2';
    });

    const activeBtn = document.getElementById('tab-trend-' + tabName);
    if (activeBtn) {
        activeBtn.className = 'pb-3 border-b-2 border-red-600 text-red-600 font-extrabold text-sm sm:text-base whitespace-nowrap flex items-center gap-2';
    }

    renderTrendProducts();
};

window.filterTrendCategory = function(cat) {
    currentTrendCat = cat;
    const pills = document.querySelectorAll('.trend-pill');
    pills.forEach(p => {
        p.className = 'trend-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition';
    });
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.className = 'trend-pill active px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-600 text-white shadow-sm whitespace-nowrap transition';
    }
    renderTrendProducts();
};

function renderTrendProducts() {
    const featuredContainer = document.getElementById('featured-products-grid');
    if (!featuredContainer || typeof PRODUCTS === 'undefined') return;

    let items = [...PRODUCTS];
    if (currentTrendCat !== 'all') {
        items = items.filter(p => p.category === currentTrendCat);
    }
    if (currentTrendTab === 'dealsoc') {
        items = items.filter(p => p.discount > 0);
    } else if (currentTrendTab === 'hottrend') {
        items.sort((a, b) => b.rating - a.rating);
    } else if (currentTrendTab === 'hangmoive') {
        items.reverse();
    }

    if (items.length === 0) {
        items = PRODUCTS.slice(0, 4);
    }

    featuredContainer.innerHTML = items.slice(0, 4).map(p => `
        <div class="product-item bg-white rounded-2xl overflow-hidden shadow-box-md border border-slate-200/60 flex flex-col justify-between group hover:shadow-xl hover:border-red-400 transition duration-300">
            <div class="relative bg-slate-50 p-2.5 sm:p-4">
                ${p.discount > 0 ? `<span class="absolute top-2 left-2 bg-red-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-md z-10 shadow-sm">Giảm ${p.discount}%</span>` : ''}
                <span class="absolute top-2 right-2 bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-200 z-10">
                    Trả góp 0%
                </span>
                <a href="chitietsanpham/${p.slug}.html" class="block">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-36 sm:h-48 object-cover rounded-xl group-hover:scale-105 transition duration-300">
                </a>
            </div>
            <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span class="font-bold text-red-600 uppercase">${p.brand}</span>
                        <span class="truncate">${p.categoryName}</span>
                    </div>
                    <h3 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-1 hover:text-red-600 transition">
                        <a href="chitietsanpham/${p.slug}.html">${p.name}</a>
                    </h3>
                    <div class="flex items-center gap-1 text-amber-400 text-[11px] sm:text-xs mt-1.5">
                        <i class="fa-solid fa-star"></i>
                        <span class="font-bold text-slate-700">${p.rating}</span>
                        <span class="text-slate-400">(${p.reviewsCount})</span>
                    </div>
                </div>

                <!-- Authentic CellphoneS Promotion Tag -->
                <div class="promotion my-2">
                    <div class="promo-list">
                        <ul>
                            <li class="pmh-title">Ưu đãi</li>
                            <li class="pmh-content">Smember</li>
                        </ul>
                    </div>
                    <p class="coupon-price">Giảm thêm đến 500.000đ khi thanh toán thẻ & Smember</p>
                </div>

                <div class="mt-2 sm:mt-2.5 pt-2 border-t border-slate-100">
                    <div class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                        <span class="text-sm sm:text-base font-black text-red-600">${formatCurrency(p.price)}</span>
                        ${p.originalPrice > p.price ? `<span class="text-[11px] sm:text-xs text-slate-400 line-through">${formatCurrency(p.originalPrice)}</span>` : ''}
                    </div>
                    <div class="my-1.5 p-1 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-600 flex items-center justify-between">
                        <span>Giao siêu tốc</span>
                        <span class="font-bold text-emerald-600">Miễn phí 2H</span>
                    </div>
                    <div class="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2">
                        <a href="chitietsanpham/${p.slug}.html" class="text-center py-1.5 sm:py-2 px-1 rounded-lg border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-50 transition truncate">
                            Chi tiết
                        </a>
                        <button onclick="quickAddToCart('${p.id}')" class="py-1.5 sm:py-2 px-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm truncate">
                            <i class="fa-solid fa-cart-shopping text-[10px]"></i> <span>Mua</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


/* ==========================================================================
   AUTHENTIC CELLPHONES DUAL-CATEGORY SHOWCASE (ĐIỆN THOẠI - MÁY TÍNH BẢNG)
   ========================================================================== */

const DUAL_SHOWCASE_DATA = {"phone":{"bannerImg":"https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/zv1W7XTzX029gfa9P9uQ7Xp1wTI3XRaNZHGB2d6U.png","bannerAlt":"Xiaomi Redmi Note 17 Series ưu đãi mở bán","bannerLink":"sanpham.html?brand=xiaomi","seeAllLink":"sanpham.html?category=phone","demand":[{"name":"Điện thoại chơi game","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-gamning.png","link":"sanpham.html?search=gaming"},{"name":"Điện thoại pin trâu","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-pin.png","link":"sanpham.html?search=pin+trau"},{"name":"Điện thoại 5G","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-5g_1.png","link":"sanpham.html?search=5g"},{"name":"Điện thoại chụp ảnh đẹp","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-chup-anh.png","link":"sanpham.html?search=chup+anh"},{"name":"Điện thoại gập","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-gap_1.png","link":"sanpham.html?search=gap"},{"name":"Điện thoại AI","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/dien-thoai-ai-icon-cate.png","link":"sanpham.html?search=ai"},{"name":"Điện thoại phổ thông","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/dien-thoai-pho-thong-icon-cate.png","link":"sanpham.html?search=pho+thong"}],"brands":["Apple","Samsung","Xiaomi","OPPO","TECNO","HONOR","Nubia","Sony","Nokia","Infinix","Nothing Phone","Masstel","Realme","Itel","vivo"],"products":[{"title":"iPhone 18 Pro 256GB","link":"/iphone-18-pro.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01.jpg","price":"38.690.000đ","oldPrice":"38.990.000đ","discount":"1%","badge":"","smember":"387.000đ","sStudent":"","promo":"Ưu đãi 500K cho Apple Watch Series 12, Ultra 4 khi mua kèm Iphone 18 Pro/Pro Max và 3 km khác","rating":"5"},{"title":"iPhone 18 Pro Max 256GB","link":"/iphone-18-pro-max.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-max-01.jpg","price":"41.990.000đ","oldPrice":"","discount":"","badge":"","smember":"420.000đ","sStudent":"","promo":"Ưu đãi 500K cho Apple Watch Series 12, Ultra 4 khi mua kèm Iphone 18 Pro/Pro Max và 3 km khác","rating":"5"},{"title":"iPhone 17 Pro 256GB | Chính hãng","link":"/iphone-17-pro.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-256-gb.png","price":"31.990.000đ","oldPrice":"34.990.000đ","discount":"9%","badge":"","smember":"320.000đ","sStudent":"","promo":"Chi thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB data/ngày+500 phút gọi Mobifone &amp; VNSKY, miễn phí 30 ngày đầu - chỉ áp dụng tại cửa hàng và 2 km khác","rating":"5"},{"title":"iPhone 17 Pro Max 256GB | Chính hãng","link":"/iphone-17-pro-max.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max_3.jpg","price":"34.990.000đ","oldPrice":"37.990.000đ","discount":"8%","badge":"","smember":"350.000đ","sStudent":"","promo":"Chi thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB data/ngày+500 phút gọi Mobifone &amp; VNSKY, miễn phí 30 ngày đầu - chỉ áp dụng tại cửa hàng và 3 km khác","rating":"5"},{"title":"Samsung Galaxy S26 Ultra 5G 12GB 256GB","link":"/dien-thoai-samsung-galaxy-s26-ultra.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg","price":"31.990.000đ","oldPrice":"40.990.000đ","discount":"22%","badge":"","smember":"320.000đ","sStudent":"500.000đ","promo":"Tặng thêm 12 tháng bảo hành tại CellphoneS và 1 km khác","rating":"5"},{"title":"iPhone 17 256GB | Chính hãng","link":"/iphone-17-256gb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg","price":"28.490.000đ","oldPrice":"28.990.000đ","discount":"2%","badge":"","smember":"285.000đ","sStudent":"","promo":"Chi thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB data/ngày+500 phút gọi Mobifone &amp; VNSKY, miễn phí 30 ngày đầu - chỉ áp dụng tại cửa hàng và 2 km khác","rating":"5"},{"title":"iPhone 18 Pro Max 512GB","link":"/iphone-18-pro-max-512gb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-max-01_1.jpg","price":"48.490.000đ","oldPrice":"","discount":"","badge":"","smember":"485.000đ","sStudent":"","promo":"Chi thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB data/ngày+500 phút gọi Mobifone &amp; VNSKY, miễn phí 30 ngày đầu - chỉ áp dụng tại cửa hàng và 3 km khác","rating":"5"},{"title":"iPhone Duo 256GB","link":"/iphone-duo-256gb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-duo-01.jpg","price":"64.990.000đ","oldPrice":"","discount":"","badge":"","smember":"650.000đ","sStudent":"","promo":"Ưu đãi 1TR cho Apple Watch Series 12, Ultra 4 khi mua kèm Iphone Duo và 2 km khác","rating":"5"},{"title":"OPPO Find X10 5G 12GB 256GB","link":"/dien-thoai-oppo-find-x10.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x10-glow-01.jpg","price":"34.990.000đ","oldPrice":"","discount":"","badge":"","smember":"350.000đ","sStudent":"","promo":"Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng","rating":"5"},{"title":"Samsung Galaxy Z Fold8 5G 12GB 256GB","link":"/dien-thoai-samsung-galaxy-z-fold-8.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-8-lavender-01.jpg","price":"41.190.000đ","oldPrice":"46.990.000đ","discount":"12%","badge":"","smember":"412.000đ","sStudent":"500.000đ","promo":"Ưu đãi dịch vụ hậu mãi độc quyền Galaxy Z Care và 3 km khác","rating":"5"},{"title":"Xiaomi Redmi Note 17 4GB 128GB","link":"/dien-thoai-xiaomi-redmi-note-17.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-17-purple.jpg","price":"6.390.000đ","oldPrice":"6.990.000đ","discount":"9%","badge":"","smember":"64.000đ","sStudent":"300.000đ","promo":"Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng","rating":"5"},{"title":"Samsung Galaxy A37 5G 8GB 128GB","link":"/dien-thoai-samsung-galaxy-a37.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-a37-2_2.jpg","price":"9.600.000đ","oldPrice":"11.790.000đ","discount":"19%","badge":"","smember":"96.000đ","sStudent":"480.000đ","promo":"Nhận Voucher 500K -mua ngay Robot hút bụi lau nhà, Tivi, Tủ lạnh, Máy giặt (Voucher phát ngay về tin nhắn sau khi mua điện thoại, laptop) và 1 km khác","rating":"5"},{"title":"Samsung Galaxy S25 Ultra 12GB 256GB","link":"/dien-thoai-samsung-galaxy-s25-ultra.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png","price":"25.490.000đ","oldPrice":"33.380.000đ","discount":"24%","badge":"","smember":"255.000đ","sStudent":"500.000đ","promo":"Nhận Voucher 500K -mua ngay Robot hút bụi lau nhà, Tivi, Tủ lạnh, Máy giặt (Voucher phát ngay về tin nhắn sau khi mua điện thoại, laptop)","rating":"4.7"},{"title":"iPhone 18 Pro Max 2TB","link":"/iphone-18-pro-max-2tb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-max-01_3.jpg","price":"80.990.000đ","oldPrice":"","discount":"","badge":"","smember":"810.000đ","sStudent":"","promo":"Chi thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB data/ngày+500 phút gọi Mobifone &amp; VNSKY, miễn phí 30 ngày đầu - chỉ áp dụng tại cửa hàng và 3 km khác","rating":"5"},{"title":"iPhone 18 Pro 512GB","link":"/iphone-18-pro-512gb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-01_1.jpg","price":"45.490.000đ","oldPrice":"","discount":"","badge":"","smember":"455.000đ","sStudent":"","promo":"Ưu đãi 500K cho Apple Watch Series 12, Ultra 4 khi mua kèm Iphone 18 Pro/Pro Max và 3 km khác","rating":"5"},{"title":"Xiaomi POCO F9 Ultra 5G 12GB 256GB","link":"/dien-thoai-xiaomi-poco-f9-ultra.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-poco-f9-ultra-red.jpg","price":"24.990.000đ","oldPrice":"29.990.000đ","discount":"17%","badge":"","smember":"250.000đ","sStudent":"500.000đ","promo":"Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng","rating":"5"},{"title":"Samsung Galaxy Z Fold8 Ultra 5G 12GB 256GB","link":"/dien-thoai-samsung-galaxy-z-fold-8-ultra.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-8-violet-01.jpg","price":"47.490.000đ","oldPrice":"52.990.000đ","discount":"10%","badge":"","smember":"475.000đ","sStudent":"500.000đ","promo":"Ưu đãi dịch vụ hậu mãi độc quyền Galaxy Z Care và 3 km khác","rating":"5"},{"title":"iPhone 18 Pro Max 1TB","link":"/iphone-18-pro-max-1tb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-18-pro-max-01_2.jpg","price":"61.490.000đ","oldPrice":"","discount":"","badge":"","smember":"615.000đ","sStudent":"","promo":"Chi thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB data/ngày+500 phút gọi Mobifone &amp; VNSKY, miễn phí 30 ngày đầu - chỉ áp dụng tại cửa hàng và 3 km khác","rating":"5"},{"title":"iPhone 17 Pro Max 512GB | Chính hãng","link":"/iphone-17-pro-max-512gb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3.jpg","price":"41.390.000đ","oldPrice":"46.490.000đ","discount":"11%","badge":"","smember":"414.000đ","sStudent":"","promo":"Ưu đãi mua kèm Gói cam kết giá thu S-Buy Back vơi giá chỉ từ 1TR (giá gốc chỉ từ 1.4TR) và 3 km khác","rating":"5"},{"title":"iPhone Air 256GB | Chính hãng","link":"/iphone-air-256gb.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_air-3_2.jpg","price":"23.390.000đ","oldPrice":"31.990.000đ","discount":"27%","badge":"","smember":"234.000đ","sStudent":"","promo":"Nhận Voucher 500K -mua ngay Robot hút bụi lau nhà, Tivi, Tủ lạnh, Máy giặt (Voucher phát ngay về tin nhắn sau khi mua điện thoại, laptop) và 1 km khác","rating":"4.9"}]},"tablet":{"bannerImg":"https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/FO6ob1jtxq3hW2T8jHZHNeTFLYzcLQWGqq3oMrgq.png","bannerAlt":"iPad mini 2026","bannerLink":"sanpham.html?category=tablet","seeAllLink":"sanpham.html?category=tablet","demand":[{"name":"Cho trẻ em","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-gamning.png","link":"sanpham.html?category=tablet"},{"name":"Chơi game","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-pin.png","link":"sanpham.html?category=tablet"},{"name":"Đồ hoạ - Sáng tạo","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-chup-anh.png","link":"sanpham.html?category=tablet"},{"name":"Học tập - văn phòng","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Web/icon/mobile-5g_1.png","link":"sanpham.html?category=tablet"},{"name":"Máy tính bảng AI","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/dien-thoai-ai-icon-cate.png","link":"sanpham.html?category=tablet"},{"name":"Máy đọc sách","icon":"https://cdn2.cellphones.com.vn/insecure/rs:fill:96:96/q:90/plain/https://cellphones.com.vn/media/wysiwyg/dien-thoai-pho-thong-icon-cate.png","link":"sanpham.html?category=tablet"}],"brands":["iPad Pro M5","iPad Pro M4 2024","Galaxy Tab S11 Series","iPad","Xiaomi","Samsung","Huawei","Lenovo"],"products":[{"title":"iPad mini (2026) Wifi 128GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-mini-7-wifi-256gb_1.png","price":"19.490.000đ","oldPrice":"","discount":"","badge":"Sắp về hàng","smember":"195.000đ","sStudent":"300.000đ","promo":"Nhận Voucher 500K -mua ngay Robot hút bụi lau nhà, Tivi, Tủ lạnh...","rating":"5"},{"title":"iPad A16 Wifi 128GB 2025 | Chính hãng Apple Việt Nam","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-10-9-inch-wifi-64gb-2022.png","price":"12.090.000đ","oldPrice":"12.790.000đ","discount":"5%","badge":"","smember":"121.000đ","sStudent":"300.000đ","promo":"Tặng voucher giảm thêm 10% khi mua kèm Microsoft Office 365...","rating":"4.8"},{"title":"OPPO Pad Mini Wifi 8GB 256GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-pad-neo.png","price":"24.990.000đ","oldPrice":"","discount":"","badge":"Hàng mới về","smember":"250.000đ","sStudent":"300.000đ","promo":"Tặng Bao da Oppo Pad Mini (Opc2505) Tím (Quà tặng không quy đổi...","rating":"5"},{"title":"Samsung Galaxy Tab S10 FE Wifi 12GB 256GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-s9-fe-wifi.png","price":"13.650.000đ","oldPrice":"16.690.000đ","discount":"18%","badge":"","smember":"137.000đ","sStudent":"800.000đ","promo":"Giảm thêm đến 5 triệu đồng khi mua kèm Tivi/Màn hình Samsung...","rating":"5"},{"title":"iPad Pro 11 inch M4 Wi-Fi 256GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-11-m4-256gb.png","price":"27.990.000đ","oldPrice":"29.990.000đ","discount":"7%","badge":"","smember":"280.000đ","sStudent":"500.000đ","promo":"Giảm thêm đến 500.000đ khi thanh toán thẻ & Smember","rating":"4.9"},{"title":"Xiaomi Pad 6 8GB 128GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-pad-6.png","price":"6.790.000đ","oldPrice":"7.990.000đ","discount":"15%","badge":"","smember":"68.000đ","sStudent":"300.000đ","promo":"Tặng bút cảm ứng stylus + bao da trị giá 1.200.000đ","rating":"4.7"},{"title":"Samsung Galaxy Tab S9 FE 6GB 128GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-s9-fe-wifi.png","price":"7.990.000đ","oldPrice":"9.990.000đ","discount":"20%","badge":"","smember":"80.000đ","sStudent":"400.000đ","promo":"Kèm bút S-Pen kháng nước chuẩn IP68, bảo hành 12 tháng","rating":"4.8"},{"title":"Huawei MatePad 11.5 S","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/h/u/huawei-matepad-11-5s.png","price":"11.990.000đ","oldPrice":"13.490.000đ","discount":"10%","badge":"","smember":"120.000đ","sStudent":"300.000đ","promo":"Màn hình PaperMatte chống chói, tặng bàn phím nam châm","rating":"4.9"},{"title":"Lenovo Tab M11 4GB 128GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/l/e/lenovo-tab-m11.png","price":"4.490.000đ","oldPrice":"5.290.000đ","discount":"15%","badge":"","smember":"45.000đ","sStudent":"200.000đ","promo":"Tặng bút cảm ứng Lenovo Tab Pen, 4 loa Dolby Atmos","rating":"4.6"},{"title":"iPad 10.9 inch 2022 (Gen 10) Wifi 64GB","link":"chitietsanpham/ipad-pro-m4.html","img":"https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-10-9-inch-wifi-64gb-2022.png","price":"9.490.000đ","oldPrice":"10.990.000đ","discount":"14%","badge":"","smember":"95.000đ","sStudent":"300.000đ","promo":"Thu cũ đổi mới trợ giá lên đến 1.000.000đ","rating":"4.9"}]}};

let currentDualTab = 'phone';
let currentDualBrand = 'all';
let currentDualDemand = 'all';
let currentDualPage = 0;

function getDualPageSize() {
    if (typeof window === 'undefined') return 8;
    if (window.innerWidth >= 1024) return 8;
    if (window.innerWidth >= 768) return 6;
    return 4;
}

function initDualCategoryShowcase() {
    const section = document.getElementById('phone-tablet-showcase-section');
    if (!section) return;

    renderDualTabs();
    renderDualBanner();
    renderDualDemand();
    renderDualBrands();
    renderDualProducts();

    const demandTrack = document.getElementById('dual-demand-track');
    if (demandTrack && !demandTrack.dataset.bound) {
        demandTrack.dataset.bound = 'true';
        demandTrack.addEventListener('scroll', updateDualDemandArrows, { passive: true });
        window.addEventListener('resize', updateDualDemandArrows);
    }

    if (!window._dualResizeBound) {
        window._dualResizeBound = true;
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                renderDualProducts();
            }, 100);
        });
    }
}

function renderDualTabs() {
    const tabPhone = document.getElementById('dual-tab-phone');
    const tabTablet = document.getElementById('dual-tab-tablet');
    if (!tabPhone || !tabTablet) return;

    const isPhone = currentDualTab === 'phone';

    const activeClasses = "cat-tab-btn flex-1 py-3 px-2 text-center text-sm sm:text-base font-bold uppercase transition-all duration-200 cursor-pointer border-b-2 border-[#d70018] text-[#d70018] bg-gradient-to-t from-red-50 to-transparent";
    const inactiveClasses = "cat-tab-btn flex-1 py-3 px-2 text-center text-sm sm:text-base font-bold uppercase transition-all duration-200 cursor-pointer border-b border-slate-200 text-neutral-700 hover:text-neutral-900 bg-white";

    tabPhone.className = isPhone ? activeClasses : inactiveClasses;
    tabPhone.setAttribute('aria-selected', isPhone ? 'true' : 'false');

    tabTablet.className = !isPhone ? activeClasses : inactiveClasses;
    tabTablet.setAttribute('aria-selected', !isPhone ? 'true' : 'false');
}

function renderDualBanner() {
    const bannerLink = document.getElementById('dual-banner-link');
    const bannerImg = document.getElementById('dual-banner-img');
    if (!bannerLink || !bannerImg) return;

    const catData = DUAL_SHOWCASE_DATA[currentDualTab];
    if (!catData) return;

    bannerLink.href = catData.bannerLink;
    bannerImg.src = catData.bannerImg;
    bannerImg.alt = catData.bannerAlt;
}

function renderDualDemand() {
    const track = document.getElementById('dual-demand-track');
    if (!track) return;

    const catData = DUAL_SHOWCASE_DATA[currentDualTab];
    if (!catData) return;

    track.innerHTML = catData.demand.map(d => {
        const isActive = currentDualDemand === d.name;
        return `
            <button onclick="selectDualDemand('${d.name}')" class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                isActive 
                    ? 'bg-red-50 border-red-500 text-red-600 font-bold' 
                    : 'bg-[#f4f6f8] hover:bg-[#eaecee] border-transparent text-neutral-800 font-semibold'
            }">
                <img src="${d.icon}" alt="${d.name}" class="w-8 h-8 sm:w-9 sm:h-9 object-contain flex-shrink-0" onerror="this.style.display='none'">
                <span class="text-[11px] sm:text-xs whitespace-nowrap">${d.name}</span>
            </button>
        `;
    }).join('');

    setTimeout(updateDualDemandArrows, 50);
}

function renderDualBrands() {
    const track = document.getElementById('dual-brands-track');
    const seeAll = document.getElementById('dual-see-all-link');
    if (!track) return;

    const catData = DUAL_SHOWCASE_DATA[currentDualTab];
    if (!catData) return;

    if (seeAll) {
        seeAll.href = catData.seeAllLink;
    }

    const allBtn = `
        <button onclick="selectDualBrand('all')" class="px-3 py-1 text-xs sm:text-sm font-medium rounded-full border transition whitespace-nowrap cursor-pointer ${
            currentDualBrand === 'all'
                ? 'bg-red-50 text-red-600 border-red-500 font-bold'
                : 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800'
        }">
            Tất cả
        </button>
    `;

    const brandBtns = catData.brands.map(b => {
        const isActive = currentDualBrand.toLowerCase() === b.toLowerCase();
        return `
            <button onclick="selectDualBrand('${b}')" class="px-3 py-1 text-xs sm:text-sm font-medium rounded-full border transition whitespace-nowrap cursor-pointer ${
                isActive
                    ? 'bg-red-50 text-red-600 border-red-500 font-bold'
                    : 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800'
            }">
                ${b}
            </button>
        `;
    }).join('');

    track.innerHTML = allBtn + brandBtns;
}

function renderDualProducts() {
    const track = document.getElementById('dual-products-track');
    if (!track) return;

    const catData = DUAL_SHOWCASE_DATA[currentDualTab];
    if (!catData) return;

    let items = catData.products;

    if (currentDualBrand !== 'all') {
        const q = currentDualBrand.toLowerCase();
        items = items.filter(p => p.title.toLowerCase().includes(q));
    }

    if (currentDualDemand !== 'all') {
        const q = currentDualDemand.toLowerCase();
        if (q.includes('game')) items = items.filter(p => p.title.toLowerCase().includes('pro') || p.title.toLowerCase().includes('ultra') || p.title.toLowerCase().includes('poco') || p.title.toLowerCase().includes('fold'));
        else if (q.includes('pin')) items = items.filter(p => p.title.toLowerCase().includes('plus') || p.title.toLowerCase().includes('max') || p.title.toLowerCase().includes('ultra') || p.title.toLowerCase().includes('redmi'));
        else if (q.includes('5g')) items = items.filter(p => p.title.includes('5G') || p.title.toLowerCase().includes('pro'));
        else if (q.includes('chụp ảnh')) items = items.filter(p => p.title.toLowerCase().includes('pro') || p.title.toLowerCase().includes('ultra') || p.title.toLowerCase().includes('find'));
        else if (q.includes('gập')) items = items.filter(p => p.title.toLowerCase().includes('fold') || p.title.toLowerCase().includes('flip') || p.title.toLowerCase().includes('duo'));
        else if (q.includes('ai')) items = items.filter(p => p.title.toLowerCase().includes('s26') || p.title.toLowerCase().includes('s25') || p.title.toLowerCase().includes('18'));
    }

    if (items.length === 0) {
        items = catData.products;
    }

    const pageSize = getDualPageSize();
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    if (currentDualPage >= totalPages) currentDualPage = totalPages - 1;
    if (currentDualPage < 0) currentDualPage = 0;

    const pageItems = items.slice(currentDualPage * pageSize, (currentDualPage + 1) * pageSize);

    track.innerHTML = pageItems.map(card => {
        return `
            <div class="product-item animate-fade-in relative flex flex-col rounded-2xl bg-white border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-200 overflow-hidden group h-full justify-between">
                <a href="${card.link}" class="flex-1 p-2 sm:p-2.5 pb-0 flex flex-col relative">
                    ${card.discount ? `
                    <div class="absolute top-0 left-3 z-10 flex px-2 py-0.5 items-center justify-center text-[10px] font-bold text-white rounded-b-md bg-[#d70018] shadow-xs">
                        Giảm ${card.discount}
                    </div>` : ''}
                    <div class="absolute top-0 right-0 z-10 flex px-1.5 py-0.5 items-center justify-center text-[10px] font-medium text-blue-600 bg-blue-50 rounded-bl-lg rounded-tr-2xl">
                        Trả góp <span class="font-bold ml-0.5">0%</span>
                    </div>

                    <div class="relative w-full aspect-square flex items-center justify-center mb-1 overflow-hidden">
                        <img alt="${card.title}" loading="lazy" width="300" height="300" class="w-full h-full object-contain p-1.5 scale-90 group-hover:scale-100 transition-transform duration-300" src="${card.img}" onerror="this.src='https://cellphones.com.vn/media/wysiwyg/placehoder.png'">
                    </div>

                    <h3 title="${card.title}" class="mb-1 line-clamp-2 h-8 sm:h-9 text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-red-600 transition leading-snug">
                        ${card.title}
                    </h3>

                    ${card.badge ? `
                    <div class="mb-1 w-fit rounded-sm px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        ${card.badge}
                    </div>` : ''}

                    <div class="mb-1 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
                        <p class="text-xs sm:text-base font-bold text-red-600">${card.price}</p>
                        ${card.oldPrice ? `<p class="text-[10px] sm:text-xs text-neutral-400 line-through">${card.oldPrice}</p>` : ''}
                    </div>

                    ${card.smember ? `
                    <div class="mb-1 rounded-sm bg-blue-50 text-blue-900 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold truncate">
                        Smember giảm đến <span class="font-bold">${card.smember}</span>
                    </div>` : ''}

                    ${card.sStudent ? `
                    <div class="mb-1 rounded-sm bg-purple-50 text-purple-900 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold truncate">
                        S-Student giảm thêm <span class="font-bold">${card.sStudent}</span>
                    </div>` : ''}

                    ${card.promo ? `
                    <div class="mb-1 flex items-center gap-1 rounded-sm bg-neutral-100 p-1 text-[9px] sm:text-[10px] text-neutral-700 line-clamp-2 mt-auto">
                        ${card.promo}
                    </div>` : '<div class="mt-auto"></div>'}
                </a>

                <div class="flex items-center justify-between px-2 sm:px-2.5 pt-1.5 pb-2 border-t border-slate-50 mt-1 bg-white">
                    <div class="flex items-center gap-1 bg-[#1e97ee] text-white rounded px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold">
                        <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span>2 Giờ</span>
                    </div>

                    <div class="flex items-center gap-0.5 text-xs font-bold text-neutral-700 ml-auto mr-1.5">
                        <svg class="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span>${card.rating || '5'}</span>
                    </div>

                    <button onclick="toggleMegaWishlist(this, '${card.title}')" class="text-neutral-400 hover:text-red-500 transition p-1 cursor-pointer" aria-label="Yêu thích">
                        <i class="fa-regular fa-heart text-sm"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    updateDualProductArrows(totalPages);
}

function updateDualProductArrows(totalPages) {
    const prevBtn = document.getElementById('dual-prod-prev');
    const nextBtn = document.getElementById('dual-prod-next');
    if (!prevBtn || !nextBtn) return;

    if (currentDualPage <= 0) {
        prevBtn.classList.add('opacity-0', 'pointer-events-none');
    } else {
        prevBtn.classList.remove('opacity-0', 'pointer-events-none');
    }

    if (currentDualPage >= totalPages - 1) {
        nextBtn.classList.add('opacity-0', 'pointer-events-none');
    } else {
        nextBtn.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function updateDualDemandArrows() {
    const track = document.getElementById('dual-demand-track');
    const prevBtn = document.getElementById('dual-demand-prev');
    const nextBtn = document.getElementById('dual-demand-next');
    if (!track || !prevBtn || !nextBtn) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const current = track.scrollLeft;

    if (current <= 8) {
        prevBtn.classList.add('opacity-0', 'pointer-events-none');
    } else {
        prevBtn.classList.remove('opacity-0', 'pointer-events-none');
    }

    if (current >= maxScroll - 8) {
        nextBtn.classList.add('opacity-0', 'pointer-events-none');
    } else {
        nextBtn.classList.remove('opacity-0', 'pointer-events-none');
    }
}

window.selectPhoneTabletTab = function(tabId) {
    currentDualTab = tabId;
    currentDualBrand = 'all';
    currentDualDemand = 'all';
    currentDualPage = 0;

    renderDualTabs();
    renderDualBanner();
    renderDualDemand();
    renderDualBrands();
    renderDualProducts();
};

window.selectDualBrand = function(brand) {
    if (currentDualBrand.toLowerCase() === brand.toLowerCase() && brand !== 'all') {
        currentDualBrand = 'all';
    } else {
        currentDualBrand = brand;
    }
    currentDualPage = 0;
    renderDualBrands();
    renderDualProducts();
};

window.selectDualDemand = function(demand) {
    if (currentDualDemand === demand) {
        currentDualDemand = 'all';
    } else {
        currentDualDemand = demand;
    }
    currentDualPage = 0;
    renderDualDemand();
    renderDualProducts();
};

window.scrollDualProducts = function(direction) {
    const catData = DUAL_SHOWCASE_DATA[currentDualTab];
    if (!catData) return;

    let items = catData.products;
    if (currentDualBrand !== 'all') {
        const q = currentDualBrand.toLowerCase();
        items = items.filter(p => p.title.toLowerCase().includes(q));
    }
    if (currentDualDemand !== 'all') {
        const q = currentDualDemand.toLowerCase();
        if (q.includes('game')) items = items.filter(p => p.title.toLowerCase().includes('pro') || p.title.toLowerCase().includes('ultra') || p.title.toLowerCase().includes('poco') || p.title.toLowerCase().includes('fold'));
        else if (q.includes('pin')) items = items.filter(p => p.title.toLowerCase().includes('plus') || p.title.toLowerCase().includes('max') || p.title.toLowerCase().includes('ultra') || p.title.toLowerCase().includes('redmi'));
        else if (q.includes('5g')) items = items.filter(p => p.title.includes('5G') || p.title.toLowerCase().includes('pro'));
        else if (q.includes('chụp ảnh')) items = items.filter(p => p.title.toLowerCase().includes('pro') || p.title.toLowerCase().includes('ultra') || p.title.toLowerCase().includes('find'));
        else if (q.includes('gập')) items = items.filter(p => p.title.toLowerCase().includes('fold') || p.title.toLowerCase().includes('flip') || p.title.toLowerCase().includes('duo'));
        else if (q.includes('ai')) items = items.filter(p => p.title.toLowerCase().includes('s26') || p.title.toLowerCase().includes('s25') || p.title.toLowerCase().includes('18'));
    }
    if (items.length === 0) items = catData.products;

    const pageSize = getDualPageSize();
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    const newPage = currentDualPage + direction;
    if (newPage >= 0 && newPage < totalPages) {
        currentDualPage = newPage;
        renderDualProducts();
    }
};

window.scrollDualDemand = function(direction) {
    const track = document.getElementById('dual-demand-track');
    if (!track) return;
    track.scrollBy({ left: direction * 200, behavior: 'smooth' });
    setTimeout(updateDualDemandArrows, 150);
    setTimeout(updateDualDemandArrows, 350);
};

function renderIndexPage() {
    if (typeof PRODUCTS === 'undefined') return;

    initHeroSlider();
    initMegaTrendShowcase();
    initDualCategoryShowcase();

    const flashSaleContainer = document.getElementById('flash-sale-grid');

    if (flashSaleContainer && typeof getFlashSaleProducts === 'function') {
        const flashItems = getFlashSaleProducts(4);
        flashSaleContainer.innerHTML = flashItems.map((p, idx) => {
            const soldCount = [8, 12, 6, 9][idx % 4];
            const maxCount = [10, 15, 10, 10][idx % 4];
            const percent = Math.round((soldCount / maxCount) * 100);
            return `
            <div class="product-item bg-white text-slate-900 rounded-2xl overflow-hidden shadow-box-md border border-slate-100 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition duration-300">
                <div class="relative bg-slate-50 p-2.5 sm:p-4 overflow-hidden">
                    <span class="absolute top-2 left-2 bg-[#d70018] text-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-md z-10 shadow-sm">
                        Giảm ${p.discount}%
                    </span>
                    <span class="absolute top-2 right-2 bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-200 z-10">
                        Trả góp 0%
                    </span>
                    <a href="chitietsanpham/${p.slug}.html" class="block">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-36 sm:h-48 object-cover rounded-xl group-hover:scale-105 transition duration-300">
                    </a>
                </div>
                <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-1.5 mb-1">
                            <span class="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded">${p.brand}</span>
                            <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <i class="fa-solid fa-truck-fast text-[9px]"></i> Giao 2H
                            </span>
                        </div>
                        <h3 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-1 hover:text-red-600 transition">
                            <a href="chitietsanpham/${p.slug}.html">${p.name}</a>
                        </h3>
                        <div class="flex items-center gap-1 text-amber-400 text-[11px] sm:text-xs mt-1.5">
                            <i class="fa-solid fa-star"></i>
                            <span class="font-bold text-slate-700">${p.rating}</span>
                            <span class="text-slate-400">(${p.reviewsCount})</span>
                        </div>
                    </div>

                    <!-- Authentic CellphoneS Promotion Tag -->
                    <div class="promotion my-2">
                        <div class="promo-list">
                            <ul>
                                <li class="pmh-title">Ưu đãi</li>
                                <li class="pmh-content">Smember</li>
                            </ul>
                        </div>
                        <p class="coupon-price">Smember giảm thêm đến 500.000₫ & tích điểm 2%</p>
                    </div>
                    
                    <div class="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100">
                        <!-- Prices -->
                        <div class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                            <span class="text-sm sm:text-base font-black text-red-600">${formatCurrency(p.price)}</span>
                            <span class="text-[11px] sm:text-xs text-slate-400 line-through">${formatCurrency(p.originalPrice)}</span>
                        </div>

                        <!-- Sold Progress Bar (CellphoneS Iconic Feature) -->
                        <div class="relative w-full bg-red-100 rounded-full h-4 overflow-hidden my-2 flex items-center justify-center">
                            <div class="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500" style="width: ${percent}%;"></div>
                            <span class="relative z-10 text-[9px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1">
                                <i class="fa-solid fa-fire text-amber-200 animate-pulse text-[8px]"></i> Đã bán ${soldCount}/${maxCount} suất
                            </span>
                        </div>

                        <!-- 2 Buttons -->
                        <div class="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2">
                            <a href="chitietsanpham/${p.slug}.html" class="text-center py-1.5 sm:py-2 px-1 rounded-lg border border-slate-300 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-100 transition truncate">
                                Chi tiết
                            </a>
                            <button onclick="quickAddToCart('${p.id}')" class="py-1.5 sm:py-2 px-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm shadow-red-500/20 truncate">
                                <i class="fa-solid fa-cart-plus text-[10px]"></i> <span>Thêm</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    renderTrendProducts();
}

// --- TRANG DANH SÁCH SẢN PHẨM (sanpham.html) ---
let prodCat = 'all';
let prodPrice = 'all';
let prodBrand = 'all';
let prodSearch = '';
let prodSort = 'default';

function renderProductsPage() {
    if (typeof PRODUCTS === 'undefined') return;

    // Đọc URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category')) {
        prodCat = urlParams.get('category');
        const r = document.querySelector(`input[name="filter-category"][value="${prodCat}"]`);
        if (r) r.checked = true;
    }
    if (urlParams.get('search')) {
        prodSearch = urlParams.get('search');
        const s = document.getElementById('filter-search-input');
        if (s) s.value = prodSearch;
    }

    // Gán sự kiện bộ lọc
    setupProductFilterEvents();
    // Render ngay danh sách sản phẩm
    applyAndRenderProducts();
}

function setupProductFilterEvents() {
    document.querySelectorAll('input[name="filter-category"]').forEach(r => {
        r.onchange = (e) => { prodCat = e.target.value; applyAndRenderProducts(); };
    });

    document.querySelectorAll('input[name="filter-price"]').forEach(r => {
        r.onchange = (e) => { prodPrice = e.target.value; applyAndRenderProducts(); };
    });

    document.querySelectorAll('.brand-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.brand-btn').forEach(b => {
                b.classList.remove('bg-red-600', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-700');
            });
            btn.classList.add('bg-red-600', 'text-white');
            btn.classList.remove('bg-slate-100', 'text-slate-700');
            prodBrand = btn.getAttribute('data-brand') || 'all';
            applyAndRenderProducts();
        };
    });

    const searchInput = document.getElementById('filter-search-input');
    if (searchInput) {
        searchInput.oninput = (e) => {
            prodSearch = e.target.value.trim().toLowerCase();
            applyAndRenderProducts();
        };
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.onchange = (e) => {
            prodSort = e.target.value;
            applyAndRenderProducts();
        };
    }

    const resetBtn = document.getElementById('reset-filters-btn');
    const clearAllBtn = document.getElementById('clear-all-filters-btn');
    const resetFilterAction = () => {
        prodCat = 'all'; prodPrice = 'all'; prodBrand = 'all'; prodSearch = ''; prodSort = 'default';
        const rAll = document.querySelector('input[name="filter-category"][value="all"]');
        if (rAll) rAll.checked = true;
        const pAll = document.querySelector('input[name="filter-price"][value="all"]');
        if (pAll) pAll.checked = true;
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        document.querySelectorAll('.brand-btn').forEach(b => {
            if (b.getAttribute('data-brand') === 'all') {
                b.classList.add('bg-red-600', 'text-white');
                b.classList.remove('bg-slate-100', 'text-slate-700');
            } else {
                b.classList.remove('bg-red-600', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-700');
            }
        });
        applyAndRenderProducts();
    };

    if (resetBtn) resetBtn.onclick = resetFilterAction;
    if (clearAllBtn) clearAllBtn.onclick = resetFilterAction;
}

function applyAndRenderProducts() {
    if (typeof PRODUCTS === 'undefined') return;
    let list = [...PRODUCTS];

    if (prodCat !== 'all') list = list.filter(p => p.category === prodCat);
    if (prodPrice === 'under-10m') list = list.filter(p => p.price < 10000000);
    else if (prodPrice === '10m-20m') list = list.filter(p => p.price >= 10000000 && p.price <= 20000000);
    else if (prodPrice === '20m-30m') list = list.filter(p => p.price > 20000000 && p.price <= 30000000);
    else if (prodPrice === 'above-30m') list = list.filter(p => p.price > 30000000);

    if (prodBrand !== 'all') list = list.filter(p => p.brand.toLowerCase() === prodBrand.toLowerCase());

    if (prodSearch) {
        list = list.filter(p => 
            p.name.toLowerCase().includes(prodSearch) || 
            p.brand.toLowerCase().includes(prodSearch) ||
            p.shortDesc.toLowerCase().includes(prodSearch)
        );
    }

    if (prodSort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (prodSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (prodSort === 'rating-desc') list.sort((a, b) => b.rating - a.rating);

    const titleEl = document.getElementById('category-title');
    const countEl = document.getElementById('results-count');
    const catMap = {
        all: 'Tất Cả Sản Phẩm',
        phone: 'Điện Thoại Thông Minh',
        laptop: 'Laptop & Máy Tính',
        tablet: 'Máy Tính Bảng (Tablet)',
        accessory: 'Tai Nghe & Phụ Kiện',
        smartwatch: 'Đồng Hồ Thông Minh'
    };
    if (titleEl) titleEl.textContent = catMap[prodCat] || 'Sản Phẩm';
    if (countEl) countEl.textContent = `Hiển thị ${list.length} sản phẩm`;

    const gridEl = document.getElementById('products-grid');
    const emptyEl = document.getElementById('empty-state');
    if (!gridEl) return;

    if (list.length === 0) {
        gridEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    gridEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');

    gridEl.innerHTML = list.map(p => `
        <div class="product-item bg-white rounded-2xl overflow-hidden shadow-box-md border border-slate-200/60 flex flex-col justify-between group hover:shadow-xl hover:border-red-400 transition duration-300">
            <div class="relative bg-slate-50 p-2.5 sm:p-4">
                ${p.discount > 0 ? `
                    <span class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-red-600 text-white font-bold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg z-10 shadow-sm">
                        -${p.discount}%
                    </span>
                ` : ''}
                <span class="absolute top-2.5 right-2.5 bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-200 z-10">
                    Trả góp 0%
                </span>
                <a href="chitietsanpham/${p.slug}.html" class="block overflow-hidden rounded-xl">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-36 sm:h-48 object-cover rounded-xl group-hover:scale-105 transition duration-300">
                </a>
            </div>
            <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-1">
                        <span class="font-bold text-red-600 uppercase">${p.brand}</span>
                        <span class="truncate ml-1">${p.categoryName}</span>
                    </div>
                    <h3 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-red-600 transition">
                        <a href="chitietsanpham/${p.slug}.html">${p.name}</a>
                    </h3>
                    <div class="flex items-center gap-1 text-amber-400 text-[11px] sm:text-xs mt-1.5 sm:mt-2">
                        <i class="fa-solid fa-star"></i>
                        <span class="font-bold text-slate-700">${p.rating}</span>
                        <span class="text-slate-400">(${p.reviewsCount})</span>
                    </div>
                </div>

                <!-- Authentic CellphoneS Promotion Tag -->
                <div class="promotion my-2">
                    <div class="promo-list">
                        <ul>
                            <li class="pmh-title">Ưu đãi</li>
                            <li class="pmh-content">Smember</li>
                        </ul>
                    </div>
                    <p class="coupon-price">Smember giảm thêm đến 500.000₫ & bảo hành 12 tháng</p>
                </div>

                <div class="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100">
                    <div class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                        <span class="text-sm sm:text-base font-extrabold text-red-600">${formatCurrency(p.price)}</span>
                        ${p.originalPrice > p.price ? `<span class="text-[11px] sm:text-xs text-slate-400 line-through">${formatCurrency(p.originalPrice)}</span>` : ''}
                    </div>

                    <div class="my-1.5 p-1 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-600 flex items-center justify-between">
                        <span>Giao siêu tốc</span>
                        <span class="font-bold text-emerald-600">Miễn phí 2H</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                        <a href="chitietsanpham/${p.slug}.html" class="text-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-50 transition truncate">
                            Chi tiết
                        </a>
                        <button onclick="quickAddToCart('${p.id}')" class="py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm shadow-red-500/20 truncate">
                            <i class="fa-solid fa-cart-plus text-[10px] sm:text-xs"></i> <span>Thêm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// --- TRANG KHUYẾN MÃI (khuyenmai.html) ---
function renderKhuyenMaiPage() {
    if (typeof PRODUCTS === 'undefined') return;
    const grid = document.getElementById('promo-products-grid');
    if (grid) {
        const saleItems = PRODUCTS.filter(p => p.discount > 0);
        grid.innerHTML = saleItems.map(p => `
            <div class="product-item bg-white rounded-2xl overflow-hidden shadow-box-md border border-slate-200/60 flex flex-col justify-between group hover:shadow-xl hover:border-red-400 transition duration-300">
                <div class="relative bg-slate-50 p-2.5 sm:p-4">
                    <span class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-red-600 text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg z-10 shadow-sm animate-pulse">
                        -${p.discount}%
                    </span>
                    <a href="chitietsanpham/${p.slug}.html" class="block">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-36 sm:h-48 object-cover rounded-xl group-hover:scale-105 transition duration-300">
                    </a>
                </div>
                <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] sm:text-[11px] font-bold text-red-600 uppercase tracking-wide">${p.brand}</span>
                        <h3 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-1 hover:text-red-600 transition">
                            <a href="chitietsanpham/${p.slug}.html">${p.name}</a>
                        </h3>
                    </div>

                    <!-- Authentic CellphoneS Promotion Tag -->
                    <div class="promotion my-2">
                        <div class="promo-list">
                            <ul>
                                <li class="pmh-title">Ưu đãi</li>
                                <li class="pmh-content">Smember</li>
                            </ul>
                        </div>
                        <p class="coupon-price">Giảm thêm 500.000₫ & tích điểm 2%</p>
                    </div>

                    <div class="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100">
                        <div class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                            <span class="text-sm sm:text-base font-extrabold text-red-600">${formatCurrency(p.price)}</span>
                            <span class="text-[11px] sm:text-xs text-slate-400 line-through">${formatCurrency(p.originalPrice)}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                            <a href="chitietsanpham/${p.slug}.html" class="text-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl border border-slate-300 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-100 transition truncate">
                                Chi tiết
                            </a>
                            <button onclick="quickAddToCart('${p.id}')" class="py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm shadow-red-500/20 truncate">
                                <i class="fa-solid fa-cart-plus text-[10px] sm:text-xs"></i> <span>Thêm</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// --- TRANG GIỎ HÀNG (giohang.html) ---
function renderCartPageDynamic() {
    if (typeof getCart !== 'function') return;
    const cart = getCart();
    const emptyView = document.getElementById('empty-cart-view');
    const activeView = document.getElementById('active-cart-view');
    const itemsList = document.getElementById('cart-items-list');
    const countBadge = document.getElementById('cart-items-count-badge');

    if (!emptyView || !activeView) return;

    if (!cart || cart.length === 0) {
        emptyView.classList.remove('hidden');
        activeView.classList.add('hidden');
        return;
    }

    emptyView.classList.add('hidden');
    activeView.classList.remove('hidden');

    const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (countBadge) countBadge.textContent = `${totalItemCount} món`;

    if (itemsList) {
        itemsList.innerHTML = cart.map(item => `
            <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 group">
                <a href="chitietsanpham/${item.slug}.html" class="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition">
                </a>
                <div class="flex-1 text-center sm:text-left">
                    <h4 class="font-bold text-sm text-slate-900 hover:text-blue-600 transition">
                        <a href="chitietsanpham/${item.slug}.html">${item.name}</a>
                    </h4>
                    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                        ${item.color ? `<span class="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded">${item.color}</span>` : ''}
                        ${item.storage ? `<span class="bg-blue-50 text-blue-600 text-[11px] px-2 py-0.5 rounded font-semibold">${item.storage}</span>` : ''}
                    </div>
                    <div class="sm:hidden font-extrabold text-blue-600 text-sm mt-2">
                        ${formatCurrency(item.price)}
                    </div>
                </div>
                <div class="hidden sm:block text-right">
                    <p class="text-xs text-slate-400">Đơn giá</p>
                    <p class="font-bold text-sm text-slate-700">${formatCurrency(item.price)}</p>
                </div>
                <div class="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                    <button onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity - 1}); renderCartPageDynamic();" class="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition font-bold text-sm">-</button>
                    <span class="w-9 h-8 flex items-center justify-center font-bold text-xs text-slate-800">${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity + 1}); renderCartPageDynamic();" class="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition font-bold text-sm">+</button>
                </div>
                <div class="text-right min-w-[100px]">
                    <p class="hidden sm:block text-xs text-slate-400">Thành tiền</p>
                    <p class="font-extrabold text-sm text-blue-600">${formatCurrency(item.price * item.quantity)}</p>
                </div>
                <button onclick="removeFromCart('${item.cartItemId}'); renderCartPageDynamic();" class="p-2 text-slate-400 hover:text-red-500 transition" title="Xóa sản phẩm">
                    <i class="fa-regular fa-trash-can text-sm"></i>
                </button>
            </div>
        `).join('');
    }

    updateCartSummaryView();
}

function updateCartSummaryView() {
    if (typeof calculateCartTotals !== 'function') return;
    const totals = calculateCartTotals();
    const subtotalEl = document.getElementById('summary-subtotal');
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (discountRow && discountEl) {
        if (totals.discount > 0) {
            discountRow.classList.remove('hidden');
            discountEl.textContent = `-${formatCurrency(totals.discount)}`;
        } else {
            discountRow.classList.add('hidden');
        }
    }
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'Miễn phí' : formatCurrency(totals.shipping);
    if (totalEl) totalEl.textContent = formatCurrency(totals.finalTotal);
}

// --- TRANG THANH TOÁN (thanhtoan.html) ---
function renderCheckoutPageDynamic() {
    if (typeof getCart !== 'function') return;
    const cart = getCart();
    const listEl = document.getElementById('checkout-items-list');
    if (!listEl) return;

    if (!cart || cart.length === 0) {
        listEl.innerHTML = `<p class="text-xs text-slate-500 py-4 text-center">Không có sản phẩm nào trong giỏ hàng. <a href="sanpham.html" class="text-blue-600 underline">Mua sắm ngay</a></p>`;
        return;
    }

    listEl.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0">
            <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-slate-900 truncate">${item.name}</h4>
                <p class="text-[10px] text-slate-500">${item.color || ''} ${item.storage ? '• ' + item.storage : ''} (SL: ${item.quantity})</p>
            </div>
            <span class="text-xs font-bold text-slate-800 flex-shrink-0">${formatCurrency(item.price * item.quantity)}</span>
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

    // Setup toggles và form submit
    const radios = document.querySelectorAll('input[name="payment_method"]');
    const qrBox = document.getElementById('vietqr-preview-box');
    radios.forEach(radio => {
        radio.onchange = () => {
            document.querySelectorAll('.payment-radio-option').forEach(opt => {
                opt.classList.remove('border-blue-600', 'bg-blue-50/40');
                opt.classList.add('border-slate-200');
            });
            radio.closest('label').classList.add('border-blue-600', 'bg-blue-50/40');
            radio.closest('label').classList.remove('border-slate-200');
            if (qrBox) {
                if (radio.value === 'VIETQR') qrBox.classList.remove('hidden');
                else qrBox.classList.add('hidden');
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
            const city = document.getElementById('cust-city').value;
            const district = document.getElementById('cust-district').value;
            const address = document.getElementById('cust-address').value;
            const currentTotals = calculateCartTotals();
            const orderCode = 'TP-' + Math.floor(10000 + Math.random() * 90000);

            const modalCode = document.getElementById('success-order-code');
            const modalName = document.getElementById('success-cust-name');
            const modalPhone = document.getElementById('success-cust-phone');
            const modalAddr = document.getElementById('success-cust-addr');
            const modalTotal = document.getElementById('success-total-amount');

            if (modalCode) modalCode.textContent = '#' + orderCode;
            if (modalName) modalName.textContent = name;
            if (modalPhone) modalPhone.textContent = phone;
            if (modalAddr) modalAddr.textContent = `${address}, ${district}, ${city}`;
            if (modalTotal) modalTotal.textContent = formatCurrency(currentTotals.finalTotal);

            clearCart();
            const modal = document.getElementById('order-success-modal');
            if (modal) modal.classList.remove('hidden');
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
        relatedContainer.innerHTML = related.map(p => `
            <div class="product-item bg-white rounded-2xl overflow-hidden shadow-box-md border border-slate-200/60 flex flex-col justify-between group hover:shadow-lg transition">
                <div class="relative bg-slate-50 p-2.5 sm:p-4">
                    <a href="${p.slug}.html" class="block">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-32 sm:h-40 object-cover rounded-xl group-hover:scale-105 transition">
                    </a>
                </div>
                <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] font-bold text-red-600 uppercase">${p.brand}</span>
                        <h4 class="font-bold text-xs text-slate-900 line-clamp-2 mt-1 hover:text-red-600">
                            <a href="${p.slug}.html">${p.name}</a>
                        </h4>
                    </div>
                    <div class="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span class="font-extrabold text-xs sm:text-sm text-red-600">${formatCurrency(p.price)}</span>
                        <a href="${p.slug}.html" class="text-[11px] sm:text-xs bg-slate-100 hover:bg-red-600 hover:text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-semibold transition">
                            Xem
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
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
                title: "Gửi liên hệ thành công!",
                message: `Cảm ơn ${name}! Chúng tôi sẽ liên hệ lại với bạn trong ít phút.`,
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
            const accountInput = document.getElementById('login-account') || document.getElementById('login-phone');
            const account = accountInput ? accountInput.value : 'Quý khách';
            showToast({
                title: "Đăng nhập thành công!",
                message: `Xin chào ${account}! Đang chuyển hướng về trang chủ...`,
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
                message: `Chào mừng ${name}! Voucher 500.000₫ đã sẵn sàng trong tài khoản.`,
                type: "success"
            });
            setTimeout(() => {
                navigateTo('dangnhap.html');
            }, 1500);
        };
    }
}

// --- GLOBAL EVENT HELPERS (DÙNG CHO TẤT CẢ CÁC TRANG & SPA) ---
window.selectedStorage = "256GB";
window.selectedColor = "Titan Tự Nhiên";
window.currentDetailQty = 1;

window.changeMainImage = function(src, btn) {
    const mainImg = document.getElementById('main-product-img');
    if (mainImg) mainImg.src = src;
    document.querySelectorAll('.thumbnail-btn').forEach(b => {
        b.classList.remove('border-blue-600');
        b.classList.add('border-transparent');
    });
    if (btn) {
        btn.classList.add('border-blue-600');
        btn.classList.remove('border-transparent');
    }
};

window.selectStorage = function(val, btn) {
    window.selectedStorage = val;
    const txt = document.getElementById('selected-storage-text');
    if (txt) txt.textContent = val;
    document.querySelectorAll('.storage-btn').forEach(b => {
        b.classList.remove('border-blue-600', 'bg-blue-50/50', 'text-blue-700', 'font-bold');
        b.classList.add('border-slate-200', 'text-slate-700', 'font-medium');
    });
    if (btn) {
        btn.classList.add('border-blue-600', 'bg-blue-50/50', 'text-blue-700', 'font-bold');
        btn.classList.remove('border-slate-200', 'text-slate-700', 'font-medium');
    }
};

window.selectColor = function(val, btn) {
    window.selectedColor = val;
    const txt = document.getElementById('selected-color-text');
    if (txt) txt.textContent = val;
    document.querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('border-blue-600', 'bg-blue-50/50', 'text-blue-700', 'font-bold');
        b.classList.add('border-slate-200', 'text-slate-700', 'font-medium');
    });
    if (btn) {
        btn.classList.add('border-blue-600', 'bg-blue-50/50', 'text-blue-700', 'font-bold');
        btn.classList.remove('border-slate-200', 'text-slate-700', 'font-medium');
    }
};

window.changeQty = function(delta) {
    window.currentDetailQty = Math.max(1, Math.min(10, (window.currentDetailQty || 1) + delta));
    const input = document.getElementById('detail-qty');
    if (input) input.value = window.currentDetailQty;
};

window.switchTab = function(tab) {
    const descBtn = document.getElementById('tab-btn-desc');
    const specsBtn = document.getElementById('tab-btn-specs');
    const descContent = document.getElementById('tab-content-desc');
    const specsContent = document.getElementById('tab-content-specs');

    if (tab === 'desc') {
        if (descBtn) descBtn.className = "pb-3 border-b-2 border-blue-600 text-blue-600 font-bold";
        if (specsBtn) specsBtn.className = "pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-900 font-bold";
        if (descContent) descContent.classList.remove('hidden');
        if (specsContent) specsContent.classList.add('hidden');
    } else {
        if (specsBtn) specsBtn.className = "pb-3 border-b-2 border-blue-600 text-blue-600 font-bold";
        if (descBtn) descBtn.className = "pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-900 font-bold";
        if (specsContent) specsContent.classList.remove('hidden');
        if (descContent) descContent.classList.add('hidden');
    }
};

window.handleAddToCartClick = function() {
    const currentSlug = window.location.pathname.split('/').pop().replace('.html', '');
    const prod = (typeof getProductBySlug === 'function') ? getProductBySlug(currentSlug) : null;
    if (prod && typeof addToCart === 'function') {
        addToCart(prod, window.currentDetailQty || 1, { color: window.selectedColor, storage: window.selectedStorage });
    }
};

window.handleBuyNowClick = function() {
    window.handleAddToCartClick();
    navigateTo('../thanhtoan.html');
};

// Coupon Helpers trong Giỏ hàng
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
            alertEl.className = "mt-2 text-[11px] p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200";
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

// Global Quick Add Handler
window.quickAddToCart = function(productId) {
    if (typeof getProductById === 'function' && typeof addToCart === 'function') {
        const product = getProductById(productId);
        if (product) addToCart(product, 1);
    }
};

// Global Copy Voucher Handler
window.copyVoucher = function(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast({
                title: "Đã sao chép mã voucher!",
                message: `Mã "${code}" đã sẵn sàng. Hãy dán vào giỏ hàng để nhận giảm giá.`,
                type: "success"
            });
        }).catch(() => {
            showToast({
                title: "Mã giảm giá:",
                message: `Mã của bạn là: ${code}`,
                type: "success"
            });
        });
    } else {
        showToast({
            title: "Mã giảm giá:",
            message: `Mã của bạn là: ${code}`,
            type: "success"
        });
    }
};

// Global Auth Helpers
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
            message: "Chào mừng bạn quay lại hệ sinh thái TechPulse.",
            type: "success"
        });
    }
    setTimeout(() => {
        if (typeof navigateTo === 'function') {
            navigateTo('index.html');
        } else {
            window.location.href = 'index.html';
        }
    }, 1200);
};

// =========================================================================
// 12. TECHPULSE AI CHATBOT & FLOATING ACTIONS (CARESOFT CELLPHONES STYLE)
// =========================================================================

function formatPriceChat(val) {
    if (!val) return '0₫';
    return Number(val).toLocaleString('vi-VN') + '₫';
}

function escapeHtmlChat(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

window.toggleAIChatModal = function() {
    const modal = document.getElementById('ai-chat-modal');
    if (!modal) return;
    const isHidden = modal.classList.contains('hidden');
    if (isHidden) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            const input = document.getElementById('ai-chat-input');
            if (input) input.focus();
            const container = document.getElementById('ai-chat-messages');
            if (container) container.scrollTop = container.scrollHeight;
        }, 100);
    } else {
        modal.classList.add('hidden');
    }
};

window.handleInsertEmoji = function(emoji) {
    const input = document.getElementById('ai-chat-input');
    if (input) {
        input.value += emoji;
        input.focus();
    }
};

window.handleQuickPrompt = function(promptText) {
    const input = document.getElementById('ai-chat-input');
    if (input) {
        input.value = promptText;
    }
    const form = document.getElementById('ai-chat-form');
    if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
};

window.handleSendAIChat = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    const msgContainer = document.getElementById('ai-chat-messages');
    if (!input || !msgContainer) return;

    const query = input.value.trim();
    if (!query) return;

    // 1. Thêm tin nhắn của User vào khung chat (bên phải, màu đỏ #d70018)
    const userMsgHtml = `
        <div class="flex items-start justify-end gap-2">
            <div class="space-y-1 max-w-[85%]">
                <div class="bg-[#d70018] text-white p-3 rounded-2xl rounded-tr-sm shadow-sm leading-relaxed text-xs">
                    <p>${escapeHtmlChat(query)}</p>
                </div>
                <p class="text-[10px] text-slate-400 text-right pr-1 font-medium">Bạn • Vừa xong</p>
            </div>
        </div>
    `;
    msgContainer.insertAdjacentHTML('beforeend', userMsgHtml);
    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // 2. Hiển thị Typing Indicator ("Đang soạn câu trả lời...")
    const typingId = 'typing-' + Date.now();
    const typingHtml = `
        <div id="${typingId}" class="flex items-start gap-2">
            <div class="w-7 h-7 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 flex-shrink-0 mt-0.5">
                <svg class="w-full h-full" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="18" fill="#ffffff"/>
                    <circle cx="18" cy="20" r="10" fill="#d70018"/>
                    <ellipse cx="18" cy="22" rx="7" ry="6" fill="#ffffff"/>
                    <circle cx="15" cy="18" r="2" fill="#1d1d20"/>
                    <circle cx="21" cy="18" r="2" fill="#1d1d20"/>
                    <path d="M15 22.5c1 1.2 5 1.2 6 0" stroke="#d70018" stroke-width="1.8" stroke-linecap="round"/>
                    <path d="M8 17c0-6 4.5-9 10-9s10 3 10 9H8z" fill="#fed530"/>
                </svg>
            </div>
            <div class="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
        </div>
    `;
    msgContainer.insertAdjacentHTML('beforeend', typingHtml);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // 3. Phân tích ngữ cảnh & tìm kiếm sản phẩm trong kho PRODUCTS
    setTimeout(() => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        const botReply = generateSmartBotResponse(query);
        const isSubdir = window.location.pathname.includes('/chitietsanpham/');

        let cardHtml = '';
        if (botReply.product) {
            const p = botReply.product;
            const imgSrc = isSubdir ? (p.image.startsWith('../') ? p.image : '../' + p.image) : p.image;
            const detailHref = isSubdir ? `${p.slug}.html` : `chitietsanpham/${p.slug}.html`;
            cardHtml = `
                <div class="mt-2.5 p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2 hover:border-red-500 transition">
                    <img src="${imgSrc}" alt="${escapeHtmlChat(p.name)}" class="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-100 flex-shrink-0">
                    <div class="flex-1 min-w-0 text-left">
                        <p class="font-bold text-slate-800 truncate text-[11px]">${escapeHtmlChat(p.name)}</p>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-[#d70018] font-black text-xs">${formatPriceChat(p.price)}</span>
                            ${p.originalPrice ? `<span class="text-slate-400 line-through text-[10px]">${formatPriceChat(p.originalPrice)}</span>` : ''}
                        </div>
                    </div>
                    <a href="${detailHref}" class="px-2.5 py-1.5 bg-[#d70018] hover:bg-[#b80014] text-white text-[10px] font-bold rounded-lg transition whitespace-nowrap">
                        Xem ngay
                    </a>
                </div>
            `;
        }

        const botMsgHtml = `
            <div class="flex items-start gap-2">
                <div class="w-7 h-7 rounded-full bg-white p-0.5 shadow-sm border border-slate-200 flex-shrink-0 mt-0.5">
                    <svg class="w-full h-full" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="18" fill="#ffffff"/>
                        <circle cx="18" cy="20" r="10" fill="#d70018"/>
                        <ellipse cx="18" cy="22" rx="7" ry="6" fill="#ffffff"/>
                        <circle cx="15" cy="18" r="2" fill="#1d1d20"/>
                        <circle cx="21" cy="18" r="2" fill="#1d1d20"/>
                        <path d="M15 22.5c1 1.2 5 1.2 6 0" stroke="#d70018" stroke-width="1.8" stroke-linecap="round"/>
                        <path d="M8 17c0-6 4.5-9 10-9s10 3 10 9H8z" fill="#fed530"/>
                    </svg>
                </div>
                <div class="space-y-1 max-w-[85%] text-left">
                    <div class="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-[#1D1D20] leading-relaxed">
                        <div>${botReply.text}</div>
                        ${cardHtml}
                    </div>
                    <p class="text-[10px] text-slate-400 pl-1 font-medium">CELLPHONES • Vừa xong</p>
                </div>
            </div>
        `;
        msgContainer.insertAdjacentHTML('beforeend', botMsgHtml);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 600);
};

function generateSmartBotResponse(query) {
    const q = query.toLowerCase();
    const prods = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];

    // Tìm kiếm sản phẩm theo tên hoặc hãng
    let found = null;
    if (q.includes('iphone') || q.includes('apple') || q.includes('15 pro max')) {
        found = prods.find(p => p.slug.includes('iphone') || p.name.toLowerCase().includes('iphone'));
    } else if (q.includes('samsung') || q.includes('s24')) {
        found = prods.find(p => p.slug.includes('samsung') || p.name.toLowerCase().includes('samsung'));
    } else if (q.includes('macbook') || q.includes('mac')) {
        found = prods.find(p => p.slug.includes('macbook') || p.name.toLowerCase().includes('macbook'));
    } else if (q.includes('dell') || q.includes('xps') || q.includes('laptop')) {
        found = prods.find(p => p.slug.includes('dell') || p.category === 'laptop');
    } else if (q.includes('ipad') || q.includes('tablet')) {
        found = prods.find(p => p.slug.includes('ipad') || p.category === 'tablet');
    } else if (q.includes('tai nghe') || q.includes('airpods') || q.includes('sony') || q.includes('âm thanh')) {
        found = prods.find(p => p.slug.includes('airpods') || p.slug.includes('sony') || p.category === 'accessory');
    } else if (q.includes('đồng hồ') || q.includes('watch')) {
        found = prods.find(p => p.slug.includes('watch') || p.category === 'smartwatch');
    }

    if (found) {
        return {
            text: `Dạ em tìm thấy sản phẩm rất phù hợp với nhu cầu của mình: <strong>${escapeHtmlChat(found.name)}</strong> đang có giá ưu đãi sốc chỉ <strong>${formatPriceChat(found.price)}</strong>! Giao nhanh 2H miễn phí và tặng kèm gói bảo hành vàng 1 đổi 1 trong 30 ngày.`,
            product: found
        };
    }

    if (q.includes('giao hàng') || q.includes('ship') || q.includes('2h') || q.includes('vận chuyển')) {
        return {
            text: `Dạ TechPulse hỗ trợ <strong>Giao nhanh siêu tốc 2H</strong> hoàn toàn <strong>Miễn phí</strong> cho đơn hàng từ 300.000₫ trong khu vực nội thành TP.HCM, Hà Nội và Đà Nẵng ạ! Anh/chị chỉ cần chọn sản phẩm, nhân viên sẽ liên hệ và giao tận nơi ngay.`
        };
    }

    if (q.includes('bảo hành') || q.includes('đổi trả') || q.includes('lỗi')) {
        return {
            text: `Dạ chính sách bảo hành tại TechPulse tiêu chuẩn CellphoneS:<br>• <strong>1 đổi 1 trong 30 ngày</strong> nếu có lỗi từ nhà sản xuất.<br>• <strong>Bảo hành chính hãng 12 - 24 tháng</strong> tại tất cả TTBH ủy quyền trên toàn quốc.<br>• Hỗ trợ máy mượn dùng tạm trong thời gian bảo hành!`
        };
    }

    if (q.includes('thu cũ') || q.includes('đổi mới') || q.includes('lên đời')) {
        return {
            text: `Dạ chương trình <strong>Thu cũ đổi mới - Lên đời trợ giá đến 3 TRIỆU ĐỒNG</strong> đang diễn ra cho toàn bộ Điện thoại, Laptop và Tablet! Không phân biệt xuất xứ máy, định giá nhanh chỉ 5 phút tại quầy.`
        };
    }

    if (q.includes('trả góp') || q.includes('lãi suất')) {
        return {
            text: `Dạ TechPulse hỗ trợ <strong>Trả góp 0% lãi suất</strong> qua thẻ tín dụng của hơn 25 ngân hàng hoặc qua công ty tài chính (Home Credit, HD Saison) chỉ cần CCCD gắn chip, duyệt hồ sơ online trong 5 phút ạ!`
        };
    }

    // Default friendly fallback
    return {
        text: `Dạ em đã ghi nhận câu hỏi của mình: <em>"${escapeHtmlChat(query)}"</em>. Đội ngũ chuyên viên tư vấn TechPulse sẵn sàng hỗ trợ qua hotline miễn phí <strong>1800 2097</strong> hoặc anh/chị có thể bấm <strong>Chat qua Zalo</strong> để được giải đáp 1-1 ngay ạ!`
    };
}




/* ==========================================================================
   LAPTOP SHOWCASE CAROUSEL NAVIGATION (AUTHENTIC CELLPHONES)
   ========================================================================== */
window.scrollLaptopProducts = function(direction) {
    const track = document.getElementById('laptop-products-track') || document.querySelector('.slide-product-list .swiper-wrapper');
    if (!track) return;
    const scrollAmount = track.clientWidth > 600 ? 840 : 340;
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
};
