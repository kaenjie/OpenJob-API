exports.up = (pgm) => {
  pgm.createTable("companies", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    name: { type: "VARCHAR(100)", notNull: true },
    description: { type: "TEXT" },
    location: { type: "VARCHAR(100)" },
    website: { type: "VARCHAR(200)" },
    created_at: { type: "TIMESTAMP", default: pgm.func("current_timestamp") },
    updated_at: { type: "TIMESTAMP", default: pgm.func("current_timestamp") },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("companies");
};
