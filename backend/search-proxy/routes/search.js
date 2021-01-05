var express = require("express");
var router = express.Router();

var elasticsearch = require("elasticsearch");
const bodyParser = require('body-parser');

var client = new elasticsearch.Client({
  host: "http://deep-cell.ucsd.edu:9200",
});

const DEF_OPTIONS = {
  index: "genes",
  type: "gene",
};



/* GET users listing. */
router.post("/", function (req, res, next) {
  let opt = DEF_OPTIONS

  client.search({
    index: opt.index,
    type: opt.type,
    size: 50,
    body: {
      query: {
        match: {
          _all: req.body.query
        }
      }
    }
  }).then(json => {
    console.log(json);
    res.json(json);
  })

});

module.exports = router;
