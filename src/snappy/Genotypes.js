import has from 'lodash/has';

const genotypeRegex = new RegExp('^([AGCTI-]);?([AGCTI-])$');

export default class Genotypes {
  static get(snp, genotype) {
    return new Promise((resolve, reject) => {
      import(/* webpackChunkName: "data" */ '../../data/genotypes.json').then((GenotypeData) => {
        if (has(GenotypeData, snp)) {
          if (typeof genotype === 'undefined') {
            // get(snp)
            return resolve(GenotypeData[snp]);
          }

          const g = genotypeRegex.exec(genotype);
          if (!g) {
            return reject(Error(`Invalid genotype ${snp} ${genotype}`));
          }

          let result = null;

          const match = this.getMatch(
            Object.keys(GenotypeData[snp]),
            g[1],
            g[2],
          );
          if (match) {
            // Exact match
            result = GenotypeData[snp][match];
          } else if (genotype.indexOf('I') !== -1) {
            // Insertion
            const candidates = [];
            for (const candidate of Object.keys(GenotypeData[snp])) {
              const normalized = candidate.replace(new RegExp('[AGCT]+', 'g'), 'I');
              if (this.matches(normalized, g[1], g[2])) {
                candidates.push(candidate);
              }
            }
            if (candidates.length !== 1) {
              // Ambiguous insertion
              return reject(Error(`${snp} ${genotype} is ambiguous or has no info; Possible genotypes include ${candidates}`));
            }
            result = GenotypeData[snp][candidates[0]];
            result.o = candidates[0];
          } else {
            return reject(Error(`Cannot interpret ${snp} ${genotype}: ${genotype} has no info`));
          }

          // Success
          result.name = snp;
          result.g = genotype;
          return resolve(result);
        }

        return reject(Error(`Cannot interpret ${snp} ${genotype}: ${snp} not supported`));
      });
    });
  }

  static getSupportedSnps() {
    return new Promise((resolve) => {
      // eslint-disable-next-line arrow-body-style
      import(/* webpackChunkName: "data" */ '../../data/genotypes.json').then((GenotypeData) => {
        return resolve(Object.keys(GenotypeData));
      });
    });
  }

  static getMatch(genotypes, allele1, allele2) {
    const s1 = `${allele1};${allele2}`;
    const s2 = `${allele2};${allele1}`;

    if (genotypes.includes(s2)) {
      return s2;
    }
    if (genotypes.includes(s1)) {
      return s1;
    }
    return false;
  }

  static matches(genotype, allele1, allele2) {
    return genotype === `${allele1};${allele2}` ||
           genotype === `${allele2};${allele1}`;
  }
}
