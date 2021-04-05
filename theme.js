const fs = require("fs");

const data = JSON.parse(fs.readFileSync("themes.json", "utf8"));
const themes = data["themes"];
exports.getRandomTheme = () => {
  const num = Math.floor(Math.random() * themes.length);
  return themes[num];
};

const letters =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじずぜぞだでどばびぶべぼ";
exports.getRandomLetter = () => {
  const num = Math.floor(Math.random() * letters.length);
  return letters[num];
};
