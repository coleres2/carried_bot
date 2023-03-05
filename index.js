import fetch from 'node-fetch';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

const prefix = '!tracker';

async function getValorantStats(username, id, platform) {

  
  const headers =  {
      'content-type' : 'application/json', 
      'Cache-Control': 'public',
      'Accept': 'application/json',
      'cf-cache-staus': 'MISS', //
      "TRN-Api-Key": process.env.TRACKER_API_KEY// Replace with your API key
    }

  const url = "https://api.tracker.gg/api/v2/valorant/standard/profile/riot/" + username + '%23' + id; 
  console.log(url);
  const response = await fetch(url, {headers})
  const data =  response.json();
  // Extract the desired stats from the response data
  const stats = data.data.segments[0].stats;
  const kills = stats.kills.value;
  const deaths = stats.deaths.value;
  const assists = stats.assists.value;

  //const kdratio = stats.kdRatio.value;

  if(data.data.platformInfo.platformUserId === "c7d21993-3cdc-48a6-ac64-cbee2d8ff085") {
    return 'The best player in the world';
  }
  return `Kills: ${kills}\nDeaths: ${deaths}\nAssists: ${assists}\n`;
}
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  //const args = message.content.slice(prefix.length).trim().split(/ +/);
  //console.log(args);
  var str = message.content.split(' ');
  const fullName = str.slice(1).join(' ');
  console.log(fullName);
  //var name = args[0];
  
//   if(args.length > 1) {
//     name += '_' + args[1];
//   }
  //const url = args[0];
  //const [username, id] = name.split("#");
  const newStr = fullName.replace(/ /g, "_");
  const [username, id] = newStr.split("#");
  console.log(username);
  console.log(id);
  const platform = 'riot'; // Default platform is Riot Games

  try {
    const stats = await getValorantStats(username, id, platform);
    message.reply(stats);
  } catch (error) {
    console.error(error);
    message.reply('Error retrieving stats. Please check your URL and try again.');
  }
});

client.login(process.env.DISCORD_TOKEN);
