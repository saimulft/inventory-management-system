import { useState } from "react";

function VirtualKeyboard({state}) {
  const emojiCategories = {
    "Smileys & People": [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "😉",
      "😍",
    ],
    "Animals & Nature": [
      "🐶",
      "🐱",
      "🐭",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🦁",
      "🐮",
      "🐯",
      "🦄",
      "🐔",
    ],
    "Food & Drink": [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍈",
      "🍍",
      "🥭",
      "🍅",
      "🍆",
    ],
    "Travel & Places": [
      "🚗",
      "🚕",
      "🚆",
      "✈️",
      "🚢",
      "🚀",
      "🌍",
      "🌎",
      "🌏",
      "🏞️",
      "🏝️",
      "🏔️",
    ],
    Objects: [
      "📱",
      "💻",
      "🖥️",
      "📷",
      "🎥",
      "🎮",
      "⏰",
      "📺",
      "🔦",
      "📦",
      "🚽",
      "🧰",
    ],
    Symbols: [
      "❤️",
      "✨",
      "⭐",
      "☀️",
      "🌈",
      "⚡",
      "💫",
      "⛔",
      "🚫",
      "🛑",
      "✅",
      "💯",
    ],
    Flags: [
      "🇺🇸",
      "🇬🇧",
      "🇨🇦",
      "🇦🇺",
      "🇯🇵",
      "🇩🇪",
      "🇫🇷",
      "🇮🇹",
      "🇪🇸",
      "🇷🇺",
      "🇨🇳",
      "🇮🇳",
    ],
  };

  const [input, setInput] = state;
  const [emojiPanelVisible, setEmojiPanelVisible] = useState(false);

  const handleKeyPress = (emoji) => {
    setInput(input + emoji);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setEmojiPanelVisible(!emojiPanelVisible)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        😀 Emoji
      </button>
      {emojiPanelVisible && (
        <div className="absolute right-0 mt-12 p-4 bg-white border shadow-lg">
          <button
            onClick={() => setEmojiPanelVisible(false)}
            className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800"
          >
            &#10006; {/* Close button */}
          </button>
          {Object.keys(emojiCategories).map((category) => (
            <div key={category} className="mb-4">
              <h3 className="text-lg font-bold">{category}</h3>
              <div className="grid grid-cols-6 gap-2">
                {emojiCategories[category].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleKeyPress(emoji)}
                    className="text-2xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VirtualKeyboard;
