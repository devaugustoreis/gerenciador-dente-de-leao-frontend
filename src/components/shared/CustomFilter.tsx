import { ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { useState } from "react"
import styles from "@/components/shared/CustomFilter.module.css"

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
        <div className={styles.filterContainer}>
            {options.map(option => {
                const direction = sortDirection[option.value] ?? 'asc'
                const isActive = selectedFilter.startsWith(option.value)
                
                return (
                    <button
                        key={option.id}
                        onClick={() => handleSortClick(option.value)}
                        className={`btn ${isActive ? 'active' : ''}`}
                        title={`${option.label} - ${direction === 'asc' ? 'Ascendente' : 'Descendente'}`}
                    >
                        <span className={styles.filterLabel}>{option.label}</span>
                        <div className={styles.arrowIcon}>
                            { direction === 'asc' ? <ArrowUpward /> : <ArrowDownward /> }
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

export default CustomFilter