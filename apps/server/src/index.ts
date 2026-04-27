import { cors } from "@elysiajs/cors";
import { env } from "@itcamp-allcamp/env/server";
import { Elysia, t } from "elysia";
import { db, schema } from "@itcamp-allcamp/db";

const DEFAULT_ADMIN = {
  ownValue: 25,
  otherValue: -10,
  spinPrice: 5,
  secretRoomPrice: 15,
  ticketStock: 5,
};

const DEFAULT_WEIGHTS = {
  1: 12, 2: 10, 3: 15, 4: 8, 5: 5, 6: 7, 7: 3, 8: 20, 9: 10, 10: 10,
};

const DEFAULT_SCORE = {
  re: { re: 10, drop: 1, pro: 1, tire: 1 },
  drop: { re: 2, drop: 15, pro: 4, tire: 1 },
  pro: { re: 3, drop: 2, pro: 8, tire: 0 },
  tire: { re: 0, drop: 0, pro: 0, tire: 0 },
};

async function syncToDb(type: "admin" | "score", payload: any) {
  if (type === "admin") {
    for (const [key, value] of Object.entries(payload)) {
      if (key === "itemWeights") {
        for (const [id, weight] of Object.entries(value as any)) {
          await db.insert(schema.gachaItems)
            .values({ id: Number(id), name: `Item ${id}`, weight: Number(weight) })
            .onConflictDoUpdate({ target: schema.gachaItems.id, set: { weight: Number(weight) } });
        }
      } else {
        await db.insert(schema.gameSettings)
          .values({ key, value: Number(value) })
          .onConflictDoUpdate({ target: schema.gameSettings.key, set: { value: Number(value) } });
      }
    }
  } else {
    for (const [house, ores] of Object.entries(payload)) {
      const o = ores as any;
      await db.insert(schema.houseInventories)
        .values({
          houseKey: house,
          reOres: o.re,
          dropOres: o.drop,
          proOres: o.pro,
          tireOres: o.tire
        })
        .onConflictDoUpdate({
          target: schema.houseInventories.houseKey,
          set: {
            reOres: o.re,
            dropOres: o.drop,
            proOres: o.pro,
            tireOres: o.tire
          }
        });
    }
  }
}

async function loadAppState() {
  const settings = await db.select().from(schema.gameSettings);
  const items = await db.select().from(schema.gachaItems);
  const inventories = await db.select().from(schema.houseInventories);

  if (settings.length === 0) {
    console.log("Seeding default settings...");
    await syncToDb("admin", { ...DEFAULT_ADMIN, itemWeights: DEFAULT_WEIGHTS });
    await syncToDb("score", DEFAULT_SCORE);
    return {
      admin: { ...DEFAULT_ADMIN, itemWeights: DEFAULT_WEIGHTS },
      score: DEFAULT_SCORE
    };
  }

  const admin: any = {};
  settings.forEach(s => admin[s.key] = s.value);
  admin.itemWeights = {};
  items.forEach(i => admin.itemWeights[i.id] = i.weight);

  const score: any = {};
  inventories.forEach(inv => {
    score[inv.houseKey] = {
      re: inv.reOres,
      drop: inv.dropOres,
      pro: inv.proOres,
      tire: inv.tireOres
    };
  });

  return { admin, score };
}

let appState = await loadAppState();

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
    async message(ws, message) {
      if (message.type === "UPDATE_ADMIN") {
        await syncToDb("admin", message.payload);
        appState = await loadAppState();
        const updateMsg = { type: "STATE_UPDATE", payload: appState };
        ws.publish("broadcast", updateMsg);
        ws.send(updateMsg);
      } else if (message.type === "UPDATE_SCORE") {
        await syncToDb("score", message.payload);
        appState = await loadAppState();
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
