/**
 * @Description:
 * @params:
 * @return:
 * Created by chencc on 2019/2/1.
 */


/*
* mqtt服务的连接需要说明来源是浏览器还是客户端
* 使用客户端访问mqtt服务时使用options配置
* 使用浏览器访问mqtt服务时使用settings配置
* */
const mosca = require('mosca')

const ascoltatore = {
  //using ascoltatore
};
const settings = { // mqtt-client.html访问时的配置文件
  http: {
    port: 8081,
    bundle: true,
    static: './'
  },
  backend: ascoltatore
};
const options = { // mqttClient.js访问时的配置文件
  port: 8081
}
const MqttServer = new mosca.Server(options) // 当使用mqttClient.js访问此服务
// const MqttServer = new mosca.Server(settings) // 当使用mqtt-client.html访问此服务

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
