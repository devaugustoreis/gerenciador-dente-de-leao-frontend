import { useEffect, useState } from "react"
import { getMaterialSets } from "@/services/materialSetService"
import MaterialSetModel from "@/models/material-sets/material-set.model"
import SectionHeader from "@/components/shared/SectionHeader"
import MaterialSet from "@/components/material-sets/MaterialSet"
import MaterialSetModal from "@/components/material-sets/modals/MaterialSetModal"
import DeleteMaterialSetModal from "@/components/material-sets/modals/DeleteMaterialSetModal"


const MaterialSetsContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "calc(100vh - 184px)",
    padding: "0 2px 20px 2px",
    overflowY: "auto",
}

type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const MaterialSets = () => {
    const [ loading, setLoading ] = useState(true);
    const [ materialSetList, setMaterialSetList ] = useState<MaterialSetModel[]>([]);
    const [ selectedMaterialSet, setSelectedMaterialSet ] = useState<MaterialSetModel | null>(null)
    const [ openSetId, setOpenSetId ] = useState<string | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null);

    const fetchMaterialSets = async () => {
        try {
            const data = await getMaterialSets();
            setMaterialSetList(data);
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMaterialSets();
    }, []);

    const openModal = (action: ModalAction, materialSet?: MaterialSetModel) => {
        setModalAction(action);
        setSelectedMaterialSet(materialSet ?? null);
    }

    const closeModal = () => {
        setModalAction(null);
        setSelectedMaterialSet(null);
    }

    const onActionComplete = () => {
        setLoading(true)
        fetchMaterialSets();
        closeModal();
    }

    const handleToggle = (id: string) => {
        setOpenSetId(previousId => (previousId == id) ? null : id)
    }

    const renderModal = () => {
        if (!modalAction) return null;

        switch (modalAction) {
            case "NEW":
                return <MaterialSetModal onSave={onActionComplete} onClose={closeModal} />

            case "EDIT":
                return <MaterialSetModal materialSet={selectedMaterialSet!} onSave={onActionComplete} onClose={closeModal} />

            case "DELETE":
                return <DeleteMaterialSetModal materialSet={selectedMaterialSet!} onDelete={onActionComplete} onClose={closeModal} />

            default:
                return null;
        }
    }

    const renderMaterialSets = () => (
        materialSetList.map(materialSet => (
            <MaterialSet 
                key={materialSet.id} 
                materialSet={materialSet}
                isOpen={openSetId === materialSet.id}
                onToggle={handleToggle}    
                onEdit={() => openModal("EDIT", materialSet)} 
                onDelete={() => openModal("DELETE", materialSet)} 
            />
        ))
    )

    return (
        <>
            <SectionHeader title="CONJUNTOS" buttonLabel="Novo Conjunto" onClick={() => openModal("NEW")} />
            
            { loading ? <p>Carregando...</p> : (
                <div style={ MaterialSetsContainerStyle }>
                    { renderMaterialSets() }
                </div>
            )}

            { renderModal() }
        </>
    )
}

export default MaterialSets