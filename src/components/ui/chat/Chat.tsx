import React, { useEffect, useState } from "react";
import ChatEntry from "./chat-entry";
import "./chat.css";

export default function chat() {
  const [entries, setEntries] = useState([
    {
      username: "Santiago",
      text: `  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere
  distinctio adipisci labore voluptatem suscipit fugiat reprehenderit
 `,
      color: "#32a852",
    },
    {
      username: "Joel",
      text: `  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere
    distinctio adipisci labore voluptatem suscipit fugiat reprehenderit
    `,
      color: "#7f32a8",
    },
  ]);

  useEffect(() => {
    const editable = window.document.querySelector(".input-entry")!;
    editable.addEventListener("keypress", function (event: Event) {
      const key = (event as KeyboardEvent).key;
      if (key === "Enter") {
        let text = editable.textContent;
        setEntries((current) => [
          ...current,
          { username: "Santiago", text: text!, color: "#32a852" },
        ]);
        editable.textContent = "";
      }
    });
  }, []);

  return (
    <div className="chat-main-wrapper">
      <div className="chat-div">
        {entries.map((entry, idx) => (
          <ChatEntry
            key={idx}
            username={entry.username}
            text={entry.text}
            color={entry.color}
          />
        ))}
      </div>
      <div className="input-entry" contentEditable="true"></div>
    </div>
  );
}
