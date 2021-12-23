const { user } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    let userData = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt, updatedAt"],
      },
    });

    if (!userData) {
      return res.status(400).send({
        status: "Failed",
        message: "Email or Password is incorrect",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, userData.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Email or Password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
      },
      process.env.TOKEN_KEY
    );

    userData = JSON.parse(JSON.stringify(userData));

    const newUserData = {
      id: userData.id,
      email: userData.email,
      fullname: userData.fullname,
      gender: userData.gender,
      address: userData.address,
      role: userData.role,
      token,
    };

    res.send({
      status: "Success",
      message: "Login successful",
      data: newUserData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const { id } = req.user;

    let userData = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!userData) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    userData = JSON.parse(JSON.stringify(userData));

    const newUserData = {
      id: userData.id,
      fullname: userData.fullname,
      email: userData.email,
      gender: userData.gender,
      address: userData.address,
      role: userData.role,
    };

    res.send({
      status: "Success",
      data: {
        user: newUserData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
