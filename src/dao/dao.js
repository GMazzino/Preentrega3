import appConfig from '../../app_config.js';

let products;
let carts;

switch (appConfig.PERSISTENCE) {
  case 'mem':
    const { default: MemProducts } = await import('./mem_products.js');
    const { default: MemCarts } = await import('./mem_carts.js');
    products = new MemProducts();
    carts = new MemCarts();
    break;

  case 'mongoDB':
    const { products: prods } = await import('./mongoDB_products.js');
    products = prods;
    const { default: MongoDBCarts } = await import('./mongoDB_carts.js');
    carts = new MongoDBCarts();
    break;

  default:
    break;
}
export { products, carts };
