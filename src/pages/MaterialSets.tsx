import { useEffect, useState } from "react"
import { useAppData } from "@/store/AppDataContext"
import SectionHeader from "@/components/shared/SectionHeader"
import CustomFilter, { FilterOption } from "@/components/shared/CustomFilter";
import MaterialSet from "@/components/shared/CustomAccordion"
import MaterialSetModal from "@/components/material-sets/modals/MaterialSetModal"
import DeleteModal from "@/components/shared/modals/DeleteModal"
import Spinner from "@/components/shared/Spinner"
import CustomPagination from "@/components/shared/CustomPagination";
import MaterialSetModel from "@/models/material-sets/material-set.model"


type ModalAction = "NEW" | "EDIT" | "DELETE" | null;

const MaterialSets = () => {
    const { isLoading, materialSets, refreshMaterials, refreshMaterialSets } = useAppData()
    const [ pagination, setPagination ] = useState({
        page: 1,
        // 60px = Topbar | 80px = Section padding | 84px = Section Header + margin | 34px = Filter | 20px = Section content margin | 64px = Pagination + margin 
        // 76px = Material Set Accordion + gap between each  
        size: Math.round((window.innerHeight - 60 - 80 - 84 - 34 - 20 - 64) / 76),
        sort: ["label,asc"]
    })
    const [ selectedMaterialSet, setSelectedMaterialSet ] = useState<MaterialSetModel | null>(null)
    const [ openSetId, setOpenSetId ] = useState<string | null>(null)
    const [ modalAction, setModalAction ] = useState<ModalAction>(null)

    const filterOptions: FilterOption[] = [
        { id: "sort-material-set-name", label: "Nome do Conjunto", value: "label" },
    ]

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const materialSetsQueryParams = { ...pagination, page: pagination.page - 1 };

        refreshMaterials(undefined, signal);
        refreshMaterialSets(materialSetsQueryParams);

        return () => controller.abort(); 
    }, [pagination]);
    
    const handleFilterChange = (filterValue: string) => {
        setPagination(prev => ({
            ...prev,
            page: 1,
            sort: [filterValue]
        }))
    }

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
            <CustomFilter options={filterOptions} selectedFilter={pagination.sort[0]} onFilterChange={handleFilterChange} />

            { (isLoading.materialSets || isLoading.materials) ? <Spinner /> : (
                <div className="sectionContentContainer flexColumn">
                    {renderMaterialSets()}
                </div>
            )}

            <CustomPagination count={materialSets.totalPages} page={pagination.page} onChange={handlePageChange} />

            { renderModal() }
        </>
    )
}

export default MaterialSets