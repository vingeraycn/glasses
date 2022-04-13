function translatePage() {
  const content = document.body.innerText;
  const ret = (content.match(/[a-zA-Z]*/g) || [])
    .filter((item) => item !== "" && item.length > 3)
    .map((item) => item.toLowerCase());
  const words = difference(ret, basicWords);

  function replaceWord(node) {
    if (node === null) {
      return;
    }
    node.childNodes.forEach((item) => {
      if (item instanceof Text) {
        const sentences = item.textContent;
        if (sentences) {
          const wordList = Array.from(
            new Set(sentences.split(" ").filter((word) => !!word))
          );

          wordList.forEach((word) => {
            if (words.includes(word.toLowerCase())) {
              const target = wordBook.find((item) => item.word === word);
              if (target && target.trans) {
                item.textContent = item.textContent.replace(
                  word,
                  `${word}(${target.trans})`
                );
              }
            }
          });
        }
      } else if (item instanceof Node) {
        replaceWord(item);
      }
    });
  }

  for (const item of document.body.children) {
    if (
      ["SCRIPT", "SVG", "IFRAME", "STYLE"].includes(item.tagName) ||
      item.tagName.includes("-")
    ) {
      continue;
    }
    replaceWord(item);
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === "translate") {
    translatePage();
  }
  sendResponse("我收到了你的消息！");
});
