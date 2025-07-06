import toast from 'react-hot-toast'
import styles from './DeleteMaterialSetModal.module.css'
import { useAppData } from '@/store/AppDataContext'
import ModalOverlay from '@/components/shared/ModalOverlay'
import CustomButton from '@/components/shared/CustomButton'
import MaterialSetModel from '@/models/material-sets/material-set.model'
import closeIcon from "@/assets/icons/close.svg"
import { deleteMaterialSet } from '@/services/materialSetService'


interface DeleteMaterialSetModalProps {
    materialSet: MaterialSetModel
    onClose: () => void
}


const DeleteMaterialSetModal = ({ materialSet, onClose }: DeleteMaterialSetModalProps) => {
    const { materialSets, setMaterialSets } = useAppData()

    const handleDeleteMaterialSet = async () => {
        try {
            await toast.promise(
                deleteMaterialSet(materialSet.id),
                {
                    loading: "Excluindo conjunto...",
                    success: "O conjunto foi excluído com sucesso!",
                    error: "Ocorreu um erro ao excluir o conjunto!"
                }
            )
            const updatedMaterialSets = materialSets.filter(matSet => matSet.id !== materialSet.id)
            setMaterialSets(updatedMaterialSets)
            onClose()

        } catch (error) {
            console.error("Erro ao excluir conjunto:", error)
        }
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Excluir Conjunto</div>

                <div className={styles.modalContent}>
                    <div className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={closeIcon} alt="Botão fechar" />
                    </div>

                    <h1 className={styles.modalMessage}>Você realmente deseja excluir <b>{materialSet.label}</b>?</h1>
                    <p className={styles.modalSubMessage}>Atenção! Esta ação é irreversível!</p>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-red" onClick={onClose} />
                        <CustomButton label="Confirmar" actionColor="red" onClick={handleDeleteMaterialSet} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteMaterialSetModal