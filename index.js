/** @format */

String.prototype.stripHTML = function () {
  return this.replace(/<\/?FONT [^>]+>/gi, "")
}
String.prototype.stripbot = function () {
  return this.replace("bot", "")
} // delete the prefix in game
String.prototype.stripglo = function () {
  return this.replace("!", "")
}
const Discord = require("discord.js")
const bot = new Discord.Client({ autoReconnect: true, disableEveryone: true })
const config = require("./config.json")

module.exports = function DiscordChat(mod) {
  const Send = require("./send.js")
  const Say = new Send(mod)
  const command = mod.command || mod.require.command
  bot.once("ready", () => {
    var channel = bot.channels.cache.get(config.channel)
    //console.log(`${bot.user.tag} is online!`);
    //channel.send(` *** ${bot.user.tag} : is online ***`);
    console.log(`${bot.user.username} est connecté sur ${bot.guilds.cache.size} serveurs !`)
    let activNum = 0
    setInterval(function () {
      if (activNum === 0) {
        bot.user.setActivity("Bot Chat")
        activNum = 1
      } else if (activNum === 1) {
        bot.user.setActivity("!help pour obtenir les cmds ou pas")
        activNum = 0
      }
    }, 3 * 1000)
  })
  if (config.back) {
    bot.on("error", (e) => console.error(e))
    bot.on("warn", (e) => console.warn(e))
    //bot.on("debug", (e) => console.info(e));
  }

  bot.on("message", async (message) => {
    if (message.channel.id === config.channel) {
      //discordAuthor = message.member.nickname;
      message.guild.members.fetch(message.author).then((member) => {
        discordAuthor = member.nickname
      })

      if (message.content.match(`(Guild|@|!up|!stat|@@|i'm up|https://|http://|<@|<:|:)`)) {
        //await message.channel.send("Wrong message");
        if (config.back) {
          //console.log("Wrong message, not sent");
          return
        }
        return
      } else {
        await message.channel.messages
          .fetch({ limit: 5 })
          .then((messages) => {
            const lastMessage = messages.first()
            if (message.content.startsWith(prefix)) {
              Say.GlobalBLUE(`[${discordAuthor}]: ${lastMessage.content.stripglo()}`)
            } else {
              //Say.Guild("[" + discordAuthor + "]: " + lastMessage.content /*.stripHTML()*/);
              Say.guildBLUE(`[${discordAuthor}]: ${lastMessage.content}`)
            }
            if (config.back) {
              console.log(lastMessage.content.stripbot())
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }
  })

  //Cyan #42f4f4
  //Gold #ffcc00
  //Rouge ~ #f93ece
  mod.hook("C_CHAT", 1, async (event) => {
    let newmessage = event.message
      .replaceAll(/<ChatLinkAction[^>]*>&lt;([^<]*)&gt;<\/ChatLinkAction[^>]*>/g, " **$1 ** ")
      .replaceAll("@", "")
      .replaceAll(/<[^>]*>/g, "")
      .replaceAll(/&lt;/g, "<")
      .replaceAll(/&gt;/g, ">")
    if (event.name === myGameName) return
    if (event.channel === 2) {
      await sendMsg(newmessage, config.channel)
    }
  })

  mod.hook("S_CHAT", 3, async (event) => {
    let brut = event.message
    let newmessage = event.message
      .replaceAll(/<ChatLinkAction[^>]*>&lt;([^<]*)&gt;<\/ChatLinkAction[^>]*>/g, " **$1 ** ")
      .replaceAll("@", "")
      .replaceAll(/<[^>]*>/g, "")
      .replaceAll(/&lt;/g, "<")
      .replaceAll(/&gt;/g, ">")
    if (event.name === myGameName) return
    if (config.back && event.channel === config.guild) {
      console.log("<" + event.name + ">:\n -> " + brut)
    }
    if (event.channel === 2) {
      var channel = bot.channels.cache.get(config.channel)
      await channel.send(`Guild [${event.name}] : ${newmessage}`)
    }
    if (config.global) {
      if (event.channel === 4) var channel = bot.channels.cache.get(config.channel)
      await channel.send(`Global [${event.name}] : ${newmessage}`)
    }
    if (config.trade) {
      if (event.channel === 27) var channel = bot.channels.cache.get(config.channel)
      await channel.send(`Trade [${event.name}] : ${newmessage}`)
    }
  })

  let discordAuthor
  bot.on("message", function chatMessage(msg) {
    if (!msg.author.bot && msg.channel.id === config.channel) {
      //discordAuthor = msg.author.username
      msg.guild.members.fetch(msg.author).then((member) => {
        discordAuthor = member.nickname
      })
      if (config.back) {
        console.log(`[${discordAuthor}]: ${msg.content}`)
      }
    }
  })

  let prefix = config.prefix
  bot.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    if (message.content.startsWith(prefix + "up")) {
      await message.channel.send("i'm up")
    } /* else if (message.content.stripHTML(prefix + "stat")) {
      const textembed = new MessageEmbed()
        .setTitle("Path Reborn")
        .setColor("DARK_ORANGE")
        .setDescription(
          `GM: ${gm}\n GuildXP : ${gxp} / ${gxplvlup}\n Guild Level : ${glvl}\n PO : ${po}\n Compte = ${account}\n Perso = ${character}`
        )
        .setFooter("Not associated with GChat.");

      message.channel.send(textembed);
    }*/
  })

  let character, account, statu, restant, gname, gxp, gxplvlup, po, gm, glvl
  mod.hook("S_GUILD_MEMBER_LIST", 2, (e) => {
    gm = e.guildMaster
    gname = e.guildName
    po = e.guildFunds
    gxplvlup = e.guildXpForLevel
    gxp = e.guildXp
    glvl = e.guildLevel
    character = e.characters
    account = e.accounts
    statu = e.members
  })

  mod.hook("S_GUILD_POINT_INFO_CHANGED", 1, (e) => {
    restant = e.remainingGuildPoints
  })

  //bot.on("message", (message) => {
  //  console.log(message.content);
  //  if (message.content === "!ping") {
  //    message.channel.send("Pong.");
  //  }
  //});

  command.add("disc", (arg, arg1) => {
    switch (arg) {
      case "test":
        sendMsg(arg1, config.channel)
        break
      case "back":
        config.back = !config.back
        console.log(`feedback is: ${config.back}`)
        break
      case "stat":
        console.log(character)
        console.log(account)
        console.log(statu)
        console.log(`${restant} / 900`)
        break
      default:
        mod.command.message("disc: back, test [arg]")
    }
  })

  let myGameName
  mod.hook("S_LOGIN", 14, (event) => {
    myGameName = event.name
  })

  function sendMsg(msg, chatChannel) {
    var channel = bot.channels.cache.get(chatChannel)
    channel.send(`Guild [${myGameName}] : ${msg}`)
    // <@!231813966282752001> New ping
  }

  bot.login(config.token)
}
