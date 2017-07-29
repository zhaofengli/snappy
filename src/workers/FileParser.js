import Dna2Json from 'dna2json';

self.addEventListener('message', (event) => {
  Dna2Json.parse(event.data.raw, (err, snps) => {
    if (err) {
      return postMessage({
        state: 'error',
        error: err,
      });
    }

    // HACK: Dirty hack for dna2json/gql; this should probably be upstreamed
    //
    // 23andMe reports genotypes on some chromosomes with one letter,
    // causing inconsistencies when querying.
    //
    // This makes 23andMe data compatible with SNPedia's notations
    for (const snp of Object.keys(snps)) {
      const g = snps[snp].genotype;
      if (g.length === 1) {
        snps[snp].genotype = `${g}${g}`;
      }
    }
    return postMessage({
      state: 'done',
      name: event.data.name,
      snps,
    });
  });
});
