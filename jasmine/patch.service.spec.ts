import { TestBed } from '@angular/core/testing';

import { PatchService, PatchDisponivel, IsPatchServiceHabilitado, IsDownloadPatchesCompleto } from './patch.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

const API = environment.api;

const patches: PatchDisponivel[] = [
  {
    'Id': '2',
    'ImpactoAtualizacao': '<b>Melhorias/Correções:</b>\n\nPT: Em: Configuração->Procedimento->Cadastro\nES: En: Configuración->Examen->Ingresar\n\t- PT: Ao iniciarmos um cadastro novo e preencher todos os campos obrigatórios. Ao clicar em salvar o sistema exibia um erro que impedia o termino do cadastro\nES: cuando comience un nuevo registro y complete todos los campos obligatorios. Cuando hace clic en guardar sistema, puede ver un error que impide que se complete el registro;\n\nPT: Impressões das telas Shift LIS > Atendimento > O.S. Cadastro e O.S. Consulta\nES: Impresiones de pantalla Shift LIS > Atención > O.S. Registro y O.S. Consulta\n\t- PT: Quando uma O.S. com obrigatoriedade de nota fiscal configurada na unidade de coleta já estivesse com a nota fiscal emitida e convertida e era necessário realizar a inclusão de um procedimento para uma fonte pagadora cortesia, era solicitada a emissão da nota fiscal. Por se tratar de uma fonte pagadora cortesia, ao selecionar o "Documento fiscal/recibo" para emissão, ocorria a mensagem: "O.S. não possui itens para emissão de nota" e não possível prosseguir com a inclusão\nES: Cuando ya se emitió y convirtió una factura de una O.S. con requisito de factura establecido en la procedencia y se tuvo que incluir un examen para un convenio cortesía, se solicitó la factura. Como se trata de un convenio cortesía, al seleccionar el "Documento fiscal/recibo" para su emisión, se produjo el mensaje: "OS no tiene elementos de facturación" y no pudo continuar con la inclusión;\n\nPT: Shift LIS > Fluxo de amostras > Configuração > Cadastro de tipo de malote\nES: Shift LIS > Flujo de muestras > Configuración > Registro de tipo de contenedor\n\t- PT: No cadastro de tipo de malote, estava sendo solicitada a configuração de recipiente padrão e recipiente por unidade do procedimento, ao invés de ser um ou outro\nES: En el registro de tipo de contenedor, se solicitaba el recipiente estándar y la configuración de recipiente por unidad del examen en lugar de ser uno u otro;\n\nPT: Shift View > Painel atendimento > Paineis > Painel atendimento - Vacina\nES: Shift View > Panel atención > Paneles > Panel atención - Vacuna\n\t- PT: Ao acessar o painel de atendimento vacinas, selecionar a opção "resumo" e clicar no detalhamento, estava aparecendo a mensagem de SQL\nES: Al acceder al panel de atención de la vacuna, seleccionar la opción "resumen" y hacer clic en el detalle, aparecía el mensaje SQL;\n\nPT: Shift Controller > Estoque > Relatórios > Inventário\nES: Shift Controller > Estoque > Informes > Inventário\n\t- PT: Ao gerar o relatório de inventário no formato CSV selecionando mais de uma central de estoque, no campo "Total central de estoque", a descrição da central de estoque era sempre a mesma. Ao gerar o mesmo relatório em PDF, a descrição da central na linha do total era exibida corretamente, porém, o valor total não era exibido\nES: Al generar el informe de inventario en formato CSV seleccionando más de una central de estoque, en el campo "Total central de estoque", la descripción de la central siempre fue la misma. Al generar el mismo informe PDF, la descripción de la central en la línea total se mostraba correctamente, pero el valor total no se mostraba;\n\nPT: Shift LIS > Atendimento > O.S. Cadastro\nES: Shift LIS > Atención > O.S. Registro\n\t- PT: Durante o cadastro de O.S., ao definir procedimentos com perguntas obrigatórias como pendente, chegar até a aba "Observações", retornar à aba "Procedimentos" e desmarcar um destes procedimentos, ao retornar para a aba "Observações", a pergunta referente ao procedimento que antes estava pendente não era apresentada, a mensagem "Perguntas obrigatórias não respondidas" era apresentada e não era possível prosseguir com o cadastro da O.S.\nES: Durante el registro de O.S., cuando configurado los exámenes con las preguntas requeridas como pendientes, acceda a la pestaña "Observaciones", regrese a la pestaña "Exámenes" y desmarque uno de estos exámenes volviendo a la pestaña "Observaciones", la pregunta sobre el examen que anteriormente pendiente no se mostraba, se visualizaba el mensaje "Preguntas sin respuesta requeridas" y no se podía continuar el registro de O.S.;',
    'TempoEstimadoAtualizacao': '1',
    'Versao': '5.0.930'
  },
  {
    'Id': '3',
    'ImpactoAtualizacao': '<b>Melhorias/Correções:</b>',
    'TempoEstimadoAtualizacao': '1',
    'Versao': '5.0.931'
  }
];

