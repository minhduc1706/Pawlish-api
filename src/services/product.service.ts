import { Product } from "../models/product.model";
import { IProduct } from "../interfaces/product.interface";
export class ProductService {
  static async getAllProducts(): Promise<IProduct[]> {
    try {
      return await Product.find().populate("category_id", "name");
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message || error}`);
    }
  }

  static async getProductById(id: string): Promise<IProduct | null> {
    try {
      const product = await Product.findById(id).populate(
        "category_id",
        "name"
      );
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product;
    } catch (error) {
      console.error("Error fetching product by id:", error);
      throw new Error(
        `Error fetching product by id: ${error.message || error}`
      );
    }
  }

  static async addProduct(productData: IProduct): Promise<IProduct> {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error(`Error adding product: ${error.message || error}`);
    }
  }

  static async updateProduct(
    id: string,
    productData: Partial<IProduct>
  ): Promise<IProduct | null> {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
      if (!updatedProduct) {
        throw new Error(`Product with id ${id} not found`);
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error(`Error updating product: ${error.message || error}`);
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      const deletedProduct = await Product.deleteOne({_id: id});
      if (!deletedProduct) {
        throw new Error(`Product with id ${id} not found`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(`Error deleting product: ${error.message || error}`);
    }
  }
}
