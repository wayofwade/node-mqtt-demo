/**
 * @Description:
 * @params:
 * @return:
 * Created by chencc on 2019/2/1.
 */


const mosca = require('mosca')
const MqttServer = new mosca.Server({
  port: 8081
})

MqttServer.on('clientConnected', function(client){
  console.log('client connected', client.id);
  console.log('客户端连接成功啦啦啦');
});

/**
 * 监听MQTT主题消息
 **/
MqttServer.on('published', function(packet, client) {
  const topic = packet.topic;
  console.log('message-arrived--->','topic ='+topic+',message = '+ packet.payload.toString());
});

// 开启服务之后
MqttServer.on('ready', function(){
  console.log('mqtt server is running...');
})

// 客户端断开连接后触发
MqttServer.on('clientDisconnected', function(client) {
  console.log('Client Disconnected:', client.id);
  MqttServer.close(() => { // 客户端断开之后就断开服务端
    console.log('关闭server-mqtt')
  })
});
