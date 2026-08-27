export const DEFAULT_PICKUP_HOURS = "Mon–Fri, 9:00 AM – 6:00 PM CST";

export type IPickupLocation = {
  name: string;
  company: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  hours: string;
  formattedAddress: string;
};

/** Used only if the pickup-location API is unavailable. */
export const FALLBACK_PICKUP_LOCATION: IPickupLocation = {
  name: "STX Research — Corpus Christi",
  company: "STX Research",
  street: "3639 WL Breeding Dr",
  city: "Corpus Christi",
  state: "TX",
  postalCode: "78414",
  country: "US",
  phone: "361-222-4431",
  email: "rmungia@stxresearch.com",
  hours: DEFAULT_PICKUP_HOURS,
  formattedAddress: "3639 WL Breeding Dr, Corpus Christi, TX 78414",
};
