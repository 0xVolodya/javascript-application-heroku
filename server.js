/**
 * Created by vladimir on 02.12.15.
 */
var http=require("http"),
    fs=require("fs"),
    url=require("url");

var port=9090;
var pathPublic="public";

/*Обслуживание базового файла*/
function handleLayout(res){
    fs.readFile(pathPublic+"templates/index.html", function (err, fileData) {
        if(err){
            throw err;
        }
        res.writeHead
    })

}