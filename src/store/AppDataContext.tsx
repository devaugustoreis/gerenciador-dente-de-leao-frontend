import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Pageable, PageableQueryParams } from '@/services/api'
import { getAppointments, getAppointmentsToConclude, getAppointmentTypes } from '@/services/appointmentService'
import { getMaterials, getMaterialsCategories } from '@/services/materialService'
import { getMaterialSets } from '@/services/materialSetService'
import AppointmentType from '@/models/appointments/appointment-type.model'
import Appointment from '@/models/appointments/appointment.model'
import MaterialSet from '@/models/material-sets/material-set.model'
import MaterialCategory from '@/models/materials/material-category.model'
import Material from '@/models/materials/material-item.model'

type AppData = {
	isLoading: {
		materialsCategories: boolean
		materials: boolean
		materialSets: boolean
		appointmentTypes: boolean
		appointments: boolean
		appointmentsToConclude: boolean
	}

	materialsCategories: MaterialCategory[]
	materials: Pageable<Material>
	materialSets: Pageable<MaterialSet>
	appointmentTypes: AppointmentType[]
	appointments: Appointment[]
	appointmentsToConclude: Pageable<Appointment>

	setMaterials: (data: Pageable<Material>) => void
	setMaterialSets: (data: Pageable<MaterialSet>) => void
	setAppointments: (data: Appointment[]) => void
	setAppointmentsToConclude: (data: Pageable<Appointment>) => void

	refreshMaterials: (queryParams?: PageableQueryParams, signal?: AbortSignal) => Promise<void>
	refreshMaterialSets: (queryParams?: PageableQueryParams, signal?: AbortSignal) => Promise<void>
	refreshAppointments: (startDate?: string, endDate?: string, signal?: AbortSignal) => Promise<void>
	refreshAppointmentsToConclude: (queryParams?: PageableQueryParams, signal?: AbortSignal) => Promise<void>
}

