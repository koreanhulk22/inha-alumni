export type PostType =
  | "총동창회소식"
  | "단위동문회소식"
  | "모교소식"
  | "동문동정"
  | "인터뷰/칼럼"
  | "공지사항"
  | "자유게시판"
  | "경조사알림"
  | "구인구직";

export type FundType = "회비발전기금" | "장학기금" | "건립기금";

export type BusinessCategory =
  | "요식업"
  | "의료"
  | "사무소"
  | "교육"
  | "서비스"
  | "기타";

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  summary?: string;
  image_url?: string | null;
  date: string;
  views: number;
  author_id: string;
  is_pinned: boolean;
  attachments?: string[];
  created_at: string;
}

export interface AlumniBusiness {
  id: string;
  name: string;
  category: BusinessCategory;
  address: string;
  lat: number;
  lng: number;
  benefit: string;
  owner_id: string;
  is_approved: boolean;
}

export interface Donation {
  id: string;
  fund_type: FundType;
  amount: number;
  donor_name: string;
  user_id?: string;
  is_anonymous: boolean;
  payment_key?: string;
  created_at: string;
}
