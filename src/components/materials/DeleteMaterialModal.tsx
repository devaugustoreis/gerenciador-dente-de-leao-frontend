import styles from './DeleteMaterialModal.module.css'
import ModalOverlay from '../shared/ModalOverlay'
import CustomButton from '../shared/CustomButton'
import { MaterialItem as MaterialItemModel } from "../../models/material-item.model"
import closeIcon from "../../assets/icons/close.svg"


interface deleteMaterialModalProps {
    material: MaterialItemModel
    onClose: () => void
}


const DeleteMaterialModal = ({ material, onClose }: deleteMaterialModalProps) => {
    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Excluir Material</div>
                
                <div className={styles.modalContent}>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        <img src={closeIcon} alt="Botão fechar" />
                    </button>

                    <h1 className={styles.modalMessage}>Você realmente deseja excluir <b>{ material.name }</b>?</h1>
                    <p className={styles.modalSubMessage}>Atenção! Esta ação é irreversível!</p>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-red" />
                        <CustomButton label="Confirmar" actionColor="red" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteMaterialModal