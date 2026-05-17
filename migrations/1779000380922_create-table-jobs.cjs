exports.up = (pgm) => {
  pgm.createTable("jobs", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    company_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"companies"',
      onDelete: "CASCADE",
    },
    category_id: {
      type: "VARCHAR(50)",
      references: '"categories"',
      onDelete: "SET NULL",
    },
    title: { type: "VARCHAR(200)", notNull: true },
    description: { type: "TEXT" },
    location: { type: "VARCHAR(100)" },
    salary_min: { type: "INTEGER" },
    salary_max: { type: "INTEGER" },
    job_type: { type: "VARCHAR(50)" },
    created_at: { type: "TIMESTAMP", default: pgm.func("current_timestamp") },
    updated_at: { type: "TIMESTAMP", default: pgm.func("current_timestamp") },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("jobs");
};
