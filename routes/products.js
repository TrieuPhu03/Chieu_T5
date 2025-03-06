var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj) {
  console.log(obj);
  let result = {};
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }
  result.price = {};
  if (obj.price) {
    if (obj.price.$gte) {
      result.price.$gte = obj.price.$gte;
    } else {
      result.price.$gte = 0
    }
    if (obj.price.$lte) {
      result.price.$lte = obj.price.$lte;
    } else {
      result.price.$lte = 10000;
    }

  }
  return result;
}

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let products = await productModel.find(buildQuery(req.query));

  res.status(200).send({
    success: true,
    data: products
  });
});
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "khong co id phu hop"
    });
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      quantity: Number(req.body.quantity),
      imgURL: req.body.imgURL,
      category: req.body.category
    })
    await newProduct.save();
    res.status(200).send({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

//update post
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updateData = req.body;

    let updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật"
      });
    }

    res.status(200).send({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;