import api, { PageableResponse } from "@/services/api";
import MaterialSet from "@/models/material-sets/material-set.model";


const materialSetAPI = "/entities/material-group"


export const getMaterialSets = async (): Promise<MaterialSet[]> => {
	const response = await api.get<PageableResponse<MaterialSet>>(materialSetAPI);
	const materialSetsArray: MaterialSet[] = response.data.content
	return materialSetsArray.map(materialSet => new MaterialSet(materialSet));
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
