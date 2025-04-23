export interface MaterialItem {
  id: number;
  name: string;
  imgPath: string;
  stockQuantity: number;
  scheduledQuantity: number;
  endPrevision: Date;
}

export const createMaterialItem = (data: any): MaterialItem => ({
  ...data,
  endPrevision: new Date(data.endPrevision)
})