export type FoodItem = {
  supplier_id?: number;
  supplier_name?: string;
  discount_code?: string;
  total_amount: number;
  payment_amount: number;
  discount_amount: number;
  price: number;
  image?: string;
  count: number;
  description?: string;
  name: string;
  food_id: number;
};

export type BasketType = {
  total_amount: number;
  payment_amount: number;
  total_discount_amount: number;
  food_list: FoodItem[];
  general_discount_detail: any;
};
