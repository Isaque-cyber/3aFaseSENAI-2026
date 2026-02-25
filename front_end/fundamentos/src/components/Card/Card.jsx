import styles from "./Card.module.css"

const Card = ({nome, idade, cidade}) => {
    return (
        <div className={styles.Card}>
            <h3>Nome: {nome}</h3>
            <p>idade: {idade}</p>
            <p>cidade: {cidade}</p>
        </div>

    )
}

export default Card