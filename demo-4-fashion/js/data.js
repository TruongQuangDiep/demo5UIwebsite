/**
 * DỮ LIỆU SẢN PHẨM MẪU - URBANVIBE STREETWEAR STUDIO (DEMO 4)
 */

const CATEGORIES = [
    { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-solid fa-shapes' },
    { id: 'hoodie', name: 'Áo Hoodie & Sweater', icon: 'fa-solid fa-vest' },
    { id: 't-shirt', name: 'Áo thun Boxy Fit', icon: 'fa-solid fa-shirt' },
    { id: 'jacket', name: 'Áo khoác & Bomber', icon: 'fa-solid fa-user-ninja' },
    { id: 'pants', name: 'Quần Cargo & Jeans', icon: 'fa-solid fa-tent' },
    { id: 'sneaker', name: 'Giày Sneaker Chunky', icon: 'fa-solid fa-shoe-prints' },
    { id: 'accessory', name: 'Phụ kiện & Nón', icon: 'fa-solid fa-hat-cowboy' }
];

const PRODUCTS = [
    {
        id: 'FASH01',
        name: 'Áo Hoodie Oversize Heavyweight 450GSM UrbanVibe "Cyber Street"',
        slug: 'ao-hoodie-oversize-heavyweight-cyber-street',
        category: 'hoodie',
        price: 650000,
        originalPrice: 850000,
        discount: 24,
        rating: 5.0,
        reviewsCount: 320,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Nỉ bông chân cua 100% Cotton 450GSM dầy dặn đứng phom, mũ 2 lớp siêu dày dặn, hình in lụa tràm phản quang nổi bật.',
        description: 'Chiếc áo Hoodie biểu tượng của phong cách Cyberpunk & Streetwear hiện đại. Vải nỉ chải kỹ đạt chuẩn 450GSM giữ nhiệt tuyệt vời mà không gây bí bách. Form dáng Oversize chuẩn phương Tây tôn trọn vibe đường phố bụi bặm.',
        stock: 45,
        badge: 'Best Seller Drop',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Chất liệu vải': '100% French Terry Cotton 450GSM dày dặn',
            'Kỹ thuật in': 'In lụa thủ công Plastisol & phủ viền phản quang 3M',
            'Phom dáng': 'Oversized Boxy Fit, nón 2 lớp sâu trùm đầu',
            'Xuất xứ': 'Sản xuất độc quyền tại UrbanVibe Studio Việt Nam',
            'Bảo quản': 'Giặt máy chế độ nhẹ, lộn trái khi giặt và phơi'
        },
        sizes: ['Size S (Dưới 60kg)', 'Size M (60 - 72kg)', 'Size L (73 - 85kg)', 'Size XL (Trên 85kg)'],
        colors: ['Đen Tuyền (Pitch Black)', 'Xám Tiêu (Washed Grey)', 'Rêu Khói (Smoke Olive)']
    },
    {
        id: 'FASH02',
        name: 'Quần Cargo Baggy Dây Rút Túi Hộp Utility Tactical Pants',
        slug: 'quan-cargo-baggy-utility-pants',
        category: 'pants',
        price: 580000,
        originalPrice: 720000,
        discount: 19,
        rating: 4.9,
        reviewsCount: 215,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Vải dù đan ô Ripstop kháng xước, trang bị 6 túi hộp tiện lợi đựng đồ cá nhân, gấu quần có khóa chặn dây rút linh hoạt.',
        description: 'Mẫu quần Cargo đình đám dành cho tín đồ Techwear và Streetwear năng động. Thiết kế túi xếp ly 3D gia tăng không gian chứa, đai lưng chun co giãn kèm dây dệt cường lực chịu tải cao.',
        stock: 35,
        badge: 'Top Trending',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Chất liệu vải': 'Cotton Ripstop dệt tổ ong kháng rách xước',
            'Số lượng túi': '6 túi hộp nắp dán Velcro & 2 túi chéo hông',
            'Chi tiết khóa': 'Khóa kéo kim loại YKK dập chìm logo',
            'Tính năng': 'Dây rút gấu quần tùy chỉnh ống suông hoặc túm bo'
        },
        sizes: ['Size M (Eo 74-80cm)', 'Size L (Eo 81-86cm)', 'Size XL (Eo 87-94cm)'],
        colors: ['Đen Phủ Nhám', 'Be Cát (Desert Sand)', 'Rêu Quân Đội (Military Olive)']
    },
    {
        id: 'FASH03',
        name: 'Áo Thun Boxy Cổ Cao 3cm Vintage Acid Wash "Rebel Youth"',
        slug: 'ao-thun-boxy-vintage-acid-wash',
        category: 't-shirt',
        price: 380000,
        originalPrice: 480000,
        discount: 21,
        rating: 5.0,
        reviewsCount: 410,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: '100% Heavyweight Cotton 260GSM, xử lý wash axit thủ công độc bản từng chiếc áo, cổ bo gân 3cm chống bai dão 100%.',
        description: 'Tái hiện tinh thần tự do của văn hóa Rock & Skate thập niên 90s. Mỗi chiếc áo là một hoa văn loang màu độc nhất nhờ công nghệ xử lý Wash khoáng tính. Cổ áo bo bản to dầy dặn ôm sát gáy cực kỳ thời thượng.',
        stock: 60,
        badge: 'Iconic Drop',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Định lượng vải': 'Cotton 2 chiều 260GSM siêu mịn, thoáng khí',
            'Cổ áo': 'Bo dệt spandex co giãn đàn hồi bản rộng 3cm',
            'Hiệu ứng màu': 'Mineral Acid Wash xước bụi phong trần',
            'Phom dáng': 'Boxy Crop Fit chuẩn tỷ lệ vàng hack chiều cao'
        },
        sizes: ['Size S (Rộng 56cm)', 'Size M (Rộng 59cm)', 'Size L (Rộng 62cm)', 'Size XL (Rộng 65cm)'],
        colors: ['Xám Tro Acid (Acid Grey)', 'Đen Khói Phai (Faded Black)', 'Rỉ Sắt Vintage (Vintage Rust)']
    },
    {
        id: 'FASH04',
        name: 'Áo Khoác Bomber Streetwear Techwear Kháng Nước Reversible 2 Mặt',
        slug: 'ao-khoac-bomber-techwear-khang-nuoc',
        category: 'jacket',
        price: 890000,
        originalPrice: 1200000,
        discount: 26,
        rating: 4.9,
        reviewsCount: 165,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Vải dù mật độ cao kháng nước tiêu chuẩn, lớp chần bông siêu nhẹ cách nhiệt, mặc được cả 2 mặt linh hoạt biến đổi phong cách.',
        description: 'Đỉnh cao thiết kế áo khoác phi công hiện đại. Mặt ngoài màu đen mờ phong cách Minimalist huyền bí, mặt trong màu cam Neon nổi bật đặc trưng của phong cách cứu hộ quân đội. Trang bị túi khóa bắp tay tiện dụng.',
        stock: 28,
        badge: 'Limited Edition',
        isFeatured: true,
        isFlashSale: false,
        specs: {
            'Lớp vỏ ngoài': 'Polyester dệt micro mật độ cao chống nước IPX4',
            'Lớp lót': 'Trần bông hữu cơ siêu nhẹ giữ ấm mùa thu đông',
            'Khóa kéo': '2 chiều Reversible mạ crom bạc chống rỉ sét',
            'Chi tiết độc quyền': 'Thẻ Tag đỏ Remove Before Flight thêu nổi'
        },
        sizes: ['Size M (1m60 - 1m72)', 'Size L (1m73 - 1m82)', 'Size XL (1m83 - 1m92)'],
        colors: ['Đen Ma Trận (Shadow Black)', 'Cam Cứu Hộ / Đen (Reversible Neon)']
    },
    {
        id: 'FASH05',
        name: 'Giày Sneaker Chunky Platform UrbanVibe "Shadow Runner 01"',
        slug: 'giay-sneaker-chunky-shadow-runner',
        category: 'sneaker',
        price: 1250000,
        originalPrice: 1650000,
        discount: 24,
        rating: 5.0,
        reviewsCount: 198,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Đế đệm bọt EVA đúc nguyên khối tăng 5.5cm chiều cao, da tổng hợp kết hợp lưới thoáng khí Mesh thể thao cao cấp.',
        description: 'Đôi sneaker không thể thiếu trong tủ đồ của bất kỳ bạn trẻ nào theo đuổi phong cách Y2K và Chunky thời thượng. Phom giày ôm chân chắc chắn, đệm lót êm ái hỗ trợ vận động liên tục suốt 12 tiếng không đau mỏi.',
        stock: 30,
        badge: 'Hot Kicks',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Độ cao đế': '5.5cm đế bọt khí EVA phân tán lực tác động',
            'Chất liệu upper': 'Microfiber Leather chống bám bẩn & lưới Mesh',
            'Đế ngoài': 'Cao su tự nhiên xẻ rãnh chống trơn trượt tuyệt đối',
            'Trọng lượng': '390g / chiếc cực kỳ nhẹ êm'
        },
        sizes: ['Size 39 (24.5cm)', 'Size 40 (25.0cm)', 'Size 41 (26.0cm)', 'Size 42 (26.5cm)', 'Size 43 (27.5cm)'],
        colors: ['Trắng Băng (Triple White)', 'Đen Báo (Triple Black)', 'Xám Khói Phối Da Lộn']
    },
    {
        id: 'FASH06',
        name: 'Túi Đeo Chéo Tactical Crossbody Bag Khóa Nam Châm Quick-Release',
        slug: 'tui-deo-cheo-tactical-crossbody-bag',
        category: 'accessory',
        price: 420000,
        originalPrice: 550000,
        discount: 24,
        rating: 4.8,
        reviewsCount: 145,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Vải Cordura 1000D chống thấm nước, khóa nam châm Fidlock tháo lắp 1 giây, ngăn đệm mút chống sốc đựng vừa iPad mini.',
        description: 'Mẫu túi đeo chéo đa năng mang đậm phong cách Techwear & Cyberpunk. Thiết kế nhiều ngăn phân loại thông minh giúp bạn mang theo điện thoại, sạc dự phòng, ví tiền, tai nghe một cách gọn gàng nhất.',
        stock: 50,
        badge: 'Phụ Kiện Hot',
        isFeatured: false,
        isFlashSale: false,
        specs: {
            'Kích thước': '28cm x 18cm x 8cm (Dung tích 4.5L)',
            'Chất liệu chính': 'Vải dệt Cordura 1000D chống mài mòn',
            'Khóa bấm': 'Nam châm hít từ tính đóng mở nhanh bằng 1 tay',
            'Dây đeo': 'Dây đai bản 3.8cm kèm đệm vai êm ái'
        },
        sizes: ['Free Size (Dây đeo tăng giảm thoải mái)'],
        colors: ['Đen All-Black', 'Xám Phản Quang 3M']
    },
    {
        id: 'FASH07',
        name: 'Quần Jeans Suông Rách Gối Phủi Bụi Distressed Vintage Denim',
        slug: 'quan-jeans-suong-distressed-denim',
        category: 'pants',
        price: 620000,
        originalPrice: 790000,
        discount: 22,
        rating: 4.9,
        reviewsCount: 180,
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Chất liệu Denim 14oz dày dặn không co dãn đứng phom, kỹ thuật mài rách laser thủ công cực kỳ tự nhiên.',
        description: 'Quần jeans ống suông thẳng đứng chuẩn phom Vintage Mỹ. Phối hợp hoàn hảo với sneaker chunky hoặc boot da cao cổ. Màu vải nhuộm chàm cổ điển được rửa bạc tinh tế tôn vẻ phong trần.',
        stock: 40,
        badge: 'Street Essential',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Chất liệu': '100% Cotton Denim 14oz không co giãn giữ dáng',
            'Chi tiết rách': 'Mài rách rãnh gối & mép túi thủ công tinh xảo',
            'Khuy & đinh tán': 'Hợp kim đồng thau nguyên khối không rỉ sét',
            'Phom quần': 'Straight-leg suông thẳng che khuyết điểm chân'
        },
        sizes: ['Size 29 (Vòng eo 75cm)', 'Size 30 (Vòng eo 78cm)', 'Size 31 (Vòng eo 81cm)', 'Size 32 (Vòng eo 84cm)', 'Size 34 (Vòng eo 89cm)'],
        colors: ['Xanh Khói Vintage (Washed Indigo)', 'Đen Phai (Faded Charcoal)']
    },
    {
        id: 'FASH08',
        name: 'Nón Bucket Hat Thêu Nổi 3D Kim Loại UrbanVibe Reversible 2 Mặt',
        slug: 'non-bucket-hat-theu-noi-urbanvibe',
        category: 'accessory',
        price: 290000,
        originalPrice: 390000,
        discount: 26,
        rating: 4.8,
        reviewsCount: 130,
        image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Vải Kaki chéo 100% Cotton thoáng khí, logo kim loại hợp kim sơn tĩnh điện, vành nón định hình cứng cáp.',
        description: 'Phụ kiện hoàn thiện set đồ streetwear chất lừ. Mũ có thể lộn ngược để mặc cả 2 màu sắc khác nhau, thiết kế lỗ thoát khí kim loại bên hông giúp đầu luôn mát mẻ cả ngày dài ngoài trời.',
        stock: 55,
        badge: 'Must-Have',
        isFeatured: false,
        isFlashSale: false,
        specs: {
            'Vòng đầu': 'Chuẩn Free Size 56 - 59cm',
            'Chất liệu': 'Kaki Cotton 100% đứng vành không gãy gập',
            'Huy hiệu logo': 'Hợp kim titan siêu nhẹ dập nổi 3D',
            'Đặc điểm': 'Đội được 2 mặt đổi màu tiện lợi'
        },
        sizes: ['Free Size (Vòng đầu 56 - 59cm)'],
        colors: ['Đen Phối Bạc (Black Silver)', 'Kem Be Cát (Sand Cream)']
    }
];

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
