import { ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { useEffect, useState } from "react"

const filterContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap"
}

export interface FilterOption {
    id: string
    label: string
    value: string
}

interface CustomFilterProps {
    options: FilterOption[]
    selectedFilter: string
    onFilterChange: (filterValue: string) => void
}

const CustomFilter = ({ options, selectedFilter, onFilterChange }: CustomFilterProps) => {
    const [sortDirection, setSortDirection] = useState<{ [key: string]: 'asc' | 'desc' }>({})

    // sincroniza direção inicial quando o pai muda selectedFilter
    useEffect(() => {
        if (!selectedFilter) return
        const [field, dir] = selectedFilter.split(',')
        setSortDirection(prev => ({ ...prev, [field]: dir as 'asc' | 'desc' }))
    }, [selectedFilter])

    const handleSortClick = (value: string) => {
        const isActive = selectedFilter.startsWith(value)

        if (isActive) {
            const currentDirection = sortDirection[value] ?? 'asc'
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'
            setSortDirection(prev => ({ ...prev, [value]: newDirection }))
            onFilterChange(`${value},${newDirection}`)
        } else {
            const direction = sortDirection[value] ?? 'asc'
            setSortDirection(prev => ({ ...prev, [value]: direction }))
            onFilterChange(`${value},${direction}`)
        }
    }

    return (
        <div style={filterContainerStyle}>
            {options.map(option => {
                const direction = sortDirection[option.value] ?? 'asc'
                const isActive = selectedFilter.startsWith(option.value)
                
                return (
                    <button
                        key={option.id}
                        onClick={() => handleSortClick(option.value)}
                        className={`btn ${isActive ? 'active' : ''}`}
                        title={`Ordernar por ${option.label} - ${direction === 'asc' ? 'Ascendente' : 'Descendente'}`}
                    >
                        <span>{option.label}</span>
                        { direction === 'asc' ? <ArrowUpward /> : <ArrowDownward /> }
                    </button>
                )
            })}
        </div>
    )
}

export default CustomFilter