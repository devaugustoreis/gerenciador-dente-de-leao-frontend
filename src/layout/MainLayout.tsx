import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css"
import Menu from "./menu/Menu";
import TopBar from "./topbar/Topbar";
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
    return (
        <main className={styles.page}>
            <div><Toaster/></div>
            <Menu />

            <div className={styles.contentContainer}>
                <TopBar />

                <section className={styles.sectionContainer}>
                    <div style={{ position: "relative", height: "100%" }}>
                        <Outlet />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default MainLayout