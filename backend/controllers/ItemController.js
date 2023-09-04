NODE_OPTIONS = '--require "./models/ItemModel.js"';
const ItemModel = require("../models/ItemModel");

module.exports.getItem = async (req, res) => {
  const item = await ItemModel.find();
  res.send(item);
};

module.exports.updateQuantity = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  ItemModel.findByIdAndUpdate(id, { quantity })
    .then(() => res.send("Updated Successfully!"))
    .catch((err) => {
      res.send({ error: err, msg: "Something went wrong!" });
    });
};
