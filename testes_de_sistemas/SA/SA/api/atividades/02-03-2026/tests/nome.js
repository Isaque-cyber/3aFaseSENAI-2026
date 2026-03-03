export function nome(a) {
    if (a === 'Senai') {
        return 'Nome Correto'
    } else {
        throw new Error('Nome inválido')
    }
}