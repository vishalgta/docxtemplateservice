/**
 * Created by amado on 1/5/17.
 */

var fs  =   require('fs');
var express = require('express');
var multer = require('multer');
var docxtemps = require('docxtemplater');
var JSZip   =   require('jszip');

var templater   =   new docxtemps();
var upload = multer({ dest: 'uploads/' });
var app = express();

app.get('/', home);

app.post('/', upload.fields([{ name: 'file', maxCount: 1}]), function (req, res){
    //console.log(req);

    if(!req.files['file'] || !req.body['jsondata']){
        res.redirect('/');
        return;
    }

    var docx_fileinfo   =   req.files['file'][0];
    var json    =   JSON.parse(req.body['jsondata'].trim());

    console.log(docx_fileinfo, json );
    // @todo check stuff..

    fs.readFile(docx_fileinfo.path, 'binary', function(err, buffer){
        var buff = onUploadGenerateBuffer(buffer.toString(), json);
        res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.write(buff, 'binary');
        res.end();
    });
});

app.listen(3000, function (){
    console.log("listeining on 3000 " + `${process.cwd()}`);
});

function onUploadGenerateBuffer(content, docData)
{
    var zip = new JSZip(content);
    var doc = templater.loadZip(zip);

    doc.setData(docData);
    doc.render();

    return doc.getZip()
        .generate({type: "nodebuffer"});
}

function home(req, res){
    res.sendFile(process.cwd() + '/www/index.html');
}