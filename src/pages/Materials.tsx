import mockMaterials from "../mock-materials.json"
import SectionHeader from "../components/shared/SectionHeader"
import MaterialItem from "../components/materials/MaterialItem"
import { createMaterialItem } from "../models/material-item.model"


const materialItensContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: "32px",
    maxHeight: "calc(100vh - 184px)",
    overflowY: "auto",
}


const Materials = () => {
    const teste = () => {
        console.log("materiais")
    }

    const renderMaterialItems = () => (
        mockMaterials.map(createMaterialItem).map(material => (
            <MaterialItem key={material.id} material={material} />
        ))
    )

    return (
        <>
            <SectionHeader title="MATERIAIS" buttonLabel="Novo Material" onClick={teste} />
            <div style={ materialItensContainerStyle }>
                { renderMaterialItems() }
            </div>
        </>
    )
}

export default Materials