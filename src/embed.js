const Discord = require('discord.js')
const img = 'https://i.imgur.com/5EzbNbl.png'

module.exports.ErrorEmbed = class ErrorEmbed extends Discord.MessageEmbed {
  constructor (err) {
    super()
    this.setAuthor('🔴 Error', img)
    this.setDescription(err)
    this.setFooter('craftbot', img)
    this.setColor('RED')
    this.setTimestamp()
  }
}

module.exports.LoadingEmbed = class LoadingEmbed extends Discord.MessageEmbed {
  constructor () {
    super()
    this.setColor('BLUE')
    this.setAuthor('Loading', 'https://i.imgur.com/7HfV99d.gif')
    this.setDescription('Loading...')
    this.setFooter('Please wait')
  }
}

module.exports.TextEmbed = class TextEmbed extends Discord.MessageEmbed {
  constructor (msg) {
    super()
    this.setColor('GREEN')
    this.setDescription(msg)
  }
}
