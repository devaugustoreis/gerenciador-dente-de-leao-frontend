import api, { Pageable, PageableQueryParams } from "@/services/api";
import MaterialSet from "@/models/material-sets/material-set.model";


const materialSetAPI = "/entities/material-group"


export const getMaterialSets = async (queryParams?: PageableQueryParams): Promise<Pageable<MaterialSet>> => {
	const defaultParams = { page: 0, size: 999, sort: ['label,asc'] }
    const params = { ...defaultParams, ...(queryParams || {}) }
	const response = await api.get<Pageable<MaterialSet>>(materialSetAPI, { params });
	return {
		content: response.data.content.map(materialSet => new MaterialSet(materialSet)),
		totalPages: response.data.totalPages
	}
};


export const createMaterialSet = async (materialSet: MaterialSet): Promise<MaterialSet> => {
	const response = await api.post<MaterialSet>(materialSetAPI, materialSet);
	return new MaterialSet(response.data);
};


export const updateMaterialSet = async (materialSet: MaterialSet): Promise<MaterialSet> => {
	const response = await api.put<MaterialSet>(materialSetAPI, materialSet);
	return new MaterialSet(response.data);
};


export const deleteMaterialSet = async (id: string): Promise<void> => {
	await api.delete(`${materialSetAPI}/${id}`);
};
