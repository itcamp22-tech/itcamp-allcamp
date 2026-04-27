import { cors } from "@elysiajs/cors";
import { env } from "@itcamp-allcamp/env/server";
import { Elysia, t } from "elysia";

const defaultAdminState = {
  ownValue: 25,
  otherValue: -10,
  spinPrice: 5,
  secretRoomPrice: 15,
  ticketStock: 5,
  itemWeights: {
    1: 12, 2: 10, 3: 15, 4: 8, 5: 5, 6: 7, 7: 3, 8: 20, 9: 10, 10: 10,
  }
};

const defaultScoreState = {
  re: { re: 10, drop: 1, pro: 1, tire: 1 },
  drop: { re: 2, drop: 15, pro: 4, tire: 1 },
  pro: { re: 3, drop: 2, pro: 8, tire: 0 },
  tire: { re: 0, drop: 0, pro: 0, tire: 0 },
};

let appState = {
  admin: defaultAdminState,
  score: defaultScoreState,
};

export const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .ws("/ws", {
    body: t.Object({
      type: t.String(),
      payload: t.Any(),
    }),
    open(ws) {
      ws.subscribe("broadcast");
      ws.send({ type: "INIT", payload: appState });
    },
    message(ws, message) {
      if (message.type === "UPDATE_ADMIN") {
        appState.admin = { ...appState.admin, ...message.payload };
        const updateMsg = { type: "STATE_UPDATE", payload: appState };
        ws.publish("broadcast", updateMsg);
        ws.send(updateMsg);
      } else if (message.type === "UPDATE_SCORE") {
        appState.score = { ...appState.score, ...message.payload };
        const updateMsg = { type: "STATE_UPDATE", payload: appState };
        ws.publish("broadcast", updateMsg);
        ws.send(updateMsg);
      }
    },
  })
  .get("/", () => "OK")
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
