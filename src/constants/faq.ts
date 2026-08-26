export const FAQ_CATEGORIES = [
  "General Information",
  "Usage & Research",
  "Quality & Testing",
  "Shipping & Delivery",
  "Order & Returns",
] as const;

export type TFaqCategory = (typeof FAQ_CATEGORIES)[number];

export type IFaq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const FAQ_CATEGORY_OPTIONS = FAQ_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

export const resolveFaqCategory = (category?: string) =>
  category?.trim() || "General Information";
