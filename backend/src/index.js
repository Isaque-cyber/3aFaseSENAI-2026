import {buscarLivroPorId} from "./bibliotecaService.js";
import {pool} from "./config.js"

async function main() {
    console.log(await buscarLivroPorId(1))
}

main().catch(error=>
    console.error(error)
).finally(async()=>{
    await pool.end();
})

