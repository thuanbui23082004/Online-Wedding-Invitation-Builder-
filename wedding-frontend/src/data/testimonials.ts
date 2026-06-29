// src/data/testimonials.ts
export interface Testimonial {
    text: string;
    image: string;
    name: string;
    role: string;
}

export const testimonialsData: Testimonial[] = [
  {
    text: "Tụi mình tự tạo thiệp cưới trên DearLove chỉ mất chưa đầy 15 phút. Giao diện kéo thả trực quan, hình ảnh lên nét căng và điều thích nhất là tính năng quản lý khách mời tham dự cực kỳ chính xác, đỡ hẳn khâu gọi điện xác nhận.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Linh Đan",
    role: "Cô dâu tháng 10",
  },
  {
    text: "DearLove saved us so much time! Since my husband is American and I am Vietnamese, we needed a platform that supports multiple languages effortlessly. Our guests from New York and Hanoi loved the elegant bilingual design.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "David & Thu Hồng",
    role: "Đám cưới Việt - Mỹ",
  },
  {
    text: "Nhận được link thiệp cưới từ bạn thân mà bất ngờ vì giao diện dễ thương quá! Có cả bản đồ chỉ đường, nhạc nền tự động phát và khu vực gửi lời chúc trực tuyến rất ý nghĩa. Mình đã bấm xác nhận tham dự ngay trên thiệp.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Minh Thư",
    role: "Khách mời dự tiệc",
  },
  {
    text: "As an expat living in Da Nang, planning a wedding locally was challenging until I found DearLove. The digital invitations are stunning, modern, and incredibly easy to share via WhatsApp and social media with my family back home.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Michael Green",
    role: "Chú rể ngoại quốc tại Việt Nam",
  },
  {
    text: "Tính năng nhận lời chúc trực tuyến của DearLove là kho tàng kỷ niệm vô giá đối với tụi mình. Đêm tân hôn hai vợ chồng ngồi mở danh sách ra đọc từng lời chúc bằng cả tiếng Việt lẫn tiếng Anh của bạn bè mà vừa cười vừa xúc động.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ngọc Anh",
    role: "Cô dâu mới",
  },
  {
    text: "Ce site là là fantastique! Thiết kế tinh tế chuẩn gu châu Âu, hệ thống phông chữ cực kỳ sang trọng. Nó giải quyết hoàn hảo bài toán gửi thiệp cưới nhanh chóng cho các cặp đôi có bạn bè, gia đình sinh sống ở nhiều quốc gia khác nhau.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Thomas & Minh Anh",
    role: "Cặp đôi Việt - Pháp",
  },
];
