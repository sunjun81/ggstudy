/**
 * Created by sunjun on 14-5-28.
 */
var fs = require('fs')
    , path = require('path');

var baseurl = "http://home.wind.com.cn:8000/"
    , hostname = "home.wind.com.cn:8000"
    , domain = "windnet"
    , username = "jsun.rick"
    , password = "Sj1669785"
    , ntlmauth = null


//    , ntlmrequest = require('request').defaults({
//        agentClass: require('agentkeepalive').HttpsAgent
//    });

var httpNtlm = require('httpntlm');
var ntlm = httpNtlm.ntlm;
//var Agent = require('agentkeepalive');
//var keepaliveAgent = new Agent();


var downloadDir = './downloads'
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

var auth = '';

function getDeptTree(){
    var treeUrl = "AddressList/AddressTree.aspx";

    httpNtlm.get({
        url: baseurl + treeUrl,
        username: username,
        password: password,
        workstation: "",
        domain: domain
    }, function (err, res){
        if(err) return err;
        var content = findContent(res.body,'BuildInfoTable(',')//]]',0);
        var bulist  = eval(content);
        console.log('bulist downloaded.')
        for(var i = 0;i < bulist.length;i++){
            var bu = bulist[i];
            if (bu[0] === "") continue;
            downloadBU(bu);
        }
    });
}

function requestPage(){
    var url = baseurl + "AddressTree.aspx";
    ntlmrequest(url, {
        headers: {
            'Authorization': ntlm.challengeHeader(hostname, domain)
        }
    }, function(err, res) {
        ntlmrequest(url, {
            headers: {
                'Authorization': ntlm.responseHeader(res, url, domain, username, password),
            }
        }, function (err, res, body) {
            console.log(body);
            var content = findContent(body,"BuildInfoTable(",")//]]",0);
            var bulist  = eval(content);

            for(var i = 0;i < bulist.length;i++){
                var bu = bulist[i];
                if (bu[0] === "") continue;
                downloadBU(bu);
            }
        });
    });
}


var request = require('request');

//function downloadBU2(bu){
//    var buDir = downloadDir + "/" + bu[0];
//    if (!fs.existsSync(buDir)) {
//        fs.mkdirSync(buDir);
//    }
//    var membersUrl = baseurl + "AddressList/AddressList.aspx?UnitID=0&DeptID="+bu[1];
//
//    var options = {
//        url : membersUrl,
//        headers: {
//            Authorization :
//        }
//    };
//}

function downloadBU(bu) {

    var buDir = downloadDir + "/" + bu[0];
    if (!fs.existsSync(buDir)) {
        fs.mkdirSync(buDir);
    }
    var membersUrl = baseurl + "AddressList/AddressList.aspx?UnitID=0&DeptID="+bu[1];

    var options = {
        url: membersUrl,
        username: username,
        password: password,
        workstation: "",
        domain: domain,
        headers:{
            'Authorization' : ''
        }
        //agent: keepaliveAgent
    }

    request.get(membersUrl, {
        headers:{
            'Authorization' : ntlm.createType1Message(options)
        }
    } , function(err, res) {
        var type2msg = ntlm.parseType2Message(res.headers['www-authenticate']);
        var type3msg = ntlm.createType3Message(type2msg, options);
        options.headers.Authorization = type3msg;
        options.headers.Connection =  'Close';
        options.allowRedirects = false;
        request.get(membersUrl,{
            headers:{
                'Authorization' :  type3msg
            }
        },function (err, res, body) {
            //console.log(body);
            var content = findContent(body,"var historyBuilder_arrContent =  new ",")//]]",0);
            var members = eval(content);
            for(var i = 0;i<members.length;i++){
                var member = members[i];
                downloadMember(member);
            }
        });
    });

//    httpNtlm.get({
//        url: membersUrl,
//        username: username,
//        password: password,
//        workstation: "",
//        domain: domain,
//    }, function (err, res){
//        if(err) return err;
//        var content = findContent(res.body,'var historyBuilder_arrContent =  new ',')//]]',0);
//        var members = eval(content);
//        for(var i = 0;i<members.length;i++){
//            var member = members[i];
//            downloadMember(member);
//        }
//    });

    function downloadMember(member) {
//        var url = baseurl + "UserInfo/UserImageShow.aspx?userid="+member[0]+"&flag=1";
//        var photoFile = path.join(downloadDir, bu[0], member[9] + '.jpg');
//        ntlmrequest(url, {
//            headers: {
//                'Authorization': ntlm.challengeHeader(hostname, domain)
//            }
//        }, function(err, res) {
//            ntlmrequest(url, {
//                headers: {
//                    'Authorization': ntlm.responseHeader(res, url, domain, username, password)
//                }
//            }, function (err, res, body) {
//                //console.log(body);
//                res.setEncoding('binary');//二进制（binary）
//                var imageData ='';
//                res.on('data',function(data){//图片加载到内存变量
//                    imageData += data;})
//                   .on('end',function(){//加载完毕保存图片
//                    fs.writeFile(photoFile, imageData, 'binary', function (err) {//以二进制格式保
//                        if (err) throw err;
//                        console.log(member[9] + ' saved');
//                    });
//                });
//
//            });
//        });
    }
}

function findContent(html, key, endTag, offset) {
    var start = html.indexOf(key);
    var end = html.indexOf(endTag, start);
    return html.substring(start + key.length, end + offset);
}

function main(){
    getDeptTree();
}

main();