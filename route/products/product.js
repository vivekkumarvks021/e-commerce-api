const dbProducts = require("../../models/product");
const Yup = require("yup");

const productSchema = Yup.object().shape({
  title: Yup.string().min(3).required(),
  price: Yup.string().required(),
  description: Yup.string().required(),
  category: Yup.string().required(),
});

const product = async (req, res) => {
  const { title, price, description, category } = req.body;
  const productImage = req.file.path;
  let productId = (await dbProducts.count()) + 1;
  productId = `product${productId}`;

  await new dbProducts({
    productId,
    title,
    price,
    description,
    category,
    productImage,
  }).save();

  res.json({
    success: true,
    message: "Product added.",
  });
};

const getProducts = async (req, res) => {
  let { sort, limit } = req.query;
  if (sort === "desc") {
    sort = { _id: -1 };
  } else {
    sort = { _id: 1 };
  }
  const products = await dbProducts.find().sort(sort).limit(limit);

  res.json({
    success: true,
    products,
  });
};

const getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await dbProducts.find({ productId });

  res.json({
    success: true,
    product,
  });
};

const updateProduct = async (req, res) => {
  const { title, price, description, category } = req.body;
  const { productId } = req.params;
  const productImage = req.file.path;

  const updatedProduct = await dbProducts.findOneAndUpdate(
    { productId },
    { title, price, description, category, productImage }
  );

  if (updatedProduct) {
    res.json({
      success: true,
      message: "Product updated.",
    });
  } else {
    res.json({
      success: false,
      message: "Product Not found.",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  const deleteProduct = await dbProducts.deleteOne({ productId });

  if (deleteProduct.deletedCount) {
    res.json({
      success: true,
      message: "Product Deleted.",
    });
  } else {
    res.json({
      success: false,
      message: "Product Not found.",
    });
  }
};

module.exports = {
  product,
  productSchema,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
