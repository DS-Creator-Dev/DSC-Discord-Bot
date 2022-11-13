const Discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const { SlashCommandBuilder } = require("discord.js");

function HexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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
  let color = interaction.options.getString("hex")

  try {
    if (color.charAt(0) == "#") {
      var SplitSplit = color.split("#")
      color = SplitSplit[1];
    }
    if (color.match(/^(([0-9a-fA-F]){6}|([0-9a-fA-F]){4})$/i)) {
      var red = HexToRgb(`#${color}`).r.toString();
      var green = HexToRgb(`#${color}`).g.toString();
      var blue = HexToRgb(`#${color}`).b.toString();

      var R = red / 8;
      var G = green / 8;
      var B = blue / 8;

      if(!Number.isInteger(R)){
        R = Math.round(R);
      }
      if(!Number.isInteger(G)){
        G = Math.round(G);
      }
      if(!Number.isInteger(B)){
        B = Math.round(B);
      }

      var HEX = `${color}`;
      var BGR15 = to_rgb24(parseInt(HEX, 16));


      Embed = new EmbedBuilder()
        .setColor(`#${HEX}`)
        .setTitle('Color Converter:')
        .addFields(
          { name: 'HEX:', value: "#" + HEX.toUpperCase(), inline: true },
          { name: 'BGR15', value: "0x" + BGR15.toUpperCase(), inline: true },
          { name: 'RGB-255', value: `R: ${red} | G: ${green} | B: ${blue}`, inline: true },
          { name: 'RGB-31', value: `R: ${R} | G: ${G} | B: ${B}`, inline: true },
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
    .setName("color_hex")
    .setDescription("Converts a HEX color.")
    .addStringOption((option) =>
      option
        .setName('hex')
        .setDescription('The HEX value you want to convert.')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    runstuff(client, interaction);
  }
}