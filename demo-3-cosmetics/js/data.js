/**
 * DỮ LIỆU SẢN PHẨM MẪU - GLOWAURA BEAUTY (MỸ PHẨM & CHĂM SÓC DA CAO CẤP)
 */

const CATEGORIES = [
    { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-solid fa-sparkles' },
    { id: 'skincare', name: 'Serum & Tinh chất', icon: 'fa-solid fa-droplet' },
    { id: 'cream', name: 'Kem dưỡng phục hồi', icon: 'fa-solid fa-jar' },
    { id: 'cleanser', name: 'Làm sạch & Tẩy trang', icon: 'fa-solid fa-pump-soap' },
    { id: 'sunscreen', name: 'Kem chống nắng', icon: 'fa-solid fa-sun' },
    { id: 'combo-set', name: 'Bộ chăm sóc da', icon: 'fa-solid fa-gift' }
];

const PRODUCTS = [
    {
        id: 'COS01',
        name: 'Serum Phục Hồi & Tái Tạo Da Chuyên Sâu GlowAura B5 Advanced',
        slug: 'serum-phuc-hoi-b5-glowaura',
        category: 'skincare',
        price: 680000,
        originalPrice: 890000,
        discount: 24,
        rating: 5.0,
        reviewsCount: 245,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1608248597359-5f28c2e64ca6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Tinh chất chứa 10% Vitamin B5, Hyaluronic Acid đa tầng và rau má Centella giúp làm dịu, cấp ẩm và phục hồi hàng rào bảo vệ da.',
        description: 'Serum GlowAura B5 Advanced là giải pháp cứu cánh số 1 cho làn da tổn thương, da sau peel/laser hoặc da nhạy cảm mất nước. Kết cấu mỏng nhẹ, thẩm thấu nhanh không nhờn rít, trả lại làn da căng bóng ngậm nước chỉ sau 7 ngày sử dụng.',
        stock: 50,
        badge: 'Best Seller',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Dung tích': '30ml / 50ml',
            'Thành phần chính': 'Vitamin B5 10%, HA 4 tầng, Centella Asiatica',
            'Loại da phù hợp': 'Mọi loại da, đặc biệt da nhạy cảm & da mụn',
            'Xuất xứ': 'Pháp - Tiêu chuẩn Dược Mỹ Phẩm Châu Âu',
            'Hạn sử dụng': '36 tháng kể từ ngày sản xuất'
        },
        capacities: ['30ml (Tiêu chuẩn)', '50ml (Tiết kiệm)', '100ml (Đại gia đình)'],
        skinTypes: ['Mọi loại da', 'Da dầu mụn', 'Da khô nhạy cảm']
    },
    {
        id: 'COS02',
        name: 'Kem Dưỡng Cấp Ẩm Khóa Nước Trẻ Hóa GlowAura Peptide Cream',
        slug: 'kem-duong-tre-hoa-peptide-cream',
        category: 'cream',
        price: 820000,
        originalPrice: 1050000,
        discount: 22,
        rating: 4.9,
        reviewsCount: 182,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Phức hợp 6 loại Peptide sinh học cùng Ceramide NP củng cố cấu trúc đàn hồi, ngăn ngừa nếp nhăn và khóa ẩm 72H.',
        description: 'Chất kem nhung mềm mịn tan đều trên da, nuôi dưỡng làn da căng mướt tràn đầy sức sống. Hỗ trợ mờ nếp nhăn li ti khóe mắt và rãnh cười, mang đến vẻ rạng ngời tươi trẻ chuẩn spa.',
        stock: 35,
        badge: 'Chống lão hóa',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Thành phần chính': '6-Peptides Complex, Ceramide NP, Squalane thực vật',
            'Hiệu quả': 'Cấp ẩm 72H, săn chắc cơ mặt, mờ nhăn',
            'Kết cấu': 'Kem gel mỏng mịn thấm nhanh không bí da'
        },
        capacities: ['50ml', '80ml Phiên bản đặc biệt'],
        skinTypes: ['Da lão hóa', 'Da khô mất nước', 'Mọi loại da']
    },
    {
        id: 'COS03',
        name: 'Kem Chống Nắng Phổ Rộng Vô Hình GlowAura UV Shield SPF50+ PA++++',
        slug: 'kem-chong-nang-uv-shield-spf50',
        category: 'sunscreen',
        price: 520000,
        originalPrice: 650000,
        discount: 20,
        rating: 5.0,
        reviewsCount: 310,
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Màng lọc quang phổ rộng chống tia UVA/UVB và ánh sáng xanh, kiềm dầu 8 tiếng, nâng tone trắng hồng tự nhiên.',
        description: 'Kem chống nắng vật lý lai hóa học thế hệ mới nhất với kết cấu sữa lỏng nhẹ tênh như không thoa. Kháng nước và mồ hôi tối đa, không để lại vệt trắng hay gây bít tắc lỗ chân lông sinh mụn.',
        stock: 65,
        badge: 'Top 1 Mùa Hè',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Chỉ số chống nắng': 'SPF50+ / PA++++ / PPD 38',
            'Khả năng chống nước': 'Water-resistant 80 phút',
            'Lớp hoàn thiện': 'Matte ráo mịn kiềm dầu nâng 0.5 tone'
        },
        capacities: ['50ml Tuýp tiêu chuẩn', '100ml Chai đôi gia đình'],
        skinTypes: ['Da dầu mụn', 'Da hỗn hợp thiên dầu', 'Mọi loại da']
    },
    {
        id: 'COS04',
        name: 'Nước Tẩy Trang Micellar Dịu Nhẹ Cấp Ẩm GlowAura Gentle Cleanse',
        slug: 'nuoc-tay-trang-micellar-gentle-cleanse',
        category: 'cleanser',
        price: 380000,
        originalPrice: 480000,
        discount: 21,
        rating: 4.8,
        reviewsCount: 140,
        image: 'https://images.unsplash.com/photo-1556228722-d0b7d8d21c43?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1556228722-d0b7d8d21c43?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Công nghệ phân tử Micellar hút sạch 99.8% bụi mịn PM2.5, bã nhờn và cặn trang điểm chống nước mà không cay mắt.',
        description: 'Công thức không cồn, không hương liệu nhân tạo, bổ sung chiết xuất hoa cúc La Mã và nước khoáng núi lửa giúp giữ ẩm cho da mềm mượt ngay sau khi tẩy trang.',
        stock: 45,
        badge: 'Dịu nhẹ',
        isFeatured: false,
        isFlashSale: false,
        specs: {
            'Công nghệ': 'Micellar Biphasic hút sâu tận lỗ chân lông',
            'Độ an toàn': 'Dùng được cho cả mắt & môi nhạy cảm',
            'Dung tích': '400ml Siêu tiết kiệm'
        },
        capacities: ['250ml', '400ml Tiết kiệm'],
        skinTypes: ['Mọi loại da', 'Da cực kỳ nhạy cảm']
    },
    {
        id: 'COS05',
        name: 'Sữa Rửa Mặt Tạo Bọt Axit Amin Dịu Nhẹ pH 5.5 GlowAura Foam',
        slug: 'sua-rua-mat-tao-bot-axit-amin',
        category: 'cleanser',
        price: 320000,
        originalPrice: 400000,
        discount: 20,
        rating: 4.9,
        reviewsCount: 118,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Hệ hoạt chất bề mặt axit amin thuần khiết cân bằng độ pH chuẩn 5.5, làm sạch sâu không gây khô căng da.',
        description: 'Bọt xốp siêu mịn len lỏi vào từng lỗ chân lông loại bỏ bã nhờn dư thừa và tế bào chết già cỗi, duy trì lớp màng lipid bảo vệ da tự nhiên.',
        stock: 60,
        badge: 'pH 5.5 Chuẩn',
        isFeatured: true,
        isFlashSale: true,
        specs: {
            'Độ pH': 'Chuẩn sinh lý da 5.5',
            'Thành phần làm sạch': 'Gốc Amino Acid từ dừa thiên nhiên',
            'Dung tích': '150ml'
        },
        capacities: ['150ml'],
        skinTypes: ['Da dầu mụn', 'Da hỗn hợp', 'Da thường']
    },
    {
        id: 'COS06',
        name: 'Bộ Quà Tặng Dưỡng Trắng & Tái Sinh Da Toàn Diện GlowAura Radiance Set',
        slug: 'bo-qua-tang-duong-trang-radiance-set',
        category: 'combo-set',
        price: 1850000,
        originalPrice: 2450000,
        discount: 24,
        rating: 5.0,
        reviewsCount: 88,
        image: 'https://images.unsplash.com/photo-1608248597359-5f28c2e64ca6?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1608248597359-5f28c2e64ca6?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Hộp quà nhung sang trọng gồm trọn bộ 4 món: Sữa rửa mặt, Nước thần cân bằng, Serum B5 và Kem khóa ẩm Peptide.',
        description: 'Món quà đẳng cấp dành tặng phái đẹp. Liệu trình chăm sóc da 4 bước chuẩn khoa học mang lại hiệu quả nâng tone sáng khỏe và làm mờ thâm nám rõ rệt sau 14 ngày.',
        stock: 25,
        badge: 'Hộp Quà Cao Cấp',
        isFeatured: true,
        isFlashSale: false,
        specs: {
            'Bao gồm 4 sản phẩm': 'Cleanser 100ml + Toner 150ml + Serum 30ml + Cream 50ml',
            'Đóng gói': 'Hộp quà cứng nam châm mạ vàng dập nổi logo',
            'Tặng kèm': 'Băng đô skincare lụa cao cấp & thiệp chúc mừng'
        },
        capacities: ['Fullset 4 Món Cao Cấp'],
        skinTypes: ['Mọi loại da cần phục hồi & dưỡng sáng']
    },
    {
        id: 'COS07',
        name: 'Serum Tinh Chất Niacinamide 15% Thu Nhỏ Lỗ Chân Lông & Mờ Thâm',
        slug: 'serum-niacinamide-15-thu-nho-lo-chan-long',
        category: 'skincare',
        price: 750000,
        originalPrice: 950000,
        discount: 21,
        rating: 4.9,
        reviewsCount: 165,
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Niacinamide nồng độ cao kết hợp Kẽm PCA 1% điều tiết dầu thừa, se khít lỗ chân lông và làm đều màu da.',
        description: 'Đặc trị các vấn đề thâm đỏ sau mụn, xỉn màu và lỗ chân lông to ở vùng chữ T. Mang lại bề mặt da láng mịn như nhung chỉ sau 2-4 tuần.',
        stock: 40,
        badge: 'Mờ thâm mụn',
        isFeatured: false,
        isFlashSale: true,
        specs: {
            'Nồng độ': 'Niacinamide 15% + Zinc PCA 1% + Arbutin 2%',
            'Dung tích': '30ml',
            'Khuyên dùng': 'Sử dụng sáng và tối sau bước toner'
        },
        capacities: ['30ml', '50ml'],
        skinTypes: ['Da dầu thâm mụn', 'Lỗ chân lông to']
    },
    {
        id: 'COS08',
        name: 'Mặt Nạ Ngủ Dưỡng Ẩm & Tái Sinh Collagen GlowAura Sleeping Mask',
        slug: 'mat-na-ngu-collagen-sleeping-mask',
        category: 'cream',
        price: 490000,
        originalPrice: 620000,
        discount: 21,
        rating: 4.8,
        reviewsCount: 95,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
        ],
        shortDesc: 'Mặt nạ ngủ công nghệ màng nước bổ sung Collagen thủy phân và lợi khuẩn Men vi sinh Probiotics qua đêm.',
        description: 'Khôi phục độ săn chắc và độ ẩm ngay trong lúc bạn ngủ say. Thức dậy với làn da bóng bẩy, căng tràn năng lượng như vừa trải qua liệu trình spa đắt đỏ.',
        stock: 38,
        badge: 'Căng mướt qua đêm',
        isFeatured: false,
        isFlashSale: false,
        specs: {
            'Công dụng': 'Khóa ẩm ban đêm, tăng sinh Collagen',
            'Dung tích': '100g Hũ thủy tinh sang trọng'
        },
        capacities: ['100g'],
        skinTypes: ['Da thiếu ẩm', 'Da mệt mỏi xỉn màu']
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
