/**
 * Created by rick on 6/13/14.
 */

var segment = require('nodejieba');
segment.loadDict("./public/dict/my.dict.utf8",
                 "./node_modules/nodejieba/dict/hmm_model.utf8");
console.log(
    segment.cut("上交所，58同城和3I集团因为npm速度很慢000001而且经常因为墙的原因万科出现莫名其妙的问题,在此强烈建议使用cnpm，命令如下")
);