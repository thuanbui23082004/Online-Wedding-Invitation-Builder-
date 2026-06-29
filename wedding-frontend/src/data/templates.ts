// src/data/templates.ts
import WeddingImg1 from '../assets/images/wedding1.jpg';
import WeddingImg2 from '../assets/images/wedding2.jpg';
import WeddingImg3 from '../assets/images/wedding3.jpg';
import WeddingImg4 from '../assets/images/wedding4.jpg';
import WeddingImg5 from '../assets/images/wedding5.jpg';
import WeddingImg6 from '../assets/images/wedding6.jpg';
import WeddingImg7 from '../assets/images/wedding7.jpg';
import WeddingImg8 from '../assets/images/wedding8.jpg';
import WeddingImg9 from '../assets/images/wedding9.jpg';
import WeddingImg10 from '../assets/images/wedding10.jpg';

export interface TemplateItem {
  id: number;
  title: string;
  code: string;
  tag: string;
  price: string;
  mainImage: string;
  detailImages: string[]; 
  description: string;
}

export const templatesData: TemplateItem[] = [
  {
    id: 1,
    title: "Mẫu thiệp cưới Hiện đại - Thanh lịch",
    code: "DL-2026-01",
    tag: "WEDDING",
    price: "Miễn phí",
    mainImage: WeddingImg1,
    detailImages: [WeddingImg1, WeddingImg2, WeddingImg3], 
    description: "Phong cách thiết kế tối giản với sự kết hợp hài hòa của tone màu pastel ngọt ngào. Phù hợp cho các cặp đôi yêu thích sự hiện đại, tinh tế nhưng không kém phần lãng mạn."
  },
  {
    id: 2,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "WEDDING",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 3,
    title: "Thiệp mời Họp lớp - Thời gian trôi nhanh như tên bắn",
    code: "DL-REUNION-01",
    tag: "REUNION",
    price: "Miễn phí",
    mainImage: WeddingImg4,
    detailImages: [WeddingImg4, WeddingImg5, WeddingImg6],
    description: "Mẫu thiệp mời họp lớp, gặp mặt bạn bè sau nhiều năm ra trường. Gợi nhớ kỷ niệm tuổi học trò thơ ngây và thân thương."
  },
  {
    id: 4,
    title: "Lễ Tốt nghiệp - Trường Đại học Hà Nội",
    code: "DL-GRAD-01",
    tag: "GRADUATION",
    price: "Miễn phí",
    mainImage: WeddingImg5,
    detailImages: [WeddingImg5, WeddingImg6, WeddingImg7],
    description: "Thiết kế trang trọng dành cho lễ tốt nghiệp đại học, cao đẳng. Thể hiện niềm tự hào và bước ngoặt quan trọng của cuộc đời sinh viên."
  },
  {
    id: 5,
    title: "Thiệp mời Kỷ yếu - Ngày tụ họp khóa học",
    code: "DL-GRAD-02",
    tag: "GRADUATION",
    price: "Miễn phí",
    mainImage: WeddingImg6,
    detailImages: [WeddingImg6, WeddingImg4, WeddingImg5],
    description: "Thiết kế trẻ trung, năng động cho lễ chụp ảnh kỷ yếu và ngày tụ họp của tập thể lớp."
  },
  {
    id: 6,
    title: "Happy Graduation - Lễ trao bằng tốt nghiệp",
    code: "DL-GRAD-03",
    tag: "GRADUATION",
    price: "39.000đ",
    mainImage: WeddingImg7,
    detailImages: [WeddingImg7, WeddingImg5, WeddingImg6],
    description: "Thiệp chúc mừng tốt nghiệp cao cấp với phong cách thiết kế hiện đại, nhiều hiệu ứng sinh động."
  },
  {
    id: 7,
    title: "Thiệp mời Sinh nhật Sweet Sixteen",
    code: "DL-BIRT-01",
    tag: "BIRTHDAY",
    price: "Miễn phí",
    mainImage: WeddingImg8,
    detailImages: [WeddingImg8, WeddingImg1, WeddingImg2],
    description: "Mẫu thiệp sinh nhật tươi vui, ngọt ngào dành cho các buổi tiệc đón tuổi mới nhiều niềm vui."
  },
  {
    id: 8,
    title: "Thiệp Tất Niên - Year End Party",
    code: "DL-YEAR-01",
    tag: "YEAR_END",
    price: "Miễn phí",
    mainImage: WeddingImg9,
    detailImages: [WeddingImg9, WeddingImg10, WeddingImg1],
    description: "Mẫu thiệp mời tiệc tất niên, gặp mặt cuối năm của các gia đình, nhóm bạn hoặc cơ quan đoàn thể."
  },
  {
    id: 9,
    title: "Thiệp mời Sự kiện và Hội nghị",
    code: "DL-EVEN-01",
    tag: "EVENT",
    price: "Miễn phí",
    mainImage: WeddingImg10,
    detailImages: [WeddingImg10, WeddingImg9, WeddingImg4],
    description: "Thiết kế lịch sự, tối giản và sang trọng phù hợp cho các buổi hội nghị, hội thảo hoặc sự kiện ra mắt sản phẩm."
  },
  {
    id: 10,
    title: "Thiệp gửi Lời chúc chúc phúc tốt đẹp",
    code: "DL-WISH-01",
    tag: "WISH",
    price: "Miễn phí",
    mainImage: WeddingImg3,
    detailImages: [WeddingImg3, WeddingImg1, WeddingImg2],
    description: "Thiệp chúc mừng và gửi gắm những lời chúc ngọt ngào nhất tới người thân yêu nhân ngày vui trọng đại."
  }
];