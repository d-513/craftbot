require("dotenv").config();
const { CommandoClient } = require("discord.js-commando");
const path = require("path");

const client = new CommandoClient({
  commandPrefix: "mc!",
  owner: "521038099749404672",
});

client.registry
  .registerDefaultTypes()
  .registerGroups([["main", "Main commands of CraftBot"]])
  .registerDefaultGroups()
  .registerDefaultCommands({ ping: false })
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", async () => {
  console.log(`SHARD: Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity(client.shard.ids.length + " shards");
});

client.on("error", console.error);
client.login(process.env.TOKEN);
