export function sortByKey<T>(items: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...items].sort((a, b) => {
    const aValue = String(a[key])
    const bValue = String(b[key])
    const comparison = aValue.localeCompare(bValue, "pt-BR", { sensitivity: "base" })

    return order === "asc" ? comparison : -comparison
  })
}
