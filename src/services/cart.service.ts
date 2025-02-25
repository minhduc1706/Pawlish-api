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
    if (!product) {
      throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = new Cart({
        user_id: userId,
        items: [{ productId, quantity }],
        totalPrice: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart.totalPrice += product.price * quantity;
    }

    await cart.save();
    return cart;
  }

  static async getCart(user_id: string) {
    try {
      const cart = await Cart.findOne({ user_id }).populate("items.productId", "name price imgUrl");
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
      const cart = await Cart.findOne({ user_id });
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );

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
      let cart = await Cart.findOne({ user_id });
      if (!cart) {
        cart = new Cart({ user_id, items: [], totalPrice: 0 });
      }

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.productId.toString() === item.productId
        );

        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      }

      cart.totalPrice = await calculateTotalPrice(cart.items);

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to bulk add items to cart");
    }
  }
}
