async function storeGet(key) {
  return new Promise(resolve => {
    resolve(localStorage.getItem(key));
  });
}