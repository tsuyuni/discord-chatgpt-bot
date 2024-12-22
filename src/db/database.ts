import postgres from "postgres";
import env from "../env.js";

const sql = postgres(env.DATABASE_URL);

export default sql;
