interface Category {
  id: string;
  label: string;
}

export default class MaterialItem {
  id: string;
  name: string;
  category: Category;
  imgPath: string;
  stockQuantity: number;
  scheduledQuantity: number;
  alertQuantity: number;
  expectedEndDate: Date | null;

  constructor(data: Partial<MaterialItem> = {}) {
    this.id = data.id ?? "Sem id";
    this.name = data.name ?? "";
    this.category = data.category ?? { id: "Sem id", label: "Sem categoria" };
    this.imgPath = data.imgPath ?? "material-placeholder.png";
    this.stockQuantity = data.stockQuantity ?? 0;
    this.scheduledQuantity = data.scheduledQuantity ?? 0;
    this.alertQuantity = data.alertQuantity ?? 0;
    this.expectedEndDate = data.expectedEndDate ? new Date(data.expectedEndDate) : null;
  }
}
