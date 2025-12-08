import React, { useEffect, useState } from "react"
import { useAppData } from "@/store/AppDataContext"
import SectionHeader from "@/components/shared/SectionHeader"
import MaterialFilter from "@/components/materials/MaterialFilter";
import MaterialCard from "@/components/materials/MaterialCard"
import MaterialModal from "@/components/materials/modals/MaterialModal"
import MaterialStockModal from "@/components/materials/modals/MaterialStockModal"
import DeleteModal from "@/components/shared/modals/DeleteModal"
import Spinner from "@/components/shared/Spinner"
import CustomPagination from "@/components/shared/CustomPagination";
import MaterialItemModel from "@/models/materials/material-item.model"


type ModalAction = "NEW" | "EDIT" | "ADD STOCK" | "REMOVE STOCK" | "DELETE" | null

const Materials = () => {
    const { isLoading, materials, refreshMaterials } = useAppData()
    const [ pagination, setPagination ] = useState({
        page: 1,
        // 250px = Lateral Menu | 80px = Section padding on both sides. | 232px = Material Card + gap between each | *2 because 2 rows of cards 
        size: Math.round((window.innerWidth - 250 - 80) / 232) * 2,
        sort: ["highlight,desc", "name,asc"]
    })
    const [ highlightEnabled, setHighlightEnabled ] = useState<boolean>(true)
    const [ selectedMaterial, setSelectedMaterial ] = useState<MaterialItemModel | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)


    useEffect(() => {
        const queryParams = { ...pagination, page: pagination.page - 1 };
        refreshMaterials(queryParams);
    }, [pagination]);

    const currentSort = pagination.sort.find(s => !s.startsWith('highlight')) ?? "name,asc"

    const toggleHighlight = () => {
        setHighlightEnabled(prev => {
            const enabled = !prev
            setPagination(prevPag => {
                const currentFilter = prevPag.sort.find(s => !s.startsWith('highlight')) ?? "name,asc"
                return {
                    ...prevPag,
                    page: 1,
                    sort: enabled ? ["highlight,desc", currentFilter] : [currentFilter]
                }
            })
            return enabled
        })
    }

    const handleFilterChange = (filterValue: string) => {
        setPagination(prev => ({
            ...prev,
            page: 1,
            sort: highlightEnabled ? ["highlight,desc", filterValue] : [filterValue]
        }))
    }

    const renderMaterialItems = () => materials.content.map(material => (
        <MaterialCard 
            key={material.id} 
            material={material} 
            onEdit={() => openModal("EDIT", material)} 
            onDelete={() => openModal("DELETE", material)}
            onRemoveStock={() => openModal("REMOVE STOCK", material)} 
            onAddStock={() => openModal("ADD STOCK", material)} 
        />
    ))

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, page }));
    }

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
                return <MaterialModal pagination={pagination} onClose={closeModal} />

            case "EDIT":
                return <MaterialModal material={selectedMaterial!} pagination={pagination} onClose={closeModal} />

            case "ADD STOCK":
                return <MaterialStockModal action="add" material={selectedMaterial!} pagination={pagination} onClose={closeModal} />

            case "REMOVE STOCK":
                return <MaterialStockModal action="remove" material={selectedMaterial!} pagination={pagination} onClose={closeModal} />

            case "DELETE":
                return <DeleteModal element={selectedMaterial!} pagination={pagination} onClose={closeModal} />

            default:
                return null
        }
    }
 
    return (
        <>
            <SectionHeader title="MATERIAIS" buttonLabel="Novo Material" onClick={() => openModal("NEW")} />
            
            <MaterialFilter
                highlightEnabled={highlightEnabled}
                onToggleHighlight={toggleHighlight}
                selectedFilter={currentSort}
                onFilterChange={handleFilterChange}
            />
            
            { isLoading.materials ? <Spinner /> : (
                <div className="sectionContentContainer grid">
                    { renderMaterialItems() }
                </div>
            )}

            <CustomPagination count={materials.totalPages} page={pagination.page} onChange={handlePageChange} />

            { renderModal() }
        </>
    )
}

export default Materials
