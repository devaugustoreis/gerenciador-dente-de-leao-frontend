import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoutes";
import Login from "../pages/Login";
import Agenda from "../pages/Agenda";
import AppointmentFinalization from "../pages/AppointmentFinalization";
import Materials from "../pages/Materials";
import MaterialSets from "../pages/MaterialSets";
import MainLayout from "../layout/MainLayout";

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/finalizar-consulta" element={<AppointmentFinalization />} />
                    <Route path="/materiais" element={<Materials />} />
                    <Route path="/conjuntos" element={<MaterialSets />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
)

export default AppRoutes;