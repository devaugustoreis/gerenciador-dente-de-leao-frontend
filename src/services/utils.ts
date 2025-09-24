export function sortByKey<T>(items: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
    return [...items].sort((a, b) => {
        const aValue = String(a[key])
        const bValue = String(b[key])
        const comparison = aValue.localeCompare(bValue, "pt-BR", { sensitivity: "base" })

        return order === "asc" ? comparison : -comparison
    })
}

export const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}