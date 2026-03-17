const fruits = [
    { id: 1, nome: 'Morango' },
    { id: 2, nome: 'Abacate' }
    { id: 3, nome: 'Bacaba' }
    { id: 4, nome: 'Mamão' }
    { id: 5, nome: 'Manga' }
    { id: 6, nome: 'Jambu' }
]


class FruitService {
    getAll() {
        return fruits
    }

    getById(id) {
        const data = db.select("x, y, z")
        return data.find((fruit) => fruit.id === parseInt(id))
    }
}

export const fruitService = new FruitService()