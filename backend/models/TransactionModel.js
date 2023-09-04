const mongoose = require("mongoose");
const ItemModel = require("../models/ItemModel");

const transactionSchema = new mongoose.Schema({
  items: [ItemModel.schema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
