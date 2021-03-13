/** @format */

const config = require("./config.json")

class Sends {
  constructor(mod) {
    this.Guild = function (msg) {
      mod.send("C_CHAT", 1, {
        channel: config.guild,
        name: "TIP",
        message: msg,
      })
    }
    this.guildBLUE = function (msg) {
      mod.send("C_CHAT", 1, {
        channel: 2,
        message: '<FONT color="#42f4f4"><ChatLinkAction param="1#####0@0@name">' + msg + "</ChatLinkAction>",
      })
    }

    this.Global = function (msg) {
      mod.send("C_CHAT", 1, {
        channel: config.Glob,
        name: "TIP",
        message: msg,
      })
    }
    this.GlobalBLUE = function (msg) {
      mod.send("C_CHAT", 1, {
        channel: config.Glob,
        name: "TIP",
        message: '<FONT color="#42f4f4"><ChatLinkAction param="1#####0@0@name">' + msg + "</ChatLinkAction>",
      })
    }
  }
}
module.exports = Sends
