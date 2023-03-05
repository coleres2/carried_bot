import fetch from 'node-fetch';
import { Client, GatewayIntentBits, EmbedBuilder, Events } from 'discord.js';
import dotenv from 'dotenv';
import { config } from 'dotenv';

// Load the environment variables from the .env file
config();


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '!tracker';

async function getValorantStats(username, id, platform) {

  //uncomment all this if tracker adds val to api (could also get from riot directly but need approval)
  // const headers =  {
  //     'content-type' : 'application/json', 
  //     'Cache-Control': 'public',
  //     'Accept': 'application/json',
  //     'cf-cache-staus': 'MISS', //
  //     "TRN-Api-Key": process.env.TRACKER_API_KEY// Replace with your API key
  //   }

  // const url = "https://api.tracker.gg/api/v2/valorant/standard/profile/riot/" + username + '%23' + id; 
  // console.log(url);
  // const response = await fetch(url, {headers})
  // const data =  await response.json();

  // Extract the desired stats from the response data
  // let stats = data.data.segments[0].stats;
  // let kills = stats.kills.value;
  // let deaths = stats.deaths.value;
  // let assists = stats.assists.value;
  // let adr = stats.damagePerRound.value;
  // let firstbloods = stats.firstBloodsPerMatch.value;
  // let oneschoked = stats.clutches1v1 - clutchesLost1v1;

  //comment out these eight lines if previous content gets working
  let carriedCounter = 0;
  let kills = 363;
  let deaths = 300;
  let kdratio = kills/deaths;
  let assists = 36;
  let kadratio = (kills + assists)/deaths
  let adr = 102;
  let firstbloods = 3;
  let oneschoked = -5;

  if(adr < 110) {
    adr += ' :skull::skull::skull:';
    carriedCounter++
  }
  if(firstbloods < 2) {
    firstbloods += " u better be a smokes main";
    carriedCounter++;
  }
  if(oneschoked < 0) {
    oneschoked += " no clutch gene lol";
    carriedCounter++;
  }
  switch(carriedCounter) {
    case 0:
      carriedCounter += "\nYou are not carried";
      break;
    case 1: 
      carriedCounter += "\nYou are carried";
      break;
    case 2:
      carriedCounter += "\nYou are extremely carried";
      break;
    case 3:
      carriedCounter += "\nYou are the most carried person I have ever seen. Some would call you boosted";
      break;
  }


  // if(data.data.platformInfo.platformUserId === "c7d21993-3cdc-48a6-ac64-cbee2d8ff085") {
  //   return 'The best player in the world';
  // }
  return `**Kills:** ${kills}\n**Deaths:** ${deaths}\n**Assists:** ${assists}\n**KD:** ${kdratio}\n**KAD:** ${kadratio}\n**ADR:** ${adr}\n**FB:** ${firstbloods}\n**1v1 Chokes:** ${oneschoked}\n**Carried?** Level ${carriedCounter}`;
}
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  var str = message.content.split(' ');
  const fullName = str.slice(1).join(' ');
  console.log(fullName);

  const newStr = fullName.replace(/ /g, "_");
  const [username, id] = newStr.split("#");
  console.log(username);
  console.log(id);
  const platform = 'riot'; // Default platform is Riot Games
  
  try {
    const stats = await getValorantStats(username, id, platform);
    const url = 'https://tracker.gg/valorant/profile/riot/' + username + '%23' + id + '/overview';
    const title = fullName + '#' + id + ' Tracker';
    //const description = 
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setURL(url)
        .setDescription(stats);
    //message.reply(stats);
    message.reply({ content: 'Pong!', ephemeral: true, embeds: [embed]})
  } catch (error) {
    console.error(error);
    message.reply('Error retrieving stats. Please check your URL and try again.');
  }
});

client.login(process.env.DISCORD_TOKEN);
