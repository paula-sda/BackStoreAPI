export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
}

export type CreateProduct = Omit<Product, 'id'>;
export type UpdateProduct = Partial<CreateProduct>;
