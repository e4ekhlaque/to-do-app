const Todo = require("../models/todo");

// GET all tasks of logged-in user
async function handleGetAll(req, res) {
  try {
    const { search = "", status = "all", sort = "newest" } = req.query;

    let query = {
      user: req.user.id,
    };

    // Search
    if (search.trim()) {
      query.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Status filter
    if (status === "completed") {
      query.completed = true;
    } else if (status === "pending") {
      query.completed = false;
    } else if (status === "overdue") {
      query.completed = false;
      query.dueDate = { $lt: new Date() };
    }

    let mongoQuery = Todo.find(query);

    // Sort
    if (sort === "dueDate") {
      mongoQuery = mongoQuery.sort({ dueDate: 1 });
    } else if (sort === "priority") {
      mongoQuery = mongoQuery.sort({
        priority: 1,
        _id: -1,
      });
    } else {
      mongoQuery = mongoQuery.sort({ _id: -1 });
    }

    const tasks = await mongoQuery;

    return res.status(200).json(tasks);
  } catch (error) {
    console.log("GET TASK ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}

// ADD task for logged-in user
async function handleAddOne(req, res) {
  try {
    const task = await Todo.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

// UPDATE only own task
async function handleUpdateOne(req, res) {
  try {
    const { id } = req.params;

    const updatedTask = await Todo.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(updatedTask);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

// DELETE only own task
async function handleDeleteOne(req, res) {
  try {
    const { id } = req.params;

    const deletedTask = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

// GET one own task
async function handleGetOne(req, res) {
  try {
    const { id } = req.params;

    const task = await Todo.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(task);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = {
  handleGetAll,
  handleGetOne,
  handleAddOne,
  handleUpdateOne,
  handleDeleteOne,
};
