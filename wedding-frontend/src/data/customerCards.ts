// src/data/customerCards.ts
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

export interface CustomerCardItem {
  id: number;
  title: string;
  date: string;
  image: string;
  url: string;
}

export const customerCardsData: CustomerCardItem[] = [
  {
    id: 1,
    title: "Thiệp Cưới 222 Pre",
    date: "29/06/2026",
    image: WeddingImg1,
    url: "/show/1"
  },
  {
    id: 2,
    title: "Thiệp mời cưới Minh Thái & Nguyễn Nhung",
    date: "24/06/2026",
    image: WeddingImg2,
    url: "/show/2"
  },
  {
    id: 3,
    title: "KHÁNH DUY - NGỌC TRÂM",
    date: "02/06/2026",
    image: WeddingImg3,
    url: "/show/3"
  },
  {
    id: 4,
    title: "Thế Mạnh & Thảo Vân Wedding",
    date: "23/06/2026",
    image: WeddingImg4,
    url: "/show/4"
  },
  {
    id: 5,
    title: "MINH CHIẾN & HUYỀN MY WEDDING",
    date: "30/03/2026",
    image: WeddingImg5,
    url: "/show/5"
  },
  {
    id: 6,
    title: "Thiệp Cưới Tự Sỹ Đào Bình",
    date: "20/06/2026",
    image: WeddingImg6,
    url: "/show/6"
  },
  {
    id: 7,
    title: "Đức Tài & Lan Phương Wedding",
    date: "15/06/2026",
    image: WeddingImg7,
    url: "/show/7"
  },
  {
    id: 8,
    title: "Anh Tuấn & Bích Ngọc Tiệc Cưới",
    date: "12/06/2026",
    image: WeddingImg8,
    url: "/show/8"
  },
  {
    id: 9,
    title: "Hoàng Long & Mỹ Duyên Lễ Cưới",
    date: "08/06/2026",
    image: WeddingImg9,
    url: "/show/9"
  },
  {
    id: 10,
    title: "Quốc Anh & Hà Anh Lễ Thành Hôn",
    date: "01/06/2026",
    image: WeddingImg10,
    url: "/show/10"
  }
];
