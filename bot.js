const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Collector } = require('discord.js');
const axios = require("axios")
const moment = require("moment")
moment.locale('th')
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', "GUILD_MESSAGE_REACTIONS"] });

const sec_color = {
  "nor": "#de4232",
  "or": "#19b319",
  "and": "#4680de",
  "not": "#6c4187"
}
const sec_emoji = {
  "and": "🐳",
  "not": "👾",
  "or": "🐸",
  "nor": "🐦"
}

const list_commands = [{
  "name": "random",
  "description": "🎲🎲เรามาสุ่มผู้โชคดีกันดีกว่า🎲🎲",
  "options": [
    {
      "type": 3,
      "name": "topic",
      "description": "🔧หัวข้อสุ่ม🔧",
      "required": true
    },
    {
      "type": 4,
      "name": "countdown",
      "description": "⏲️ตั้งเวลาสิ้นสุดการสุ่ม (วินาที)⏲️",
      "required": true
    }
  ]
},
{
  "name": "bonus",
  "description": "🎲🎲เรามาแจกคะแนนกันดีกว่า🎲🎲",
  "options": [
    {
      "type": 4,
      "name": "point",
      "description": "💵ตั้งเวลาสิ้นสุดการสุ่ม (วินาที)💵",
      "required": true
    },
    {
      "type": 3,
      "name": "topic",
      "description": "🔧หัวข้อสุ่ม🔧",
      "required": true
    },
    {
      "type": 4,
      "name": "countdown",
      "description": "⏲️ตั้งเวลาสิ้นสุดการสุ่ม (วินาที)⏲️",
      "required": true
    }
  ]
},
{
  "name": "auth",
  "description": "🕵️🕵️ยืนยันตัว🕵️🕵️",
  "options": [
    {
      "type": 4,
      "name": "student_number",
      "description": "💳รหัสนักศึกษา💳",
      "required": true
    },
    {
      "type": 3,
      "name": "gate",
      "description": "🏘️กรุณาเลือกเกรท🏘️",
      "required": true,
      "choices": [
        {
          "name": "and",
          "value": "and"
        },
        {
          "name": "or",
          "value": "or"
        },
        {
          "name": "nor",
          "value": "nor"
        },
        {
          "name": "not",
          "value": "not"
        }
      ]
    },
    {
      "type": 3,
      "name": "firstname",
      "description": "🖋️ชื่อจริง🖋️",
      "required": true
    },
    {
      "type": 4,
      "name": "it",
      "description": "🖥️รุ่น 1 - 19🖥️",
      "required": true
    }
  ]
},
{
  "name": "givescore",
  "description": "📋📋เพิ่มคะแนน📋📋",
  "options": [
    {
      "type": 4,
      "name": "score",
      "description": "💵จำนวนคะแนน💵",
      "required": true
    },
    {
      "type": 3,
      "name": "event",
      "description": "❓ได้คะแนนจาก Event อะไร❓",
      "required": true
    },
    {
      "type": 3,
      "name": "mention",
      "description": "👨‍👩‍👧‍👦Mention คนได้กี่คนก็ได้แต่ห้ามเว้นวรรค **ห้ามเว้นวรรค**👨‍👩‍👧‍👦",
      "required": true
    },
  ]
},
{
  "name": "removescore",
  "description": "📋📋หักคะแนน📋📋",
  "options": [
    {
      "type": 4,
      "name": "score",
      "description": "💵จำนวนคะแนน💵",
      "required": true
    },
    {
      "type": 3,
      "name": "cause",
      "description": "❓หักเนื่องจากอะไร❓",
      "required": true
    },
    {
      "type": 3,
      "name": "mention",
      "description": "👨‍👩‍👧‍👦Mention คนได้กี่คนก็ได้แต่ห้ามเว้นวรรค **ห้ามเว้นวรรค**👨‍👩‍👧‍👦",
      "required": true
    },
  ]
},
{
  "name": "score",
  "description": "🏦🏦ดูคะแนนตัวเอง🏦🏦",
  "options": [
    {
      "type": 9,
      "name": "target",
      "description": "🔎คนที่เราอยากดูคะแนน หากอยากดูของตัวเองไม่ต้องกรอก🔍",
      "required": false
    }
  ]
},
{
  "name": "unlink",
  "description": "🔧🔧ยกเลิกการยืนยันตัวตน🔧🔧"
},
{
  "name": "gatescore",
  "description": "🏦🏦เช็คคะแนนGate🏦🏦",
  "options": [
    {
      "type": 3,
      "name": "gate",
      "description": "🏘️**ถ้าไม่เลือกจะโชว์ของทุกเกท**🏘️",
      "required": false,
      "choices": [
        {
          "name": "and",
          "value": "and"
        },
        {
          "name": "or",
          "value": "or"
        },
        {
          "name": "nor",
          "value": "nor"
        },
        {
          "name": "not",
          "value": "not"
        }
      ]
    }
  ]
},
{
  "name": "roulette",
  "description": "🎯🔵🔴🟢มาเล่นลูเล็ทกัน🟢🔴🔵🎯",
  "options": [
    {
      "type": 4,
      "name": "point",
      "description": "⚖️ตาละเท่าไหร่ดี?⚖️",
      "required": true
    },
    {
      "type": 4,
      "name": "countdown",
      "description": "⏲️Countdown กี่วิดีนะ?⏲️",
      "required": true
    }
  ]
},
{
  "name": "wheelspin",
  "description": "🎡วงล้อเสี่ยงโชค (ตาละ 80 Token)🎡"
},
{
  "name": "givebuff",
  "description": "🧙‍♂️🧙‍♂️ให้ Buff🧙‍♂️🧙‍♂️",
  "options": [
    {
      "type": 3,
      "name": "buff",
      "description": "🗡️🗡️Buff อะไรเอ๋ย🗡️🗡️",
      "required": true
    },
    {
      "type": 4,
      "name": "duration",
      "description": "⏲️⏲️Buff นานแค่ไหน (นาที)⏲️⏲️",
      "required": true
    },
    {
      "type": 3,
      "name": "mention",
      "description": "👨‍👩‍👧‍👦สามารถ Mention ได้หลายคน👨‍👩‍👧‍👦",
      "required": true
    }
  ]
},
{
  "name": "checkbuff",
  "description": "🔎check buff🔍",
  "options": [
    {
      "type": 6,
      "name": "mention",
      "description": "🕵️**Mention ได้แค่คนเดียว**🕵️",
      "required": true
    }
  ]
}
]

