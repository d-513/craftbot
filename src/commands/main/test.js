const { Command, CommandoMessage } = require("discord.js-commando");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "main",
      memberName: "test",
      description: "Does the bot work?",
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  run(message) {
    return message.say("> 🟢 Online");
  }
};
