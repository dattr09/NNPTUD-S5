var express = require("express");
const product = require("../schemas/product");
const { name } = require("ejs");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(objs);
});

module.exports = router;
