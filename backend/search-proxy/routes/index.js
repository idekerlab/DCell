var express = require("express");
var router = express.Router();

const MSG = {
  service: "Gene Search API",
  status: "OK"
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json(MSG);
});

module.exports = router;
