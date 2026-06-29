// src/data/templates.ts
import WeddingImg1 from '../assets/images/wedding1.jpg';
import WeddingImg2 from '../assets/images/wedding2.jpg';
import WeddingImg3 from '../assets/images/wedding3.jpg';
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
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 3,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg3,
    detailImages: [WeddingImg3, WeddingImg1, WeddingImg2],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 2,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 2,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 2,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 2,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  },
  {
    id: 2,
    title: "Mẫu thiệp mời Truyền thống Á Đông",
    code: "DL-2026-02",
    tag: "TRADITIONAL",
    price: "Miễn phí",
    mainImage: WeddingImg2,
    detailImages: [WeddingImg2, WeddingImg1, WeddingImg3],
    description: "Đậm đà nét đẹp truyền thống với họa tiết song hỷ và tone màu đỏ may mắn, được cách điệu nhẹ nhàng phù hợp xu hướng thời đại."
  }
];