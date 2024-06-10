import { Product } from "./product";

export class CartItem {
    _id: string;
    productId: Product;
    quantity: number;
    userId: string | null; // Change type to string | null
    sessionId: string | null; // Change type to string | null
    
    constructor(id: string, productId: Product, quantity: number, userId: string | null, sessionId: string | null) {
      this._id = id;
      this.productId = productId;
      this.quantity = quantity;
      this.userId = userId;
      this.sessionId = sessionId;
    }
}
