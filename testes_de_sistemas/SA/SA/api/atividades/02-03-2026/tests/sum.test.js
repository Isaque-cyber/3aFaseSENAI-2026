import { nome } from "./nome"
import { sum } from "./sum"

test('Soma de 2+2 valores', () => {
    expect(2 + 2).toBe(4)
})

const obj1 = {
    nome: 'teste',
    idade: 12
}

const obj2 = {
    nome: 'teste',
    idade: 12
}


test('Dois objetos iguais', () => {
    expect(obj1).toEqual(obj2)
})

// test('testando a função soma externa', () => {
//     expect(() => sum(2,'a')).toThrow('Os valores precisam ser numericos')
// })

test('testando a função de nomes', () => {
    expect(() => nome('Senai')).toThrow('Nome inválido')
})

// test('testando a função de nomes', () => {
//     try {
//         expect(() => nome('senai'))
//     } catch (error) {
//         error.message()
//     }
// })