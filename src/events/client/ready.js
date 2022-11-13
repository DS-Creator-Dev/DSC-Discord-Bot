const { ActivityType } = require("discord.js")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setActivity(`DS Creator`, { type: ActivityType.Playing })

    client.user.setStatus('online')

    console.log(`${client.user.tag} is online!`)
  }
}