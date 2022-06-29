import {
  mongoose,
  cartsModel,
  productsModel,
} from '../models/mongoDB_schemas.js';
import appConfig from '../../app_config.js';

export default class Carts {
  #createMongo() {
    const db = mongoose.connect(
      appConfig.mongoRemote.url,
      appConfig.mongoRemote.advancedOptions
    ).connection;
    return db;
  }

  async createCartId() {
    try {
      const db = this.#createMongo();
      let createdCartId = await new cartsModel({ products: [] }).save();
      return { status: 200, content: { success: createdCartId.id } };
    } catch (err) {
      return {
        status: 500,
        content: { error: `Server error: ${err.message}` },
      };
    }
  }

  async delCart(cartId) {
    if (mongoose.isValidObjectId(cartId)) {
      const db = this.#createMongo();
      try {
        let del = await cartsModel.findByIdAndDelete(cartId);
        if (del !== null) {
          return {
            status: 200,
            content: { success: `Carrito con ID: ${cartId} borrado` },
          };
        } else {
          return {
            status: 200,
            content: { error: `Carrito con ID: ${cartId} no encontrado` },
          };
        }
      } catch (err) {
        return {
          status: 500,
          content: { error: `Server error: ${err.message}` },
        };
      }
    } else {
      return {
        status: 400,
        content: { error: `Error en la peticion.` },
      };
    }
  }

  async getCartProducts(cartId) {
    if (mongoose.isValidObjectId(cartId)) {
      const db = this.#createMongo();
      try {
        let cart;
        if ((cart = await cartsModel.findById(cartId)) != null) {
          return {
            status: 200,
            content: { success: cart.products },
          };
        } else {
          return {
            status: 200,
            content: { error: `El carrito ${cartId} no existe` },
          };
        }
      } catch (err) {
        return {
          status: 500,
          content: { error: `Server error: ${err.message}` },
        };
      }
    } else {
      return { status: 400, content: { error: `Error en la peticion.` } };
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    if (
      mongoose.isValidObjectId(cartId) &&
      mongoose.isValidObjectId(productId) &&
      !isNaN(quantity)
    ) {
      try {
        const db = this.#createMongo();
        let cart;
        let cartProducts;
        if ((cart = await cartsModel.findById(cartId)) != null) {
          let product = await productsModel.findById(productId);
          if (product != null) {
            cartProducts = cart.products;
            if (cartProducts[0] == null || cartProducts[0] == undefined) {
              // Empty cart
              cartProducts = [{ id: productId, quantity: quantity }];
            } else {
              let productIndex = cartProducts.findIndex(
                (prod) => prod.id == productId
              );
              if (productIndex == -1) {
                //New cart product
                cartProducts.push({
                  id: productId,
                  quantity: parseInt(quantity),
                });
              } else {
                //Existing cart product
                cartProducts[productIndex].quantity = parseInt(quantity);
              }
            }
          } else {
            return {
              status: 200,
              content: { error: `Producto no encontrado` },
            };
          }
        } else {
          return {
            status: 200,
            content: { error: `El carrito ${cartId} no existe` },
          };
        }
        let result = await cartsModel.findOneAndUpdate(
          { _id: cartId },
          { products: cartProducts }
        );
        if (result != null) {
          return {
            status: 200,
            content: {
              success: `Producto con ID ${productId} agregado/actualizado en el carrito con ID ${cartId}`,
            },
          };
        } else {
          return {
            status: 500,
            content: { error: `No se pudo guardar el producto.` },
          };
        }
      } catch (err) {
        return { status: 500, content: `Server error: ${err.message}` };
      }
    } else {
      return {
        status: 200,
        content: {
          error: `Error en la peticion.`,
        },
      };
    }
  }

  async delProductFromCart(cartId, productId) {
    if (
      mongoose.isValidObjectId(cartId) &&
      mongoose.isValidObjectId(productId)
    ) {
      const db = this.#createMongo();
      let cart;
      try {
        if ((cart = await cartsModel.findById(cartId)) != null) {
          let cartProducts = cart.products;
          if (cart.products[0] !== undefined) {
            cartProducts = cartProducts.filter((prod) => prod.id !== productId);
          } else {
            return { status: 200, content: { error: `El carrito esta vacio` } };
          }
          let result = await cartsModel.findOneAndUpdate(
            { _id: cartId },
            { products: cartProducts }
          );
          if (result != null) {
            return {
              status: 200,
              content: {
                success: `Producto con ID ${productId} borrado del carrito con ID ${cartId}`,
              },
            };
          } else {
            return {
              status: 500,
              content: { error: `No se pudo borrar el producto.` },
            };
          }
        } else {
          return {
            status: 200,
            content: {
              error: `El carrito con ID ${cartId} no existe`,
            },
          };
        }
      } catch (err) {
        return {
          status: 500,
          content: { error: `Server error: ${err.message}` },
        };
      }
    } else {
      return {
        status: 400,
        content: { error: `Error en la peticion.` },
      };
    }
  }
}
