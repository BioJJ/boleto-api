import { Boleto } from './boleto.entity';

export class Retorno {
  status: string;

  boleto: Boleto;

  mensagem: string;

  tipoCodigoInput: string;

  tipoBoleto: string;
}
