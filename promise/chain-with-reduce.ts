
promises.reduce((chain: Promise<Cliente[]>, promise: Promise<Cliente>) => {
  return chain.then<Cliente[]>(clientes => new Promise((resolve, reject) => {
    promise.then(cliente => {
      // consome um cliente e o adiciona no array de clientes
      clientes.push(cliente);
      resolve(clientes);
    })
    .catch(err => reject(err));
  }));
}, Promise.resolve<Cliente[]>([]))
.then(clientes => {
  // consumir todos os clientes
});
