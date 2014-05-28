/**
 * Created by sunjun on 14-5-28.
 */
var fs = require('fs')
    , path = require('path');

var baseurl = "http://home.wind.com.cn:8000/"
    , domain = "windnet"
    , username = "jsun.rick"
    , password = "xxx"

var ntlm = require('ntlm')
    , ntlmrequest = require('request').defaults({
        agentClass: require('agentkeepalive').HttpsAgent
    });


var downloadDir = './downloads'
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

var buTreeUrl = baseurl + "AddressTree.aspx";

var content = requestPage(buTreeUrl,"BuildInfoTable(",")//]]",0);
var bulist  = eval(content);

for(var i = 0;i < bulist.length;i++){
    var bu = bulist[i];
    if (bu[0] === "") continue;
    downloadBU(bu);
}


function requestPage(url,start,end){
    ntlmrequest(url, {
        headers: {
            'Authorization': ntlm.challengeHeader(baseurl, domain)
        }
    }, function(err, res) {
        ntlmrequest(buTreeUrl, {
            headers: {
                'Authorization': ntlm.responseHeader(res, url, domain, username, password)
            }
        }, function (err, res, body) {
            console.log(body);
            var content = findContent(body,start,end,0);
            return content;
        });
    });
}

function downloadBU(bu) {

    var buDir = downloadDir + "/" + bu[0];
    if (!fs.existsSync(buDir)) {
        fs.mkdirSync(buDir);
    }
    var membersUrl = baseurl + "AddressList.aspx?UnitID=0&DeptID="+bu[1];
    var content = requestPage(membersUrl,"var historyBuilder_arrContent =  new ","//]]>",0);
    var members = eval(content);

    function downloadMember(member) {
        var url = baseurl + "UserInfo/UserImageShow.aspx?userid="+member[0]+"&flag=1";
        var photoFile = path.join(downloadDir, bu[0], member[9] + '.jpg');
        ntlmrequest(url, {
            headers: {
                'Authorization': ntlm.challengeHeader(baseurl, domain)
            }
        }, function(err, res) {
            ntlmrequest(buTreeUrl, {
                headers: {
                    'Authorization': ntlm.responseHeader(res, url, domain, username, password)
                }
            }, function (err, res, body) {
                //console.log(body);
                res.setEncoding('binary');//二进制（binary）
                var imageData ='';
                res.on('data',function(data){//图片加载到内存变量
                    imageData += data;})
                   .on('end',function(){//加载完毕保存图片
                    fs.writeFile(photoFile, imageData, 'binary', function (err) {//以二进制格式保
                        if (err) throw err;
                        console.log(member[9] + ' saved');
                    });
                });

            });
        });
    }

    for(var i = 0;i<members.length;i++){
        var member = members[i];
        downloadMember(member);
    }
}





function findContent(html, key, endTag, offset) {
    var start = html.indexOf(key);
    var end = html.indexOf(endTag, start);
    return html.substring(start + key.length, end + offset);
}