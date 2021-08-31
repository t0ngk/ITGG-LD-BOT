const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Collector } = require('discord.js');
const axios = require("axios")

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

const commands = [{
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
      "name": "giver",
      "description": "🖋️ชื่อคนให้คะแนน🖋️",
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
      "name": "giver",
      "description": "🖋️ชื่อคนลงหักคะแนน🖋️",
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
  "description": "ลอง"
},
{
  "name": "givebuff",
  "description": "ให้ Buff",
  "options": [
    {
      "type": 3,
      "name": "buff",
      "description": "Buff อะไรเอ๋ย",
      "required": true
    },
    {
      "type": 4,
      "name": "duration",
      "description": "Buff นานแค่ไหน (นาที)",
      "required": true
    },
    {
      "type": 3,
      "name": "mention",
      "description": "@คน",
      "required": true
    }
  ]
},
{
  "name": "checkbuff",
  "description": "check buff",
  "options": [
    {
      "type": 6,
      "name": "mention",
      "description": "Mention ให้คนเดียว",
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
  if (message.content == "!setup") {
    mes_id = message.guild.id
    commands.forEach(data => {
      client.application?.commands.create(data, mes_id)
    })
    // message.delete()
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
  
  function check_house(user) {
    tmp_a = []
    user.roles.cache.some(role_user => {
      if (role_user.name == "GATE-OR" || role_user.name == "GATE-AND" || role_user.name == "GATE-NOR" || role_user.name == "GATE-NOT") {
        tmp_a.push(role_user.name)
      }
    })
    return tmp_a
  }

  if (interaction.commandName == "bonus") {
    const get_point = interaction.options.getInteger("point")
    const get_topic = interaction.options.getString("topic")
    const get_countdown = interaction.options.getInteger("countdown")
    const users_role = []
    const all_role = []
    await interaction.reply("เตรียมตัว ระวังงงงงง")
    await interaction.deleteReply()
    let mess = await interaction.channel.send(`⏲️🔥 แจก ${get_point} Token เป็น เวลา ${get_countdown} วิ เพราะ __**${get_topic}**__ กดเลย!!!!! หมดแล้วหมดเลย ระวังเสียใจภายหลัง 🔥⏲️`)
    mess.react("📌")
    const filter = (reaction, user) => {
      return reaction.emoji.name === '📌' && user.bot == false && reaction.message.id == mess.id;
    };
    const collector = mess.createReactionCollector({ filter, time: get_countdown * 1000 });

    collector.on('collect', (reaction, user) => {
      if (!user.bot){
        interaction.guild.members.cache.some(user_info => {
          if (user.id == user_info.id) {
            all_role.push(user_info)
          }
        })
      }
    });

    collector.on('end',async collected => {
      let sum_user = 0
      all_role.forEach(get_user => {
        users_role.push(...check_house(get_user)) 
      })
      if (collected.size != 0) {
        const payload = {
          "and" : get_count(users_role,"GATE-AND") * get_point,
          "or" : get_count(users_role,"GATE-OR") * get_point,
          "nor" : get_count(users_role,"GATE-NOR") * get_point,
          "not" : get_count(users_role,"GATE-NOT") * get_point
        }
        await axios.post("https://itgg.herokuapp.com/discord/gateCoin",payload)
        .then(function(done) {       
          collected.map(user => sum_user = user.count - 1)
          mess.reply(`การแจก Token สิ้นสุดลงแล้ว มีผู้ได้ Token ทั้งหมด ${sum_user} คน  🎉🎉🎉`)
        })
        .catch(function(err){
          interaction.reply("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
        })

      }
      mess.reactions.removeAll()
      mess.edit(`~~⏲️🔥 แจก ${get_point} Token เป็น เวลา ${get_countdown} วิ เพราะ __**${get_topic}**__ กดเลย!!!!! หมดแล้วหมดเลย ระวังเสียใจภายหลัง 🔥⏲️~~  ⚠️การแจกสิ้นสุดลงแล้ว⚠️`)
    });
  }
  if (interaction.commandName == "givescore") {
    if (get_role(interaction)) {
      const score = interaction.options.getInteger("score")
      const remove_syntax = /[<@!>]/g
      const remove_alhpa = /([^0123456789,])/g
      let member = interaction.options.getString("mention").replaceAll("><@!", ",").replaceAll(remove_syntax, "").replaceAll(remove_alhpa, "").split(",")
      member.forEach((deq) => {
        if (!(interaction.guild.members.cache.some(userid => (userid.id == deq)))) {
          member = arrayremove(member, deq)
        }
      })
      let getevent = interaction.options.getString("event")
      let getgiver = interaction.options.getString("giver")
      const payload = {
        "discord_id": member,
        "coin": score,
        "event": getevent,
        "giver": getgiver
      }
      await axios.post('https://itgg.herokuapp.com/discord/coins', payload)
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
      member.forEach((deq) => {
        if (!(interaction.guild.members.cache.some(userid => (userid.id == deq)))) {
          member = arrayremove(member, deq)
        }
      })
      let getcause = interaction.options.getString("cause")
      let getgiver = interaction.options.getString("giver")
      const payload = {
        "discord_id": member,
        "coin": -score,
        "event": getcause,
        "giver": getgiver
      }
      await axios.post('https://itgg.herokuapp.com/discord/coins', payload)
        .then((req) => {
          const getres = req.data
          if (getres.success.length > 1) {
            interaction.reply(`${getres.success.length} คน ถูกตัดคะแนน ${getres.coin} Token! เพราะว่า __${getcause}__`)
          } else if (getres.success.length == 1) {
            interaction.reply(`<@${getres.success}> ถูกตัดคะแนน ${getres.coin} Token! เพราะว่า __${getcause}__`)
          }
          else {
            interaction.reply("⚠️ ไม่พบผู้ใช้งานในระบบ ⚠️")
          }
          getres.fail.forEach((userid) => {
            interaction.channel.send(`🛑 <@${userid}> คุณยังไม่ได้ยืนยันตัว กณุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน🛑 `)
          })
        })
        .catch((err) => {
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
    await interaction.reply("กำลังจัดโต๊ะสำหรับ Roulette")
    let mess = await interaction.channel.send("คิด Text ไม่ออกใครก็ได้คิดให้หน่อย")
    const get_countdown = interaction.options.getInteger("countdown")
    const get_point = interaction.options.getInteger("point")
    mess.react("🔵")
    mess.react("🔴")
    mess.react("🟢")
    let blue = []
    let red = []
    let green = []
    const roulette_filter = (reaction, user) => {
      return user.bot == false && reaction.message.id == mess.id;
    };
    const roulette_collector = mess.createReactionCollector({ roulette_filter, time: get_countdown * 1000 });

    roulette_collector.on("end",async collected => {
      collected.map(user => {user.users.cache.some(user_info => {
        if (!user_info.bot) {
          interaction.guild.members.cache.some(get_id => {
            if(get_id.id == user_info.id){
              if(user.emoji.name === '🔵'){
                blue.push(get_id)
              }
              if(user.emoji.name === '🔴'){
                red.push(get_id)
              }
              if(user.emoji.name === '🟢'){
                green.push(get_id)
              }
            }
          })
        }
      })})
      let user_blue = []
      let user_red = []
      let user_green = []
      
      blue.forEach(get_user => {
        user_blue.push(...check_house(get_user))
      })
      red.forEach(get_user => {
        user_red.push(...check_house(get_user))
      })
      green.forEach(get_user => {
        user_green.push(...check_house(get_user))
      })
      let payload ={}
      let rng = Math.floor(Math.random() * 100)
      let get_and = (get_count(user_blue, "GATE-AND") * get_point) + (get_count(user_red, "GATE-AND") * get_point) + (get_count(user_green, "GATE-AND") * get_point)
      let get_or = (get_count(user_blue, "GATE-OR") * get_point) + (get_count(user_red, "GATE-OR") * get_point) + (get_count(user_green, "GATE-OR") * get_point)
      let get_nor = (get_count(user_blue, "GATE-NOR") * get_point) + (get_count(user_red, "GATE-NOR") * get_point) + (get_count(user_green, "GATE-NOR") * get_point)
      let get_not = (get_count(user_blue, "GATE-NOT") * get_point) + (get_count(user_red, "GATE-NOT") * get_point) + (get_count(user_green, "GATE-NOT") * get_point)
      if (rng > 0 && rng <= 45) {
        interaction.channel.send("Blue Win")
        payload = {
          "and" : (get_count(user_blue, "GATE-AND") * get_point * 2) - get_and,
          "or" : (get_count(user_blue, "GATE-OR") * get_point * 2) - get_or,
          "nor" : (get_count(user_blue, "GATE-NOR") * get_point * 2) - get_nor,
          "not" : (get_count(user_blue, "GATE-NOT") * get_point * 2) - get_not,
        }
      }else if(rng > 45 && rng <= 90){
        interaction.channel.send("Red Win")
        payload = {
          "and" : (get_count(user_red, "GATE-AND") * get_point * 2) - get_and,
          "or" : (get_count(user_red, "GATE-OR") * get_point * 2) - get_or,
          "nor" : (get_count(user_red, "GATE-NOR") * get_point * 2) - get_nor,
          "not" : (get_count(user_red, "GATE-NOT") * get_point * 2) - get_not,
        }
      }else if(rng < 90){
        interaction.channel.send("Green Win")
        payload = {
          "and" : (get_count(user_green, "GATE-AND") * get_point * 4) - get_and,
          "or" : (get_count(user_green, "GATE-OR") * get_point * 4) - get_or,
          "nor" : (get_count(user_green, "GATE-NOR") * get_point * 4) - get_nor,
          "not" : (get_count(user_green, "GATE-NOT") * get_point * 4) - get_not,
        }
      }
      mess.reactions.removeAll()
      await axios.post("https://itgg.herokuapp.com/discord/gateCoin",payload)
      .then(done => {
        interaction.channel.send(`This is Debug Don't mind me
  and : ${payload["and"]}
  or : ${payload["or"]}
  nor : ${payload["nor"]}
  not : ${payload["not"]}
        `)
      })
      .catch(() => {
        interaction.reply("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
      })
    })
  }
  if (interaction.commandName == "wheelspin"){
    let user = []
    interaction.guild.members.cache.some(user_info => {
      if (user_info.id == interaction.member.id) {
        user = check_house(user_info)
      }
    })
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
    await axios.post("https://itgg.herokuapp.com/discord/gateCoin",{
      "and" : (get_count(user, "GATE-AND") * score) - 80,
      "or" : (get_count(user, "GATE-OR") * score) - 80,
      "nor" : (get_count(user, "GATE-NOR") * score) - 80,
      "not" : (get_count(user, "GATE-NOT") * score) - 80
    }).then(done => {
      interaction.reply(String(score - 80))
    }).catch(err => {
      interaction.reply("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
    })
  }
  if (interaction.commandName == "givebuff"){
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
  }
  if (interaction.commandName == "checkbuff"){
    let mention = interaction.options.getMember("mention")
    await axios.get(`https://itgg.herokuapp.com/discord/getBuff/${mention.id}`)
    .then(done => {
      let all_buff = []
      done.data.map(buff => {
        all_buff.push({
          "name" : buff.buff_name,
          "value" : "IDK"
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
      console.log(embed)
    })
    .catch(err => {
      console.log(err)
    })
  }
})

client.login('ODc4OTk5NjAwMDA5MTgzMzAz.YSJWKw.axFg9E8buwrr3fcXgNiFJ5bl2lg');
