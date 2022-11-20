const Discord = require("discord.js");
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');

const { SlashCommandBuilder } = require("discord.js");
var Jimp = require('jimp');
const fs = require("fs");

var R = [];
var G = [];
var B = [];


/// "Zips" R,G,B channels into a single RGB array:
/// [R0, R1, ...] [G0, G1, ...] [B0, B1, ...] --> [ [R0,G0,B0], [R1,G1,B1], ... ]
function combine(R, G, B) {
  const len = R.length;
  var list = []
  for (var i = 0; i < len; i++) {
    list.push([R[i], G[i], B[i]]);
  }
  return list;
}

/// removes duplicates from an RGB list
function uniq(colors_list) {
  return colors_list.map((c) => JSON.stringify(c))
    .filter((v, i, a) => a.indexOf(v) == i)
    .map((c) => JSON.parse(c));
}

/// removes a color from the RGB list (in the below code, the transparent color)
function remove(colors_list, trsp) {
  trsp = JSON.stringify(trsp)
  return colors_list.map((c) => JSON.stringify(c))
    .filter((v, i, a) => v != trsp)
    .map((c) => JSON.parse(c));
}

/// Converts RGB to 4-bit indexed palette, keeping the transparent color at index 0
/// Returns a palette (array of [R,G,B]s) and a buffer of color indices
function reduce_colors(R, G, B, transp_color) {
  var colors = combine(R, G, B)
  colors = remove(colors, transp_color)
  colors = uniq(colors)

  //console.log(colors)	

  const minR = Math.min(...R)
  const minG = Math.min(...G)
  const minB = Math.min(...B)

  const maxR = Math.max(...R)
  const maxG = Math.max(...G)
  const maxB = Math.max(...B)

  const lenR = Math.floor((maxR - minR) / 8 + 1);
  const lenG = Math.floor((maxG - minG) / 8 + 1);
  const lenB = Math.floor((maxB - minB) / 8 + 1);

  var blocks = new Array(8);
  for (var i = 0; i < 8; i++) {
    blocks[i] = new Array(8);
    for (var j = 0; j < 8; j++) {
      blocks[i][j] = new Array(8);
      for (var k = 0; k < 8; k++) {
        blocks[i][j][k] = { "items": [], "visited": false }
      }
    }
  }

  for (var i = 0; i < colors.length; i++) {
    var r = colors[i][0] - minR;
    var g = colors[i][1] - minG;
    var b = colors[i][2] - minB;

    if (r != 0) r = Math.floor(r / lenR);
    if (g != 0) g = Math.floor(g / lenG);
    if (b != 0) b = Math.floor(b / lenB);

    blocks[r][g][b].items.push(i);
  }

  var groups = []

  const dr = [-1, 0, 0, 1, 0, 0]
  const dg = [0, -1, 0, 0, 1, 0]
  const db = [0, 0, -1, 0, 0, 1]

  function lee(r, g, b) {
    var st = [[r, g, b]];
    var gr = { "blocks": [], "weight": 0 }

    while (st.length > 0) {
      var p = st.shift();
      var r = p[0];
      var g = p[1];
      var b = p[2];

      blocks[r][g][b].visited = true;
      gr.blocks.push([r, g, b])
      gr.weight += blocks[r][g][b].items.length
      for (var i = 0; i < 6; i++) {
        var nr = r + dr[i];
        var ng = g + dg[i];
        var nb = b + db[i];
        if (nr < 0 || ng < 0 || nb < 0 || nr > 7 || ng > 7 || nb > 7)
          continue;
        if (blocks[nr][ng][nb].items.length == 0)
          continue;
        if (blocks[nr][ng][nb].visited)
          continue;
        st.push([nr, ng, nb]);
      }
    }
    gr.blocks = JSON.stringify(gr.blocks)
    return gr;
  }

  for (var r = 0; r < 8; r++) {
    for (var g = 0; g < 8; g++) {
      for (var b = 0; b < 8; b++) {
        if (blocks[r][g][b].items.length == 0)
          continue;
        if (!blocks[r][g][b].visited) {
          groups.push(lee(r, g, b));
        }
      }
    }
  }

  function gsort() {
    groups.sort(function(g1, g2) {
      if (g2.blocks.length == g1.blocks.length)
        return g2.weight - g1.weight;
      return g2.blocks.length - g1.blocks.length;
    });
  }

  gsort();


  function slice(g0) {
    if (g0.blocks.length == 1) {
      return [g0, { "blocks": [], "weight": 0 }]
    }

    var g1 = { "blocks": [], "weight": 0 }
    var g2 = { "blocks": [], "weight": 0 }

    var tmp = JSON.parse(g0.blocks)
    //console.log(tmp)		

    while (2 * g1.weight < g0.weight) {
      var b = tmp.shift();
      //console.log(b);
      g1.blocks.push(b);
      g1.weight += blocks[b[0]][b[1]][b[2]].items.length;
    }

    while (tmp.length > 0) {
      var b = tmp.shift();
      g2.blocks.push(b);
      g2.weight += blocks[b[0]][b[1]][b[2]].items.length;
    }
    g1.blocks = JSON.stringify(g1.blocks)
    g2.blocks = JSON.stringify(g2.blocks)

    return [g1, g2]
  }

  function merge(g1, g2) {
    return {
      "blocks": JSON.stringify(JSON.parse(g1.blocks).concat(JSON.parse(g2.blocks))),
      "weight": g1.weight + g2.weight
    }
  }

  while (groups.length < 15) {
    groups.push(...slice(groups.shift()))
    gsort();
  }

  while (groups.length > 15) {
    groups.push(merge(groups.pop(), groups.pop()))
    gsort();
  }

  var gr_colors = new Array(15);
  for (var i = 0; i < 15; i++) {
    gr_colors[i] = { "items": [], "value": [0, 0, 0] };
  }
  red = {};
  red[JSON.stringify(transp_color)] = 0

  for (var i = 0; i < groups.length; i++) {
    groups[i].blocks = JSON.parse(groups[i].blocks)

    for (var j = 0; j < groups[i].blocks.length; j++) {
      var r = groups[i].blocks[j][0];
      var g = groups[i].blocks[j][1];
      var b = groups[i].blocks[j][2];
      gr_colors[i].items.push(...blocks[r][g][b].items);
      for (var k = 0; k < blocks[r][g][b].items.length; k++) {
        var id = blocks[r][g][b].items[k];
        red[JSON.stringify(colors[id])] = i + 1
        gr_colors[i].value[0] += colors[id][0]
        gr_colors[i].value[1] += colors[id][1]
        gr_colors[i].value[2] += colors[id][2]
      }
    }
    if (gr_colors[i].items.length > 0) {
      gr_colors[i].value = gr_colors[i].value.map(x => Math.floor(x / gr_colors[i].items.length))
    }
  }
  //console.log(gr_colors)
  //console.log(red)

  var palette = gr_colors.map(x => x.value)

  var buffer = [];

  for (var i = 0; i < R.length; i += 2) {
    var cl1 = JSON.stringify([R[i], G[i], B[i]]);
    var cl2 = JSON.stringify([R[i + 1], G[i + 1], B[i + 1]]);
    buffer.push(red[cl1] * 16 + red[cl2])
  }

  return { "palette": [transp_color].concat(palette), "buffer": buffer }
}

