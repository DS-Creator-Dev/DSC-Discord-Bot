const fs = require("fs");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: `Something went wrong while executing command.`
        });
      }
    }
    else if (interaction.isAutocomplete()) {
      if (interaction.commandName === 'img') {
        const focusedValue = interaction.options.getFocused();
        const choices = fs.readdirSync("./imgs")
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
          filtered.map(choice => ({ name: choice, value: choice })),
        );
      }
      else if (interaction.commandName === 'resource') {
        const focusedValue = interaction.options.getFocused();
        const choices = ["all", "home", "about", "documentation", "tutorials", "archives", "community"]
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
          filtered.map(choice => ({ name: choice, value: choice })),
        );
      }
    }
  }
}