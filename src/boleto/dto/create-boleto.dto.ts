import { ApiProperty } from '@nestjs/swagger';

export class CreateBoletoDto {
  @ApiProperty()
  status: boolean; //200 para linha válida ou 400 para linha inválida

  @ApiProperty()
  amount: number; //O valor do boleto, se existir

  @ApiProperty()
  expirationDate: Date; //A data de vencimento do boleto, se existir

  @ApiProperty()
  barCode: string; //Os 44 dígitos correspondentes ao código de barras desse boleto
}
