export async function getProducts(req, res) {
  const { default: axios } = await import('axios');
  const { data } = await axios.get('http://127.0.0.1:8080/api/productos');
  res.render('./user/products.ejs', {
    name: req.session.passport.user.name,
    products: data,
  });
}
