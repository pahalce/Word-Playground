const emojiStringToArray = (str) => {
  const split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
  const arr = [];
  for (var i = 0; i < split.length; i++) {
    const char = split[i];
    if (char !== "") {
      arr.push(char);
    }
  }
  return arr;
};
export const emojis = emojiStringToArray("🙋😄🤣😅😭😘🤔🥶🤮😲💩💯💢");
