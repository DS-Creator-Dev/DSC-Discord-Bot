const { ActivityType } = require("discord.js")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setActivity(`DS Creator be built...`, { type: ActivityType.Watching })

    client.user.setStatus('online')

    console.log(`${client.user.tag} is online!`)

    setInterval(function() {
      client.user.setActivity(`DS Creator be built...`, { type: ActivityType.Watching })
    }, 43200000)
  }
}