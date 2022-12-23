var msg = "DS Creator (DSC) is a game engine created by Kenyon Bowers and NotImplementedLife. It gives **ANYONE** the ability to create video games for the Nintendo DS! Currently it is not available to the public due to the fact that it is still in development.\nMore info about DS Creator can be found here: https://ds-creator-dev.github.io/ds-creator-docs/";

const Discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Tells you a little about DS Creator."),
  async execute(interaction, client) {
    Embed = new EmbedBuilder()
      .setColor(`#FFFFFF`)
      .setTitle('About DS Creator:')
      .setThumbnail('https://cdn.discordapp.com/avatars/958179164660310090/57b7326c44c34fabf7e3e31c83cf9f55.webp?size=128')
      .setDescription(`${msg}`)
    return interaction.reply({ embeds: [Embed] })
  }
}