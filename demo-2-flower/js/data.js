/**
 * DỮ LIỆU SẢN PHẨM MẪU - BLOSSOM & BLOOM (TIỆM HOA TƯƠI & QUÀ TẶNG CAO CẤP)
 */

const CATEGORIES = [
    { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-solid fa-spa' },
    { id: 'bouquet', name: 'Bó hoa tươi', icon: 'fa-solid fa-fan' },
    { id: 'flower-basket', name: 'Giỏ hoa chúc mừng', icon: 'fa-solid fa-basket-shopping' },
    { id: 'flower-box', name: 'Hộp hoa sang trọng', icon: 'fa-solid fa-gift' },
    { id: 'gift-set', name: 'Set quà hoa & nến', icon: 'fa-solid fa-wand-magic-sparkles' }
];

const PRODUCTS = [
    {
        id: 'FL01',
        name: 'Bó Hoa Hồng Ecuador Đỏ Ruby (Tình Yêu Nồng Nàn)',
        slug: 'bo-hoa-hong-ecuador-do',
        category: 'bouquet',
        price: 850000,
        originalPrice: 1100000,
        discount: 23,
        rating: 5.0,
        reviewsCount: 168,
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Bó hoa gồm 19 cành hồng Ecuador đỏ nhung cao cấp nhập khẩu, phối hoa baby trắng và lá bạc dịu dàng.',
        description: 'Bó hoa hồng Ecuador Đỏ Ruby là biểu tượng bất diệt của tình yêu say đắm và chân thành. Từng đóa hoa được chọn lọc kỹ càng, bông to rực rỡ, cánh dày mịn như nhung và độ bền tươi lên đến 7-10 ngày. Đi kèm giấy gói phong cách Hàn Quốc thanh lịch và nơ lụa thủ công tinh xảo.',
        stock: 35,
        badge: 'Bán chạy nhất',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Xuất xứ hoa': 'Ecuador & Đà Lạt Grade A',
            'Số lượng cành': '19 đóa hoa hồng đỏ',
            'Phụ liệu đi kèm': 'Hoa baby Hà Lan, lá bạc Dollar',
            'Thời gian tươi': '7 - 10 ngày (kèm gói dưỡng hoa)',
            'Phong cách gói': 'Hàn Quốc Minimalist'
        },
        sizes: ['Bó vừa (15 bông)', 'Bó lớn (19 bông)', 'Bó VIP (33 bông)'],
        wrappingColors: ['Hồng Pastel', 'Đen Quyền Lực', 'Trắng Tinh Khôi', 'Kem Vintage']
    },
    {
        id: 'FL02',
        name: 'Giỏ Hoa Khai Trương Phát Tài - Vạn Sự Hanh Thông',
        slug: 'gio-hoa-khai-truong-phat-tai',
        category: 'flower-basket',
        price: 1550000,
        originalPrice: 1850000,
        discount: 16,
        rating: 4.9,
        reviewsCount: 92,
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Giỏ mây mộc kết hợp hoa hồng cam Spirited, lan vũ nữ vàng hoàng kim và cúc mẫu đơn.',
        description: 'Giỏ hoa khai trương thiết kế tone màu ấm áp rực rỡ tượng trưng cho tài lộc dồi dào, khởi đầu thuận buồm xuôi gió. Sản phẩm phù hợp tặng đối tác, chúc mừng thăng chức, khai trương cửa hàng hoặc kỷ niệm thành lập công ty.',
        stock: 20,
        badge: 'Khai Trương',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Tone màu chủ đạo': 'Cam Cháy - Vàng Hoàng Kim',
            'Chất liệu giỏ': 'Mây tre đan thủ công cao cấp',
            'Loại hoa chính': 'Hồng cam Đà Lạt, Lan vũ nữ, Cúc mẫu đơn',
            'Băng rôn chúc mừng': 'In màu nhũ vàng theo yêu cầu',
            'Chiều cao giỏ': 'Khoảng 65 - 75cm'
        },
        sizes: ['Giỏ Tiêu Chuẩn', 'Giỏ Đại Sang Trọng'],
        wrappingColors: ['Tone Cam Vàng Tài Lộc', 'Tone Đỏ Phú Quý']
    },
    {
        id: 'FL03',
        name: 'Hộp Hoa Tulip Hà Lan Pastel Thơ Mộng',
        slug: 'hop-hoa-tulip-ha-lan',
        category: 'flower-box',
        price: 950000,
        originalPrice: 1200000,
        discount: 21,
        rating: 4.9,
        reviewsCount: 114,
        image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1589244159943-460088ed5c92?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Hộp tròn nắp kính phối 10 bông hoa Tulip nhập khẩu Hà Lan màu hồng phấn tao nhã.',
        description: 'Hộp hoa Tulip Hà Lan đại diện cho vẻ đẹp thanh tao, thuần khiết và tình yêu vĩnh cửu. Hộp đựng tròn bọc nhung nhã nhặn phối ruy băng tơ tằm, thích hợp làm quà tặng sinh nhật bạn gái, ngày kỷ niệm hoặc tỏ tình.',
        stock: 18,
        badge: 'Nhập Khẩu',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Xuất xứ hoa': 'Nhập khẩu trực tiếp Hà Lan',
            'Số lượng cành': '10 đóa Tulip tuyển chọn',
            'Chất liệu hộp': 'Hộp trụ tròn phủ nhung cao cấp',
            'Bảo quản': 'Tươi 5-7 ngày trong môi trường máy lạnh'
        },
        sizes: ['Hộp 10 bông', 'Hộp 20 bông Đặc Biệt'],
        wrappingColors: ['Hồng Pastel', 'Trắng Sữa', 'Tím Mộng Mơ']
    },
    {
        id: 'FL04',
        name: 'Bó Hoa Baby Trắng Tinh Khôi - Giấc Mơ Tuyết Trắng',
        slug: 'bo-hoa-baby-trang-tinh-khoi',
        category: 'bouquet',
        price: 450000,
        originalPrice: 550000,
        discount: 18,
        rating: 4.8,
        reviewsCount: 79,
        image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Bó hoa baby khổng lồ trắng muốt tựa mây trời, giữ tươi lâu và có thể sấy khô lưu niệm.',
        description: 'Hoa baby trắng tượng trưng cho sự dịu dàng, trong sáng và ngây thơ. Bó hoa có thể giữ khô tự nhiên suốt nhiều tháng mà không tàn phai vẻ đẹp nguyên bản.',
        stock: 40,
        badge: 'Ưa chuộng',
        isFeatured: false,
        isFlashSale: false,
        specs: {
            'Loại hoa': 'Hoa baby Hà Lan sấy công nghệ giữ form',
            'Kích thước': 'Đường kính bó ~45cm',
            'Độ bền': 'Có thể trưng khô từ 6 đến 12 tháng'
        },
        sizes: ['Size Vừa', 'Size Khổng Lồ'],
        wrappingColors: ['Giấy báo Vintage', 'Hồng kẹo ngọt', 'Xanh bơ mát mắt']
    },
    {
        id: 'FL05',
        name: 'Giỏ Hoa Hướng Dương Ban Mai Nắng Ấm',
        slug: 'gio-hoa-huong-duong-ruc-ro',
        category: 'flower-basket',
        price: 680000,
        originalPrice: 850000,
        discount: 20,
        rating: 4.9,
        reviewsCount: 88,
        image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Giỏ hoa kết hợp 7 đóa hướng dương nở rộ cùng cát tường xanh và thạch thảo.',
        description: 'Hoa hướng dương luôn hướng về ánh mặt trời, mang lại niềm tin, hy vọng và năng lượng tích cực cho người nhận trong các dịp tốt nghiệp, chúc sức khỏe hoặc tân gia.',
        stock: 25,
        badge: 'Tốt nghiệp',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Ý nghĩa': 'Năng lượng, Tươi sáng, Nghị lực vươn lên',
            'Số lượng cành': '7 bông hướng dương đại + hoa lá đệm',
            'Kèm theo': 'Thiệp thiết kế riêng & túi đựng hoa cao cấp'
        },
        sizes: ['Giỏ Tiêu Chuẩn', 'Giỏ Quà Đặc Biệt'],
        wrappingColors: ['Vàng Nắng Mộc Mạc', 'Xanh Mint']
    },
    {
        id: 'FL06',
        name: 'Set Hộp Quà Hoa Hồng & Nến Thơm Tinh Dầu Tự Nhiên',
        slug: 'set-qua-tang-hoa-nen-thom',
        category: 'gift-set',
        price: 790000,
        originalPrice: 990000,
        discount: 20,
        rating: 5.0,
        reviewsCount: 63,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Hộp quà nắp nam châm sang trọng gồm hoa hồng sáp thơm vĩnh cửu và hũ nến đậu nành thư giãn.',
        description: 'Món quà trọn vẹn mọi giác quan: sắc hoa kiêu kỳ và hương thơm trị liệu êm ái từ nến sáp đậu nành organic. Giúp xua tan mệt mỏi và làm ấm áp không gian sống.',
        stock: 30,
        badge: 'Gift Box',
        isFeatured: true,
        isFlashSale: false,
        specs: {
            'Nến thơm': 'Hũ sáp đậu nành 200g (mùi gỗ thông & hoa oải hương)',
            'Hoa trong hộp': 'Hoa hồng sáp thơm bảo quản vĩnh cửu',
            'Hộp đựng': 'Hộp cứng nắp gập nam châm thắt nơ nhung'
        },
        sizes: ['Hộp Quà Standard', 'Hộp Quà Luxury'],
        wrappingColors: ['Hộp Đỏ Rượu Vang', 'Hộp Đen Huyền Bí']
    },
    {
        id: 'FL07',
        name: 'Chậu Lan Hồ Điệp Hoàng Gia 5 Cành Tím Đại',
        slug: 'hop-hoa-lan-ho-diep-quy-phai',
        category: 'flower-box',
        price: 2200000,
        originalPrice: 2600000,
        discount: 15,
        rating: 5.0,
        reviewsCount: 42,
        image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Chậu sứ cao cấp trồng 5 cành lan hồ điệp tím đại hoa dày, rực rỡ và giữ hoa suốt 2-3 tháng.',
        description: 'Lan hồ điệp quý tộc thể hiện đẳng cấp, sự tinh tế và giàu sang phú quý. Từng cành lan được tạo dáng uốn lượn phong thủy tài lộc, phối cùng gỗ lũa và rêu rừng tự nhiên.',
        stock: 12,
        badge: 'VIP Quý Tộc',
        isFeatured: false,
        isFlashSale: false,
        specs: {
            'Số lượng cành': '5 cành hoa hồ điệp loại A tuyển chọn',
            'Chậu trồng': 'Chậu sứ Bát Tràng men mạ vàng',
            'Thời gian giữ hoa': 'Từ 6 đến 10 tuần nếu chăm sóc đúng cách'
        },
        sizes: ['Chậu 5 Cành', 'Chậu 9 Cành Thịnh Vượng'],
        wrappingColors: ['Chậu Trắng Men Sứ', 'Chậu Đen Mạ Vàng']
    },
    {
        id: 'FL08',
        name: 'Bó Hoa Cẩm Chướng Pastel Ngọt Ngào',
        slug: 'bo-hoa-cam-chuong-pastel',
        category: 'bouquet',
        price: 520000,
        originalPrice: 650000,
        discount: 20,
        rating: 4.8,
        reviewsCount: 51,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Sự hòa quyện ngọt ngào giữa cẩm chướng hồng pastel, cúc Tana nhỏ nhắn và lá bạch đàn.',
        description: 'Bó hoa cẩm chướng mang lời tri ân sâu sắc, lòng biết ơn và sự ngưỡng mộ tới đấng sinh thành, thầy cô hoặc những người phụ nữ yêu thương.',
        stock: 28,
        badge: 'Tri Ân',
        isFeatured: false,
        isFlashSale: true,
        specs: {
            'Loại hoa': 'Cẩm chướng đơn, cúc Tana, lá bạch đàn',
            'Ý nghĩa': 'Sự biết ơn, kính trọng và yêu mến',
            'Tặng kèm': 'Bưu thiếp chúc mừng & gói bột dinh dưỡng hoa'
        },
        sizes: ['Bó Tiêu Chuẩn (20 bông)', 'Bó To Sang Trọng (35 bông)'],
        wrappingColors: ['Hồng Thạch Anh', 'Kem Trắng']
    }
];

// Helper Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getProductBySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug);
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

function getFeaturedProducts() {
    return PRODUCTS.filter(p => p.isFeatured);
}

function getFlashSaleProducts() {
    return PRODUCTS.filter(p => p.isFlashSale);
}
