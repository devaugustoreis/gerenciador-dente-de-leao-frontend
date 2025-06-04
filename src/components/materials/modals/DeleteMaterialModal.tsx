import styles from './DeleteMaterialModal.module.css'
import ModalOverlay from '@/components/shared/ModalOverlay'
import CustomButton from '@/components/shared/CustomButton'
import MaterialItemModel from "@/models/materials/material-item.model"
import closeIcon from "@/assets/icons/close.svg"
import { deleteMaterial } from '@/services/materialService'


interface DeleteMaterialModalProps {
    material: MaterialItemModel
    onDelete: () => void
    onClose: () => void
}


const DeleteMaterialModal = ({ material, onDelete, onClose }: DeleteMaterialModalProps) => {
    const handleDeleteMaterial = async () => {
        try {
            await deleteMaterial(material.id);
            onDelete()

        } catch (error) {
            console.error("Erro ao excluir material:", error);
        }
    };

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Excluir Material</div>
                
                <div className={styles.modalContent}>
                    <div className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={closeIcon} alt="Botão fechar" />
                    </div>

                    <h1 className={styles.modalMessage}>Você realmente deseja excluir <b>{ material.name }</b>?</h1>
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