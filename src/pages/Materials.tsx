import React, { useEffect, useState } from "react"
import { Pagination, Stack } from "@mui/material";
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
    display: "flex",
    justifyContent: "space-between",
    gap: "28px",
    flexWrap: "wrap",
    maxHeight: "calc(100vh - 288px)",
    padding: "0 2px 6px 2px",
    overflowY: "auto",
}

type ModalAction = "NEW" | "EDIT" | "ADD STOCK" | "REMOVE STOCK" | "DELETE" | null

const Materials = () => {
    const { isLoading, materials, refreshMaterials } = useAppData()
    const [ currentPage, setCurrentPage] = useState(1)
    const [ selectedMaterial, setSelectedMaterial ] = useState<MaterialItemModel | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)

    // 250px = Lateral Menu | 80px = Section padding on both sides. | 232px = Material Card + gap between each | *2 because 2 rows of cards 
    const pageSize = Math.round((window.innerWidth - 250 - 80) / 232) * 2

    useEffect(() => {
        const queryParams = { page: currentPage - 1, size: pageSize, sort: ["highlight,desc", "name,asc"] }
        refreshMaterials(queryParams)
    }, [currentPage])

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
                return <DeleteModal element={selectedMaterial!} onClose={closeModal} />

            default:
                return null
        }
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
        setCurrentPage(page);
    }

    return (
        <>
            <SectionHeader title="MATERIAIS" buttonLabel="Novo Material" onClick={() => openModal("NEW")} />
            
            { isLoading.materials ? <Spinner /> : (
                <div style={ materialItensContainerStyle }>
                    { renderMaterialItems() }
                </div>
            )}

            <Stack spacing={2} alignItems="center" sx={{ mt: 3, position: "absolute", bottom: 0, width: "100%" }}>
                <Pagination
                    count={materials.totalPages}
                    page={currentPage}
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
