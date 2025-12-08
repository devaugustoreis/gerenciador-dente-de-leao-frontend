import React from "react"
import { Pagination, Stack } from "@mui/material"

interface CustomPaginationProps {
    count: number
    page: number
    onChange: (e: React.ChangeEvent<unknown>, page: number) => void
    size?: "small" | "medium" | "large"
}

const PAGINATION_SX = {
    '& .MuiPaginationItem-root': {
        fontSize: '1.25rem',
        minWidth: '40px',
        height: '40px',
        padding: '0 8px'
    },
    '& .MuiPaginationItem-root.Mui-selected': {
        backgroundColor: 'var(--deep-blue)',
        color: '#ffffff'
    },
    '& .MuiPaginationItem-root.Mui-selected:hover': {
        backgroundColor: '#5dade2'
    }
}

const CustomPagination = ({ count, page, onChange, size = "large" }: CustomPaginationProps) => (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3, position: "absolute", bottom: 0, width: "100%" }}>
        <Pagination count={count} page={page} onChange={onChange} size={size} sx={PAGINATION_SX} />
    </Stack>
)

export default CustomPagination