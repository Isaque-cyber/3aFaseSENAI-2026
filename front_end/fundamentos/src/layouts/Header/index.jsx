import styles from "./Header.module.css"

const Header = ({titulo}) => {
  return (
    <header className="nomeDaClasse">
      <h1 className={styles.header}> {titulo} </h1>
      <div>
        <h5>Jesus é bom e o fracassado não presta.</h5>
      </div>

    </header>
     
  )
}

export default Header