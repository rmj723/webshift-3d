import React, { useEffect, useState } from "react";
import useApp from "../../../store/useApp";
import ChatEntry from "./chat-entry";
import "./chat.css";

let msgCount = 0;

type EntryType = { username: string; text: string; color: string };

export default function chat() {
  const {
    data: { ablyRealtime, name },
  } = useApp();
  const [entries, setEntries] = useState<EntryType[]>([]);

  useEffect(() => {
    if (!ablyRealtime) return;

    (async () => {
      const channel = ablyRealtime.channels.get("chat");
      await channel.subscribe((msg) => {
        msg.data.color = msgCount % 2 ? "#32a852" : "#7f32a8";
        setEntries((current) => [...current, msg.data]);
        ++msgCount;
      });

      const editable = window.document.querySelector(".input-entry")!;

      const onKeyDown = async (event: Event) => {
        event.stopPropagation();
        const key = (event as KeyboardEvent).key;
        if (key === "Enter") {
          let text = editable.textContent;

          await channel.publish("update", {
            username: name,
            text: text!,
            color: "#32a852",
          });
          editable.textContent = "";
        }
      };

      editable.addEventListener("keydown", onKeyDown);

      return () => {
        editable.removeEventListener("keypress", onKeyDown);
      };
    })();
  }, [ablyRealtime, name]);

  return (
    <div className="chat-main-wrapper">
      <div className="chat-div">
        <div>Chat Here</div>
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