/// Builds bitmap from the result of the previous function
function to_bitmap(palette, buffer) {
  var header = "\x42\x4D\x76\x02\x00\x00\x00\x00\x00\x00\x76\x00\x00\x00\x28\x00\x00\x00\x20\x00\x00\x00\x20\x00\x00\x00\x01\x00\x04\x00\x00\x00\x00\x00\x00\x02\x00\x00\x23\x2E\x00\x00\x23\x2E\x00\x00\x10\x00\x00\x00\x10\x00\x00\x00";

  var enc = new TextEncoder();
  var buff = enc.encode(header);

  //https://stackoverflow.com/questions/33702838/how-to-append-bytes-multi-bytes-and-buffer-to-arraybuffer-in-javascript
  function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }

  function concatBuffers(a, b) {
    return concatTypedArrays(
      new Uint8Array(a.buffer || a),
      new Uint8Array(b.buffer || b)
    ).buffer;
  }


  buff = concatBuffers(buff, Int32Array.from(palette))
  buff = concatBuffers(buff, Int8Array.from(buffer))
  return buff
}


/// Some testing 

/// dummy.raw was generated from dummy.png and contains 
/// headerless image data. For each pixel, dummy.raw contains 
/// 3 bytes (B,G,R values)

/// let's say this is the function the R,G,B arrays
function load_dummy_raw() {

  var fs = require('fs')
  bytes = fs.readFileSync("dummy.raw");

  var R = [];
  var G = [];
  var B = [];

  for (var i = 0; i < bytes.length; i += 3) {
    B.push(bytes[i]);
    G.push(bytes[i + 1]);
    R.push(bytes[i + 2]);
  }
  return { "R": R, "G": G, "B": B };
}

