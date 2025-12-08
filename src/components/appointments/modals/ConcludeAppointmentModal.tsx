import toast from "react-hot-toast"
import concludeAppointmentIcon from "@/assets/icons/concludeAppointmentIcon.svg"
import { useAppData } from "@/store/AppDataContext"
import { PageableQueryParams } from "@/services/api"
import { concludeAppointment } from "@/services/appointmentService"
import Appointment from "@/models/appointments/appointment.model"
import styles from "@/components/appointments/modals/ConcludeAppointmentModal.module.css"
import ModalOverlay from "@/components/shared/modals/ModalOverlay"
import CustomButton from "@/components/shared/forms/CustomButton"

interface ConcludeAppointmentModalProps {
    appointmentToConclude: Appointment
    pagination: PageableQueryParams
    onClose: () => void
}

const ConcludeAppointmentModal = ({ appointmentToConclude, pagination, onClose }: ConcludeAppointmentModalProps) => {
    const { refreshAppointmentsToConclude } = useAppData()

    const handleConclude = async () => {
        try {
            await toast.promise(concludeAppointment(appointmentToConclude.id), {
                loading: "Finalizando consulta...",
                success: "A consulta foi finalizada com sucesso!",
                error: "Erro ao finalizar consulta!",
            })

            onClose()
            const queryParams = { ...pagination, page: pagination.page - 1 }
            refreshAppointmentsToConclude(queryParams)

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

                    <h1 className={styles.modalMessage}>Você realmente deseja finalizar a consulta de <b>{appointmentToConclude.patientName}</b>?</h1>
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