client.once('ready', () => {
  console.log(`${client.user.username} Ready!`);
  client.user.setPresence({ activities: [{ name: 'ITGG' }], status: 'online' });
});

client.on("message", (message) => {
  if (message.content == "!update") {
    mes_id = message.guild.id
    list_commands.forEach(data => {
      client.application?.commands.create(data, mes_id)
    })
    message.delete()
  }
})

function arrayremove(arr, value) {
  return arr.filter(item => item !== value)
}

function get_role(user) {
  if (user.member.roles.cache.some(role => role.name === 'GG Admin' ||
    role.name === "🔧Administrator🔧" ||
    role.name === "🎲 Committy 🎲" ||
    role.name === "🔨Moderator🔨" ||
    role.name === "🦅 Agency 🦅")) {
    return true
  } else {
    return false
  }
}

function get_count(arr, value) {
  let count = 0
  arr.forEach(val => {
    if (val == value) {
      count += 1
    }
  })
  return count
}

client.on('interaction', async interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName == "auth") {
    const getstd_id = interaction.options.getInteger("student_number")
    const getgate = interaction.options.getString("gate")
    const getname = interaction.options.getString("firstname")
    const getit = interaction.options.getInteger("it")
    if (String(getstd_id).length != 8) {
      interaction.reply("⚠️ รหัสนักศึกษาจำเป็นต้องมี 8 หลักเท่านั้น ⚠️")
    } else {
      if (!(getit > 0 && getit <= 19)) {
        interaction.reply("⚠️ กรุณากรอดรุ่นให้ถูกต้อง ⚠️")
        return
      }
      await axios.post('https://itgg.herokuapp.com/discord/register', {
        "discord_id": interaction.member.id,
        "std_id": String(getstd_id),
        "name": getname,
        "house": getgate,
        "year": getit
      })
        .then(function (response) {
          interaction.reply("✅ ยืนยันตัวสำเร็จ ขอให้สนุกกับการร่วมกิจกรรมนะครับบบ")
        })
        .catch(function (error) {
          if (error.response !== undefined) {
            console.log(error)
            if (error.response.data == "Your discord is registered") {
              interaction.reply("⚠️ คุณได้ทำการยืนยันตัวไปแล้ว ⚠️")
            } else if (error.response.data == "Not found player or registered") {
              interaction.reply("🛑 ไม่พบรหัสนักศึกษา หรือ รหัสนักศึกษาถูกใช้ไปแล้ว 🛑")
            } else {
              interaction.reply("🛠️ พบปัญหาขณะยืนยันตัว(ทางเทคนิค) กรุณาติดต่อทีมงาน GG Admin 🛠️")
            }
          }
        });
    }
  }
  if (interaction.commandName == "random") {
    if (get_role(interaction)) {
      interaction.reply("เตรียมตัว ระวัง")
      const topic = interaction.options.getString('topic');
      const countdown = interaction.options.getInteger('countdown');
      let mess = await interaction.channel.send(`__**${topic}**__`)
      await mess.react("🎲")
      const filter = (reaction, user) => {
        return reaction.emoji.name === '🎲' && user.bot == false && reaction.message.id == mess.id;
      };
      const collector = mess.createReactionCollector({ filter, time: countdown * 1000 });

      collector.on('end', collected => {
        if (collected.size != 0) {
          mess.reply(`ผู้ชนะคือ <@${collector.users.random().id}> 🎉🎉🎉`)
        }
        mess.reactions.removeAll()
        mess.edit(`~~__**${topic}**__~~ ⚠️การสุ่มสิ้นสุดลงแล้ว⚠️`)
      });
    } else {
      interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ")
    }
  }

  if (interaction.commandName == "bonus") {
    if (get_role(interaction)) {
      const get_point = interaction.options.getInteger("point")
      const get_topic = interaction.options.getString("topic")
      const get_countdown = interaction.options.getInteger("countdown")
      await interaction.reply("เตรียมตัว ระวังงงงงง")
      await interaction.deleteReply()
      let mess = await interaction.channel.send(`⏲️🔥 แจก ${get_point} Token เป็น เวลา ${get_countdown} วิ เพราะ __**${get_topic}**__ กดเลย!!!!! หมดแล้วหมดเลย ระวังเสียใจภายหลัง 🔥⏲️`)
      mess.react("📌")
      const filter = (reaction, user) => {
        return reaction.emoji.name === '📌' && user.bot == false && reaction.message.id == mess.id;
      };
      const collector = mess.createReactionCollector({ filter, time: get_countdown * 1000 });
  
      collector.on('end',async collected => {
        let all_user = []
        collected.map(info => {
          info.users.cache.some(user => {
            interaction.guild.members.cache.some(get_user => {
              if ((get_user.id == user.id) && !user.bot) {
                all_user.push({
                  "discord_id" : user.id,
                  "coin" : get_point,
                  "event" : get_topic,
                  "giver" : interaction.member.displayName
                })
              }
            })
          })
        })
        await axios.post('https://itgg.herokuapp.com/discord/coins',all_user)
        .then(done => {
          mess.reactions.removeAll()
          mess.edit(`~~⏲️🔥 แจก ${get_point} Token เป็น เวลา ${get_countdown} วิ เพราะ __**${get_topic}**__ กดเลย!!!!! หมดแล้วหมดเลย ระวังเสียใจภายหลัง 🔥⏲️~~  ⚠️การแจกสิ้นสุดลงแล้ว⚠️`)
          done.data.fail.forEach(user => {
            interaction.channel.send(`🛑  <@${user}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`)
          })
        })
        .catch(err => {
          interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
        })
      });
    } else {
      interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ")
    }
  }
  if (interaction.commandName == "givescore") {
    if (get_role(interaction)) {
      const score = interaction.options.getInteger("score")
      const remove_syntax = /[<@!>]/g
      const remove_alhpa = /([^0123456789,])/g
      let member = interaction.options.getString("mention").replaceAll("><@!", ",").replaceAll(remove_syntax, "").replaceAll(remove_alhpa, "").split(",")
      let get_all = []
      let getevent = interaction.options.getString("event")
      let getgiver = interaction.options.getString("giver")
      member.forEach((deq) => {
        if (!(interaction.guild.members.cache.some(userid => (userid.id == deq)))) {
          member = arrayremove(member, deq)
        }
      })
      member.forEach(user_id => {
        get_all.push({
          "discord_id" : user_id,
          "coin" : score,
          "event" : getevent,
          "giver" : interaction.member.displayName
        })
      })
      await axios.post('https://itgg.herokuapp.com/discord/coins', get_all)
        .then((req) => {
          const getres = req.data
          if (getres.success.length > 1) {
            interaction.reply(`ยินดีด้วยกับ ${getres.success.length} คน ที่ได้รับ ${getres.coin} Token! จากกิจกรรม __${getevent}__`)
          } else if (getres.success.length == 1) {
            interaction.reply(`ยินดีด้วยกับ <@${getres.success}> ที่ได้รับ ${getres.coin} Token! จากกิจกรรม __${getevent}__`)
          }
          else {
            interaction.reply("⚠️ ไม่พบผู้ใช้งานในระบบ หรือ ผู้ใช้อาจจะไม่ได้ยืนยันตัว รบกวนแอดมินแจ้งผู้ใช้ด้วยครับ ⚠️")
          }
          getres.fail.forEach((userid) => {
            interaction.channel.send(`🛑 <@${userid}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน🛑 `)
          })
        })
        .catch((err) => {
          interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
        })
    } else {
      interaction.reply("🗨️🤖 : เห้ยอย่าแอบเพิ่มคะแนนเองสิ : )")
    }
  }
  if (interaction.commandName == "removescore") {
    if (get_role(interaction)) {
      const score = interaction.options.getInteger("score")
      const remove_syntax = /[<@!>]/g
      const remove_alhpa = /([^0123456789,])/g
      let member = interaction.options.getString("mention").replaceAll("><@!", ",").replaceAll(remove_syntax, "").replaceAll(remove_alhpa, "").split(",")
      let get_all = []
      let getcause = interaction.options.getString("cause")
      let getevent = interaction.options.getString("event")
      member.forEach((deq) => {
        if (!(interaction.guild.members.cache.some(userid => (userid.id == deq)))) {
          member = arrayremove(member, deq)
        }
      })
      member.forEach(user_id => {
        get_all.push({
          "discord_id" : user_id,
          "coin" : score,
          "event" : String(getevent),
          "giver" : interaction.member.displayName
        })
      })
      await axios.post('https://itgg.herokuapp.com/discord/coins', get_all)
        .then((req) => {
          const getres = req.data
          if (getres.success.length > 1) {
            interaction.reply(`${getres.success.length} คน ถูกตัดคะแนน ${score} Token! เพราะว่า __${getcause}__`)
          } else if (getres.success.length == 1) {
            interaction.reply(`<@${getres.success}> ถูกตัดคะแนน ${score} Token! เพราะว่า __${getcause}__`)
          }
          else {
            interaction.reply("⚠️ ไม่พบผู้ใช้งานในระบบ ⚠️")
          }
          getres.fail.forEach((userid) => {
            interaction.channel.send(`🛑 <@${userid}> คุณยังไม่ได้ยืนยันตัว กณุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน🛑 `)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      interaction.reply("🗨️🤖 : เห้ยอย่าแอบหักคะแนนเองสิ : (")
    }
  }
  if (interaction.commandName == "score") {
    let target = interaction.options.getMentionable("target")
    let targetid = ""
    if (target == null) { targetid = interaction.user.id } else { targetid = target.user.id }
    await axios.get(`https://itgg.herokuapp.com/players?search=${targetid}`)
      .then((res) => {
        const getres = res.data
        if (getres.length > 0) {
          if (targetid == interaction.user.id) {
            interaction.reply(`<@${targetid}> มีคะแนนทั้งหมด ${getres[0].coin} Token!`)
          } else {
            interaction.reply("ส่งให้ใน DM แล้วนะ 🕵️")
            setTimeout(() => {
              interaction.deleteReply()
            }, 2000);
            interaction.member.send(`<@${targetid}> มีคะแนนทั้งหมด ${getres[0].coin} Token!`)
          }
        } else {
          interaction.reply("⚠️ ไม่พบผู้ใช้งานในระบบ ⚠️")
        }
      })
      .catch((err) => {
      })
  }
  if (interaction.commandName == "unlink") {
    await axios.delete(`https://itgg.herokuapp.com/discord/register/${interaction.member.id}`)
      .then(res => {
        if (res.data == "Your discord is unlinked") {
          interaction.reply("✅ ยกเลิกการยืนยันเรียบร้อย ✅")
        }
      })
      .catch(err => {
        if (err.response.data == "Your discord is not registered") {
          interaction.reply("⚠️ คุณยังไม่ยืนยันตัวตน ⚠️")
        } else {
          interaction.reply("🛠️ พบปัญหาขณะยืนยันตัว(ทางเทคนิค) กรุณาติดต่อทีมงาน GG Admin 🛠️")
        }
      })
  }
  if (interaction.commandName == "gatescore") {
    await axios.get('https://itgg.herokuapp.com/')
      .then(res => {
        const get_gate = interaction.options.getString("gate")
        const sorted_leader = res.data.sort(function (a, b) { return parseFloat(b.coin) - parseFloat(a.coin); });
        const leaderboard = new MessageEmbed()
          .setColor(sec_color[sorted_leader[0].name])
          .setTitle('ตารางคะแนนแต่ละ Gate')
          .addFields(
            { name: `🏅 ${sorted_leader[0].name} : ${sorted_leader[0].coin} Token!`, value: "==============" },
            { name: `🥈 ${sorted_leader[1].name} : ${sorted_leader[1].coin} Token!`, value: "==============" },
            { name: `🥉 ${sorted_leader[2].name} : ${sorted_leader[2].coin} Token!`, value: "==============" },
            { name: `🐢 ${sorted_leader[3].name} : ${sorted_leader[3].coin} Token!`, value: "==============" },
          )
          .setTimestamp()
          .setFooter('🗨️🤖 : อัพเดจเมื่อ');


        if (get_gate != null) {
          sorted_leader.forEach(info => {
            if (info.name == get_gate) {
              const solo_lead = new MessageEmbed()
                .setColor(sec_color[get_gate])
                .setTitle(`ตารางคะแนน Gate ${info.name}`)
                .addFields(
                  { name: `${sec_emoji[get_gate]} ${info.name} : ${info.coin} Token!`, value: "==============" },
                )
                .setTimestamp()
                .setFooter('🗨️🤖 : อัพเดจเมื่อ');
              interaction.reply({ embeds: [solo_lead] })
            }
          })
        } else {
          interaction.reply({ embeds: [leaderboard] });
        }
      })
      .catch(err => {
      })
  }
  if (interaction.commandName == "roulette"){
    if (get_role(interaction)) {      
      await interaction.reply("กำลังจัดโต๊ะสำหรับ Roulette")
      let mess = await interaction.channel.send("คิด Text ไม่ออกใครก็ได้คิดให้หน่อย")
      const get_countdown = interaction.options.getInteger("countdown")
      const get_point = interaction.options.getInteger("point")
      mess.react("🔵")
      mess.react("🔴")
      mess.react("🟢")
      let all = []
      const roulette_filter = (reaction, user) => {
        return user.bot == false && reaction.message.id == mess.id;
      };
      const roulette_collector = mess.createReactionCollector({ roulette_filter, time: get_countdown * 1000 });
  
      roulette_collector.on("end",async collected => {
        let mutipie = {
          "blue" : -1,
          "red" : -1,
          "green" : -1
        }
        let rng = Math.floor(Math.random() * 100)
        if (rng > 0 && rng <= 45) {
          interaction.channel.send("Blue Win")
          mutipie.blue = 1
        }else if(rng > 45 && rng <= 90){
          interaction.channel.send("Red Win")
          mutipie.red = 1
        }else if(rng < 90){
          interaction.channel.send("Green Win")
          mutipie.green = 2
        }
        let winner = 0
        collected.map(user => {user.users.cache.some(user_info => {
          if (!user_info.bot) {
            interaction.guild.members.cache.some(get_id => {
              if(get_id.id == user_info.id){
                if(user.emoji.name === '🔵'){
                  all.push({
                    "id" : get_id.id,
                    "coin" : (get_point * mutipie.blue)
                  })
                  winner += 1
                }
                if(user.emoji.name === '🔴'){
                  all.push({
                    "id" : get_id.id,
                    "coin" : (get_point * mutipie.red)
                  })
                  winner += 1
                }
                if(user.emoji.name === '🟢'){
                  all.push({
                    "id" : get_id.id,
                    "coin" : (get_point * mutipie.green)
                  })
                  winner += 1
                }
              }
            })
          }
        })})
        mess.reactions.removeAll()
        await axios.post("https://itgg.herokuapp.com/discord/gateCoin",all)
        .then(done => {
          interaction.channel.send(`ผู้ชนะทั้งหมด ${winner} คน`)
          done.data.fail.forEach(user => {
            interaction.channel.send(`🛑  <@${user}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`)
          })
        })
        .catch(() => {
          interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
        })
      })
    } else {
      interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ")
    }
  }
  if (interaction.commandName == "wheelspin"){
    let rng = Math.floor(Math.random() * 100)
    let score = 0
    if (rng > 0 && rng <= 15){
      score = 160
    }else if(rng > 15 && rng <= 50){
      score = 120
    }else if(rng > 50 && rng <= 70){
      score = 80
    }else if(rng > 70 && rng <= 90){
      score = 40
    }else if(rng > 90 && rng <= 100){
      score = 0
    }
    await axios.post('https://itgg.herokuapp.com/discord/coins',[
      {"discord_id" : interaction.member.id,"coin":score - 80}
    ])
    .then(done => {
      if (done.data.fail.length != 0){
        interaction.channel.send(`🛑  <@${done.data.fail}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`)
      }else{
        if (score - 80 > 0) {
          interaction.reply(`ยินดีด้วยคุณได้รับ ${score - 80} Token!  🎉🎉🎉🎉`)
        }else if(score - 80 == 0){
          interaction.reply(`แย่จังคุณได้คืนทุน`)
        }else{
          interaction.reply(`แย่จังคุณเสียไป ${score - 80} Token!`)
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
  if (interaction.commandName == "givebuff"){
    if (get_role(interaction)) {
      const mention = interaction.options.getString("mention").replaceAll("><@",",").replaceAll(/([^0123456789,])/g,"").split(",")
      const buff = interaction.options.getString("buff")
      const duration = interaction.options.getInteger("duration") * 60
      const payload = {
        "discord_id" : mention,
        "name" : buff,
        "exp" : duration
      }
      await axios.post('https://itgg.herokuapp.com/discord/addBuff',payload)
      .then(done => {
        if(mention.length == 1){
          interaction.reply(`<@${mention[0]}> ได้รับ Buff __**${buff}**__ เป็นเวลา ${duration / 60} นาที  🎉🎉🎉🎉`)
        }else{
          interaction.reply(`${mention.length} คน ได้รับ Buff __**${buff}**__ เป็นเวลา ${duration / 60} นาที  🎉🎉🎉🎉`)
        }
      })
      .catch(err => {
        interaction.reply("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
      })
    } else {
      interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ")
    }
  }
  if (interaction.commandName == "checkbuff"){
    if (get_role(interaction)) {
      let mention = interaction.options.getMember("mention")
      await axios.get(`https://itgg.herokuapp.com/discord/getBuff/${mention.id}`)
      .then(done => {
        let all_buff = []
        done.data.map(buff => {
          all_buff.push({
            "name" : `__${buff.buff_name}__`,
            "value" : `${moment(buff.expireAt).fromNow()} จะหมดเวลา`
          })
        })
        const embed = {
          "type": "rich",
          "title": `Check Buff`,
          "description": "",
          "color": 0x007bff,
          "fields": all_buff,
          "author": {
            "name": `${mention.user.username}`,
            "icon_url": `https://cdn.discordapp.com/avatars/${mention.user.id}/${mention.user.avatar}.png?size=128`
          }
        }
        interaction.reply({embeds: [embed]})
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ")
    }
  }
})

client.login('ODc4OTk5NjAwMDA5MTgzMzAz.YSJWKw.axFg9E8buwrr3fcXgNiFJ5bl2lg');
