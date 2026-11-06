export type DetailEntity =
  | 'orders'
  | 'companies'
  | 'products'
  | 'authorizations';
export type DetailTarget =
  | { kind: 'detail'; entity: DetailEntity; id: string }
  | { kind: 'cancel'; id: string }
  | { kind: 'reports'; id: string };
