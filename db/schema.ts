import { pgTable, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    shortCode: text('short_code').notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('links_short_code_idx').on(table.shortCode),
    index('links_user_id_idx').on(table.userId),
  ]
);

export type SelectLink = typeof links.$inferSelect;
export type InsertLink = typeof links.$inferInsert;
