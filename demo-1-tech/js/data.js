/**
 * DATA SẢN PHẨM - TECHPULSE STORE (DEMO 1)
 */
const PRODUCTS = [
    {
        id: "prod-1",
        slug: "iphone-15-pro-max",
        name: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
        brand: "Apple",
        category: "phone",
        categoryName: "Điện thoại",
        price: 29990000,
        originalPrice: 34990000,
        discount: 14,
        rating: 4.9,
        reviewsCount: 156,
        isFeatured: true,
        isFlashSale: true,
        inStock: true,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Khung viền Titan chuẩn hàng không vũ trụ, chip A17 Pro đột phá hiệu năng và camera zoom quang học 5x sắc nét đỉnh cao.",
        specs: {
            "Màn hình": "6.7 inch, Super Retina XDR OLED, 120Hz ProMotion",
            "Vi xử lý": "Apple A17 Pro (3nm)",
            "RAM / Bộ nhớ": "8GB / 256GB",
            "Camera sau": "Chính 48MP + 12MP UltraWide + 12MP Tele 5x",
            "Pin & Sạc": "4.422 mAh, Sạc nhanh 20W, MagSafe 15W",
            "Chất liệu": "Khung Titan, Mặt lưng kính nhám Ceremic Shield"
        },
        colors: ["Titan Tự Nhiên", "Titan Xanh", "Titan Trắng", "Titan Đen"],
        storageOptions: ["256GB", "512GB", "1TB"]
    },
    {
        id: "prod-2",
        slug: "samsung-s24-ultra",
        name: "Samsung Galaxy S24 Ultra 5G 12GB/256GB",
        brand: "Samsung",
        category: "phone",
        categoryName: "Điện thoại",
        price: 27490000,
        originalPrice: 31990000,
        discount: 14,
        rating: 4.8,
        reviewsCount: 98,
        isFeatured: true,
        isFlashSale: true,
        inStock: true,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Đột phá kỷ nguyên Galaxy AI thông minh, camera 200MP zoom ấn tượng và bút S-Pen tích hợp đỉnh cao đa nhiệm.",
        specs: {
            "Màn hình": "6.8 inch, Dynamic AMOLED 2X, 120Hz, 2600 nits",
            "Vi xử lý": "Snapdragon 8 Gen 3 for Galaxy",
            "RAM / Bộ nhớ": "12GB / 256GB",
            "Camera sau": "200MP + 50MP + 12MP + 10MP",
            "Pin & Sạc": "5.000 mAh, Sạc siêu nhanh 45W",
            "Tính năng đặc biệt": "Bút S-Pen tích hợp, Trí tuệ nhân tạo Galaxy AI"
        },
        colors: ["Xám Titan", "Đen Titan", "Tím Titan", "Vàng Titan"],
        storageOptions: ["256GB", "512GB", "1TB"]
    },
    {
        id: "prod-3",
        slug: "macbook-pro-m3",
        name: "Apple MacBook Pro 14 M3 Pro 18GB / 512GB",
        brand: "Apple",
        category: "laptop",
        categoryName: "Laptop",
        price: 48990000,
        originalPrice: 53990000,
        discount: 9,
        rating: 5.0,
        reviewsCount: 45,
        isFeatured: true,
        isFlashSale: false,
        inStock: true,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Hiệu năng quái vật từ chip Apple M3 Pro thế hệ mới, màn hình Liquid Retina XDR sống động và thời lượng pin tới 22 giờ liên tục.",
        specs: {
            "Màn hình": "14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz ProMotion",
            "Vi xử lý": "Apple M3 Pro (11 CPU, 14 GPU)",
            "RAM / Ổ cứng": "18GB Unified Memory / 512GB SSD siêu tốc",
            "Cổng kết nối": "3 x Thunderbolt 4, HDMI, Jack 3.5mm, Khe thẻ SDXC, MagSafe 3",
            "Pin": "70 Wh Li-Po, thời lượng pin lên đến 22 giờ",
            "Trọng lượng": "1.61 kg"
        },
        colors: ["Đen Không Gian (Space Black)", "Bạc (Silver)"],
        storageOptions: ["512GB SSD", "1TB SSD"]
    },
    {
        id: "prod-4",
        slug: "ipad-pro-m4",
        name: "iPad Pro 11 inch M4 Wi-Fi 256GB",
        brand: "Apple",
        category: "tablet",
        categoryName: "Máy tính bảng",
        price: 27990000,
        originalPrice: 29990000,
        discount: 7,
        rating: 4.9,
        reviewsCount: 67,
        isFeatured: true,
        isFlashSale: true,
        inStock: true,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Thiết kế siêu mỏng nhẹ kỷ lục chỉ 5.3mm, màn hình Ultra Retina XDR Tandem OLED tiên tiến cùng sức mạnh chip M4 vượt giới hạn.",
        specs: {
            "Màn hình": "11 inch Ultra Retina XDR Tandem OLED, 120Hz ProMotion",
            "Vi xử lý": "Apple M4 với 9 CPU & 10 GPU",
            "Bộ nhớ": "8GB RAM / 256GB SSD",
            "Độ mỏng": "5.3 mm siêu nhẹ",
            "Tương thích": "Apple Pencil Pro, Magic Keyboard thế hệ mới"
        },
        colors: ["Bạc (Silver)", "Đen Không Gian (Space Black)"],
        storageOptions: ["256GB", "512GB", "1TB"]
    },
    {
        id: "prod-5",
        slug: "sony-wh1000xm5",
        name: "Tai nghe chống ồn Sony WH-1000XM5",
        brand: "Sony",
        category: "accessory",
        categoryName: "Tai nghe & Phụ kiện",
        price: 7490000,
        originalPrice: 8990000,
        discount: 17,
        rating: 4.8,
        reviewsCount: 112,
        isFeatured: true,
        isFlashSale: false,
        inStock: true,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Công nghệ chống ồn chủ động ANC hàng đầu thế giới với bộ vi xử lý V1 và QN1, thời lượng pin 30 giờ và âm thanh chuẩn Hi-Res Audio.",
        specs: {
            "Loại tai nghe": "Over-ear không dây chống ồn",
            "Thời lượng pin": "30 giờ (Bật chống ồn ANC), Sạc nhanh 3 phút nghe 3 giờ",
            "Công nghệ âm thanh": "Hi-Res Audio Wireless, LDAC, DSEE Extreme",
            "Kết nối": "Bluetooth 5.2, Kết nối đa điểm 2 thiết bị",
            "Trọng lượng": "250g"
        },
        colors: ["Đen (Black)", "Bạc Ánh Kim (Silver)", "Xanh Đêm (Midnight Blue)"],
        storageOptions: ["Tiêu chuẩn"]
    },
    {
        id: "prod-6",
        slug: "dell-xps-15",
        name: "Dell XPS 15 9530 Core i7-13700H / RTX 4050",
        brand: "Dell",
        category: "laptop",
        categoryName: "Laptop",
        price: 41500000,
        originalPrice: 45900000,
        discount: 10,
        rating: 4.7,
        reviewsCount: 38,
        isFeatured: false,
        isFlashSale: false,
        inStock: true,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Kiệt tác thiết kế nhôm nguyên khối và sợi carbon cao cấp, màn hình 3.5K OLED rực rỡ cùng card đồ họa rời NVIDIA RTX 4050 mạnh mẽ.",
        specs: {
            "Màn hình": "15.6 inch 3.5K OLED (3456 x 2160) cảm ứng, 400 nits",
            "CPU": "Intel Core i7-13700H (14 nhân, 20 luồng)",
            "GPU": "NVIDIA GeForce RTX 4050 6GB GDDR6",
            "RAM / SSD": "16GB DDR5 4800MHz / 512GB PCIe NVMe SSD",
            "Trọng lượng": "1.92 kg"
        },
        colors: ["Bạc Platinum"],
        storageOptions: ["512GB SSD", "1TB SSD"]
    },
    {
        id: "prod-7",
        slug: "apple-watch-ultra-2",
        name: "Apple Watch Ultra 2 GPS + Cellular 49mm",
        brand: "Apple",
        category: "smartwatch",
        categoryName: "Đồng hồ thông minh",
        price: 19990000,
        originalPrice: 21990000,
        discount: 9,
        rating: 4.9,
        reviewsCount: 54,
        isFeatured: true,
        isFlashSale: false,
        inStock: true,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Đồng hồ thể thao chuyên nghiệp với vỏ Titan 49mm siêu bền, màn hình siêu sáng 3000 nits, GPS tần số kép và thời lượng pin tới 72 giờ ở chế độ tiết kiệm.",
        specs: {
            "Màn hình": "Retina OLED Always-On, Độ sáng tối đa 3000 nits",
            "Vỏ máy": "Titanium chuẩn hàng không vũ trụ",
            "Kháng nước": "Chống nước 100m, lặn giải trí đến 40m (EN13319)",
            "Thời lượng pin": "Lên tới 36 giờ (sử dụng thường) / 72 giờ (chế độ tiết kiệm pin)",
            "Tính năng": "Còi báo động 86dB, Cảm biến đo độ sâu, GPS kép L1 và L5"
        },
        colors: ["Dây Alpine Cam", "Dây Trail Xám", "Dây Ocean Xanh"],
        storageOptions: ["49mm"]
    },
    {
        id: "prod-8",
        slug: "airpods-pro-2",
        name: "Tai nghe Apple AirPods Pro 2 (USB-C)",
        brand: "Apple",
        category: "accessory",
        categoryName: "Tai nghe & Phụ kiện",
        price: 5290000,
        originalPrice: 6190000,
        discount: 15,
        rating: 4.8,
        reviewsCount: 220,
        isFeatured: false,
        isFlashSale: true,
        inStock: true,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop"
        ],
        shortDesc: "Chip Apple H2 nâng cấp khả năng khử tiếng ồn chủ động gấp 2 lần, âm thanh thích ứng thông minh và hộp sạc cổng USB-C tiện lợi chống bụi nước IP54.",
        specs: {
            "Chip xử lý": "Apple H2 trong tai nghe, Apple U1 trong hộp sạc",
            "Tính năng": "Chống ồn chủ động (ANC), Xuyên âm thích ứng, Âm thanh không gian cá nhân hóa",
            "Thời lượng pin": "6 giờ (1 lần sạc), 30 giờ (kèm hộp sạc)",
            "Chuẩn sạc": "USB-C, MagSafe, Chuẩn Qi, Apple Watch Charger"
        },
        colors: ["Trắng"],
        storageOptions: ["Tiêu chuẩn"]
    }
];

// Helper: Định dạng tiền tệ VNĐ (ví dụ: 29.990.000₫)
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Helper: Tìm sản phẩm theo Slug
function getProductBySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug);
}

// Helper: Tìm sản phẩm theo ID
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// Helper: Lấy sản phẩm nổi bật
function getFeaturedProducts(limit = 4) {
    return PRODUCTS.filter(p => p.isFeatured).slice(0, limit);
}

// Helper: Lấy sản phẩm Flash Sale
function getFlashSaleProducts(limit = 4) {
    return PRODUCTS.filter(p => p.isFlashSale).slice(0, limit);
}
