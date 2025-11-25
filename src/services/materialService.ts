import api, { Pageable, PageableQueryParams } from "@/services/api";
import MaterialCategory from "@/models/materials/material-category.model";
import MaterialItem from "@/models/materials/material-item.model";
import CreateUpdateMaterial from "@/models/materials/create-update-material";
import MovementStock from "@/models/materials/movement-stock.model";


const materialsAPI = "/entities/material"
const materialCategoryAPI = "/entities/category"


export const getMaterialsCategories = async (): Promise<MaterialCategory[]> => {
    const response = await api.get<Pageable<MaterialCategory>>(`${materialCategoryAPI}?page=0&size=999`);
    const materialsCategoriesArray: MaterialCategory[] = response.data.content
    return materialsCategoriesArray.map(category => new MaterialCategory(category.id, category.label));
};


export const getMaterials = async (queryParams?: PageableQueryParams): Promise<Pageable<MaterialItem>> => {
	const defaultParams = { page: 0, size: 999, sort: ['name,asc'] }
    const params = { ...defaultParams, ...(queryParams || {}) }
    const response = await api.get<Pageable<MaterialItem>>(materialsAPI, { params });
    return {
		content: response.data.content.map(material => new MaterialItem(material)),
		totalPages: response.data.totalPages
	};
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