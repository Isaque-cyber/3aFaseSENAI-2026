export const createUser = (userData) =>{
    if(!userData || !userData.name){
        throw new Error("O nome do ususario é obrigatorio")
    }if(userData.age < 18){
        throw new Error("O usuario deve ser maior de idade")
    }

    const newUser = {
        id: Math.floor(Math.randoom(1, 18)),
        name: userData.name,
        age: userData.age,
        isActive: true, 
        roles: ['user'] 
    }
}