import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const gameSettings = sqliteTable("game_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").unique().notNull(),
  value: integer("value").notNull(),
});

export const gachaItems = sqliteTable("gacha_items", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  weight: integer("weight").notNull(),
});

export const houseInventories = sqliteTable("house_inventories", {
  houseKey: text("house_key").primaryKey(), // 're', 'drop', 'pro', 'tire'
  reOres: integer("re_ores").notNull().default(0),
  dropOres: integer("drop_ores").notNull().default(0),
  proOres: integer("pro_ores").notNull().default(0),
  tireOres: integer("tire_ores").notNull().default(0),
});
