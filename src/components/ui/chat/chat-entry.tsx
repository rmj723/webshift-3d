import React from "react";

interface chatEntryProps {
  username: string;
  text: string;
  color: string;
}

export default function ChatEntry({ username, text, color }: chatEntryProps) {
  return (
    <p>
      <a className="entry-username" style={{ color: color }}>
        {username}:{" "}
      </a>
      <a className="entry-text">{text}</a>
    </p>
  );
}
