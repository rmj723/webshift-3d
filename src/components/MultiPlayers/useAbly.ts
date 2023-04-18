import React from "react";
import * as Ably from "ably";
import useApp from "../../store/useApp";

export const useAbly = () => {
  const { updateData } = useApp();

  React.useEffect(() => {
    (async () => {
      const apiKey =
        "ybyXHg.mHyTug:bycaIuavWh9GhIL9Q26dosOkpPNN7id5WmPlW1Kvb34";
      const realtime = new Ably.Realtime.Promise(apiKey);
      await realtime.connection.once("connected");
      console.log("Connected to Ably!");
      updateData({ ablyRealtime: realtime });
    })();
  }, []);
};
