import axios from 'axios'
import qs from "qs";

export interface Pageable<T> {
    content: T[],
    totalPages: number
}

export interface PageableQueryParams {
    page: number,
    size: number,
    sort: string[]
}

export const paramsSerializer = (params: Record<string, any>) => qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true })

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/',
	timeout: 100000,
    paramsSerializer
})

api.interceptors.request.use((config: any) => {
	const token = localStorage.getItem('token')

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
});

api.interceptors.response.use(
    response => response,
    (error: any) => {
        const status = error?.response?.status
        if (status === 403) {
            localStorage.clear()
            window.location.replace('/login')
        }
        return Promise.reject(error)
    }
)

export default api