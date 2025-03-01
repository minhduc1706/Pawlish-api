import { IProductCategory } from "../interfaces/product_category.interface";
import { ProductCategory } from "../models/product_category.model";
export class ProductCategoryService {
  static async getAllCategories(): Promise<IProductCategory[]> {
    try {
      return await ProductCategory.find();
    } catch (error) {
      throw new Error("Error fetching categories: " + error.message);
    }
  }

  static async addCategory(
    categoryData: IProductCategory
  ): Promise<IProductCategory> {
    try {
      const newCategory = new ProductCategory(categoryData);
      return await newCategory.save();
    } catch (error) {
      throw new Error(`Error adding category : ${error.message || error}`);
    }
  }

  static async getCategoryById(id: string) {
    try {
      return await ProductCategory.findById(id).exec();
    } catch (error) {
      throw new Error("Error fetching category: " + error.message);
    }
  }

  static async updateCategory(id: string, categoryData: any) {
    try {
      const updatedCategory = await ProductCategory.findByIdAndUpdate(
        id,
        categoryData,
        { new: true }
      );
      return updatedCategory;
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  }

  static async deleteCategory(id: string) {
    try {
      await ProductCategory.deleteOne({ _id: id });
    } catch (error) {
      throw new Error("Error deleting category: " + error.message);
    }
  }
}
