 
describe('teste com promise ', () => {

  it('deve disparar uma promise e aguardar seu retorno', () => {
    // promise usada para controlar asincronia do teste
    return new Promise((resolve, reject) => {
      const xmlFile = 'spec/nfe/35180173909400000511550000000110951767687678-nfe.xml';
      // função que retorna um promise
      loadFromXml(xmlFile).then(cliente => {
        expect(cliente).toBeDefined();
        // resolve a promise do teste, assim informando ao jasmine que o teste finalizou
        resolve();
      });
    });
  });
  
});
