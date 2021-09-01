const get_role = (user) => {
  if (
    user.member.roles.cache.some(
      (role) =>
        role.name === "GG Admin" ||
        role.name === "🔧Administrator🔧" ||
        role.name === "🎲 Committy 🎲" ||
        role.name === "🔨Moderator🔨" ||
        role.name === "🦅 Agency 🦅"
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const arrayremove = (arr, value) => {
  return arr.filter((item) => item !== value);
};

const get_count = (arr, value) => {
  let count = 0;
  arr.forEach((val) => {
    if (val == value) {
      count += 1;
    }
  });
  return count;
};

module.exports = { get_role, arrayremove, get_count };
