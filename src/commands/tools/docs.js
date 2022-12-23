const Discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const { SlashCommandBuilder } = require("discord.js");

const links = ["https://ds-creator-dev.github.io", "https://ds-creator-dev.github.io/ds-creator-docs/docs.html", "https://libnds.devkitpro.org", "https://libnds.devkitpro.org/video_8h.html", "https://libnds.devkitpro.org/background_8h.html", "https://libnds.devkitpro.org/videoGL_8h.html", "https://libnds.devkitpro.org/video_8h.html", "https://libnds.devkitpro.org/trig__lut_8h.html", "https://libnds.devkitpro.org/timers_8h.html", "https://libnds.devkitpro.org/system_8h.html", "https://libnds.devkitpro.org/sprite_8h.html", "https://libnds.devkitpro.org/sound_8h.html", "https://libnds.devkitpro.org/sassert_8h.html", "https://libnds.devkitpro.org/rumble_8h.html", "https://libnds.devkitpro.org/postest_8h.html", "https://libnds.devkitpro.org/piano_8h.html", "https://libnds.devkitpro.org/pcx_8h.html", "https://libnds.devkitpro.org/ndstypes_8h.html", "https://libnds.devkitpro.org/ndsmotion_8h.html", "https://libnds.devkitpro.org/modules.html", "https://libnds.devkitpro.org/memory_8h.html", "https://libnds.devkitpro.org/memory_8h.html", "https://libnds.devkitpro.org/math_8h.html", "https://libnds.devkitpro.org/linkedlist_8h.html", "https://libnds.devkitpro.org/keyboard_8h.html", "https://libnds.devkitpro.org/interrupts_8h.html", "https://libnds.devkitpro.org/index.html", "https://libnds.devkitpro.org/image_8h.html", "https://libnds.devkitpro.org/gl2d_8h.html", "https://libnds.devkitpro.org/files.html", "https://libnds.devkitpro.org/fifocommon_8h.html", "https://libnds.devkitpro.org/examples.html", "https://libnds.devkitpro.org/dynamicArray_8h.html", "https://libnds.devkitpro.org/dma_8h.html", "https://libnds.devkitpro.org/decompress_8h.html", "https://libnds.devkitpro.org/debug_8h.html", "https://libnds.devkitpro.org/console_8h.html", "https://libnds.devkitpro.org/console_8h.html", "https://libnds.devkitpro.org/cache_8h.html", "https://libnds.devkitpro.org/boxtest_8h.html", "https://libnds.devkitpro.org/bios_8h.html", "https://libnds.devkitpro.org/background_8h.html", "https://libnds.devkitpro.org/arm9_2input_8h.html", "https://libnds.devkitpro.org/annotated.html", "https://www.problemkaputt.de/gbatek.htm", "https://www.problemkaputt.de/gbatek.htm#dstechnicaldata", "https://www.problemkaputt.de/gbatek.htm#dsiomaps", "https://www.problemkaputt.de/gbatek.htm#dsmemorymaps", "https://www.problemkaputt.de/gbatek.htm#dsmemorycontrol", "https://www.problemkaputt.de/gbatek.htm#dsvideo", "https://www.problemkaputt.de/gbatek.htm#ds3dvideo", "https://www.problemkaputt.de/gbatek.htm#dssound", "https://www.problemkaputt.de/gbatek.htm#dssystemandbuiltinperipherals", "https://www.problemkaputt.de/gbatek.htm#dscartridgesencryptionfirmware", "https://www.problemkaputt.de/gbatek.htm#dsxboo", "https://www.problemkaputt.de/gbatek.htm#dswirelesscommunications", "https://www.problemkaputt.de/gbatek.htm#biosfunctions", "https://www.problemkaputt.de/gbatek.htm#armcpureference", "https://www.problemkaputt.de/gbatek.htm#externalconnectors", "https://www.problemkaputt.de/gbatek.htm#dsiiomap", "https://www.problemkaputt.de/gbatek.htm#dsicontrolregistersscfg", "https://www.problemkaputt.de/gbatek.htm#dsixpertteakdsp", "https://www.problemkaputt.de/gbatek.htm#dsinewsharedwramforarm7arm9dsp", "https://www.problemkaputt.de/gbatek.htm#dsinewdmandma", "https://www.problemkaputt.de/gbatek.htm#dsimicrophoneandsoundext", "https://www.problemkaputt.de/gbatek.htm#dsiadvancedencryptionstandardaes", "https://www.problemkaputt.de/gbatek.htm#dsicartridgeheader", "https://www.problemkaputt.de/gbatek.htm#dsitouchscreensoundcontroller", "https://www.problemkaputt.de/gbatek.htm#dsii2cbus", "https://www.problemkaputt.de/gbatek.htm#dsicameras", "https://www.problemkaputt.de/gbatek.htm#dsisdmmcprotocolandioports", "https://www.problemkaputt.de/gbatek.htm#dsisdmmcfilesystem", "https://www.problemkaputt.de/gbatek.htm#dsiatheroswifisdiointerface", "https://www.problemkaputt.de/gbatek.htm#dsiatheroswifiinternalhardware", "https://www.problemkaputt.de/gbatek.htm#dsigpioregisters", "https://www.problemkaputt.de/gbatek.htm#dsiconsoleids", "https://www.problemkaputt.de/gbatek.htm#dsiunknownregisters", "https://www.problemkaputt.de/gbatek.htm#dsinotes", "https://www.problemkaputt.de/gbatek.htm#dsiexploits", "https://www.problemkaputt.de/gbatek.htm#dsiregions", "https://digitaldesigndude.github.io/DSGM-Resource-Site/"];
var keywordLinks = [];
var msg = "";

