module.exports = async (Discord, interaction, axios, { get_role }) => {
  const getstd_id = interaction.options.getInteger("student_number");
  const getgate = interaction.options.getString("gate");
  const getname = interaction.options.getString("firstname");
  const getit = interaction.options.getInteger("it");
  if (String(getstd_id).length != 8) {
    interaction.reply("⚠️ รหัสนักศึกษาจำเป็นต้องมี 8 หลักเท่านั้น ⚠️");
  } else {
    if (!(getit > 0 && getit <= 19)) {
      interaction.reply("⚠️ กรุณากรอดรุ่นให้ถูกต้อง ⚠️");
      return;
    }
    await axios
      .post("https://itgg.herokuapp.com/discord/register", {
        discord_id: interaction.member.id,
        std_id: String(getstd_id),
        name: getname,
        house: getgate,
        year: getit,
      })
      .then(function (response) {
        interaction.reply(
          "✅ ยืนยันตัวสำเร็จ ขอให้สนุกกับการร่วมกิจกรรมนะครับบบ"
        );
      })
      .catch(function (error) {
        if (error.response !== undefined) {
          console.log(error);
          if (error.response.data == "Your discord is registered") {
            interaction.reply("⚠️ คุณได้ทำการยืนยันตัวไปแล้ว ⚠️");
          } else if (error.response.data == "Not found player or registered") {
            interaction.reply(
              "🛑 ไม่พบรหัสนักศึกษา หรือ รหัสนักศึกษาถูกใช้ไปแล้ว 🛑"
            );
          } else {
            interaction.reply(
              "🛠️ พบปัญหาขณะยืนยันตัว(ทางเทคนิค) กรุณาติดต่อทีมงาน GG Admin 🛠️"
            );
          }
        }
      });
  }
};
