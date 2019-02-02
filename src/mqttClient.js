/**
 * @Description:
 * @params:
 * @return:
 * Created by chencc on 2019/2/1.
 */

let mqtt = require('mqtt')
let options = {
  username: '9212164',
  password: '123456'
}
let num = 5 // 发送5此后断开连接
let timer
let client = mqtt.connect('mqtt://127.0.0.1:8081', options)

client.on('connect', function (res) {
  console.log(res)
  client.subscribe('presence', function (err) {
    if (!err) {
      timer = setInterval(() => {
        client.publish('presence', '此消息从客户端发往服务端' + new Date())
      }, 5000)
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('client to server ====》》》' + message.toString())
  num --
  if (num === 0) {
    clearInterval(timer)
    client.end()
  }
})
