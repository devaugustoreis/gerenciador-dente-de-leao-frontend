import { useEffect, useState } from "react"
import { getMaterials } from "@/services/materialService"
import MaterialItemModel from "@/models/materials/material-item.model"
import SectionHeader from "@/components/shared/SectionHeader"
import MaterialCard from "@/components/materials/MaterialCard"
import MaterialModal from "@/components/materials/modals/MaterialModal"
import MaterialStockModal from "@/components/materials/modals/MaterialStockModal"
import DeleteMaterialModal from "@/components/materials/modals/DeleteMaterialModal"


const materialItensContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: "32px",
    maxHeight: "calc(100vh - 184px)",
    padding: "0 6px 20px 2px",
    overflowY: "auto",
}

type ModalAction = "NEW" | "EDIT" | "ADD STOCK" | "REMOVE STOCK" | "DELETE" | null;

const Materials = () => {
    const [ loading, setLoading ] = useState(true);
    const [ materialsList, setMaterialsList ] = useState<MaterialItemModel[]>([]);
    const [ selectedMaterial, setSelectedMaterial ] = useState<MaterialItemModel | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null);


    const fetchMaterials = async () => {
        try {
            const data = await getMaterials();
            setMaterialsList(data);
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMaterials();
    }, []);

    const openModal = (action: ModalAction, material?: MaterialItemModel) => {
        setModalAction(action);
        setSelectedMaterial(material ?? null);
    }

    const closeModal = () => {
        setModalAction(null);
        setSelectedMaterial(null);
    }

    const onActionComplete = () => {
        setLoading(true)
        fetchMaterials();
        closeModal();
    }

    const renderModal = () => {
        if (!modalAction) return null;

        switch (modalAction) {
            case "NEW":
                return <MaterialModal onSave={onActionComplete} onClose={closeModal} />

            case "EDIT":
                return <MaterialModal material={selectedMaterial!} onSave={onActionComplete} onClose={closeModal} />

            case "ADD STOCK":
                return <MaterialStockModal action="add" material={selectedMaterial!} onStockMovement={onActionComplete} onClose={closeModal} />

            case "REMOVE STOCK":
                return <MaterialStockModal action="remove" material={selectedMaterial!} onStockMovement={onActionComplete} onClose={closeModal} />

            case "DELETE":
                return <DeleteMaterialModal material={selectedMaterial!} onDelete={onActionComplete} onClose={closeModal} />

            default:
                return null;
        }
    }

    const renderMaterialItems = () => (
        materialsList.map(material => (
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
            
            { loading ? <p>Carregando...</p> : (
                <div style={ materialItensContainerStyle }>
                    { renderMaterialItems() }
                </div>
            )}

            { renderModal() }
        </>
    )
}

export default Materials