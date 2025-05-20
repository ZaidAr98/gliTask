interface ProductResponse {
  exists: boolean;
  product?: {
    id: number;
    price: number;
    stock: number;
  };
}