fdescribe('PatchService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatchService],
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: PatchService = TestBed.get(PatchService);
    expect(service).toBeTruthy();
  });

  it('isPatchHabilitado() should return true if patch is enabled', () => {
    const testUrl = `${API}/patch/is-habilitado`;
    const testData: IsPatchServiceHabilitado = {isHabilitado: true};

    const service: PatchService = TestBed.get(PatchService);
    service.isPatchHabilitado().subscribe(isHabilitado => {
      expect(isHabilitado).toBeTruthy();
      expect(service.isPatchHabilitadoAsync()).toBeTruthy();
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne(testUrl);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testData);
  });

  it('isPatchHabilitado() should return false if patch isn\'t enabled', () => {
    const testUrl = `${API}/patch/is-habilitado`;
    const testData: IsPatchServiceHabilitado = {isHabilitado: false};

    const service: PatchService = TestBed.get(PatchService);
    service.isPatchHabilitado().subscribe(isHabilitado => {
      expect(isHabilitado).toBeFalsy();
      expect(service.isPatchHabilitadoAsync()).toBeFalsy();
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });

  it('getNovosPatchesObservable() should return an Observable', () => {
    const service: PatchService = TestBed.get(PatchService);
    expect(service.getNovosPatchesObservable()).toBeDefined();
  });

  it('getNovosPatches() should return new patches', () => {
    const testUrl = `${API}/patch/versoes-disponiveis`;
    const testData: PatchDisponivel[] = patches;

    const service: PatchService = TestBed.get(PatchService);
    service.getNovosPatches().subscribe(lPatches => {
      expect(lPatches).toBeDefined();
      expect(lPatches).toEqual(testData);
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });

  it('isNovosPatchesStatupExecuted() should return false if getNovosPatches wasn\'t executed', () => {
    const service: PatchService = TestBed.get(PatchService);
    expect(service.isNovosPatchesStatupExecuted()).toBeFalsy();
  });

  it('isNovosPatchesStatupExecuted() should return true if getNovosPatches was executed', () => {
    const testUrl = `${API}/patch/versoes-disponiveis`;
    const testData: PatchDisponivel[] = patches;

    const service: PatchService = TestBed.get(PatchService);
    service.getNovosPatches().subscribe(lPatches => {
      expect(lPatches).toBeDefined();
    });
    expect(service.isNovosPatchesStatupExecuted()).toBeTruthy();

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });

  it('getLastPatched() should return []', () => {
    const service: PatchService = TestBed.get(PatchService);
    expect(service.getLastPatches()).toEqual([]);
  });

  it('getLastPatched() should return last patch', () => {
    const testUrl = `${API}/patch/versoes-disponiveis`;
    const testData: PatchDisponivel[] = patches;

    const service: PatchService = TestBed.get(PatchService);
    service.getNovosPatches().subscribe(lPatches => {
      expect(lPatches).toBeDefined();
      expect(lPatches).toEqual(testData);
      expect(service.getLastPatches()).toEqual(testData);
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });

  it('iniciarDowload() should return void', () => {
    const testUrl = `${API}/patch/download-versoes-disponiveis`;

    const service: PatchService = TestBed.get(PatchService);
    service.iniciarDowload().subscribe(() => {});

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('POST');
  });

  it('isDownloadComplete() should return', () => {
    const testUrl = `${API}/patch/is-download-completo`;
    const testData: IsDownloadPatchesCompleto = {isCompleto: false};

    const service: PatchService = TestBed.get(PatchService);
    service.isDownloadComplete().subscribe(isCompleto => {
      expect(isCompleto).toEqual(testData);
    });

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });

  it('getErroComunicacaoObservable() should return an Observable', () => {
    const service: PatchService = TestBed.get(PatchService);
    expect(service.getErroComunicacaoObservable()).toBeDefined();
  });

  afterEach(() => {
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });
});
