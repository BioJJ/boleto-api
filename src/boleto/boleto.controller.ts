import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoletoService } from './boleto.service';
import { CreateRetornoDto } from './dto/create-retorno.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Retorno } from './entities/retorno.entity';
import { Boleto } from './interfaces/boleto.interface';

@Controller('boleto')
export class BoletoController {
  constructor(private readonly boletoService: BoletoService) {}

  @Post()
  create(@Body() createBoletoDto: Boleto) {
    return this.boletoService.create(createBoletoDto);
  }

  @Get()
  findAll() {
    return this.boletoService.findAll();
  }

  @Get(':barCode')
  findBarCode(@Param('barCode') id: string): Retorno {
    return this.boletoService.findBarCode(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoletoDto: UpdateBoletoDto) {
    return this.boletoService.update(+id, updateBoletoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletoService.remove(+id);
  }
}
