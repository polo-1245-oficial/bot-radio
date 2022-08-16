const { TOKEN, CHANNEL, STATUS, LIVE } = require("./config.json");
const discord = require("discord.js");
const client = new discord.Client();
const ytdl = require('ytdl-core');
let broadcast = null;
let interval = null;

client.on('ready', async () => {
  client.user.setActivity(STATUS || "Radio");
  let channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)

  if (!channel) {
    console.error("ERROR canal invalido");
    return process.exit(1);
  } else if (channel.type !== "voice") {
    console.error("ERROR canal invalido");
    return process.exit(1);
  }


  broadcast = client.voice.createBroadcast();
  stream = await ytdl(LIVE);
  stream.on('error', console.error);
  broadcast.play(stream);
  if (!interval) {
    interval = setInterval(async function() {
      try {
       stream = await ytdl(LIVE, { highWaterMark: 100 << 150 });
       stream.on('error', console.error);
       broadcast.play(stream);
      } catch (e) { return }
    }, 1800000)
  }
  try {
    const connection = await channel.join();
    connection.play(broadcast);
  } catch (error) {
    console.error(error);
  }
});

setInterval(async function() {
  if(!client.voice.connections.size) {
    let channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL);
    if(!channel) return;
    try { 
      const connection = await channel.join();
      connection.play(broadcast);
    } catch (error) {
      console.error(error);
    }
  }
}, 20000);


client.login(TOKEN) 
console.log("listo conectao que isi")
process.on('unhandledRejection', console.error);
