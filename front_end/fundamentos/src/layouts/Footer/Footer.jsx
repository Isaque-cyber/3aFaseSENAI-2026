import styles from "./Footer.module.css"

export const Footer = ({nome}) => {
  return (
    <div className={styles.footer}>Desenvolvido por:{nome}</div>


  )
}
