import styles from './MaterialModal.module.css'
import ModalOverlay from '../shared/ModalOverlay'
import InputLabel from '../shared/InputLabel'
import CustomButton from '../shared/CustomButton'
import { MaterialItem as MaterialItemModel } from "../../models/material-item.model"
import { useState } from 'react'


interface editMaterialModalProps {
    material: MaterialItemModel
    onClose: () => void
}


const EditMaterialModal = ({ material, onClose }: editMaterialModalProps) => {
    const [ materialName, setMaterialName ] = useState(material.name)
    const [ materialQuantity, setmaterialQuantity ] = useState(material.stockQuantity)

    const imageSrc = new URL(`../../assets/images/material-placeholder.png`, import.meta.url).href;

    const handleInputChange = (field: string, e: any) => {
        if (field === "name") {
            setMaterialName(e.target.value)
        } else if (field === "quantity") {
            const value = parseInt(e.target.value) || 0
            setmaterialQuantity(value)
        }
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Editar Material</div>

                <div className={styles.modalContent}>
                    <InputLabel 
                        label="Material" 
                        color="green" 
                        inputValue={materialName} 
                        onChange={ () => handleInputChange("name", event) } 
                    />
                    <InputLabel 
                        label="Total de Unidades" 
                        color="green" 
                        inputType="number" 
                        inputValue={materialQuantity} 
                        onChange={ () => handleInputChange("quantity", event) } 
                    />

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
                        <CustomButton label="Cancelar" actionColor="outline-green" />
                        <CustomButton label="Salvar Alterações" actionColor="green" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditMaterialModal