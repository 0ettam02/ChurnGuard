
export interface MasterRecord {
  customer_id: string;
  sesso: 'M' | 'F' | '';
  età: number;
  data_iscrizione: string; // YYYY-MM-DD
  tipo_abbonamento: 'mensile' | 'trimestrale' | 'annuale' | string;
  prezzo_abbonamento: number;
  ultima_presenza: string; // YYYY-MM-DD
  media_presenze_sett: number;
  giorni_da_ultima_presenza: number;
  churn: 0 | 1;
}
