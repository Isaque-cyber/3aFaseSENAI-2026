import { pool } from "./config.js"
export async function produtos_quimicos_Id(produtosId) {
    const [rows] = await pool.query("SELECT * from produtos_quimicos WHERE id=?",
        [produtosId]
    )
    return rows[0]
}

export async function datas_produtos_quimicos_id(dataInicial, dataFinal) {
    const [rows] = await pool.query(`SELECT p.id AS produtos_quimicos_id, 
        p.marca AS produtos, 
        p.valor_unitario, 
        m.quantidade_total_saida 
        FROM produtos_quimicos p 
        LEFT JOIN 
        ( SELECT produtos_quimicos_id, SUM(quantidade) AS quantidade_total_saida 
         FROM movimentacoes 
         WHERE tipo = 'SAIDA' 
         AND data_movimentacao 
         BETWEEN ? AND ? 
         GROUP BY produtos_quimicos_id ) m ON m.produtos_quimicos_id = p.id 
         ORDER BY m.quantidade_total_saida DESC`,
        [dataInicial, dataFinal]);
    return rows.map((item) => {
        const quantidade = item.quantidade_total_saida; 
        const valorUnitario = item.valor_unitario;
        return { 
            produtos: item.produtos, 
            quantidade_total_saida: quantidade, 
            valor_total_financeiro_saidas: quantidade * valorUnitario 
        };
    }); 
} 

export async function buscar_produtos_quimicos(listaTotal) {
    const [rows] = await pool.query("SELECT * FROM vw_produtos_quimicos ",
        [listaTotal]
    )
    return rows
}