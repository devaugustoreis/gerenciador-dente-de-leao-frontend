import styles from './DeleteMaterialSetModal.module.css'
import ModalOverlay from '@/components/shared/ModalOverlay'
import CustomButton from '@/components/shared/CustomButton'
import MaterialSetModel from '@/models/material-sets/material-set.model'
import closeIcon from "@/assets/icons/close.svg"
import { deleteMaterialSet } from '@/services/materialSetService'


interface DeleteMaterialSetModalProps {
    materialSet: MaterialSetModel
    onDelete: () => void
    onClose: () => void
}


const DeleteMaterialSetModal = ({ materialSet, onDelete, onClose }: DeleteMaterialSetModalProps) => {
    const handleDeleteMaterial = async () => {
        try {
            await deleteMaterialSet(materialSet.id);
            onDelete()

        } catch (error) {
            console.error("Erro ao excluir material:", error);
        }
    };

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Excluir Conjunto</div>
                
                <div className={styles.modalContent}>
                    <div className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={closeIcon} alt="Botão fechar" />
                    </div>

                    <h1 className={styles.modalMessage}>Você realmente deseja excluir <b>{ materialSet.label }</b>?</h1>
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

export default DeleteMaterialSetModal