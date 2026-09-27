import data from "@/data/shipping.json";

export type ShippingInfo = {
  instructions: string;
  recipientName: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  notes?: string;
};

export const shippingInfo: ShippingInfo = data;
