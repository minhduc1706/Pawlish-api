import { Product } from "./models/product.model";
import { ProductCategory } from "./models/product_category.model";

export const seedCartData = async () => {
  try {
    const categories = [
      { name: 'Shampoo', description: 'Pet shampoos and grooming products' },
      { name: 'Accessories', description: 'Pet accessories like collars and leashes' },
    ];
    
    const products = [
      {
        name: 'Pet Shampoo',
        description: 'A gentle shampoo for pets',
        price: 15.99,
        stock_quantity: 50,
        imgUrl: '/images/shampoo.jpg',
        categoryName: 'Shampoo',
      },
      {
        name: 'Pet Grooming Scissors',
        description: 'Scissors for grooming pets',
        price: 25.99,
        stock_quantity: 30,
        imgUrl: '/images/scissors.jpg',
        categoryName: 'Accessories',
      },
    ];

    const createdCategories = await ProductCategory.insertMany(categories);
    console.log('Categories seeded:', createdCategories);

    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {}); 

    const productsWithCategory = products.map((product) => ({
      ...product,
      category_id: categoryMap[product.categoryName], 
    }));
    const createdProducts = await Product.insertMany(productsWithCategory);
    console.log('Products seeded:', createdProducts);
    console.log("Products created successfully!");
  } catch (error) {
    console.error("Error occurred during seeding:", error);
  }
};
