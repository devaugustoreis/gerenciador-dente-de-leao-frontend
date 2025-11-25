import { JSX } from "react"
import toast from "react-hot-toast"
import { useAppData } from "@/store/AppDataContext"
import excludeIcon from "@/assets/icons/excludeIcon.svg"
import { deleteMaterial } from "@/services/materialService"
import { deleteMaterialSet } from "@/services/materialSetService"
import { deleteAppointment } from "@/services/appointmentService"
import styles from "@/components/shared/DeleteModal.module.css"
import ModalOverlay from "@/components/shared/ModalOverlay"
import CustomButton from "@/components/shared/CustomButton"
import MaterialItem from "@/models/materials/material-item.model"
import MaterialSet from "@/models/material-sets/material-set.model"
import Appointment from "@/models/appointments/appointment.model"

interface DeleteModalProps {
    element: MaterialItem | MaterialSet | Appointment
    onClose: () => void
}

const DeleteModal = ({ element, onClose }: DeleteModalProps) => {
    let modalHeader: string = ""
    let renderMessage: () => JSX.Element = () => <>Você realmente deseja excluir?</>;
    let handleDelete: () => void = () => null


    // Deleting Material
    if (element instanceof MaterialItem) {
        const { materials, setMaterials } = useAppData()

        modalHeader = "Excluir Material"
        renderMessage = () => <>Você realmente deseja excluir <b>{element.name}</b>?</>

        handleDelete = async () => {
            try {
                await toast.promise(
                    deleteMaterial(element.id),
                    {
                        loading: "Excluindo material...",
                        success: "O material foi excluído com sucesso!",
                        error: "Ocorreu um erro ao excluir o material!"
                    }
                )

                const updatedMaterials = materials.content.filter(mat => mat.id !== element.id)
                setMaterials({ content: updatedMaterials, totalPages: materials.totalPages})
                onClose()

            } catch (error) {
                console.error("Erro ao excluir material:", error)
            }
        }

    // Deleting Material Set
    } else if (element instanceof MaterialSet) {
        const { materialSets, setMaterialSets } = useAppData()

        modalHeader = "Excluir Conjunto"
        renderMessage = () => <>Você realmente deseja excluir <b>{element.label}</b>?</>

        handleDelete = async () => {
            try {
                await toast.promise(
                    deleteMaterialSet(element.id),
                    {
                        loading: "Excluindo conjunto...",
                        success: "O conjunto foi excluído com sucesso!",
                        error: "Ocorreu um erro ao excluir o conjunto!"
                    }
                )
                const updatedMaterialSets = materialSets.content.filter(matSet => matSet.id !== element.id)
                setMaterialSets({ content: updatedMaterialSets, totalPages: materialSets.totalPages })
                onClose()

            } catch (error) {
                console.error("Erro ao excluir conjunto:", error)
            }
        }

    // Deleting Appointment
    } else if (element instanceof Appointment) {
        const { appointments, setAppointments } = useAppData()

        modalHeader = "Excluir Consulta"
        renderMessage = () => <>Você realmente deseja excluir a consulta de <b>{element.patientName} às {getAppointmentHour(element.startDate)}</b>?</>

        handleDelete = async () => {
            try {
                await toast.promise(
                    deleteAppointment(element.id),
                    {
                        loading: "Excluindo consulta...",
                        success: "A consulta foi excluída com sucesso!",
                        error: "Ocorreu um erro ao excluir a consulta!"
                    }
                )
                const updatedAppointments = appointments.filter(appointment => appointment.id !== element.id)
                setAppointments(updatedAppointments)
                onClose()

            } catch (error) {
                console.error("Erro ao excluir consulta:", error)
            }
        }
    }

    function getAppointmentHour(startDate: Date) {
        const hours = String(startDate.getHours()).padStart(2, '0');
        const minutes = String(startDate.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>{ modalHeader }</div>

                <div className={styles.modalContent}>
                    <div className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={excludeIcon} alt="Ícone de exclusão" />
                    </div>

                    <h1 className={styles.modalMessage}>{renderMessage()}</h1>
                    <p className={styles.modalSubMessage}>Atenção! Esta ação é irreversível!</p>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-red" onClick={onClose} />
                        <CustomButton label="Confirmar" actionColor="red" onClick={handleDelete} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteModal
