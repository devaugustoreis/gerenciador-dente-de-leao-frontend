import { useState } from 'react'
import styles from './MaterialModal.module.css'
import ModalOverlay from '@/components/shared/ModalOverlay'
import InputLabel from '@/components/shared/InputLabel'
import CustomButton from '@/components/shared/CustomButton'
import MaterialItem from '@/models/materials/material-item.model'
import CreateUpdateMaterial from '@/models/materials/create-update-material'
import { createMaterial, updateMaterial } from '@/services/materialService'


interface MaterialModalProps {
    material?: MaterialItem
    onSave: () => void
    onClose: () => void
}


const MaterialModal = ({ material, onSave, onClose }: MaterialModalProps) => {
    const isEditing = !!material
    const imageSrc = new URL(`@/assets/images/material-placeholder.png`, import.meta.url).href;
    
    const config = {
        create: {
            style: 'blue',
            title: 'Novo Material',
            confirmLabel: 'Cadastrar',
        },
        update: {
            style: 'green',
            title: 'Editar Material',
            confirmLabel: 'Salvar Alterações',
        }
    }

    const modalConfig = isEditing ? config.update : config.create

    const convertMaterialItemToCreateUpdate = (material: MaterialItem): CreateUpdateMaterial => {
        return new CreateUpdateMaterial({
            materialId: material.id,
            name: material.name,
            categoryId: material.category.id
        })
    }

    const [ formData, setFormData ] = useState<CreateUpdateMaterial>(
        material ? convertMaterialItemToCreateUpdate(material) : new CreateUpdateMaterial()
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value });
    }

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateMaterial(formData)
            } else {
                await createMaterial(formData)
            }
            onSave()

        } catch (error) {
            console.error("Erro ao salvar material:", error)
        }
    }


    return (
        <>
            <ModalOverlay onClose={onClose} />

            <div className={`${styles.modal} ${styles[modalConfig.style]}`}>
                <div className={`${styles.modalHeader} ${styles[modalConfig.style]}`}>{modalConfig.title}</div>

                <div className={styles.modalContent}>
                    <InputLabel label="Material" inputValue={formData.name} onChange={handleInputChange} color={modalConfig.style} />

                    <div className={styles.imgContainer}>
                        <img src={imageSrc} alt={`Imagem de placeholder`} className={`${styles.materialImage} ${styles[modalConfig.style]}`} />
                        <div>
                            <button className={`${styles.selectImgBtn} ${styles[modalConfig.style]}`}>Selecionar Imagem</button>
                            <p className={styles.imgDetails}>
                                Tamanho máximo: 1mb <br />Dimensão máxima: 500x500px
                            </p>
                        </div>
                    </div>

                    <div className={styles.actionsContainer}>
                        <CustomButton label="Cancelar" actionColor={`outline-${modalConfig.style}`} onClick={onClose} />
                        <CustomButton label={modalConfig.confirmLabel} actionColor={modalConfig.style} onClick={handleSave} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MaterialModal
