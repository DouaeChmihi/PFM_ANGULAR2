export class Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  details: string;
  category: string;
  quantity: number;

  constructor(id: string, name: string, price: number, description: string, image: string, details: string, category: string, quantity: number) {
    this._id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
    this.details = details;
    this.category = category;
    this.quantity = quantity;
  }
}
