const express = require("express");

const router = express.Router();

const{

    addExpense,

    importExpenses,

    exportExpenses,

    getExpenses,

} = require("../controllers/expenseController");


 

const {protect} = require("../middleware/authMiddleware");
router.get("/",protect,getExpenses);
router.post("/",protect,addExpense);
router.post("/import",protect,importExpenses);
router.get("/export",protect,exportExpenses);
module.exports = router;