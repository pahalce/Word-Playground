const fs = require("fs");

const r = JSON.parse(fs.readFileSync("themes.json", "utf8"));
const themesHa = r["は"];
const themesBa = r["ば"];
exports.getRandomTheme = () => {
  const num = Math.floor(Math.random() * (themesHa.length + themesBa.length));
  let theme_list;
  if (num <= themesHa.length - 1) {
    theme_list = ["は", themesHa[num]];
  } else {
    theme_list = ["ば", themesBa[num - themesHa.length]];
  }
  return theme_list;
};

const letters =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじずぜぞだでどばびぶべぼ";
exports.getRandomLetter = () => {
  const num = Math.floor(Math.random() * letters.length);
  return letters[num];
};
