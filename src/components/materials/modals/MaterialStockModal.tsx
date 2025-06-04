import styles from './MaterialModal.module.css'
import ModalOverlay from '@/components/shared/ModalOverlay'
import InputLabel from '@/components/shared/InputLabel'
import CustomButton from '@/components/shared/CustomButton'
import MaterialItemModel from "@/models/materials/material-item.model"
import { useState } from 'react'
import { movementMaterialStock } from '@/services/materialService'
import MovementStock, { MovementType } from '@/models/materials/movement-stock.model'

interface AddMaterialModalProps {
    action: 'add' | 'remove'
    material: MaterialItemModel
    onStockMovement: () => void
    onClose: () => void
}

const MaterialStockModal = ({ action, material, onClose, onStockMovement }: AddMaterialModalProps) => {
    const [ movement, setMovement ] = useState<MovementStock>(
        new MovementStock({
            materialId: material.id,
            movementType: action === 'add' ? MovementType.ADDITION : MovementType.REMOVAL,
            quantity: 0
        })
    )

    const config = {
        add: {
            style: 'green',
            title: 'Adicionar Estoque',
            message: `Quantas unidades deseja adicionar ao estoque de ${material.name}?`,
            buttonLabel: 'Adicionar',
            getNewStock: () => material.stockQuantity + movement.quantity
        },
        remove: {
            style: 'red',
            title: 'Remover Estoque',
            message: `Quantas unidades deseja remover do estoque de ${material.name}?`,
            buttonLabel: 'Remover',
            getNewStock: () => material.stockQuantity - movement.quantity
        }
    }[action]

    const isConfirmDisabled = movement.quantity <= 0 || (action === "remove" && movement.quantity > material.stockQuantity)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value) || 0
        if (value < 0) value = 0

        setMovement(prev => ({
            ...prev,
            quantity: value
        }))
    }

    const handleConfirm = async () => {
        try {
            await movementMaterialStock(movement)
            onStockMovement()

        } catch (error) {
            console.error("Erro ao movimentar estoque:", error)
        }
    }

    return (
        <>
            <ModalOverlay onClose={onClose} />
            <div className={`${styles.modal} ${styles[config.style]}`}>
                <div className={`${styles.modalHeader} ${styles[config.style]}`}>{config.title}</div>

                <div className={styles.modalContent}>
                    <InputLabel 
                        label={config.message} 
                        color={config.style} 
                        inputType="number" 
                        inputValue={movement.quantity} 
                        onChange={handleInputChange} 
                    />
                    
                    <h1 className={styles.stockQuantity}>
                        {material.stockQuantity} -&gt; <span className={styles[config.style]}>{config.getNewStock()}</span>
                    </h1>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor={`outline-${config.style}`} onClick={onClose} />
                        <CustomButton label={config.buttonLabel} actionColor={config.style} disabled={isConfirmDisabled} onClick={handleConfirm} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MaterialStockModal
