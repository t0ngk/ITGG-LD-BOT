var emojiStringToArray = function (str) {
    split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    arr = [];
    for (var i=0; i<split.length; i++) {
      char = split[i]
      if (char !== "") {
        arr.push(char);
      }
    }
    return arr;
  };

module.exports = async (Discord, interaction, axios, { get_role }) => {
    let get_emoji = emojiStringToArray(interaction.options.getString('emoji'))
    let get_description = interaction.options.getString('description')
    let get_bet = interaction.options.getInteger('bet')
    let get_profit = interaction.options.getInteger('profit')
    let get_duration = interaction.options.getInteger('duration')
    interaction.reply("กำลังเตรียมตัว")
    let mess = await interaction.channel.send(get_description)
    get_emoji.forEach(emoji => {
      mess.react(emoji)
    })
    let tmp_a = []
    const filter = (reaction, user) => {
      return user.bot == false && reaction.message.id == mess.id;
    };
    let get_result = get_emoji[Math.floor((Math.random() * 100) % get_emoji.length)]
    interaction.member.send(`ตอนนี้ Bot ได้สุ่มคำตอบให้แล้ว คำตอบคือ ${get_result}`)
    const collector = mess.createReactionCollector({ filter, time: get_duration * 1000 });
    collector.on('end',async result_react => {
      mess.reactions.removeAll()
      result_react.map(react => { 
        let member_emoji = []
        react.users.cache.some(user => {
          interaction.guild.members.cache.some(guild_user => {
            if ((guild_user.id == user.id) && !user.bot) {
              member_emoji.push(guild_user.id)
            }
          })
        })
        tmp_a.push({
          "icon" : react.emoji.name,
          "member" : member_emoji
        })
      })
      let all = {
        "discord_id" : interaction.member.id,
        "bet" : get_bet,
        "profit" : get_profit,
        "result" : get_result,
        "emoji": tmp_a 
      }
      await axios.post('https://itgg.herokuapp.com/discord/table',all)
      .then(done => {
        mess.edit(`~~${get_description}~~`)
      })
      .catch(err => {
        interaction.channel.send("⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️")
      })
    })
  }