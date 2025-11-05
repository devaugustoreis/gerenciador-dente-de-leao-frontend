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
  highlighted: boolean;

  constructor(data: Partial<MaterialItem> = {}) {
    this.id = data.id ?? "Sem id";
    this.name = data.name ?? "";
    this.category = data.category ?? { id: "Sem id", label: "Sem categoria" };
    this.imgPath = data.imgPath ?? "material-placeholder.png";
    this.stockQuantity = data.stockQuantity ?? 0;
    this.scheduledQuantity = data.scheduledQuantity ?? 0;
    this.alertQuantity = data.alertQuantity ?? 0;
    this.expectedEndDate = data.expectedEndDate ? new Date(data.expectedEndDate) : null;
    this.highlighted = false;

    if (this.expectedEndDate) {
      const now = new Date();
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffDays = (this.expectedEndDate.getTime() - now.getTime()) / msPerDay;
      this.highlighted = diffDays < 14;
    } else if (this.scheduledQuantity > this.stockQuantity) {
      this.highlighted = true
    }
  }
}
