import { emojis } from "../../../misc/emojis";
const EmojiPicker = ({ setSelectedEmoji }) => {
  const pickEmoji = (emoji) => {
    setSelectedEmoji(emoji);
  };
  return (
    <div className="emoji-picker">
      {emojis.map((emoji, index) => {
        return (
          <>
            <div
              className="emoji-btn"
              key={index}
              onClick={() => {
                pickEmoji(emoji);
              }}
            >
              {emoji}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default EmojiPicker;
