import { Injectable } from '@nestjs/common';
import { CreateRetornoDto } from './dto/create-retorno.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Retorno } from './entities/retorno.entity';
import { Boleto } from './interfaces/boleto.interface';

@Injectable()
export class BoletoService {
  private boleto: Boleto;

  private retorno: Retorno;

  create(createBoleto: Boleto) {
    // this.boletos.push(createBoleto);
    return `New boleto created successfully: ${createBoleto}`;
  }

  findAll() {
    return `This action returns all boleto`;
  }

  update(id: number, updateBoletoDto: UpdateBoletoDto) {
    return `This action updates a #${id} boleto`;
  }

  remove(id: number) {
    return `This action removes a #${id} boleto`;
  }

  findBarCode(barCode: string) {
    const tipoCodigo = this.identificarTipoCodigo(barCode);

    const codigo = barCode.replace(/[^a-zA-Z]/g, '');

    if (codigo.length > 0) {
      const status = '400';
      const code = barCode;
      const mensagem =
        'O código inserido possui caractere alfanumérico: [' +
        codigo +
        '] Por favor insira uma numeração válida. (Apenas Números)';
      return `Status: ${status}
              BarCode: ${code}
              Mensagem: ${mensagem}
      `;
    } else {
      if (
        barCode.length != 44 &&
        barCode.length != 46 &&
        barCode.length != 47 &&
        barCode.length != 48
      ) {
        const status = '400';
        const code = barCode;
        const mensagem =
          'O código inserido possui ' +
          barCode.length +
          ' dígitos. Por favor insira uma numeração válida. Códigos de barras SEMPRE devem ter 44 caracteres numéricos. Linhas digitáveis podem possuir 46 (boletos de cartão de crédito), 47 (boletos bancários/cobrança) ou 48 (contas convênio/arrecadação) caracteres numéricos. Qualquer caractere não numérico será desconsiderado.';
        return `Status: ${status}
              BarCode: ${code}
              Mensagem: ${mensagem}
      `;
      } else {
        const status = '200';
        const code = barCode;
        const mensagem = 'Boleto válido';
        let tipoBoleto;
        let expirationDate;
        let amount;

        switch (tipoCodigo) {
          case 'LINHA_DIGITAVEL':
            // const tipoCodigoInput = 'LINHA_DIGITAVEL';
            tipoBoleto = this.identificarTipoBoleto(barCode);
            expirationDate = this.identificarData(barCode, 'LINHA_DIGITAVEL');
            amount = this.identificarValor(barCode, 'LINHA_DIGITAVEL');

            return `Status: ${status}
                  BarCode: ${code}
                  Mensagem: ${mensagem}
                  Tipo: ${tipoBoleto}
                  expirationDate: ${expirationDate}
                  amount ${amount}
                `;
            break;
          case 'CODIGO_DE_BARRAS':
            // const tipoCodigoInput = 'CODIGO_DE_BARRAS';
            tipoBoleto = this.identificarTipoBoleto(barCode);
            expirationDate = this.identificarData(barCode, 'CODIGO_DE_BARRAS');
            amount = this.identificarValor(barCode, 'CODIGO_DE_BARRAS');

            return `Status: ${status}
                  BarCode: ${code}
                  Mensagem: ${mensagem}
                  Tipo: ${tipoBoleto}
                  expirationDate: ${expirationDate}
                  amount ${amount}
                `;
            break;
          default:
            break;
        }
      }
    }
  }

  identificarTipoCodigo(codigo: string) {
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string')
      throw new TypeError('Insira uma string válida!');

    if (codigo.length == 44) {
      return 'CODIGO_DE_BARRAS';
    } else if (
      codigo.length == 46 ||
      codigo.length == 47 ||
      codigo.length == 48
    ) {
      return 'LINHA_DIGITAVEL';
    } else {
      return 'TAMANHO_INCORRETO';
    }
  }

  identificarTipoBoleto(codigo) {
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string')
      throw new TypeError('Insira uma string válida!');

    if (codigo.substr(0, 1) == '8') {
      if (codigo.substr(1, 1) == '1') {
        return 'ARRECADACAO_PREFEITURA';
      } else if (codigo.substr(1, 1) == '2') {
        return 'CONVENIO_SANEAMENTO';
      } else if (codigo.substr(1, 1) == '3') {
        return 'CONVENIO_ENERGIA_ELETRICA_E_GAS';
      } else if (codigo.substr(1, 1) == '4') {
        return 'CONVENIO_TELECOMUNICACOES';
      } else if (codigo.substr(1, 1) == '5') {
        return 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS';
      } else if (codigo.substr(1, 1) == '6' || codigo.substr(1, 1) == '9') {
        return 'OUTROS';
      } else if (codigo.substr(1, 1) == '7') {
        return 'ARRECADACAO_TAXAS_DE_TRANSITO';
      }
    } else {
      return 'BANCO';
    }
  }

