import React, { useEffect, useState } from "react";
import useApp from "../../../store/useApp";
import ChatEntry from "./chat-entry";
import "./chat.css";

let msgCount = 0;

type EntryType = { id: string; username: string; text: string; color: string };

export default function chat() {
  const {
    state,
    data: { ablyRealtime },
    updateData,
  } = useApp();
  const [entries, setEntries] = useState<EntryType[]>([]);

  useEffect(() => {
    if (!ablyRealtime) return;

    (async () => {
      const channel = ablyRealtime.channels.get("chat");

      await channel.subscribe((msg: { data: EntryType }) => {
        msg.data.color = msgCount % 2 ? "#32a852" : "#7f32a8";
        setEntries((current) => [...current, msg.data]);
        ++msgCount;

        let newMsg = {};
        newMsg[`${msg.data.id}`] = msg.data.text;
        state.messages = { ...state.messages, ...newMsg };
        updateData({ messages: state.messages });
      });

      const editable = window.document.querySelector(".input-entry")!;

      const onKeyDown = async (event: Event) => {
        event.stopPropagation();
        const key = (event as KeyboardEvent).key;
        if (key === "Enter") {
          let text = editable.textContent;

          const { avatarID, avatarName } = state;
          await channel.publish("update", {
            id: avatarID,
            username: avatarName,
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
  }, [ablyRealtime, state, updateData]);

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
