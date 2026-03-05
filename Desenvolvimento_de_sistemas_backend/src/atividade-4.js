function reverterString(string){
    const  pilha = []
    for (letra of string) pilha.push (letra) 

        let  output =''
        while(pilha.length)output += pilha.pop()
            return output
}

console.log(reverterString('Alex'))