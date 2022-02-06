/* eslint-disable prettier/prettier */
import { Boleto } from './boleto.interface';
export interface Retorno {
  status: string;
  boleto: Boleto;
  mensagem: string;
  tipoCodigoInput: string;
  tipoBoleto: string;
}
