export type DashboardKpi = {
  label: string;
  value: string;
  helper: string;
};

export type SkinCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  rarity: string;
  exterior: string;
  wear: number;
  price: number;
  image: string;
  finishStyle: string;
  description: string;
  collection: string;
  liquidityScore: number;
  favorite?: boolean;
};

export type ListingCard = {
  id: string;
  askPrice: number;
  createdAt: string;
  sellerName: string;
  sellerSteamConnected: boolean;
  status: "ACTIVE" | "SOLD" | "CANCELLED";
  skin: SkinCard;
};

export type ChartPoint = {
  date: string;
  value: number;
};
