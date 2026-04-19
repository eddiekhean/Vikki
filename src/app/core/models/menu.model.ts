export interface MenuItem {
  id: string;
  label: string;
  icon: string; // PrimeIcons class, VD: 'pi pi-home'
  routerLink?: string; // Không có nếu là parent có children
  children?: MenuItem[]; // Sub-menu items (đệ quy, hỗ trợ nhiều cấp)
  order?: number;
  visible?: boolean;
  expanded?: boolean; // Trạng thái expand/collapse
  showOnHome?: boolean; // Hiện trên homepage grid
}
