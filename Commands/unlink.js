module.exports = async (Discord, interaction, axios, { get_role }) => {
  await axios
    .delete(
      `https://itgg.herokuapp.com/discord/register/${interaction.member.id}`
    )
    .then((res) => {
      if (res.data == "Your discord is unlinked") {
        interaction.reply("✅ ยกเลิกการยืนยันเรียบร้อย ✅");
      }
    })
    .catch((err) => {
      if (err.response.data == "Your discord is not registered") {
        interaction.reply("⚠️ คุณยังไม่ยืนยันตัวตน ⚠️");
      } else {
        interaction.reply(
          "🛠️ พบปัญหาขณะยืนยันตัว(ทางเทคนิค) กรุณาติดต่อทีมงาน GG Admin 🛠️"
        );
      }
    });
};
