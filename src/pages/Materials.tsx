import { useEffect, useState } from "react"
import { useAppData } from "@/store/AppDataContext"
import SectionHeader from "@/components/shared/SectionHeader"
import MaterialCard from "@/components/materials/MaterialCard"
import MaterialModal from "@/components/materials/modals/MaterialModal"
import MaterialStockModal from "@/components/materials/modals/MaterialStockModal"
import DeleteModal from "@/components/shared/DeleteModal"
import Spinner from "@/components/shared/Spinner"
import MaterialItemModel from "@/models/materials/material-item.model"

const materialItensContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: "32px",
    maxHeight: "calc(100vh - 184px)",
    padding: "0 6px 20px 2px",
    overflowY: "auto",
}

type ModalAction = "NEW" | "EDIT" | "ADD STOCK" | "REMOVE STOCK" | "DELETE" | null

const Materials = () => {
    const { isLoading, materials, refreshMaterials } = useAppData()
    const [ selectedMaterial, setSelectedMaterial ] = useState<MaterialItemModel | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)

    useEffect(() => {
        refreshMaterials()
    }, [])

    const openModal = (action: ModalAction, material?: MaterialItemModel) => {
        setModalAction(action)
        setSelectedMaterial(material ?? null)
    }

    const closeModal = () => {
        setModalAction(null)
        setSelectedMaterial(null)
    }

    const renderModal = () => {
        if (!modalAction) return null

        switch (modalAction) {
            case "NEW":
                return <MaterialModal onClose={closeModal} />

            case "EDIT":
                return <MaterialModal material={selectedMaterial!} onClose={closeModal} />

            case "ADD STOCK":
                return <MaterialStockModal action="add" material={selectedMaterial!} onClose={closeModal} />

            case "REMOVE STOCK":
                return <MaterialStockModal action="remove" material={selectedMaterial!} onClose={closeModal} />

            case "DELETE":
                return <DeleteModal type="material" element={selectedMaterial!} onClose={closeModal} />

            default:
                return null
        }
    }

    const renderMaterialItems = () => (
        materials.map(material => (
            <MaterialCard 
                key={material.id} 
                material={material} 
                onEdit={() => openModal("EDIT", material)} 
                onDelete={() => openModal("DELETE", material)}
                onRemoveStock={() => openModal("REMOVE STOCK", material)} 
                onAddStock={() => openModal("ADD STOCK", material)} 
            />
        ))
    )

    return (
        <>
            <SectionHeader title="MATERIAIS" buttonLabel="Novo Material" onClick={() => openModal("NEW")} />
            
            { isLoading.materials ? <Spinner /> : (
                <div style={ materialItensContainerStyle }>
                    { renderMaterialItems() }
                </div>
            )}

            { renderModal() }
        </>
    )
}

export default Materials
