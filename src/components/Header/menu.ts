export type MenuItem = { label: string; href: string };

export type MenuGroup = {
  id: string;
  label: string;
  summary: string;
  items: MenuItem[];
};

export const menuGroups: MenuGroup[] = [
  {
    id: "products",
    label: "보증 상품",
    summary: "사업 단계에 맞는 보증을 찾아보세요.",
    items: [
      { label: "계약 보증", href: "#" },
      { label: "대출금 지급 보증", href: "#" },
      { label: "하자 보수 보증", href: "#" },
      { label: "창업 자금 보증", href: "#" },
      { label: "임대차 보증", href: "#" },
    ],
  },
  {
    id: "guide",
    label: "이용 안내",
    summary: "신청부터 발급까지 순서대로 안내합니다.",
    items: [
      { label: "신청 절차", href: "#" },
      { label: "필요 서류", href: "#" },
      { label: "보증료 계산", href: "#" },
      { label: "자주 묻는 질문", href: "#" },
    ],
  },
  {
    id: "support",
    label: "고객 지원",
    summary: "상담과 문의를 한곳에서 받습니다.",
    items: [
      { label: "상담 예약", href: "#" },
      { label: "지점 찾기", href: "#" },
      { label: "자료실", href: "#" },
      { label: "공지사항", href: "#" },
    ],
  },
  {
    id: "about",
    label: "회사 소개",
    summary: "앵커보증이 일하는 방식을 소개합니다.",
    items: [
      { label: "인사말", href: "#" },
      { label: "연혁", href: "#" },
      { label: "경영 공시", href: "#" },
      { label: "채용 안내", href: "#" },
    ],
  },
  {
    id: "consumer",
    label: "소비자 보호",
    summary: "권리와 절차를 쉽게 확인하세요.",
    items: [
      { label: "보호 정책", href: "#" },
      { label: "민원 접수", href: "#" },
      { label: "약관 안내", href: "#" },
    ],
  },
  {
    id: "disclosure",
    label: "공시 자료",
    summary: "상품과 재무 정보를 공개합니다.",
    items: [
      { label: "상품 공시", href: "#" },
      { label: "재무 현황", href: "#" },
      { label: "지속가능경영", href: "#" },
    ],
  },
];
