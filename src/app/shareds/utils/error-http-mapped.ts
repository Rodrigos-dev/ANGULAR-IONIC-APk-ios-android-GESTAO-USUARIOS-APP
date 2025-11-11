import { HttpErrorResponse } from '@angular/common/http';
import { HttpMappedError } from 'src/app/core/models/error-http-mapped.model';

export const verifyErrors = (error: HttpErrorResponse): HttpMappedError => {
  let errorDetails: HttpMappedError;
  const messageErro = error.error?.message ? error.error.message : null;

  switch (error.status) {
    case 400:
      errorDetails = {
        status: 400,
        title: 'Erro 400: Requisição inválida',
        description: 'A requisição está malformada ou contém dados inválidos.',
        messageToUser:
          messageErro ||
          'Não foi possível completar a solicitação. Tente novamente mais tarde.',
      };
      break;
    case 401:
      errorDetails = {
        status: 401,
        title: 'Erro 401: Não autorizado',
        description: 'O token de autenticação não é válido ou expirou.',
        messageToUser:
          messageErro || 'Seção expirada, por favor, refaça o login.',
      };
      break;
    case 403:
      errorDetails = {
        status: 403,
        title: 'Erro 403: Proibido',
        description: 'Você não tem permissão para acessar este recurso.',
        messageToUser:
          messageErro || 'Você não tem permissão para realizar esta ação.',
      };
      break;
    case 404:
      errorDetails = {
        status: 404,
        title: 'Erro 404: Recurso não encontrado',
        description: 'O recurso solicitado não foi encontrado no servidor.',
        messageToUser:
          messageErro ||
          'Desculpe, não conseguimos encontrar o que você procurava.',
      };
      break;
    case 500:
      errorDetails = {
        status: 500,
        title: 'Erro 500: Erro interno do servidor',
        description: 'Houve um erro no servidor. Tente novamente mais tarde.',
        messageToUser:
          messageErro ||
          'Algo deu errado no nosso lado. Tente novamente mais tarde.',
      };
      break;
    case 502:
      errorDetails = {
        status: 502,
        title: 'Erro 502: Bad Gateway',
        description:
          'Problemas de comunicação entre servidores. O servidor não conseguiu responder corretamente.',
        messageToUser:
          messageErro ||
          'Estamos tendo dificuldades técnicas. Tente novamente mais tarde.',
      };
      break;
    case 503:
      errorDetails = {
        status: 503,
        title: 'Erro 503: Serviço indisponível',
        description:
          'O servidor está temporariamente indisponível devido a manutenção ou sobrecarga.',
        messageToUser:
          messageErro ||
          'O serviço está temporariamente fora do ar. Tente novamente em breve.',
      };
      break;
    case 504:
      errorDetails = {
        status: 504,
        title: 'Erro 504: Gateway Timeout',
        description:
          'O servidor demorou muito para responder, resultando em um timeout.',
        messageToUser:
          messageErro ||
          'Estamos tendo problemas de conexão. Tente novamente mais tarde.',
      };
      break;
    default:
      errorDetails = {
        status: error.status,
        title: `Erro desconhecido: ${
          error.statusText || 'Sem descrição do erro'
        }`,
        description:
          'Um erro desconhecido ocorreu. Verifique os detalhes para mais informações.',
        messageToUser:
          messageErro ||
          'Não foi possível completar a solicitação. Tente novamente mais tarde.',
      };
      break;
  }

  return errorDetails;
};
