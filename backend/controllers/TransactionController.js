NODE_OPTIONS = '--require "./models/TransactionModel.js"';
const TransactionModel = require("../models/TransactionModel");

//Get all the transaction.
module.exports.getTransaction = async (req, res) => {
  const transaction = await TransactionModel.find();
  res.send(transaction);
};

//Store the transaction.
module.exports.saveTransaction = (req, res) => {
  const { items } = req.body;

  TransactionModel.create({ items })
    .then((data) => {
      console.log("Saved Sucessfully...");
      res.status(201).send(data);
    })
    .catch((err) => {
      console.log();
      res.send({ error: err, msg: "Something went wrong!" });
    });
};

// module.exports.updateQuantity = (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   TransactionModel.findByIdAndUpdate(id, { quantity })
//     .then(() => res.send("Updated Successfully!"))
//     .catch((err) => {
//       res.send({ error: err, msg: "Something went wrong!" });
//     });
// };

//Delete transaction.
module.exports.deleteTransaction = (req, res) => {
  const { id } = req.params;

  TransactionModel.findByIdAndDelete(id)
    .then(() => res.send("Deleted Successfully!"))
    .catch((err) => {
      console.log();
      res.send({ error: err, msg: "Something went wrong!" });
    });
};
