import React, { useEffect, useState } from "react"
import { Pagination, Stack } from "@mui/material";
import { useAppData } from "@/store/AppDataContext"
import SectionHeader from "@/components/shared/SectionHeader"
import MaterialFilter from "@/components/materials/MaterialFilter";
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
    maxHeight: "calc(100vh - 348px)",
    padding: "0 2px 6px 2px",
    overflowY: "auto",
}

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
        const queryParams = { ...pagination, page: pagination.page - 1 }
        refreshMaterials(queryParams)
    }, [pagination])

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
                <div style={ materialItensContainerStyle }>
                    { renderMaterialItems() }
                </div>
            )}

            <Stack spacing={2} alignItems="center" sx={{ mt: 3, position: "absolute", bottom: 0, width: "100%" }}>
                <Pagination
                    count={materials.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontSize: '1.25rem',
                            minWidth: '40px',
                            height: '40px',
                            padding: '0 8px'
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            backgroundColor: '#21618c',
                            color: '#ffffff'
                        },
                        '& .MuiPaginationItem-root.Mui-selected:hover': {
                            backgroundColor: '#5dade2'
                        }
                    }}
                />
            </Stack>

            { renderModal() }
        </>
    )
}

export default Materials
