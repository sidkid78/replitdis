import { serial, text } from "drizzle-orm/mysql-core";
import { integer, pgTable } from "drizzle-orm/pg-core";

// lib/db/src/schema/usage.ts
export const usageLog = pgTable("usage_log", {
    _id: serial("id").primaryKey(),
    get id() {
        return this._id;
    },
    set id(value) {
        this._id = value;
    },
  date: text("date").notNull(), // "2026-04-05"
  requestCount: integer("request_count").default(0).notNull(),
});