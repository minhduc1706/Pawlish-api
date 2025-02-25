import { Product } from '../models/product.model';  

export class ProductService {
  static async getAllProducts() {
    try {
      const products = await Product.find();  
      return products;
    } catch (error) {
      console.error('[ErrorHandler] 500 - Internal Server Error');
      console.error(error);
      throw error; 
    }
  }
}
