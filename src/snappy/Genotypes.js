import has from 'lodash/has';

const genotypeRegex = new RegExp('^([AGCTI-]);?([AGCTI-])$');

export default class Genotypes {
  static async get(snp, genotype) {
    const GenotypeData = await import(/* webpackChunkName: "genotypes" */ '#/genotypes.json');

    if (snp.startsWith('i')) {
      // 23andMe SNP; might have a corresponding rsID
      const IidAliases = await import(/* webpackChunkName: "genotypes" */ '#/iidaliases.json');
      if (has(IidAliases, snp)) {
        // eslint-disable-next-line no-param-reassign
        snp = IidAliases[snp];
      }
    }

    if (has(GenotypeData, snp)) {
      if (typeof genotype === 'undefined') {
        // get(snp)
        return GenotypeData[snp];
      }

      const g = genotypeRegex.exec(genotype);
      if (!g) {
        throw Error(`Invalid genotype ${snp} ${genotype}`);
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
        result.o = match;
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
          throw Error(`${snp} ${genotype} is ambiguous or has no info; Possible genotypes include ${candidates}`);
        }
        result = GenotypeData[snp][candidates[0]];
        result.o = candidates[0];
      } else {
        throw Error(`Cannot interpret ${snp} ${genotype}: ${genotype} has no info`);
      }

      // Success
      if (typeof result === 'string') {
        // Redirect
        const target = result;
        result = GenotypeData[snp][target];
        result.o = target;
      }
      result.name = snp;
      result.g = genotype;
      return result;
    }

    throw Error(`Cannot interpret ${snp} ${genotype}: ${snp} not supported`);
  }

  static async getSupportedSnps() {
    const GenotypeData = await import(/* webpackChunkName: "genotypes" */ '#/genotypes.json');
    return Object.keys(GenotypeData);
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
