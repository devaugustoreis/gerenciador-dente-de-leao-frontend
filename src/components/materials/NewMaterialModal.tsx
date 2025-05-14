import styles from './NewMaterialModal.module.css'
import ModalOverlay from '../shared/ModalOverlay'
import InputLabel from '../shared/InputLabel'
import CustomButton from '../shared/CustomButton'


interface NewMaterialModalProps {
    onClose: () => void
}


const NewMaterialModal = ({ onClose }: NewMaterialModalProps) => {
    const imageSrc = new URL(`../../assets/images/material-placeholder.png`, import.meta.url).href;

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Novo Material</div>

                <div className={styles.modalContent}>
                    <InputLabel label="Material" />
                    <InputLabel label="Total de Unidades" inputType="number" />
                    <div className={styles.imgContainer}>
                        <img src={imageSrc} alt={`Imagem de placeholder`} className={styles.materialImage} />
                        <div>
                            <button className={styles.selectImgBtn}>Selecionar Imagem</button>
                            <p className={styles.imgDetails}>
                                Tamanho máximo: 1mb <br />Dimensão máxima: 500x500px
                            </p>
                        </div>
                    </div>
                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-blue" />
                        <CustomButton label="Cadastrar" actionColor="blue" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewMaterialModal