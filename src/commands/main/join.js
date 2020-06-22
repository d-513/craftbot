/* eslint-disable-next-line */
const { Command, CommandoMessage } = require("discord.js-commando");
const mineflayer = require('mineflayer')
const api = require('../../api')
const chat = require('minecraft-chat-packet')
const { TextEmbed, LoadingEmbed, ErrorEmbed } = require('../../embed')

const removeFromArray = (array, item) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === item) {
      array.splice(i, 1)
    }
  }
}

module.exports = class JoinCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'join',
      group: 'main',
      memberName: 'join',
      description: 'Join a minecraft server',
      args: [
        {
          key: 'ip',
          type: 'string',
          prompt: "Please provide the server's address."
        },
        {
          key: 'version',
          type: 'string',
          prompt: "Please provide the server's version."
        }
      ]
    })
    this.channels = []
  }

  /**
   * @param {CommandoMessage} message
   */
  async run (message, { ip, version }) {
    const channel = message.channel.id
    if (this.channels.includes(channel)) {
      return message.say(
        new ErrorEmbed('This channel already has an active bot session')
      )
    }
    this.channels.push(channel)
    const msg = await message.say(new LoadingEmbed())
    const deleteMsg = () => {
      if (!msg.deleted) msg.delete()
    }
    let sessionactive = true
    const errorOut = (err) => {
      sessionactive = false
      deleteMsg()
      removeFromArray(this.channels, channel)
      message.say(new ErrorEmbed(err))
    }
    try {
      await api.ping(ip)
      const host = ip.split(':')[0]
      const port = ip.split(':')[1]
      const bot = mineflayer.createBot({
        username: process.env.MCEMAIL,
        password: process.env.MCPASS,
        host,
        port,
        version
      })
      this.client.on('message', (m) => {
        if (m.channel.id === channel && sessionactive) {
          if (m.content === 'bot!quit') {
            bot.quit()
            errorOut('Disconnected from the server')
            return
          }
          bot.chat(m.content)
        }
      })
      bot.on('kicked', (reason) => {
        reason = JSON.parse(reason)
        errorOut(
          `Kicked from the server for: \`\`\`${
            chat.removeColors(chat.parse(reason)) || 'Unknown'
          }\`\`\` \n\nDebug info: \`\`\`js\n${JSON.stringify(reason)}\n\`\`\``
        )
      })

      bot.once('login', () => msg.edit(new TextEmbed('Bot has logged in')))
      bot.once('spawn', () => msg.edit(new TextEmbed('Bot has spawned')))
      bot._client.on('chat', (packet) => {
        packet = chat.removeColors(chat.parse(JSON.parse(packet.message)))
        const embed = new TextEmbed(packet)
        embed.setColor('YELLOW')
        message.say(embed)
      })
    } catch (err) {
      errorOut(err)
    }
  }
}
