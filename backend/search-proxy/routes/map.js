var express = require("express");
var router = express.Router();

var elasticsearch = require("elasticsearch");
const bodyParser = require('body-parser');

var client = new elasticsearch.Client({
  host: "http://elasticsearch:9200",
});



router.post("/", function (req, res, next) {


  console.log(req.body)

  client.mget(
    {
      index: 'terms',
      type: 'go_term',
      _source: ['name', 'namespace'],
      body: {
        ids: req.body
      }
    }
  ).then(json => {
    console.log('MGET::::::::::', json);
    res.json(json);
  })

});

module.exports = router;
