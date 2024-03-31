const dbCategroies = require("../../models/category");
const dbProducts = require("../../models/product");
const Yup = require("yup");

const getCategories = async (req, res) => {
  let category = await dbCategroies.find();

  res.json({
    success: true,
    category: category[0].categories,
  });
};

const categorychema = Yup.object().shape({
  categoryName: Yup.string().required(),
});

const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  let category = await dbCategroies.find();
  let categoryId = `CAT${category[0].categories.length + 1}`;

  const categoryObject = {
    categoryId,
    categoryName: categoryName.toLowerCase(),
  };

  //   const addCategory = await new dbCategroies({
  //     categories: categoryObject,
  //   }).save();

  await dbCategroies.findOneAndUpdate(
    { _id: category[0]._id },
    { $push: { categories: categoryObject } }
  );

  res.json({
    success: true,
    message: "Product category successfully added.",
  });
};

const productsByCategories = async (req, res) => {
  const { category } = req.params;

  const product = await dbProducts.find({ category });

  res.json({
    success: true,
    product,
  });
};

module.exports = {
  addCategory,
  getCategories,
  productsByCategories,
  categorychema,
};
