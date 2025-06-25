import api from "@/services/api";
import MaterialItem from "@/models/materials/material-item.model";
import CreateUpdateMaterial from "@/models/materials/create-update-material";
import MovementStock from "@/models/materials/movement-stock.model";


const materialsAPI = "/entities/material"


export const getMaterials = async (): Promise<MaterialItem[]> => {
	const response = await api.get<MaterialItem[]>(materialsAPI);
	return response.data.map(material => new MaterialItem(material));
};


export const createMaterial = async (material: CreateUpdateMaterial): Promise<MaterialItem> => {
	const response = await api.post<MaterialItem>(materialsAPI, material);
	return response.data;
};


export const updateMaterial = async (material: CreateUpdateMaterial): Promise<MaterialItem> => {
	const response = await api.put<MaterialItem>(`${materialsAPI}/${material.materialId}`, material);
	return response.data;
};


export const deleteMaterial = async (id: string): Promise<void> => {
	await api.delete(`${materialsAPI}?id=${id}`);
};


export const movementMaterialStock = async (movementStock: MovementStock): Promise<MaterialItem> => {
	const response = await api.post<MaterialItem>(`${materialsAPI}/movement-stock/${movementStock.materialId}`, movementStock);
	return response.data;
};