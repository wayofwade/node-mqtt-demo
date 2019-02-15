/**
 * @Description:前后端用protobuf交互
 * @params:
 * @return:
 * Created by chencc on 2019/2/12.
 */

let fs = require("fs");
let express = require('express');
let bodyParser = require('body-parser');
let BufferHelper = require('bufferhelper');
let protobufjs = require('protobufjs')
let awesome = require('./proto/test_pb.js')
let protobuf = require('protocol-buffers')
let app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.get('/proto/get', function (req, res) {
  let datas = createProto()
  console.log(datas)
  res.send(JSON.stringify(datas)); // 需要进行json化然后给前端。不然的话浏览器会自动解析成文字的
})



app.post('/proto/send', function (req, res) {
  console.log('前端传过来的数据')
  let bufferHelper = new BufferHelper();
  req.on("data", function (chunk) {
    bufferHelper.concat(chunk);
  });
  req.on('end', function () {
    let buffer = bufferHelper.toBuffer();
    let message3 = awesome.Test.deserializeBinary(buffer)
    console.log(message3.getNum())
    let pm = awesome.Test.deserializeBinary(buffer)
    let protoBuf = pm.toObject()
    console.log(protoBuf)
  });
})

let server = app.listen(8081, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})


function createProto () {
  let messages = protobuf(fs.readFileSync('./proto/test.proto'))
  let buf = messages.Test.encode({
    num: 42,
    payload: 'hello world node js and javahhh呵呵呵',
    payloads: ''
  })
  console.log(buf) // should print a buffer
  return buf
}