var DSCLinks = "https://ds-creator-dev.github.io\nhttps://ds-creator-dev.github.io/ds-creator-docs/docs.html";
var DSGMLinks = "https://digitaldesigndude.github.io/DSGM-Resource-Site";

async function runstuff(client, interaction) {
  let keyword = interaction.options.getString("keyword")
  keywordLinks = [];
  msg = "";

  try {
    if (keyword.toLowerCase() == "ds creator" || keyword.toLowerCase() == "ds game maker") {
      if (keyword.toLowerCase() == "ds creator") {
        Embed = new EmbedBuilder()
          .setColor(`#FFFFFF`)
          .setTitle(`Found 2 Pages!`)
          .setDescription(`**${keyword}:**\n${DSCLinks}`)
        return interaction.reply({ embeds: [Embed] })
      }
      else {
        Embed = new EmbedBuilder()
          .setColor(`#FFFFFF`)
          .setTitle(`Found 1 Page!`)
          .setDescription(`**${keyword}:**\n${DSGMLinks}`)
        return interaction.reply({ embeds: [Embed] })
      }
    }
    else {
      for (i = 0; i < links.length; i++) {
        if (links[i].toLowerCase().includes(keyword.toLowerCase())) {
          keywordLinks.push(links[i]);
        }
      }
      for (i = 0; i < keywordLinks.length; i++) {
        if (i == 0) {
          msg = keywordLinks[i];
        }
        else {
          msg = `${msg}\n${keywordLinks[i]}`;
        }
      }
      if (keywordLinks.length == 1) {
        Embed = new EmbedBuilder()
          .setColor(`#FFFFFF`)
          .setTitle(`Found 1 Page!`)
          .setDescription(`**${keyword}:**\n${msg}`)
        return interaction.reply({ embeds: [Embed] })
      }
      else {
        Embed = new EmbedBuilder()
          .setColor(`#FFFFFF`)
          .setTitle(`Found ${keywordLinks.length} Pages!`)
          .setDescription(`**${keyword}:**\n${msg}`)
        return interaction.reply({ embeds: [Embed] })
      }
    }
  }
  catch (err) {
    if (err) {
      return interaction.reply(`Failed to search.`)
    }
  }
}

module.exports = {
  name: "docs",
  description: "Links to all NDS documentation pages with a keyword in the link.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "keyword",
      description: "the keyword",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  perms: "",
  run: async (client, interaction) => {
    runstuff(client, interaction);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("docs")
    .setDescription("Links to all NDS documentation pages with a keyword in the link.")
    .addStringOption((option) =>
      option
        .setName('keyword')
        .setDescription('The keyword.')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    runstuff(client, interaction);
  }
}