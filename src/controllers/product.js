const { product, user } = require("../../models");
const Joi = require("joi");

exports.addProduct = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    buy_price: Joi.number().required(),
    sell_price: Joi.number().required(),
    stock: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const newProduct = await product.create({
      ...req.body,
      userId: req.user.id,
      image: req.file.filename,
    });

    const data = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    res.send({
      status: "Success",
      message: "Data successfully added",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const data = await product.findAll({
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "role"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    res.send({
      status: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
