import SectionHeader from "../components/shared/SectionHeader"
import MaterialSet from "../components/material-sets/MaterialSet"
import mockMaterialsSets from "../mock-materials-sets.json"
import { useState } from "react"


const materialSetsContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "calc(100vh - 184px)",
    padding: "0 2px 20px 2px",
    overflowY: "auto",
}


const MaterialSets = () => {
    const [ openSetId, setOpenSetId ] = useState<number | null>(1)

    const teste = () => {
        console.log("conjuntos")
    }

    const handleToggle = (id: number) => {
        setOpenSetId(previousId => (previousId == id) ? null : id)
    }

    const renderMaterialSets = () => (
        mockMaterialsSets.map(matSet => (
            <MaterialSet 
                key={matSet.id} 
                materialSet={matSet} 
                isOpen={openSetId === matSet.id}
                onToggle={handleToggle}    
            />
        ))
    )

    return (
        <>
            <SectionHeader title="CONJUNTOS" buttonLabel="Novo Conjunto" onClick={teste} />
            <div style={ materialSetsContainerStyle }>
                { renderMaterialSets() }
            </div>
        </>
    )
}

export default MaterialSets