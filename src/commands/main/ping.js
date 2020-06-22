const { Command, CommandoMessage } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const api = require("../../api");
const imgur = require("imgur");
imgur.setClientId(process.env.IMGUR_CLIENT);
const { ErrorEmbed, LoadingEmbed } = require("../../embed");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      group: "main",
      memberName: "ping",
      description: "Pings a minecraft server",
      args: [
        {
          key: "host",
          type: "string",
          prompt: "What is the IP of the server you want to ping?",
        },
      ],
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message, { host }) {
    const msg = await message.say(new LoadingEmbed());
    try {
      const data = await api.ping(host);
      const embed = new MessageEmbed();
      let icon;
      if (data.icon) {
        const upload = await imgur.uploadBase64(data.icon.split(",")[1]);
        icon = upload.data.link;
      } else {
        icon = "https://i.imgur.com/EWoWcAB.png";
      }
      embed.setAuthor(host, icon);
      embed.setThumbnail(icon);
      embed.addField(
        "Online players",
        `${data.players.online}/${data.players.max}`
      );
      embed.addField("MOTD", data.motd.clean);
      embed.addField("Version", data.version);
      embed.addField("Direct IP", `${data.ip}:${data.port}`);
      embed.setColor("GREEN");
      msg.edit("", embed);
    } catch (err) {
      msg.edit("", new ErrorEmbed(err));
    }
  }
};
