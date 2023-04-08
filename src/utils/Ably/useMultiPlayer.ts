import * as Ably from "ably";

export const useMultiPlayer = async () => {
  console.log(3);
  const apiKey = "ybyXHg.mHyTug:bycaIuavWh9GhIL9Q26dosOkpPNN7id5WmPlW1Kvb34";
  const realtime = new Ably.Realtime.Promise(apiKey);

  await realtime.connection.once("connected");
  console.log("Connected to Ably!");

  const channel = realtime.channels.get("sport");

  await channel.subscribe((msg) => {
    console.log("Received: " + JSON.stringify(msg.data));
  });

  await channel.publish("update", { team: "Man United" });
};
