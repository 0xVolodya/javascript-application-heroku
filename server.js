/**
 * Created by vladimir on 02.12.15.
 */
var http = require("http"),
    fs = require("fs"),
    url = require("url");
    EventEmmitter=require("events").EventEmitter;

var fileEmmiter=new EventEmmitter();
var port = process.env.PORT ||5000;
var pathPublic = "public";

/*Обслуживание базового файла*/
function handleLayout(res) {
    fs.readFile(pathPublic + "/templates/index.html", function (err, fileData) {
        if (err) {
            throw err;
        }


    res.write(fileData);
    res.end();
    });

}


function writerStatic(requirePath, res) {
    var extension = requirePath.slice(requirePath.lastIndexOf('.') + 1);

    switch (extension) {
        case 'html':
            res.setHeader("Content-Type", "text/html");
            break;
        case 'css':
            res.setHeader("Content-Type", "text/css");
            break;
        case 'js':
            res.setHeader("Content-Type", "text/javascript");
            break;
        default :
            res.setHeader("Content-Type", "text/plain");


    }
}

function serveStatic(requirePath, res) {
    var path = pathPublic + requirePath;
    /*Возникате ошибка в хроме, если не подключен favicon.ico*/
    if(requirePath==="/favicon.ico"){
        res.statusCode=404;
        res.end();
        return;
    }

    fs.readFile(path, function (err, fileData) {
        if (err) {
            throw err;
        }

        res.statusCode = 200;
        writerStatic(requirePath, res);
        res.write(fileData);
        res.end();
    });
}
fileEmmiter.on("mainLayoutExists",handleLayout);
fileEmmiter.on("statisFileExists",serveStatic);
fileEmmiter.on("fileError", function (reason) {
    console.log(reason);
});

/*Сам сервер*/
var server =http.createServer(function (req, res) {
    var requestPath=url.parse(req.url).pathname;

    if(req.method==="GET" && requestPath==="/"){
        fs.exists(pathPublic+"tempates/index.html", function (exist) {
            if(!exist){
                fileEmmiter.emit("fileError","файл отсутствует");
            }
            fileEmmiter.emit("mainLayoutExists",res);
        });
    }
    else{
        fs.exists(pathPublic+requestPath, function (exist) {
            if(!exist){
                fileEmmiter.emit("fileError","файл отсутствует")
            }
            fileEmmiter.emit("statisFileExists",requestPath,res);

        })
    }
});

server.listen(port, function () {
    console.log("Server listening to PORT:"+port);
});
