import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoutes"
import { AppDataProvider } from '@/store/AppDataContext'
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Agenda from "@/pages/Agenda"
import AppointmentFinalization from "@/pages/AppointmentFinalization"
import Materials from "@/pages/Materials"
import MaterialSets from "@/pages/MaterialSets"
import MainLayout from "@/layout/MainLayout"

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/esqueci-minha-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppDataProvider><MainLayout /></AppDataProvider>}>
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

export default AppRoutes
