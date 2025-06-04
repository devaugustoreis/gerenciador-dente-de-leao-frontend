import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css"
import Menu from "./menu/Menu";
import TopBar from "./topbar/Topbar";

const MainLayout = () => {
    return (
        <main className={styles.page}>
            <Menu />

            <div className={styles.contentContainer}>
                <TopBar />

                <section className={styles.sectionContainer}>
                    <Outlet />
                </section>
            </div>
        </main>
    )
}

export default MainLayout