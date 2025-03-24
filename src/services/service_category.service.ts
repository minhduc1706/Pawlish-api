import { AppError } from "../errors/AppError";
import { IServiceCategory } from "../interfaces/service_category.interface";
import { Service } from "../models/service.model";
import { ServiceCategory } from "../models/service_category.model";

export class ServiceCategoryService {
  static async getAllCategories(
    filters: {page: number 
    limit: number, search: string }
  ): Promise<IServiceCategory[]> {
    const { page = 1, limit = 10, search } = filters;

    const query: any = {};
    if (search) query.name = { $regex: search, $options: "i" };
    
    const categories = await ServiceCategory.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    if (!categories.length) throw new AppError("No categories found", 404);
    return categories;
  }

  static async addCategory(
    categoryData: IServiceCategory
  ): Promise<IServiceCategory> {
    const existingCategory = await ServiceCategory.findOne({
      name: categoryData.name,
    });
    if (!categoryData.name) throw new AppError("Name is required", 400);
    if (existingCategory) {
      throw new AppError("Category with this name already exists", 400);
    }
    const newCategory = new ServiceCategory(categoryData);
    return await newCategory.save();
  }

  static async getCategoryById(id: string): Promise<IServiceCategory> {
    const category = await ServiceCategory.findById(id).exec();
    if (!category) throw new AppError("Category not found", 404);
    return category;
  }

  static async updateCategory(
    id: string,
    categoryData: Partial<IServiceCategory>
  ): Promise<IServiceCategory> {
    const updatedCategory = await ServiceCategory.findByIdAndUpdate(
      id,
      categoryData,
      { new: true }
    );
    if (!updatedCategory) throw new AppError("Category not found", 404);
    return updatedCategory;
  }

  static async deleteCategory(id: string): Promise<void> {
    const serviceUsingCategory = await Service.findOne({ category_id: id });
    if (serviceUsingCategory) {
      throw new AppError(
        "Cannot delete category because it is being used by a service",
        400
      );
    }
    const result = await ServiceCategory.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new AppError("Category not found", 404);
  }
}
