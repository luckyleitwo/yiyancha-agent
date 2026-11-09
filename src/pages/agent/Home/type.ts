export interface DashboardEntry {
  name: string;
  description: string;
  icon: 'building' | 'list' | 'box' | 'wallet' | 'network';
  section: 'companies' | 'orders' | 'products' | 'recharges' | 'agents';
}
