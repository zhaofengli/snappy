import Dna2Json from 'dna2json';

self.addEventListener('message', (event) => {
  Dna2Json.parse(event.data.raw, (err, snps) => {
    if (err) {
      return postMessage({
        state: 'error',
        error: err,
      });
    }
    return postMessage({
      state: 'done',
      name: event.data.name,
      snps,
    });
  });
});
