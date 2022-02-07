export interface Boleto {
  status: boolean; //200 para linha válida ou 400 para linha inválida
  amount: number; //O valor do boleto, se existir
  expirationDate: string | Date; //A data de vencimento do boleto, se existir
  barCode: string; //Os 44 dígitos correspondentes ao código de barras desse boleto
}
