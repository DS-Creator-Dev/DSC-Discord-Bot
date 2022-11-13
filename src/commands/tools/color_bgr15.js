const Discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const { SlashCommandBuilder } = require("discord.js");

var RGB31 = "";

function RGBToHex(r, g, b) {
  r = parseInt(r).toString(16);
  g = parseInt(g).toString(16);
  b = parseInt(b).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return r + g + b;
}

function bgr15_to_rgb(code, num) {
  var cl15 = Math.floor(code);
  var R = Math.floor(cl15 % 32);
  cl15 /= 32;
  var G = Math.floor(cl15 % 32);
  cl15 /= 32;
  var B = Math.floor(cl15 % 32);

  var Red = R;
  var Green = G;
  var Blue = B;

  if(!Number.isInteger(Red)){
    Red = Math.round(Red);
  }
  if(!Number.isInteger(Green)){
    Green = Math.round(Green);
  }
  if(!Number.isInteger(Blue)){
    Blue = Math.round(Blue);
  }

  RGB31 = `R: ${Red} | G: ${Green} | B: ${Blue}`

  R *= 8
  G *= 8
  B *= 8
  if (num == 0) {
    return R;
  }
  else if (num == 1) {
    return G;
  }
  else if (num == 2) {
    return B;
  }
}

async function runstuff(client, interaction) {
  let color = interaction.options.getString("bgr15")

  try {
    if (color.length == 6) {
      var red = bgr15_to_rgb(color, 0);
      var green = bgr15_to_rgb(color, 1);
      var blue = bgr15_to_rgb(color, 2);

      var RGB = red + green + blue;
      var HEX = RGBToHex(red, green, blue);
      var BGR15 = color;

      var NoFirstPart = BGR15.split("0x");

      Embed = new EmbedBuilder()
        .setColor(`#${HEX}`)
        .setTitle('Color Converter:')
        .addFields(
          { name: 'HEX:', value: "#" + HEX.toUpperCase(), inline: true },
          { name: 'BGR15', value: "0x" + NoFirstPart[1].toUpperCase(), inline: true },
          { name: 'RGB-255', value: `R: ${red} | G: ${green} | B: ${blue}`, inline: true },
          { name: 'RGB-31', value: RGB31, inline: true },
        )

      return interaction.reply({ embeds: [Embed] })
    }
    else {
      return interaction.reply(`Failed to convert color.`)
    }
  }
  catch (err) {
    if (err) {
      //console.error(err)
      return interaction.reply(`Failed to convert color.`)
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color_bgr15")
    .setDescription("Converts a BGR15 color.")
    .addStringOption((option) =>
      option
        .setName('bgr15')
        .setDescription('The BGR15 value you want to convert.')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    runstuff(client, interaction);
  }
}