  identificarData(codigo, tipoCodigo) {
    codigo = codigo.replace(/[^0-9]/g, '');
    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let fatorData = '';
    let dataBoleto = new Date();

    dataBoleto.setFullYear(1997);
    dataBoleto.setMonth(9);
    dataBoleto.setDate(7);
    dataBoleto.setHours(23, 54, 59);

    if (tipoCodigo === 'CODIGO_DE_BARRAS') {
      if (tipoBoleto == 'BANCO') {
        fatorData = codigo.substr(5, 4);

        dataBoleto.setDate(dataBoleto.getDate() + Number(fatorData));
        dataBoleto.setTime(
          dataBoleto.getTime() +
            dataBoleto.getTimezoneOffset() -
            3 * 60 * 60 * 1000,
        );
        const dataBoletoform =
          dataBoleto.getDate() +
          '/' +
          (dataBoleto.getMonth() + 1) +
          '/' +
          dataBoleto.getFullYear();

        return dataBoletoform;
      } else {
        dataBoleto = null;

        return dataBoleto;
      }
    } else if (tipoCodigo === 'LINHA_DIGITAVEL') {
      if (tipoBoleto == 'BANCO') {
        fatorData = codigo.substr(33, 4);
        dataBoleto.setDate(dataBoleto.getDate() + Number(fatorData));
        dataBoleto.setTime(
          dataBoleto.getTime() +
            dataBoleto.getTimezoneOffset() -
            3 * 60 * 60 * 1000,
        );
        const dataBoletoform =
          dataBoleto.getDate() +
          '/' +
          (dataBoleto.getMonth() + 1) +
          '/' +
          dataBoleto.getFullYear();

        return dataBoletoform;
      } else {
        dataBoleto = null;

        return dataBoleto;
      }
    }
  }

  identificarValor(codigo, tipoCodigo) {
    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let valorBoleto = '';
    let valorFinal;

    if (tipoCodigo == 'CODIGO_DE_BARRAS') {
      if (tipoBoleto == 'BANCO') {
        valorBoleto = codigo.substr(9, 10);
        valorFinal = valorBoleto.substr(0, 8) + '.' + valorBoleto.substr(8, 2);

        let char = valorFinal.substr(1, 1);
        while (char === '0') {
          valorFinal = this.substringReplace(valorFinal, '', 0, 1);
          char = valorFinal.substr(1, 1);
        }
      } else {
        valorFinal = this.identificarValorCodBarrasArrecadacao(
          codigo,
          'CODIGO_DE_BARRAS',
        );
      }
    } else if (tipoCodigo == 'LINHA_DIGITAVEL') {
      if (tipoBoleto == 'BANCO') {
        valorBoleto = codigo.substr(37);
        valorFinal = valorBoleto.substr(0, 8) + '.' + valorBoleto.substr(8, 2);

        let char = valorFinal.substr(1, 1);
        while (char === '0') {
          valorFinal = this.substringReplace(valorFinal, '', 0, 1);
          char = valorFinal.substr(1, 1);
        }
      } else {
        valorFinal = this.identificarValorCodBarrasArrecadacao(
          codigo,
          'LINHA_DIGITAVEL',
        );
      }
    }
    return parseFloat(valorFinal);
  }

  identificarValorCodBarrasArrecadacao(codigo, tipoCodigo) {
    codigo = codigo.replace(/[^0-9]/g, '');
    const isValorEfetivo = this.identificarReferencia(codigo).efetivo;

    let valorBoleto = '';
    let valorFinal;

    if (isValorEfetivo) {
      if (tipoCodigo == 'LINHA_DIGITAVEL') {
        valorBoleto = codigo.substr(4, 14);
        valorBoleto = codigo.split('');
        valorBoleto.slice(11, 1);
        // valorBoleto = valorBoleto.join('');
        valorBoleto = valorBoleto.substr(4, 11);
      } else if (tipoCodigo == 'CODIGO_DE_BARRAS') {
        valorBoleto = codigo.substr(4, 11);
      }

      valorFinal = valorBoleto.substr(0, 9) + '.' + valorBoleto.substr(9, 2);

      let char = valorFinal.substr(1, 1);
      while (char === '0') {
        valorFinal = this.substringReplace(valorFinal, '', 0, 1);
        char = valorFinal.substr(1, 1);
      }
    } else {
      valorFinal = 0;
    }

    return valorFinal;
  }

  substringReplace(str, repl, inicio, tamanho) {
    if (inicio < 0) {
      inicio = inicio + str.length;
    }

    tamanho = tamanho !== undefined ? tamanho : str.length;
    if (tamanho < 0) {
      tamanho = tamanho + str.length - inicio;
    }

    return [
      str.slice(0, inicio),
      repl.substr(0, tamanho),
      repl.slice(tamanho),
      str.slice(inicio + tamanho),
    ].join('');
  }

  identificarReferencia(codigo) {
    codigo = codigo.replace(/[^0-9]/g, '');

    const referencia = codigo.substr(2, 1);

    if (typeof codigo !== 'string')
      throw new TypeError('Insira uma string válida!');

    switch (referencia) {
      case '6':
        return {
          mod: 10,
          efetivo: true,
        };
        break;
      case '7':
        return {
          mod: 10,
          efetivo: false,
        };
        break;
      case '8':
        return {
          mod: 11,
          efetivo: true,
        };
        break;
      case '9':
        return {
          mod: 11,
          efetivo: false,
        };
        break;
      default:
        break;
    }
  }
}
