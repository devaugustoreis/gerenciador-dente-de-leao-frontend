import CustomFilter, { FilterOption } from "@/components/shared/CustomFilter"

const materialFilterContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
}

interface MaterialsFilterProps {
    highlightEnabled: boolean
    onToggleHighlight: () => void
    selectedFilter: string
    onFilterChange: (filterValue: string) => void
}


const MaterialFilter = ({ highlightEnabled, onToggleHighlight, selectedFilter, onFilterChange }: MaterialsFilterProps) => {
    const options: FilterOption[] = [
        { id: "sort-name", label: "Nome", value: "name" },
        { id: "sort-category", label: "Categoria", value: "category.label" },
        { id: "sort-sort-stock-quantity", label: "Quantidade em Estoque", value: "stockQuantity" },
        { id: "sort-scheduled-quantity", label: "Quantidade Agendada", value: "scheduledQuantity" },
        { id: "sort-expected-end-date", label: "Data de Término", value: "expectedEndDate" },
    ]

    return (
        <div style={materialFilterContainerStyle}>
            <CustomFilter options={options} selectedFilter={selectedFilter} onFilterChange={onFilterChange} />
            
            <button className={`btn ${highlightEnabled ? "active" : ''}`} onClick={onToggleHighlight}>
                Priorizar Destaques {highlightEnabled ? "ATIVO" : "INATIVO"}
            </button>
        </div>
    )
}

export default MaterialFilter