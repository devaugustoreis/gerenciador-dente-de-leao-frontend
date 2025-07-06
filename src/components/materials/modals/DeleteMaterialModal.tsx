import toast from "react-hot-toast"
import styles from "@/components/materials/modals/DeleteMaterialModal.module.css"
import ModalOverlay from "@/components/shared/ModalOverlay"
import CustomButton from "@/components/shared/CustomButton"
import MaterialItemModel from "@/models/materials/material-item.model"
import closeIcon from "@/assets/icons/close.svg"
import { deleteMaterial } from "@/services/materialService"
import { useAppData } from "@/store/AppDataContext"

interface DeleteMaterialModalProps {
    material: MaterialItemModel
    onClose: () => void
}

const DeleteMaterialModal = ({ material, onClose }: DeleteMaterialModalProps) => {
    const { materials, setMaterials } = useAppData()

    const handleDeleteMaterial = async () => {
        try {
            await toast.promise(
                deleteMaterial(material.id),
                {
                    loading: "Excluindo material...",
                    success: "O material foi excluído com sucesso!",
                    error: "Ocorreu um erro ao excluir o material!"
                }
            )

            const updatedMaterials = materials.filter(mat => mat.id !== material.id)
            setMaterials(updatedMaterials)
            onClose()

        } catch (error) {
            console.error("Erro ao excluir material:", error)
        }
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Excluir Material</div>

                <div className={styles.modalContent}>
                    <div className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={closeIcon} alt="Botão fechar" />
                    </div>

                    <h1 className={styles.modalMessage}>Você realmente deseja excluir <b>{material.name}</b>?</h1>
                    <p className={styles.modalSubMessage}>Atenção! Esta ação é irreversível!</p>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-red" onClick={onClose} />
                        <CustomButton label="Confirmar" actionColor="red" onClick={handleDeleteMaterial} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteMaterialModal
