import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoadingHttpInterceptor } from './loading.http.interceptor';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { LoadingState, LoadingCompInterface } from './loading.interface';
import { catchError } from 'rxjs/operators';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

/**
 * https://angular.io/guide/http#testing-http-requests
 * https://medium.com/netscape/testing-with-the-angular-httpclient-api-648203820712
 */
describe('LoadingHttpInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const getComponentStub = () => ({
    // tslint:disable-next-line:no-unused
    setState: (state: LoadingState) => { },
    getState: () => { },
    getMinLoadingInterval: () => { },
    scrollIntoView: () => { }
  } as LoadingCompInterface);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingHttpInterceptor, LoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingHttpInterceptor,
          multi: true
        }],
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    // Now requests made in the course of your tests will hit the testing backend instead of the normal backend
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', inject([LoadingHttpInterceptor], (service: LoadingHttpInterceptor) => {
    expect(service).toBeTruthy();
  }));

  it('deve ignorar url não registrada', inject(
    [LoadingService],
    (loadingService: LoadingService) => {
      spyOn(loadingService, 'isUrlRegistered').and.callThrough();
      spyOn(loadingService, 'showByUrl').and.callThrough();

      const url = '/some/service';
      httpClient.get<any>(url).subscribe();

      const req = httpTestingController.expectOne(url);
      expect(loadingService.isUrlRegistered).toHaveBeenCalledWith(url);
      expect(loadingService.showByUrl).not.toHaveBeenCalled();

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(null);
    }));

  it('deve ignorar url registrada para componente não registrado', done => (inject(
    [LoadingService],
    (loadingService: LoadingService) => {
      spyOn(loadingService, 'showByUrl')
        // não usa o default stub... (https://hatoum.com/blog/2016/11/12/jasmine-unit-testing-dont-forget-to-callthrough)
        .and.callThrough();
      spyOn(loadingService, 'hideByUrl').and.callThrough();
      spyOn(loadingService, 'unregisterUrl').and.callThrough();

      const url = '/some/service';
      loadingService.registerUrl(url, 'loading1');
      httpClient.get<any>(url).subscribe();

      const req = httpTestingController.expectOne(url);
      // todo: estudar toHaveBeenCalledBefore para evitar uso de setTimeout
      // expect(loadingService.showByUrl).toHaveBeenCalledBefore(hideByUrlSpy);
      expect(loadingService.showByUrl).toHaveBeenCalled();
      setTimeout(() => {
        expect(loadingService.hideByUrl).toHaveBeenCalled();
        expect(loadingService.unregisterUrl).toHaveBeenCalled();
        done();
      }, 0);
      req.flush({});
    }))());

  it('deve processar url registrada para componente registrado, com sucesso na comunicação', done => (inject(
    [LoadingService],
    (loadingService: LoadingService) => {
      spyOn(loadingService, 'showByUrl').and.callThrough();
      spyOn(loadingService, 'hideByUrl').and.callThrough();
      spyOn(loadingService, 'unregisterUrl').and.callThrough();

      const id = 'loading1';
      const url = '/some/service';
      const component = getComponentStub();

      loadingService.registerUrl(url, id);
      loadingService.register(id, component);
      httpClient.get<any>(url).subscribe();

      const req = httpTestingController.expectOne(url);
      expect(loadingService.showByUrl).toHaveBeenCalled();
      setTimeout(() => {
        expect(loadingService.hideByUrl).toHaveBeenCalled();
        expect(loadingService.unregisterUrl).toHaveBeenCalled();
        done();
      }, 0);
      req.flush({});
    }))());

  it('deve processar url registrada para componente registrado, com erro na comunicação', done => (inject(
    [LoadingService],
    (loadingService: LoadingService) => {
      spyOn(loadingService, 'showByUrl').and.callThrough();
      spyOn(loadingService, 'hideByUrl').and.callThrough();
      spyOn(loadingService, 'unregisterUrl').and.callThrough();

      const id = 'loading1';
      const url = '/some/service';
      const component = getComponentStub();

      loadingService.registerUrl(url, id);
      loadingService.register(id, component);
      httpClient.get<any>(url).pipe(catchError(() => new EmptyObservable())).subscribe();

      const req = httpTestingController.expectOne(url);
      expect(loadingService.showByUrl).toHaveBeenCalled();
      setTimeout(() => {
        expect(loadingService.hideByUrl).toHaveBeenCalled();
        expect(loadingService.unregisterUrl).toHaveBeenCalled();
        done();
      }, 0);
      // Simula um erro HTTP
      req.error(new ErrorEvent('405'));
    }))());
});