///////////////////////////////////////////////////////////////////////Stuff

async function runstuff(client, interaction) {
  let image = interaction.options.getAttachment("image")

  try {
    Jimp.read(image.url, (err, sourceImage) => {
      if (err) {
        Embed = new MessageEmbed()
          .setColor(`#ff0000`)
          .setTitle('Status: Failed!')
          .setDescription(`Failed to use image. This is likely due to the file uploaded not being an image. Please try an image instead.`)
        return interaction.reply({ embeds: [Embed] })
      }

      if (sourceImage.bitmap.width == 32 && sourceImage.bitmap.height == 32) {
      }
      else {
        sourceImage = sourceImage.resize(32, 32);
      }

      var R = []
      var G = []
      var B = []
      for (var y = 31; y >= -1; y--) {
        for (var x = 0; x < 32; x++) {
          var pixel = sourceImage.getPixelColor(x, y); //0xFFFFFFFF
          pixel = Jimp.intToRGBA(pixel) // {r: 255, g: 255, b: 255, a:255} 
          R.push(pixel.r)
          G.push(pixel.g)
          B.push(pixel.b)
        }
      }

      // process the image
      var reduced = reduce_colors(R, G, B, [255, 250, 0])

      // Resulted palette is in a JSON format [ [Ri,Gi,Bi], ... ]
      // Convert it to an array of color codes [ 0x00RRGGBB ]
      reduced.palette = reduced.palette.map(x => x[0] * 256 * 256 + x[1] * 256 + x[2])

      // obtain the bitmap file contents
      output = to_bitmap(reduced.palette, reduced.buffer)

      let bmp = new AttachmentBuilder(Buffer.from(output), { name: 'icon.bmp' });
      bmp.name = "icon.bmp";

      Embed = new EmbedBuilder()
        .setColor(`#FFFFFF`)
        .setTitle('How to use in libnds project')
        .setDescription("Download \"icon.bmp\". Next, open the file explorer for your OS. Go to your downloads folder.\nThen, copy/cut and paste \"icon.bmp\" into your projects directory. Then, open your \"Makefile\" and make sure that \"ICON\" is set to nothing.\nThen open CMD or Terminal and run `make clean` then `make`. Then enjoy your game's new icon!")
      return interaction.reply({ embeds: [Embed], files: [bmp] })
    });
  }
  catch (err) {
    if (err) {
      return interaction.reply(`Failed to convert image.`)
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("convert_icon")
    .setDescription("Converts an image to a NDS icon.")
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('32x32px image.')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    runstuff(client, interaction);
  }
}
