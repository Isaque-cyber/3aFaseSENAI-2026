







function assarbolo(ms) {
    return new Promise(
        (resolve, reject) => {
            if (ms < 2000 || ms < 6000){
                resolve(`O bolo assou por ${ms}ms e está cru ou queimou`)
            }else{
                reject(`O bolo assou por ${ms}ms e está pronto`)
            }
    })
}  
assarbolo(3000)
    .then ((Resultado) => console.log(resultado))
    .catch((erro) => console.error(erro))
    .finally(() => console.log('O bolo está pronto'));








// Criar uma funcao que retorna uma promisse, e a ideia é simular o preparo do bolo
// Receber tempo de assamento
// Lógica que trata, se o tempo que foi passado é suficente pro bolo assar ou não
// Se sim, retorna a função do resolve -> informando que o bolo assou com sucesso
// Se não, retorna reject com bolo queimado ou cru
// finally, criatividade de voces.


// Criar uma função que recebe um número aleatório, gerem o numero aleatorio
// quando chamar a funcao(usem metodos js)
// se o numero for maior que 5, retorna resolve, se não retorna reject
// usem o finally livremente.