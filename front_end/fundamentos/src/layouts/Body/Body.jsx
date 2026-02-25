import Card from "../../components/Card/Card"
import styles from "./Body.module.css"

const Body = () => {

  //Array com nomes diferentes
  const usuarios = [
    { nome: "Ana", idade: 22, cidade: "Pernambuco" },
    { nome: "Emilie", idade: 18, cidade: "Florianópolis" },
    { nome: "Aghata", idade: 34, cidade: "Curitiba" },]
  return (
    <>
      <main className={styles.body}>
        <h2>Usuários Cadastrados</h2>
        <div className={styles.cardContainer}>
          {usuarios.map((usuario, index) => (
            <Card
            key={index}
            nome = { usuario.nome }
            idade = { usuario.idade }
            cidade = { usuario.cidade }
            />
        ))} </div>
      </main>

      <h1>oi</h1>
      <Card />
    </>
  )
}

export default Body