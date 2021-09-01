module.exports = async (Discord, interaction, axios, { get_role }) => {
  if (get_role(interaction)) {
    await interaction.reply("กำลังจัดโต๊ะสำหรับ Roulette");
    let mess = await interaction.channel.send(
      "คิด Text ไม่ออกใครก็ได้คิดให้หน่อย"
    );
    const get_countdown = interaction.options.getInteger("countdown");
    const get_point = interaction.options.getInteger("point");
    mess.react("🔵");
    mess.react("🔴");
    mess.react("🟢");
    let all = [];
    const roulette_filter = (reaction, user) => {
      return user.bot == false && reaction.message.id == mess.id;
    };
    const roulette_collector = mess.createReactionCollector({
      roulette_filter,
      time: get_countdown * 1000,
    });

    roulette_collector.on("end", async (collected) => {
      let mutipie = {
        blue: -1,
        red: -1,
        green: -1,
      };
      let rng = Math.floor(Math.random() * 100);
      if (rng > 0 && rng <= 45) {
        interaction.channel.send("Blue Win");
        mutipie.blue = 1;
      } else if (rng > 45 && rng <= 90) {
        interaction.channel.send("Red Win");
        mutipie.red = 1;
      } else if (rng < 90) {
        interaction.channel.send("Green Win");
        mutipie.green = 2;
      }
      let winner = 0;
      collected.map((user) => {
        user.users.cache.some((user_info) => {
          if (!user_info.bot) {
            interaction.guild.members.cache.some((get_id) => {
              if (get_id.id == user_info.id) {
                if (user.emoji.name === "🔵") {
                  all.push({
                    id: get_id.id,
                    coin: get_point * mutipie.blue,
                  });
                  winner += 1;
                }
                if (user.emoji.name === "🔴") {
                  all.push({
                    id: get_id.id,
                    coin: get_point * mutipie.red,
                  });
                  winner += 1;
                }
                if (user.emoji.name === "🟢") {
                  all.push({
                    id: get_id.id,
                    coin: get_point * mutipie.green,
                  });
                  winner += 1;
                }
              }
            });
          }
        });
      });
      mess.reactions.removeAll();
      await axios
        .post("/discord/gateCoin", all)
        .then((done) => {
          interaction.channel.send(`ผู้ชนะทั้งหมด ${winner} คน`);
          done.data.fail.forEach((user) => {
            interaction.channel.send(
              `🛑  <@${user}> คุณยังไม่ได้ยืนยันตัว กรุณายืนยันตัว(__**/auth**__) แล้วรีบแจ้ง GG Admin โดยด่วน  🛑`
            );
          });
        })
        .catch(() => {
          interaction.channel.send(
            "⚠️ มีบางอย่างไม่ถุกต้องไปเรียก GG-Admin มาดู ⚠️"
          );
        });
    });
  } else {
    interaction.reply("🗨️🤖 : อันนี้ของเล่นแอดมิน ไม่ให้ใช้หรอกอิอิ");
  }
};
