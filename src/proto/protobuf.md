### protobuf介绍
#### 由于网上关于protobuf的交互的资料比较零散，所以自己整理了一下关于protobuf前后端交互的资料，以作参考。
Google Protocol Buffers 简称 Protobuf，它提供了一种灵活、高效、自动序列化结构数据的机制，可以联想 XML，但是比 XML 更小、更快、更简单。仅需要自定义一次你所需的数据格式，然后用户就可以使用 Protobuf 编译器自动生成各种语言的源码，方便的读写用户自定义的格式化的数据。与语言无关，与平台无关，还可以在不破坏原数据格式的基础上，依据老的数据格式，更新现有的数据格式。
### 前后端交互方式
前后端都是以二进制形式进行交互信息。前后端定义proto后缀的文件，以此文件来当文档来进行沟通。
### protobuf文件形式
以下为protobuf文件的demo，test.proto，文件的结构确实简单明了。

```
enum FOO {
  BAR = 1;
}

message Test {
  required float num  = 1;
  required string payload = 2;
  optional string payloads = 3;
}

message AnotherOne {
  repeated FOO list = 1;
}
```
### 前后端进行protobuf的环境安装
后端以node为例子：
安装bufferhelper以及protocol-buffers进行解析protobuf文件
```
npm install bufferhelper
npm install protocol-buffers
```

前端需要安装解析protobuf的环境。
mac使用brew安装protobuf环境。此操作需要先安装Homebrew环境。具体的Homebrew的安装自行搜索。
windows的前端环境安装有点不一样，自行搜索。

```
brew install protobuf
```

测试前端proto环境是不是安装好了，如果有版本就是安装好了。

```
protoc --version
```
在进行前后端交互之前，前端需要进行编译proto文件。
test.proto为前端以及后端相同的proto文件。先编译为js文件再执行。首先进入node项目的proto的目录下面，执行下面的命令之后会生成test_pb.js文件。最后js只需要解析这个文件即可。前端也需要执行这样的操作，因为我这边是前后端分离的。是两个项目，所以两个项目都需要编译。
```
protoc --js_out=import_style=commonjs,binary:. test.proto
```

### 后端给前端传数据

后端赋值proto文件的内容并传给前端。
后端传protobuf二进制给前端，要先转化为json才可以给前端。不然的话前端会转化成乱码的。前端需要请求此路由。
```
app.get('/proto/get', function (req, res) {
  let protobuf = require('protocol-buffers')
  let messages=protobuf(fs.readFileSync('./proto/test.proto')
  let buf = messages.Test.encode({
    num: 42,
    payload: 'hello world node js and javahhh呵呵呵',
    payloads: ''
  })
  console.log(buf) // 打印出来的是二进制流
  res.send(JSON.stringify(buf)); //需要进行json化然后给前端。不然的话浏览器会自动解析成文字的
})
```

前端需要进行接受二进制流
先引入proto.js文件以及protobufjs插件

```
  import awesome from '../../proto/test_pb.js'
```
前端用axios请求/proto/get的路由，在回调函数里的res.data为后端的返回值。进行以下操作。打印出来的message3也是解析好的文件。
```
 axios({
      method:'get',
      url: '/proto/get',
      headers: { 'contentType':'application/x-protobuf'} }).then(res => {
      let message3 = awesome.Test.deserializeBinary(res.data.data)
      let nums = message3.getNum()
      console.log(nums) // nums=42。解析出来就是后端传过来的42
      let pm = awesome.Test.deserializeBinary(res.data.data)
      let protoBuf = pm.toObject()
      console.log('protoBuf: ', protoBuf) // 打印出来是一个对象
    }).catch((error) => {
      console.log(error)
    })

```

### 前端给后端传数据
前端需要进行proto文件的赋值以及转换为二进制给后端
引入需要依赖的文件。

```
  import awesome from '../../proto/test_pb.js'
  import protobuf from 'protobufjs'
```


```
     let message = new awesome.Test() // 调用Person对象  实例化
    // 赋值
    message.setNum(23)
    message.setPayload('asd')
    // 序列化
    let bytes = message.serializeBinary() //  字节流
    let blob = new Blob([bytes], {type: 'buffer'});
    axios({
      method:'post',
      url: '/proto/send',
      data: blob,
      headers: {
        'Content-Type': 'application/octet-stream' // 这里根据后台要求进行设置的，如果没有要求应该是 application/octet-stream （二进制流）
      }
    }).then(res => {
      console.log(res)
    }).catch((error) => {
      console.log(error)
    })
```
后端需要接受文件
引入文件
```
let BufferHelper = require('bufferhelper');
```
接收字节流的代码

```
app.post('/proto/send', function (req, res) {
  let bufferHelper = new BufferHelper();
  req.on("data", function (chunk) {
    bufferHelper.concat(chunk);
  });
  req.on('end', function () {
    let protobuf = require('protocol-buffers')
    let buffer = bufferHelper.toBuffer();
    console.log(buffer) // 这里已经就是二进制文件了
    let message3 = awesome.Test.deserializeBinary(buffer)
    console.log(message3.getNum()) // 打印的就是前端传的23
    let pm = awesome.Test.deserializeBinary(buffer)
    let protoBuf = pm.toObject()
    console.log(protoBuf) // 打印的是{ num: 23, payload: 'asd', payloads: 'asds' }
    console.log(protoBuf.num) // 打印23
  });
})
```
以上就是关于protobuf的前后交互。如有错误，请指出。




