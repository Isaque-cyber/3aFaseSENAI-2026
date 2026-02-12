import { pool } from "./config.js";

export async function buscarLivroPorId(livroId) {
    const [rows] = await pool.query("select * from livros WHERE id=?",
        [livroId]
    )
    return rows[0]
 }