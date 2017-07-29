import has from 'lodash/has';
import Utils from '@/snappy/Utils';
import IidAliases from '#/iidaliases.json';

const genotypeRegex = new RegExp('^([AGCTI-]);?([AGCTI-])$');

export default class Genotypes {
  static async get(snp, genotype) {
    const GenotypeData = await import(/* webpackChunkName: "genotypes" */ '#/genotypes.json');

    if (!has(GenotypeData, snp) && snp.startsWith('i')) {
      // 23andMe SNP; might have a corresponding rsID
      const resolved = Utils.resolveIidAlias(snp);
      if (resolved) {
        /* eslint-disable no-param-reassign */
        snp = resolved;
        if (Utils.isSnpOrientationMinus(snp)) {
          genotype = Utils.flipAlleles(genotype);
        }
        /* eslint-enable no-param-reassign */
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

        if (typeof result === 'string') {
          // Redirect
          const target = result;
          result = GenotypeData[snp][target];
          result.o = target;
        } else {
          result.o = match;
        }
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
      result.name = snp;
      result.g = genotype;
      return result;
    }

    throw Error(`Cannot interpret ${snp} ${genotype}: ${snp} not supported`);
  }

  static async getSupportedSnps() {
    const GenotypeData = await import(/* webpackChunkName: "genotypes" */ '#/genotypes.json');
    const result = Object.keys(GenotypeData).concat(Object.keys(IidAliases));
    Genotypes.getSupportedSnps = async () => result;
    return result;
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
