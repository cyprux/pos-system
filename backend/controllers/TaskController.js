NODE_OPTIONS = '--require "./models/TaskModel.js"';
const TaskModel = require("../models/TaskModel");

module.exports.getTask = async (req, res) => {
  const task = await TaskModel.find();
  res.send(task);
};

module.exports.saveTask = (req, res) => {
  const { task } = req.body;

  TaskModel.create({ task })
    .then((data) => {
      console.log("Saved Sucessfully...");
      res.status(201).send(data);
    })
    .catch((err) => {
      console.log();
      res.send({ error: err, msg: "Something went wrong!" });
    });
};

module.exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  TaskModel.findByIdAndUpdate(id, { task })
    .then(() => res.send("Updated Successfully!"))
    .catch((err) => {
      console.log();
      res.send({ error: err, msg: "Something went wrong!" });
    });
};

module.exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  TaskModel.findByIdAndDelete(id)
    .then(() => res.send("Deleted Successfully!"))
    .catch((err) => {
      console.log();
      res.send({ error: err, msg: "Something went wrong!" });
    });
};
