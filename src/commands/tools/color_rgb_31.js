const Discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const { SlashCommandBuilder } = require("discord.js");

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

function to_rgb24(code) {
  var R = code % 256;
  code = Math.floor(code / 256);
  var G = code % 256;
  code = Math.floor(code / 256);
  var B = code % 256;
  R = Math.floor(R / 8);
  G = Math.floor(G / 8);
  B = Math.floor(B / 8);

  var color = B + 32 * G + 1024 * R;
  var final = color.toString(16);
  return final.toString().padStart(4, '0');
}

async function runstuff(client, interaction) {
  let red = interaction.options.getString("red")
  let green = interaction.options.getString("green")
  let blue = interaction.options.getString("blue")

  try {
    if (parseInt(red) > -1 && parseInt(red) < 32 && parseInt(green) > -1 && parseInt(green) < 32 && parseInt(blue) > -1 && parseInt(blue) < 32) {

      if (red == "00" || red == "000") {
        red = "0"
      }
      if (green == "00" || green == "000") {
        green = "0"
      }
      if (blue == "00" || blue == "000") {
        blue = "0"
      }

      var R = red * 8;
      var G = green * 8;
      var B = blue * 8;

      if(!Number.isInteger(R)){
        R = Math.round(R);
      }
      if(!Number.isInteger(G)){
        G = Math.round(G);
      }
      if(!Number.isInteger(B)){
        B = Math.round(B);
      }

      var RGB = `R: ${R} | G: ${G} | B: ${B}`;


      var HEX = RGBToHex(R, G, B);
      var BGR15 = to_rgb24(parseInt(HEX, 16));

      Embed = new EmbedBuilder()
        .setColor(`#${HEX}`)
        .setTitle('Color Converter:')
        .addFields(
          { name: 'HEX:', value: "#" + HEX.toUpperCase(), inline: true },
          { name: 'BGR15', value: "0x" + BGR15.toUpperCase(), inline: true },
          { name: 'RGB-255', value: `${RGB}`, inline: true },
          { name: 'RGB-31', value: `R: ${red} | G: ${green} | B: ${blue}`, inline: true },
        )

      return interaction.reply({ embeds: [Embed] })
    }
    else {
      return interaction.reply(`Failed to convert color.`)
    }

  }
  catch (err) {
    if (err) {
      console.log(err)
      return interaction.reply(`Failed to convert color.`)
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color_rgb_31")
    .setDescription("Converts a RGB-31 color.")
    .addStringOption((option) =>
      option
        .setName('red')
        .setDescription('Red, 0-31.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('green')
        .setDescription('Green, 0-31.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('blue')
        .setDescription('Blue, 0-31.')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    runstuff(client, interaction);
  }
}