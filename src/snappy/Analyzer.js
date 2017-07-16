import intersection from 'lodash/intersection';
import Genotypes from '@/snappy/Genotypes';
import Genosets from '@/snappy/Genosets';

export default class Analyzer {
  static analyze(file) {
    return new Promise((resolve) => {
      Genotypes.getSupportedSnps().then((snps) => {
        const commonSnps = intersection(
          Object.keys(file.snps),
          snps,
        );

        const promises = [];
        for (const snp of commonSnps) {
          const genotype = file.normalizedSnps[snp].genotype;
          if (genotype !== '??') {
            promises.push(Genotypes.get(snp, genotype));
          }
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

        Promise.all(rPromises)
          .then((reflected) => {
            const results = [];
            for (const r of reflected) {
              if (r.status === 'resolved') {
                results.push(Object.assign({}, r.data));
              }
            }
            for (const genoset of Genosets) {
              if (typeof genoset.match === 'function') {
                if (genoset.match(file)) {
                  results.push(Object.assign({}, genoset));
                }
              }
            }
            return resolve(Object.freeze(results));
          });
      });
    });
  }
}
