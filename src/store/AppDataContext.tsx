import { createContext, useContext, useEffect, useState } from 'react'
import { getAppointments } from '@/services/appointmentService'
import { getMaterials } from '@/services/materialService'
import { getMaterialSets } from '@/services/materialSetService'
import Appointment from '@/models/appointments/appointment.model'
import MaterialSet from '@/models/material-sets/material-set.model'
import Material from '@/models/materials/material-item.model'
import { sortByKey } from '@/services/utils'

type AppData = {
	isLoading: {
		materials: boolean
		materialSets: boolean
		appointments: boolean
	}

	materials: Material[]
	materialSets: MaterialSet[]
	appointments: Appointment[]

	setMaterials: (data: Material[]) => void
	setMaterialSets: (data: MaterialSet[]) => void
	setAppointments: (data: Appointment[]) => void

	refreshMaterials: () => Promise<void>
	refreshMaterialSets: () => Promise<void>
	refreshAppointments: () => Promise<void>
}

const AppDataContext = createContext<AppData | undefined>(undefined)

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState({
		materials: true,
		materialSets: true,
		appointments: true
	})
	const [ materials, _setMaterials ] = useState<Material[]>([])
	const [ materialSets, _setMaterialSets ] = useState<MaterialSet[]>([])
	const [ appointments, _setAppointments ] = useState<Appointment[]>([])


	const setMaterials = (data: Material[]) => {
		const sortedMaterials = sortByKey(data, "name", "asc")
		_setMaterials(sortedMaterials)
		localStorage.setItem('materials', JSON.stringify(sortedMaterials))
	}

	const setMaterialSets = (data: MaterialSet[]) => {
		const sortedMaterialSets = sortByKey(data, "label", "asc")
		_setMaterialSets(sortedMaterialSets)
		localStorage.setItem('materialSets', JSON.stringify(sortedMaterialSets))
	}

	const setAppointments = (data: Appointment[]) => {
		_setAppointments(data)
		localStorage.setItem('appointments', JSON.stringify(data))
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

	const fetchAppointments = async () => {
		setIsLoading(prev => ({ ...prev, appointments: true }))
		
		try {
			const data = await getAppointments()
			setAppointments(data)
		} catch (error) {
			console.error('Erro ao buscar consultas:', error)
		} finally {
			setIsLoading(prev => ({ ...prev, appointments: false }))
		}
	}

	useEffect(() => {
		const lsMaterials = localStorage.getItem('materials')
		const lsMaterialSets = localStorage.getItem('materialSets')
		const lsAppointments = localStorage.getItem('appointments')

		if (lsMaterials) {
			_setMaterials(JSON.parse(lsMaterials))
			setIsLoading(prev => ({ ...prev, materials: false }))
		} else {
			fetchMaterials()
		}

		if (lsMaterialSets) {
			_setMaterialSets(JSON.parse(lsMaterialSets))
			setIsLoading(prev => ({ ...prev, materialSets: false }))
		} else {
			fetchMaterialSets()
		}

		if (lsAppointments) {
			_setAppointments(JSON.parse(lsAppointments))
			setIsLoading(prev => ({ ...prev, appointments: false }))
		} else {
			fetchAppointments()
		}
	}, [])

	return (
		<AppDataContext.Provider value={{
			materials,
			materialSets,
			appointments,
			isLoading,
			refreshMaterials: fetchMaterials,
			refreshMaterialSets: fetchMaterialSets,
			refreshAppointments: fetchAppointments,
			setMaterials,
			setMaterialSets,
			setAppointments
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
