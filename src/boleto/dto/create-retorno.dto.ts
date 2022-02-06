import { ApiProperty } from '@nestjs/swagger';
import { CreateBoletoDto } from './create-boleto.dto';

export class CreateRetornoDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  boleto: CreateBoletoDto;

  @ApiProperty()
  mensagem: string;

  @ApiProperty()
  tipoCodigoInput: string;

  @ApiProperty()
  tipoBoleto: string;
}
