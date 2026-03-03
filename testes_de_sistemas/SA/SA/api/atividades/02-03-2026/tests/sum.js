export function sum(a, b) {
    if (b === 'b') {
       throw new Error("Os valores precisam ser numericos")
    }
    return a+b
}