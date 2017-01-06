/**
 * @author Amado Martinez <amado@projectivemotion.com
 * @license MIT
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
app.use(express.static('www'));

app.post('/', upload.fields([{ name: 'docxfile', maxCount: 1}, { name: 'jsondata', maxCount: 1}]), function (req, res){
    //console.log(req);

    var json    =   null;
    if(req.body['jsondata'])
    {
       json =  JSON.parse(req.body['jsondata'].trim());
    }else if(req.files['jsondata']){
        json = JSON.parse(fs.readFileSync(req.files['jsondata'][0].path));   // @todo async
    }else{
        // error..
    }

    if(!req.files['docxfile'] || !json){
        res.redirect('/');
        return;
    }

    var docx_fileinfo   =   req.files['docxfile'][0];

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
    console.log("listeining on port 3000 uploads directory is: " + `${process.cwd()}/uploads`);
    console.log('Open http://localhost:3000/ ');
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