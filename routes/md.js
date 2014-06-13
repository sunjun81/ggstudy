/**
 * Created by rick on 6/9/14.
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    path = ['./md/',
            req.params.title,
            '.md'
            ].join('');
    console.log(path);
    res.render(path, {'layout':false,
                      'pretty':true});
});

module.exports = router;