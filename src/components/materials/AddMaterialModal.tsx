import styles from './MaterialModal.module.css'
import ModalOverlay from '../shared/ModalOverlay'
import InputLabel from '../shared/InputLabel'
import CustomButton from '../shared/CustomButton'
import { MaterialItem as MaterialItemModel } from "../../models/material-item.model"
import { useState } from 'react'


interface addMaterialModalProps {
    material: MaterialItemModel
    onClose: () => void
}


const AddMaterialModal = ({ material, onClose }: addMaterialModalProps) => {
    const [ quantityToAdd, setQuantityToAdd ] = useState(0)

    const labelText = `Quantas unidades deseja adicionar a ${material.name}?`

    const handleInputChange = (e: any) => {
        const value = parseInt(e.target.value) || 0
        setQuantityToAdd(value)
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>Adicionar Material</div>

                <div className={styles.modalContent}>
                    <InputLabel label={labelText} color="green" inputType="number" inputValue={ quantityToAdd } onChange={ handleInputChange }/>
                    <h1 className={styles.addMaterial}>{ material.stockQuantity } -&gt; <span>{ material.stockQuantity + quantityToAdd }</span></h1>
                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor="outline-green" />
                        <CustomButton label="Cadastrar" actionColor="green" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddMaterialModal