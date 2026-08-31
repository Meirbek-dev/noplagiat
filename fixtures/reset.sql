-- Drops and recreates the `public` schema so `sqlx migrate run` can re-apply every migration from scratch (`vp run db:reset`).
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
