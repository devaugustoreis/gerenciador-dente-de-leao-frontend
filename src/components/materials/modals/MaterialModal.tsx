import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import styles from "./MaterialModal.module.css"
import { useAppData } from "@/store/AppDataContext"
import { PageableQueryParams } from "@/services/api"
import { createMaterial, updateMaterial, uploadMaterialImage } from "@/services/materialService"
import MaterialItem from "@/models/materials/material-item.model"
import CreateUpdateMaterial from "@/models/materials/create-update-material"
import ModalOverlay from "@/components/shared/modals/ModalOverlay"
import InputLabel from "@/components/shared/forms/InputLabel"
import CustomButton from "@/components/shared/forms/CustomButton"
import SelectLabel from "@/components/shared/forms/SelectLabel"
import placeholderImg from "@/assets/images/material-placeholder.png"

interface MaterialModalProps {
    material?: MaterialItem
    pagination: PageableQueryParams
    onClose: () => void
}

const MaterialModal = ({ material, pagination, onClose }: MaterialModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { materialsCategories, refreshMaterials } = useAppData()
    const [ imageFile, setImageFile ] = useState<File | null>(null)
    const [ imagePreview, setImagePreview ] = useState<string | null>(null)
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        if (!file) return

        // opcional: validações de tipo/tamanho
        if (!file.type.startsWith("image/")) {
            toast.error("Por favor selecione um arquivo de imagem.")
            return
        }
        if (file.size > 1_048_576) { 
            toast.error("Imagem muito grande. Tamanho máximo: 1 MB.")
            return
        }

        setImageFile(file)
        const url = URL.createObjectURL(file)
        setImagePreview(url)
    }

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview)
        }
    }, [imagePreview])

    const handleSelectImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleSave = async () => {
        const action = isEditing ? updateMaterial(formData) : createMaterial(formData)
        let material: MaterialItem = new MaterialItem()

        try {
            material = await toast.promise(
                action,
                {
                    loading: modalConfig.loadingToast,
                    success: modalConfig.successToast,
                    error: "Ocorreu um erro ao salvar o material!"
                }
            )
        } catch (error) {
            console.error("Erro ao salvar material:", error)
        }

        if (imageFile) {
          const imageBase64 = await fileToBase64(imageFile)
          
          try {
              await toast.promise(
                  uploadMaterialImage(material.id, imageBase64),
                  {
                      loading: "O upload da imagem está em andamento.",
                      success: "A imagem foi carregada com sucesso!",
                      error: "Ocorreu um erro durante o upload da imagem!"
                  }
              )
          } catch (error) {
              console.error("Erro ao salvar material:", error)
          }
        }

        onClose()
        const queryParams = { ...pagination, page: pagination.page - 1 }
        refreshMaterials(queryParams)
    }

    const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file)
    })

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
                    
                    <div className={styles.imgContainer}>
                        {/* Mostra preview se selecionada, senão imagem do material (se houver), senão placeholder */}
                        <img
                            src={imagePreview ?? material?.imageSrc ?? placeholderImg}
                            alt={`Imagem de ${formData.name || 'Materiais odontólogicos'}`}
                            className={`${styles.materialImage} ${styles[modalConfig.style]}`}
                        />
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                            <button type="button" className={`${styles.selectImgBtn} ${styles[modalConfig.style]}`} onClick={handleSelectImageClick} >
                                Selecionar Imagem
                            </button>
                            <p className={styles.imgDetails}>
                                Tamanho máximo: 1mb <br />Dimensão máxima: 200x125px
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
