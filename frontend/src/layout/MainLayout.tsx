import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            Dentro do sistema. Aqui vai ter a estrutura geral, com a sidebar e a topbar.
            <Outlet />
        </div>
    )
}

export default MainLayout;