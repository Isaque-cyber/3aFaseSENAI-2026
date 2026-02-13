import { produtos_quimicos_Id, datas_produtos_quimicos_id,buscar_produtos_quimicos } from "./smartcimed.js";
import { pool } from "./config.js";

async function main() {
    console.log(await produtos_quimicos_Id(1))

    const dataInicial = "2026-01-01 00:00:00";
    const dataFinal = "2026-12-31 23:59:59";


    console.log(await datas_produtos_quimicos_id(dataInicial, dataFinal))

    console.log(await buscar_produtos_quimicos ())
}

main().catch(error =>
    console.error(error)
).finally(async () => {
    await pool.end();
})

