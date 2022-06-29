import mongoose from 'mongoose';

// const productsCollection = "products";
const cartsCollection = 'carts';

// const productsSchema = new mongoose.Schema(
//   {
//     code: { type: String, maxLength: 25, required: true },
//     name: { type: String, maxLength: 50, required: true },
//     description: { type: String, maxLength: 100, required: true },
//     price: { type: Number, required: true },
//     stock: { type: Number, required: true },
//     datetime: { type: Date, required: true, default: Date.now() },
//     imgURL: { type: String, maxLength: 150, required: true },
//   },
//   { versionKey: false }
// );

const cartsSchema = new mongoose.Schema(
  {
    products: { type: Object },
  },
  { versionKey: false }
);

// export const productsModel = mongoose.model(productsCollection, productsSchema);
export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
export { mongoose };
