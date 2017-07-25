import intersection from 'lodash/intersection';
import Genotypes from '@/snappy/Genotypes';
import Genosets from '@/snappy/Genosets';
import File from '@/snappy/File';

async function process(fsnps) {
  const file = new File('', fsnps);
  const genosets = await Genosets.getSupportedGenosets();
  const snps = await Genotypes.getSupportedSnps();
  const promises = [];

  const commonSnps = intersection(
    Object.keys(file.snps),
    snps,
  );
  for (const snp of commonSnps) {
    const genotype = file.normalizedSnps[snp].genotype;
    if (genotype !== '??') {
      promises.push(Genotypes.get(snp, genotype));
    }
  }

  for (const genoset of genosets) {
    promises.push(new Promise((r, rj) => {
      Genosets.get(genoset).then((gs) => {
        if (gs.match(file)) {
          return r(gs);
        }
        return rj();
      });
    }));
  }

  const rPromises = promises.map(p => p
    .then(data => ({
      status: 'resolved',
      data,
    }))
    .catch(error => ({
      status: 'rejected',
      error,
    })),
  );

  const reflected = await Promise.all(rPromises);
  const results = [];
  for (const r of reflected) {
    if (r.status === 'resolved') {
      results.push(Object.assign({}, r.data));
    }
  }

  return postMessage({
    state: 'done',
    results: JSON.stringify(results),
  });
}

self.addEventListener('message', (event) => {
  process(event.data);
});
