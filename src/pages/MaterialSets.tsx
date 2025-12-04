import { useEffect, useState } from "react"
import { Pagination, Stack } from "@mui/material";
import { useAppData } from "@/store/AppDataContext"
import MaterialSetModel from "@/models/material-sets/material-set.model"
import SectionHeader from "@/components/shared/SectionHeader"
import MaterialSet from "@/components/shared/CustomAccordion"
import MaterialSetModal from "@/components/material-sets/modals/MaterialSetModal"
import DeleteModal from "@/components/shared/DeleteModal"
import Spinner from "@/components/shared/Spinner"


const MaterialSetsContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "calc(100vh - 288px)",
    padding: "0 2px 6px",
    overflowY: "auto",
}

type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const MaterialSets = () => {
    const { isLoading, materialSets, refreshMaterials, refreshMaterialSets } = useAppData()
    const [ pagination, setPagination ] = useState({
        page: 1,
        // 60px = Topbar | 80px = Section padding on top and bottom. | 64px = Section Header | 20px = Section content margin | 64px = Pagination + margin 
        // 76px = Material Set Accordion + gap between each  
        size: Math.round((window.innerHeight - 60 - 80 - 64 - 20 - 64) / 76),
        sort: ["label,asc"]
    })
    const [ selectedMaterialSet, setSelectedMaterialSet ] = useState<MaterialSetModel | null>(null)
    const [ openSetId, setOpenSetId ] = useState<string | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)


    useEffect(() => {
        const materialSetsQueryParams = { ...pagination, page: pagination.page - 1 }
        refreshMaterials()
        refreshMaterialSets(materialSetsQueryParams)
    }, [pagination])

    const openModal = (action: ModalAction, materialSet?: MaterialSetModel) => {
        setModalAction(action)
        setSelectedMaterialSet(materialSet ?? null)
    }

    const closeModal = () => {
        setModalAction(null)
        setSelectedMaterialSet(null)
    }

    const handleToggle = (id: string) => {
        setOpenSetId(previousId => (previousId === id ? null : id))
    }

    const renderModal = () => {
        if (!modalAction) return null

        switch (modalAction) {
            case "NEW":
                return <MaterialSetModal pagination={pagination} onClose={closeModal} />

            case "EDIT":
                return <MaterialSetModal materialSet={selectedMaterialSet!} pagination={pagination} onClose={closeModal} />

            case "DELETE":
                return <DeleteModal element={selectedMaterialSet!} pagination={pagination} onClose={closeModal} />
                
            default:
                return null
        }
    }

    const renderMaterialSets = () => materialSets.content.map(materialSet => (
        <MaterialSet
            key={materialSet.id}
            element={materialSet}
            isOpen={openSetId === materialSet.id}
            onToggle={handleToggle}
            onEdit={() => openModal("EDIT", materialSet)}
            onDelete={() => openModal("DELETE", materialSet)}
        />
    ))
    
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, page }))
    }

    return (
        <>
            <SectionHeader title="CONJUNTOS" buttonLabel="Novo Conjunto" onClick={() => openModal("NEW")} />

            { (isLoading.materialSets || isLoading.materials) ? <Spinner /> : (
                <div style={MaterialSetsContainerStyle}>
                    {renderMaterialSets()}
                </div>
            )}

            <Stack spacing={2} alignItems="center" sx={{ mt: 3, position: "absolute", bottom: 0, width: "100%" }}>
                <Pagination
                    count={materialSets.totalPages}
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

export default MaterialSets