import { ICartItem } from "../interfaces/cart.interface";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";

const calculateTotalPrice = async (items: ICartItem[]): Promise<number> => {
  let totalPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId).select("price");
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  }
  return totalPrice;
};

export class CartService {
  static async addItemToCart(
    userId: string,
    productId: string,
    quantity: number
  ) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const cart = await Cart.findOneAndUpdate(
      { user_id: userId, "items.productId": productId },
      {
        $inc: {
          "items.$.quantity": quantity,
          totalPrice: product.price * quantity,
        },
      },
      { new: true }
    );

    if (!cart) {
      return await Cart.findOneAndUpdate(
        { user_id: userId },
        {
          $push: { items: { productId, quantity } },
          $inc: { totalPrice: product.price * quantity },
        },
        { new: true, upsert: true }
      );
    }

    await cart.save();
    return cart;
  }

  static async getCart(user_id: string) {
    try {
      const cart = await Cart.findOne({ user_id }).populate(
        "items.productId",
        "name price imgUrl"
      );
      if (!cart) {
        return { user_id, items: [], totalPrice: 0 };
      }
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch cart");
    }
  }

  static async removeFromCart(user_id: string, productId: string) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { user_id },
        { $pull: { items: { productId } } },
        { new: true }
      );

      if (!cart) throw new Error("Cart not found");

      cart.totalPrice = await calculateTotalPrice(cart.items);

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to remove item from cart");
    }
  }

  static async clearCart(user_id: string) {
    try {
      const cart = await Cart.findOneAndDelete({ user_id });
      if (!cart) {
        throw new Error("Cart not found");
      }
      return { message: "Cart cleared successfully" };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to clear cart");
    }
  }

  static async bulkAddToCart(
    user_id: string,
    items: { productId: string; quantity: number }[]
  ) {
    try {
      const productIds = items.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== items.length) {
        throw new Error("Some products not found");
      }

      let totalIncrement = 0;
      const updateOperations = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        totalIncrement += product.price * item.quantity;

        return {
          updateOne: {
            filter: { user_id, "items.productId": item.productId },
            update: { $inc: { "items.$.quantity": item.quantity } },
          },
        };
      });

      await Cart.bulkWrite(updateOperations);

      await Cart.findOneAndUpdate(
        { user_id },
        {
          $push: { items: { $each: items } },
          $inc: { totalPrice: totalIncrement },
        },
        { new: true, upsert: true }
      );

      return await Cart.findOne({ user_id }).populate(
        "items.productId",
        "name price imgUrl"
      );
    } catch (error) {
      console.error(error);
      throw new Error("Failed to bulk add items to cart");
    }
  }
}
