const validation = (schema) => async (req, res, next) => {
  try {
    const { body } = req;
    await schema.validate(body);
    return next();
  } catch (error) {
    return res.json({
      success: false,
      error: error.errors,
    });
  }
};

module.exports = validation;
