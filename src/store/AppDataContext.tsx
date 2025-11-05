import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getAppointments, getAppointmentTypes } from '@/services/appointmentService'
import { getMaterials, getMaterialsCategories } from '@/services/materialService'
import { getMaterialSets } from '@/services/materialSetService'
import AppointmentType from '@/models/appointments/appointment-type.model'
import Appointment from '@/models/appointments/appointment.model'
import MaterialSet from '@/models/material-sets/material-set.model'
import MaterialCategory from '@/models/materials/material-category.model'
import Material from '@/models/materials/material-item.model'
import { sortByKey } from '@/services/utils'

type AppData = {
	isLoading: {
		materialsCategories: boolean
		materials: boolean
		materialSets: boolean
		appointmentTypes: boolean
		appointments: boolean
	}

	materialsCategories: MaterialCategory[]
	materials: Material[]
	materialSets: MaterialSet[]
	appointmentTypes: AppointmentType[]
	appointments: Appointment[]

	setMaterials: (data: Material[]) => void
	setMaterialSets: (data: MaterialSet[]) => void
	setAppointments: (data: Appointment[]) => void

	refreshMaterials: () => Promise<void>
	refreshMaterialSets: () => Promise<void>
	refreshAppointments: (startDate?: string, endDate?: string) => Promise<void>
}

const AppDataContext = createContext<AppData | undefined>(undefined)

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState({
		materialsCategories: true,
		materials: true,
		materialSets: true,
		appointmentTypes: true,
		appointments: true
	})
	const [ materialsCategories, _setMaterialsCategories ] = useState<MaterialCategory[]>([])
	const [ materials, _setMaterials ] = useState<Material[]>([])
	const [ materialSets, _setMaterialSets ] = useState<MaterialSet[]>([])
	const [ appointmentTypes, _setAppointmentTypes ] = useState<MaterialCategory[]>([])
	const [ appointments, _setAppointments ] = useState<Appointment[]>([])


	const setMaterialsCategories = (data: MaterialCategory[]) => {
		_setMaterialsCategories(data)
	}

	const setMaterials = (data: Material[]) => {
		const sortedMaterials = sortByKey(data, "name", "asc")
		_setMaterials(sortedMaterials)
	}

	const setMaterialSets = (data: MaterialSet[]) => {
		const sortedMaterialSets = sortByKey(data, "label", "asc")
		_setMaterialSets(sortedMaterialSets)
	}

	const setAppointmentTypes = (data: AppointmentType[]) => {
		_setAppointmentTypes(data)
	}

	const setAppointments = (data: Appointment[]) => {
		_setAppointments(data)
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

	const fetchMaterials = async () => {
		setIsLoading(prev => ({ ...prev, materials: true }))

		try {
			const data = await getMaterials()
			setMaterials(data)
		} catch (error) {
			console.error('Erro ao buscar materiais:', error)
		} finally {
			setIsLoading(prev => ({ ...prev, materials: false }))
		}
	}

	const fetchMaterialSets = async () => {
		setIsLoading(prev => ({ ...prev, materialSets: true }))

		try {
			const data = await getMaterialSets()
			setMaterialSets(data)
		} catch (error) {
			console.error('Erro ao buscar conjuntos:', error)
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

	const fetchAppointments = useCallback(async (startDate?: string, endDate?: string) => {
		setIsLoading(prev => ({ ...prev, appointments: true }))

		try {
			const end = endDate ? new Date(endDate) : new Date()
			const start = startDate ? new Date(startDate) : new Date(end)
			if (!startDate) {
				start.setDate(end.getDate() - 30)
			}

			const startDateString = start.toISOString().split('T')[0]
			const endDateString = end.toISOString().split('T')[0]

			const data = await getAppointments(startDateString, endDateString)
			setAppointments(data)
		} catch (error) {
			console.error('Erro ao buscar consultas:', error)
		} finally {
			setIsLoading(prev => ({ ...prev, appointments: false }))
		}
	}, [])

	useEffect(() => {
		fetchMaterialsCategories()
		fetchAppointmentTypes()
		fetchMaterials()
		fetchMaterialSets()
	}, [])

	return (
		<AppDataContext.Provider value={{
			materialsCategories,
			materials,
			materialSets,
			appointments,
			appointmentTypes,
			isLoading,
			refreshMaterials: fetchMaterials,
			refreshMaterialSets: fetchMaterialSets,
			refreshAppointments: fetchAppointments,
			setMaterials,
			setMaterialSets,
			setAppointments,
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
