export interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
    product_description?: string;
    product_category?: string;
    product_image?: string;
    product_is_active?: boolean;
    product_stock?: number;
  }