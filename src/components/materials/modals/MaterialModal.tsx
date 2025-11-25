import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import styles from "./MaterialModal.module.css"
import ModalOverlay from "@/components/shared/ModalOverlay"
import InputLabel from "@/components/shared/InputLabel"
import CustomButton from "@/components/shared/CustomButton"
import MaterialItem from "@/models/materials/material-item.model"
import CreateUpdateMaterial from "@/models/materials/create-update-material"
import { createMaterial, updateMaterial } from "@/services/materialService"
import { useAppData } from "@/store/AppDataContext"
import SelectLabel from "@/components/shared/SelectLabel"

interface MaterialModalProps {
    material?: MaterialItem
    onClose: () => void
}

const MaterialModal = ({ material, onClose }: MaterialModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { materialsCategories, materials, setMaterials } = useAppData()
    const isEditing = !!material

    const config = {
        create: {
            style: "blue",
            title: "Novo Material",
            confirmLabel: "Cadastrar",
            loadingToast: "Cadastrando material...",
            successToast: "O material foi cadastrado com sucesso!"
        },
        update: {
            style: "green",
            title: "Editar Material",
            confirmLabel: "Salvar Alterações",
            loadingToast: "Salvando alterações...",
            successToast: "O material foi atualizado com sucesso!"
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

    const [formData, setFormData] = useState<CreateUpdateMaterial>(
        material ? convertMaterialItemToCreateUpdate(material) : new CreateUpdateMaterial()
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value })
    }

    const handleSave = async () => {
        const action = isEditing ? updateMaterial(formData) : createMaterial(formData)

        try {
            const responseMaterial = await toast.promise(
                action,
                {
                    loading: modalConfig.loadingToast,
                    success: modalConfig.successToast,
                    error: "Ocorreu um erro ao salvar o material!"
                }
            )
            const updatedMaterials: MaterialItem[] = isEditing
                ? materials.content.map(material => (material.id === responseMaterial.id ? new MaterialItem(responseMaterial) : material))
                : [...materials.content, responseMaterial]
            
            setMaterials({
                content: updatedMaterials, 
                totalPages: materials.totalPages
            })
            onClose()

        } catch (error) {
            console.error("Erro ao salvar material:", error)
        }
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <ModalOverlay onClose={onClose} />

            <div className={`${styles.modal} ${styles[modalConfig.style]}`}>
                <div className={`${styles.modalHeader} ${styles[modalConfig.style]}`}>{modalConfig.title}</div>

                <div className={styles.modalContent}>
                    <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
                        <InputLabel 
                            ref={inputRef}
                            label="Material"
                            inputPlaceholder="Nome do Material" 
                            inputValue={formData.name} 
                            onChange={handleInputChange} 
                            color={modalConfig.style} 
                        />
                        <SelectLabel
                            label="Categoria"
                            options={materialsCategories.map(category => ({
                                value: category.id,
                                label: category.label
                            }))}
                            value={formData.categoryId}
                            color={modalConfig.style}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        />
                    </div>
                    
                    { isEditing && (
                        <div className={styles.imgContainer}>
                            <img src={material.imageSrc} alt={`Imagem de placeholder`} className={`${styles.materialImage} ${styles[modalConfig.style]}`} />
                            <div>
                                <button className={`${styles.selectImgBtn} ${styles[modalConfig.style]}`}>Selecionar Imagem</button>
                                <p className={styles.imgDetails}>
                                    Tamanho máximo: 1mb <br />Dimensão máxima: 200x125px
                                </p>
                            </div>
                        </div>
                    )}

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
