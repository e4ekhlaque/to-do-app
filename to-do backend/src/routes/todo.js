const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  handleGetAll,
  handleAddOne,
  handleUpdateOne,
  handleDeleteOne,
} = require("../controllers/todo");

router.get("/", auth, handleGetAll);
router.post("/", auth, handleAddOne);
router.put("/:id", auth, handleUpdateOne);
router.delete("/:id", auth, handleDeleteOne);

module.exports = router;
