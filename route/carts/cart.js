const dbCart = require("../../models/cart");
const Yup = require("yup");

const cartSchema = Yup.object().shape({
  userId: Yup.string().required(),
  products: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required(),
        quantity: Yup.string().required(),
      })
    )
    .required(),
});

const addCart = async (req, res) => {
  const { userId, products } = req.body;
  const cart = await dbCart.findOneAndUpdate(
    { userId },
    { $push: { products } }
  );

  if (cart === null) {
    const cartId = `CART${new Date().now()}`;

    await new dbCart({
      cartId,
      userId,
      products,
    }).save();
  }

  res.json({
    success: true,
    message: "Added to cart successfully.",
  });
};

const getAllCart = async (req, res) => {
  let { startDate, endDate, sort, limit } = req.query;

  // if (sort && sort !== "asc" && sort !== "desc") {
  //   return res.json({
  //     success: false,
  //     message: "invalid sorting options.",
  //   });
  // } else
  if (sort === "desc") {
    sort = { _id: -1 };
  } else {
    sort = { _id: 1 };
  }

  let query = { $and: [] };
  if (startDate && endDate) {
    startDate = new Date(startDate);
    startDate.setDate(startDate.getDate() + 1);

    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate() + 1);

    query.$and.push({ date: { $gte: startDate, $lte: endDate } });
  } else if (startDate) {
    startDate = new Date(startDate);
    startDate.setDate(startDate.getDate() + 1);

    query.$and.push({ date: { $gte: startDate } });
  }
  if (endDate) {
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate() + 1);

    query.$and.push({ date: { $lte: endDate } });
  }

  if (!query.$and.length) {
    query = {};
  }

  const cart = await dbCart
    .find(query, { _id: 0, "products._id": 0 })
    .sort(sort)
    .limit(limit);

  res.json({
    success: true,
    cart,
  });
};

const getUserCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await dbCart.find({ userId }, { _id: 0, "products._id": 0 });

  if (!cart.length) {
    return res.json({
      success: true,
      message: "No Cart Found.",
    });
  }

  res.json({
    success: true,
    cart,
  });
};

const getSingleCart = async (req, res) => {
  const { cartId } = req.params;
  const cart = await dbCart.find({ cartId }, { _id: 0, "products._id": 0 });

  if (!cart.length) {
    return res.json({
      success: true,
      message: "No Cart Found.",
    });
  }

  res.json({
    success: true,
    cart,
  });
};

const updateCart = async (req, res) => {
  const { cartId } = req.params;
  const { userId, products } = req.body;
  const date = new Date();

  const updatedCart = await dbCart.findOneAndUpdate(
    { cartId },
    { userId, products, date }
  );

  if (updatedCart) {
    res.json({
      success: true,
      message: "Cart updated.",
    });
  } else {
    res.json({
      success: false,
      message: "Cart Not found.",
    });
  }
};

const deleteCart = async (req, res) => {
  const { cartId } = req.params;

  const deleteCart = await dbCart.deleteOne({ cartId });

  if (deleteCart.deletedCount) {
    res.json({
      success: true,
      message: "Cart Deleted.",
    });
  } else {
    res.json({
      success: false,
      message: "Cart Not found.",
    });
  }
};

module.exports = {
  addCart,
  getAllCart,
  getUserCart,
  getSingleCart,
  cartSchema,
  updateCart,
  deleteCart,
};
