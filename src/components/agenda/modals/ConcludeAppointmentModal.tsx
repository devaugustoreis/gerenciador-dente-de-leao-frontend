import toast from "react-hot-toast"
import concludeAppointmentIcon from "@/assets/icons/concludeAppointmentIcon.svg"
import styles from "@/components/agenda/modals/ConcludeAppointmentModal.module.css"
import ModalOverlay from "@/components/shared/ModalOverlay"
import CustomButton from "@/components/shared/CustomButton"
import Appointment from "@/models/appointments/appointment.model"
import { concludeAppointment } from "@/services/appointmentService"
import { useAppData } from "@/store/AppDataContext"

interface ConcludeAppointmentModalProps {
    element: Appointment
    onClose: () => void
}

const ConcludeAppointmentModal = ({ element, onClose }: ConcludeAppointmentModalProps) => {
    const { appointments, setAppointments } = useAppData()

    const handleConclude = async () => {
        try {
            await toast.promise(concludeAppointment(element.consultationId), {
                loading: "Finalizando consulta...",
                success: "A consulta foi finalizada com sucesso!",
                error: "Erro ao finalizar consulta!",
            })

            element.concluded = true
            const updatedAppointments = appointments.map(appointment => (appointment.consultationId === element.consultationId ? element : appointment))
            setAppointments(updatedAppointments)
            onClose()

        } catch (error) {
            console.error("Erro ao finalizar consulta:", error)
        }
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Finalizar Consulta</div>

                <div className={styles.modalContent}>
                    <div className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={concludeAppointmentIcon} alt="Ícone Finalização de Consulta" />
                    </div>

                    <h1 className={styles.modalMessage}>Você realmente deseja finalizar a consulta de <b>{element.patientName}</b>?</h1>
                    <p className={styles.modalSubMessage}>Atenção! Uma vez finalizada, esta consulta não poderá mais ser editada e os materiais consumidos serão contabilizados!</p>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-green" onClick={onClose} />
                        <CustomButton label="Confirmar" actionColor="green" onClick={handleConclude} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConcludeAppointmentModal
