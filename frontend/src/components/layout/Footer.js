import styles from './Footer.module.css'

function Footer(){
    return(
        <footer className={styles.footer}>
            <p>
                <span className="bold">Get A Pet &copy;2023</span>
            </p>
        </footer>
    )
}

export default Footer