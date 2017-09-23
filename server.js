var express = require('express');
var bodyParser = require('body-parser');
// var setdata = require('./db');
var app = express();


var urlencodedParser = bodyParser.urlencoded({ extended: false })



app.use(express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

// app.use(express.static(path.join(__dirname, 'public')));

var formidable = require('formidable'),
    fs = require('fs'),
    TITLE = 'formidable上传示例',
    AVATAR_UPLOAD_FOLDER = '/images/',
    domain = "http://localhost:8081";

app.post('/uploader', function(req, res) {

    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.render('index', { title: TITLE });
            return;
        }
        console.log(files);

        var extName = '';  //后缀名
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index', { title: TITLE });
            return;
        }

        var avatarName = files.fulAvatar.name;
        console.log(Math.random())
        console.log(avatarName)
        //图片写入地址；
        var newPath = form.uploadDir + avatarName;
        //显示地址；
        var showUrl = domain + AVATAR_UPLOAD_FOLDER + avatarName;
        console.log("newPath",newPath);
        fs.renameSync(files.fulAvatar.path, newPath);  //重命名
        res.json({
            "newPath":showUrl
        });
    });
});

app.post('/updataImg', function (req, res) {

    var form = new multiparty.Form({uploadDir: './public/images'});
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files);

        if(err){
            console.log('parse error: ' + err);
        } else {
            testJson = eval("(" + filesTmp+ ")");
            console.log(testJson.fileField[0].path);
            res.json({imgSrc:testJson.fileField[0].path})
            console.log('rename ok');
        }
    });


})


app.post('/process_post',urlencodedParser, function (req, res) {

    // 输出 JSON 格式
    var response = {
        "id":req.body.id2,
        "name":req.body.username,
        "age":req.body.age
    };
    console.log(response);

    res.status(200).send(response);



    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/test';

    var insertData = function(db, callback) {
        //连接到表 site
        var collection = db.collection('users');
        //插入数据
        var data = response;
        collection.insert(data, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        insertData(db, function(result) {
            console.log(result);
            db.close();
        });
    });

    setdata.setUser(response)

})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})