import { useState } from "react"
import SectionHeader from "../components/shared/SectionHeader"
import MaterialItem from "../components/materials/MaterialItem"
import { createMaterialItem } from "../models/material-item.model"
import { MaterialItem as MaterialItemModel } from "../models/material-item.model"
import NewMaterialModal from "../components/materials/NewMaterialModal"
import EditMaterialModal from "../components/materials/EditMaterialModal"
import AddMaterialModal from "../components/materials/AddMaterialModal"
import DeleteMaterialModal from "../components/materials/DeleteMaterialModal"
import mockMaterials from "../mock-materials.json"


const materialItensContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: "32px",
    maxHeight: "calc(100vh - 184px)",
    padding: "0 2px 20px 2px",
    overflowY: "auto",
}


const Materials = () => {
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ modalAction, setModalAction ] = useState("new")
    const [ selectedMaterial, setSelectedMaterial ] = useState<MaterialItemModel | null>(null)

    const openModal = (action: string, material?: MaterialItemModel) => {
        setModalOpen(true)
        setSelectedMaterial(material ?? null)
        setModalAction(action)
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedMaterial(null)
    }

    const renderMaterialItems = () => (
        mockMaterials.map(createMaterialItem).map(material => (
            <MaterialItem 
                key={material.id} 
                material={material} 
                onEdit={(mat) => openModal("edit", mat)} 
                onAdd={(mat) => openModal("add", mat)} 
                onDelete={(mat) => openModal("delete", mat)} 
            />
        ))
    )

    return (
        <>
            <SectionHeader title="MATERIAIS" buttonLabel="Novo Material" onClick={() => openModal("new")} />
            <div style={ materialItensContainerStyle }>
                { renderMaterialItems() }
            </div>

            { modalOpen && modalAction === "new" && <NewMaterialModal onClose={closeModal} /> }
            { modalOpen && modalAction === "edit" && <EditMaterialModal material={selectedMaterial} onClose={closeModal} /> }
            { modalOpen && modalAction === "add" && <AddMaterialModal material={selectedMaterial} onClose={closeModal} /> }
            { modalOpen && modalAction === "delete" && <DeleteMaterialModal material={selectedMaterial} onClose={closeModal} /> }
        </>
    )
}

export default Materials