const AppDataContext = createContext<AppData | undefined>(undefined)

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState({
		materialsCategories: true,
		materials: true,
		materialSets: true,
		appointmentTypes: true,
		appointments: true,
		appointmentsToConclude: true
	})
	const [ materialsCategories, _setMaterialsCategories ] = useState<MaterialCategory[]>([])
	const [ materials, _setMaterials ] = useState<Pageable<Material>>({ content: [], totalPages: 0 })
	const [ materialSets, _setMaterialSets ] = useState<Pageable<MaterialSet>>({ content: [], totalPages: 0 })
	const [ appointmentTypes, _setAppointmentTypes ] = useState<MaterialCategory[]>([])
	const [ appointments, _setAppointments ] = useState<Appointment[]>([])
	const [ appointmentsToConclude, _setAppointmentsToConclude ] = useState<Pageable<Appointment>>({ content: [], totalPages: 0 })


	const setMaterialsCategories = (data: MaterialCategory[]) => {
		_setMaterialsCategories(data)
	}

	const setMaterials = (pageableMaterials: Pageable<Material>) => {
		_setMaterials(pageableMaterials)
	}

	const setMaterialSets = (pageableMaterialSets: Pageable<MaterialSet>) => {
		_setMaterialSets(pageableMaterialSets)
	}

	const setAppointmentTypes = (data: AppointmentType[]) => {
		_setAppointmentTypes(data)
	}

	const setAppointments = (data: Appointment[]) => {
		_setAppointments(data)
	}

	const setAppointmentsToConclude = (pageableAppointments: Pageable<Appointment>) => {
		_setAppointmentsToConclude(pageableAppointments)
	}

	const fetchMaterialsCategories = async () => {
		setIsLoading(prev => ({ ...prev, materialsCategories: true }))

		try {
			const data = await getMaterialsCategories()
			setMaterialsCategories(data)
		} catch (error) {
			console.error('Erro ao buscar categoria dos materiais:', error)
		} finally {
			setIsLoading(prev => ({ ...prev, materialsCategories: false }))
		}
	}

	const fetchMaterials = async (queryParams?: PageableQueryParams, signal?: AbortSignal) => {
		setIsLoading(prev => ({ ...prev, materials: true }))

		try {
			const data = await getMaterials(queryParams, signal)
			setMaterials(data)
		} catch (error) {
			if (error.name === "CanceledError" || error.name === "AbortError") {
				console.log("Requisição de materiais cancelada")
			} else {
				console.error('Erro ao buscar materiais:', error)
			}
		} finally {
			setIsLoading(prev => ({ ...prev, materials: false }))
		}
	}

	const fetchMaterialSets = async (queryParams?: PageableQueryParams, signal?: AbortSignal) => {
		setIsLoading(prev => ({ ...prev, materialSets: true }))

		try {
			const data = await getMaterialSets(queryParams, signal)
			setMaterialSets(data)
		} catch (error) {
			if (error.name === "CanceledError" || error.name === "AbortError") {
				console.log("Requisição de conjuntos cancelada")
			} else {
				console.error('Erro ao buscar conjuntos:', error)
			}
		} finally {
			setIsLoading(prev => ({ ...prev, materialSets: false }))
		}
	}

	const fetchAppointmentTypes = async () => {
		setIsLoading(prev => ({ ...prev, appointmentTypes: true }))

		try {
			const data = await getAppointmentTypes()
			setAppointmentTypes(data)
		} catch (error) {
			console.error('Erro ao buscar tipos de consulta:', error)
		} finally {
			setIsLoading(prev => ({ ...prev, appointmentTypes: false }))
		}
	}

	const fetchAppointments = useCallback(async (startDate?: string, endDate?: string, signal?: AbortSignal) => {
		setIsLoading(prev => ({ ...prev, appointments: true }))

		try {
			const end = endDate ? new Date(endDate) : new Date()
			const start = startDate ? new Date(startDate) : new Date(end)
			if (!startDate) {
				start.setDate(end.getDate() - 30)
			}

			const startDateString = start.toISOString().split('T')[0]
			const endDateString = end.toISOString().split('T')[0]

			const data = await getAppointments(startDateString, endDateString, signal)
			setAppointments(data)
		} catch (error) {
			if (error.name === "CanceledError" || error.name === "AbortError") {
				console.log("Requisição de consultas cancelada")
			} else {
				console.error('Erro ao buscar consultas:', error)
			}
		} finally {
			setIsLoading(prev => ({ ...prev, appointments: false }))
		}
	}, [])

	const fetchAppointmentsToConclude = async (queryParams?: PageableQueryParams, signal?: AbortSignal) => {
		setIsLoading(prev => ({ ...prev, appointmentsToConclude: true }))

		try {
			const data = await getAppointmentsToConclude(queryParams, signal)
			_setAppointmentsToConclude(data)
		} catch (error) {
			if (error.name === "CanceledError" || error.name === "AbortError") {
				console.log("Requisição de consultas cancelada")
			} else {
				console.error('Erro ao buscar consultas:', error)
			}
		} finally {
			setIsLoading(prev => ({ ...prev, appointmentsToConclude: false }))
		}
	}

	useEffect(() => {
		fetchMaterialsCategories()
		fetchAppointmentTypes()
	}, [])

	return (
		<AppDataContext.Provider value={{
			materialsCategories,
			materials,
			materialSets,
			appointmentTypes,
			appointments,
			appointmentsToConclude,
			isLoading,
			refreshMaterials: fetchMaterials,
			refreshMaterialSets: fetchMaterialSets,
			refreshAppointments: fetchAppointments,
			refreshAppointmentsToConclude: fetchAppointmentsToConclude,
			setMaterials,
			setMaterialSets,
			setAppointments,
			setAppointmentsToConclude,
		}}>
			{children}
		</AppDataContext.Provider>
	)
}

export const useAppData = () => {
	const context = useContext(AppDataContext)
	if (!context) throw new Error("useAppData deve ser usado dentro de AppDataProvider")
	return context
}
