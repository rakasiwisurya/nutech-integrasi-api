const { product, user } = require("../../models");
const Joi = require("joi");
const cloudinary = require("../../third-party/cloudinary");
const { Op } = require("sequelize");

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
    const productData = await product.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (productData) {
      return res.status(400).send({
        status: "Failed",
        message: "Product already exist",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "nutech_itegrasi_files",
      use_filename: true,
      unique_filename: false,
    });

    const newProduct = await product.create({
      ...req.body,
      userId: req.user.id,
      image: result.public_id,
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

exports.searchProduct = async (req, res) => {
  const { name } = req.query;

  try {
    let data = await product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      order: [["createdAt", "ASC"]],
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

    data = JSON.parse(JSON.stringify(data));

    const newData = data.map((item) => ({
      ...item,
      image: cloudinary.url(item.image),
    }));

    res.send({
      status: "Success",
      data: newData,
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
    let data = await product.findAll({
      order: [["createdAt", "ASC"]],
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

    data = JSON.parse(JSON.stringify(data));

    const newData = data.map((item) => ({
      ...item,
      image: cloudinary.url(item.image),
    }));

    res.send({
      status: "Success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await product.findOne({
      where: {
        id,
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

    data = JSON.parse(JSON.stringify(data));

    const newData = {
      ...data,
      imageUrl: cloudinary.url(data.image),
    };

    res.send({
      status: "Success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "nutech_itegrasi_files",
        use_filename: true,
        unique_filename: false,
      });

      body = { ...req.body, image: result.public_id };
    } else {
      body = req.body;
    }

    if (req.file) {
      const getData = await product.findOne({
        where: {
          id,
        },
      });

      await cloudinary.uploader.destroy(
        getData.image,
        function (result, error) {
          console.log(result, error);
        }
      );
    }

    await product.update(body, {
      where: {
        id,
      },
    });

    const data = await product.findOne({
      where: {
        id,
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
      message: "Data successfully updated",
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

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await product.findOne({
      where: {
        id,
      },
    });

    await cloudinary.uploader.destroy(data.image, function (result, error) {
      console.log(result, error);
    });

    await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: "Data successfully deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
