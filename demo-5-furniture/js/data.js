/**
 * NordicLiving - Data Store
 * Scandinavian Interior & Furniture
 */

const CATEGORIES = [
    { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-solid fa-shapes' },
    { id: 'sofa', name: 'Sofa & Ghế Thư Giãn', icon: 'fa-solid fa-couch' },
    { id: 'table', name: 'Bàn Ăn & Bàn Trà', icon: 'fa-solid fa-utensils' },
    { id: 'chair', name: 'Ghế Bành & Ghế Ăn', icon: 'fa-solid fa-chair' },
    { id: 'bed', name: 'Giường Ngủ & Tủ Kệ', icon: 'fa-solid fa-bed' },
    { id: 'shelf', name: 'Hệ Tủ & Kệ Trang Trí', icon: 'fa-solid fa-table-cells-large' },
    { id: 'decor', name: 'Đèn & Thảm Décor', icon: 'fa-solid fa-lightbulb' }
];

const PRODUCTS = [
    {
        id: 'FURN01',
        name: 'Ghế Sofa Văng 3 Chỗ Bọc Vải Nỉ Bouclé Scandinavian "Oslo Elegance"',
        slug: 'ghe-sofa-vang-vai-boucle-oslo-elegance',
        price: 12800000,
        originalPrice: 15500000,
        category: 'sofa',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Được chế tác từ khung gỗ sồi Nga tự nhiên sấy khô chống mối mọt cong vênh, đệm mút D40 êm ái kết hợp lò xo túi cao cấp, bề mặt bọc vải nỉ lông cừu Bouclé mềm mại chuẩn phong cách sống Hygge Đan Mạch.',
        materials: [
            'Vải Bouclé Trắng Kem (Ivory Cream)',
            'Vải Nỉ Xám Tro (Charcoal Grey)',
            'Vải Linen Xanh Xô Thơm (Sage Green)'
        ],
        sizes: [
            'Dài 2m0 (Căn hộ tiêu chuẩn)',
            'Dài 2m2 (Phòng khách rộng)',
            'Dài 2m4 (Biệt thự cao cấp)'
        ],
        specs: {
            'Khung sườn': 'Gỗ sồi tự nhiên đạt chuẩn FSC',
            'Đệm ngồi': 'Đệm mút D40 bọc gòn chống lún xẹp',
            'Chân ghế': 'Gỗ sồi tiện tròn cao 15cm (Robot hút bụi qua dễ)',
            'Bảo hành': '5 năm khung sườn & đệm mút tại nhà'
        },
        rating: 5.0,
        reviews: 84,
        badge: 'Best Seller'
    },
    {
        id: 'FURN02',
        name: 'Bàn Trà Gỗ Sồi Tự Nhiên Bo Tròn Khối Hữu Cơ "Copenhagen Natural"',
        slug: 'ban-tra-go-soi-bo-tron-copenhagen',
        price: 4600000,
        originalPrice: 5800000,
        category: 'table',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Mặt bàn tạo hình giọt nước uốn cong mềm mại triệt tiêu các góc nhọn nguy hiểm, phô diễn trọn vẹn vân gỗ sồi mộc mạc phủ sơn lau dầu thực vật an toàn cho trẻ nhỏ.',
        materials: [
            'Gỗ sồi tự nhiên màu sáng (Natural Oak)',
            'Gỗ sồi lau dầu nâu óc chó (Walnut Finish)'
        ],
        sizes: [
            'Đường kính 80cm (Bàn đơn)',
            'Bộ đôi lồng nhau (ĐK 80cm + 50cm)'
        ],
        specs: {
            'Chất liệu': '100% Gỗ sồi trắng nhập khẩu Bắc Mỹ',
            'Hoàn thiện': 'Dầu lau thực vật Rubio Monocoat chống nước',
            'Cạnh bàn': 'Vát cạnh 45 độ bo tròn mượt mà',
            'Bảo hành': '3 năm chống cong vênh nứt nẻ'
        },
        rating: 4.9,
        reviews: 62,
        badge: 'Hygge Choice'
    },
    {
        id: 'FURN03',
        name: 'Ghế Thư Giãn Lounge Chair Da Bò Thật Kèm Đôn Gác Chân "Stockholm Relax"',
        slug: 'ghe-thu-gian-lounge-chair-stockholm',
        price: 9900000,
        originalPrice: 12200000,
        category: 'chair',
        image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Tuyệt tác công thái học giúp thư giãn cột sống sau ngày dài làm việc. Lớp da bò thuộc nguyên tấm càng dùng càng mềm và bóng đẹp, khung kim loại và gỗ sồi chịu tải 250kg.',
        materials: [
            'Da bò Nappa màu Nâu Caramel',
            'Da bò Nappa màu Đen Mờ Obsidian',
            'Da bò Nappa màu Xanh Rêu Forest'
        ],
        sizes: [
            'Kích thước tiêu chuẩn kèm đôn gác chân'
        ],
        specs: {
            'Chất liệu bọc': 'Da bò thật lớp 1 (Top-grain Leather)',
            'Khung chân': 'Thép carbon sơn tĩnh điện kết hợp gỗ sồi',
            'Góc ngả': 'Độ nghiêng 105 độ chuẩn thư giãn đọc sách',
            'Bảo hành': '5 năm da và kết cấu chịu lực'
        },
        rating: 5.0,
        reviews: 115,
        badge: 'Thiết Kế Đỉnh Cao'
    },
    {
        id: 'FURN04',
        name: 'Bàn Ăn Gỗ Óc Chó Solid Walnut Mở Rộng 6 - 8 Ghế "Aarhus Extendable"',
        slug: 'ban-an-go-oc-cho-aarhus-extendable',
        price: 18500000,
        originalPrice: 22000000,
        category: 'table',
        image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Cơ chế trượt mở rộng thông minh của Đức giúp kéo dài mặt bàn từ 1m6 lên 2m1 chỉ bằng một thao tác nhẹ nhàng, đáp ứng linh hoạt từ bữa ăn gia đình ấm cúng đến tiệc tiếp đãi bạn bè.',
        materials: [
            'Gỗ óc chó Bắc Mỹ (Solid American Walnut)',
            'Gỗ sồi trắng tự nhiên (Solid White Oak)'
        ],
        sizes: [
            '1m6 mở rộng 2m1 (Cho 6 - 8 người)',
            '1m8 mở rộng 2m4 (Cho 8 - 10 người)'
        ],
        specs: {
            'Mặt bàn': 'Gỗ tự nhiên nguyên khối ghép mộng âm dương',
            'Hệ ray trượt': 'Ray trượt giảm chấn Hafele tiêu chuẩn Đức',
            'Tải trọng': 'Mặt bàn mở rộng chịu lực tới 120kg',
            'Bảo hành': '5 năm bảo trì trọn đời'
        },
        rating: 4.9,
        reviews: 58,
        badge: 'Thông Minh'
    },
    {
        id: 'FURN05',
        name: 'Giường Ngủ Khung Gỗ Tần Bì Bọc Đầu Giường Vải Dệt "Helsinki Cloud Bed"',
        slug: 'giuong-ngu-go-tan-bi-helsinki-cloud',
        price: 16200000,
        originalPrice: 19800000,
        category: 'bed',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Đầu giường êm ái như những đám mây bông bồng bềnh, nâng đỡ lưng thoải mái khi đọc sách hoặc xem phim trước khi ngủ. Giát giường thanh gỗ thông cong đàn hồi phân tán đều trọng lực.',
        materials: [
            'Vải dệt Linen Màu Yến Mạch (Oatmeal)',
            'Vải nỉ nhung Màu Khói Trầm (Muted Fog)'
        ],
        sizes: [
            'Queen Size: 1m6 x 2m0',
            'King Size: 1m8 x 2m0',
            'Super King: 2m0 x 2m2'
        ],
        specs: {
            'Khung giường': 'Gỗ tần bì Ash tự nhiên chống mối mọt',
            'Giát giường': 'Nan gỗ uốn dẻo trợ lực đàn hồi cao cấp',
            'Chiều cao chân': '18cm thoáng gầm dễ dàng vệ sinh',
            'Bảo hành': '5 năm kết cấu khung xương'
        },
        rating: 5.0,
        reviews: 94,
        badge: 'Best for Sleep'
    },
    {
        id: 'FURN06',
        name: 'Kệ Sách Gỗ Tối Giản Nhiều Tầng Modular Bookshelf "Bergen Minimalist"',
        slug: 'ke-sach-go-toi-gian-bergen-modular',
        price: 5400000,
        originalPrice: 6800000,
        category: 'shelf',
        image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Hệ kệ module đa năng kết hợp ngăn kín và đợt gỗ hở, cho phép trưng bày sách, tranh ảnh, tượng gốm nghệ thuật và chậu cây xanh giúp không gian thêm sinh động.',
        materials: [
            'Gỗ sồi tự nhiên màu sáng (Light Oak)',
            'Gỗ sồi sơn phủ đen mờ phong cách Wabi-Sabi'
        ],
        sizes: [
            'Kệ 4 tầng: Cao 1m4 x Rộng 90cm',
            'Kệ 5 tầng: Cao 1m8 x Rộng 1m2'
        ],
        specs: {
            'Cấu trúc': 'Module tháo lắp thông minh không lộ vít',
            'Tải trọng': 'Mỗi tầng kệ chịu tải 35kg',
            'Chân đế': 'Tăng chỉnh chống trầy sàn và cân bằng độ dốc',
            'Bảo hành': '3 năm bảo hành chính hãng'
        },
        rating: 4.8,
        reviews: 45,
        badge: 'Modular'
    },
    {
        id: 'FURN07',
        name: 'Đèn Cây Đứng Phòng Khách Chao Vải Linen Thân Gỗ "Nordic Glow Floor Lamp"',
        slug: 'den-cay-dung-chao-vai-linen-nordic-glow',
        price: 2150000,
        originalPrice: 2700000,
        category: 'decor',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Ánh sáng vàng ấm 3000K dịu nhẹ xuyên qua lớp chao đèn vải Linen thô mộc, tạo điểm nhấn ấm cúng cho góc sofa hay góc đọc sách thư giãn buổi tối.',
        materials: [
            'Thân gỗ tần bì chao vải Linen Tự Nhiên',
            'Thân kim loại mạ đồng thau xước vintage'
        ],
        sizes: [
            'Chiều cao 1m55 (Đường kính chao 40cm)'
        ],
        specs: {
            'Bóng đèn': 'Tặng kèm bóng LED Philips Warm White 9W',
            'Công tắc': 'Công tắc đạp chân tiện lợi',
            'Đui đèn': 'Chuẩn E27 dễ dàng thay thế bóng',
            'Bảo hành': '2 năm phần điện & bóng'
        },
        rating: 4.9,
        reviews: 77,
        badge: 'Warm Glow'
    },
    {
        id: 'FURN08',
        name: 'Thảm Trải Sàn Dệt Thủ Công Họa Tiết Hình Học Bohemian "Scandi Wool Rug"',
        slug: 'tham-trai-san-len-det-thu-cong-scandi-wool',
        price: 3200000,
        originalPrice: 4100000,
        category: 'decor',
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Dệt thủ công từ 80% sợi len tự nhiên kết hợp sợi cotton hữu cơ, bề mặt dày dặn êm chân, khả năng cách âm chống trơn trượt hoàn hảo cho sàn gỗ phòng khách và phòng ngủ.',
        materials: [
            'Len cừu New Zealand phối hoa văn Kem & Đen Khói',
            'Len dệt mộc hoa văn Kim Cương Đan Mạch'
        ],
        sizes: [
            '1m6 x 2m3 (Cho sofa đôi / giường ngủ)',
            '2m0 x 3m0 (Cho phòng khách lớn / bàn ăn)'
        ],
        specs: {
            'Chất liệu': '80% Len tự nhiên New Zealand, 20% Cotton',
            'Độ dày': '15mm dệt nốt cao cấp cực kỳ êm ái',
            'Đế thảm': 'Phủ cao su non chống xô lệch trên mặt sàn',
            'Bảo hành': '2 năm chống bung viền tuột sợi'
        },
        rating: 4.9,
        reviews: 91,
        badge: 'Handmade'
    }
];

// Helper Functions
function formatPrice(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

function getProductBySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug);
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

function getRelatedProducts(currentId, limit = 4) {
    return PRODUCTS.filter(p => p.id !== currentId).slice(0, limit);
}
