import postgres from "postgres";
import env from "../env.js";

const sql = postgres(env.POSTGRES_DATABASE_URL);

export default sql;
