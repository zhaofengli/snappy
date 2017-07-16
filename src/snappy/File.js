import clone from 'lodash/clone';
import has from 'lodash/has';
import MinusOrientationSnps from '#/minusorientationsnps.json';
import Utils from '@/snappy/Utils';

export default class File {
  constructor(id, snps) {
    this.id = id;

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
    this.snps = Object.freeze(snps);

    // Normalized SNPs
    this.normalizedSnps = {};
    const normalizedGetter = (target, snp) => {
      if (!has(this.snps, snp)) {
        return undefined;
      } else if (MinusOrientationSnps.indexOf(snp) === -1) {
        return this.snps[snp];
      }

      const flipped = clone(this.snps[snp]);
      flipped.genotype = Utils.flipAlleles(flipped.genotype);
      return flipped;
    };
    if (typeof Proxy === 'undefined') {
      // That sucks :(
      // Expect high memory usage and crashes
      for (const snp of Object.keys(snps)) {
        Object.defineProperty(this.normalizedSnps, snp, {
          get: () => normalizedGetter(this, snp),
        });
      }
    } else {
      this.normalizedSnps = new Proxy(this.normalizedSnps, {
        get: normalizedGetter,
      });
    }
    this.normalizedSnps = Object.freeze(this.normalizedSnps);
    this.name = 'Imported file';
  }

  get length() {
    Object.defineProperty(this, 'length', {
      value: Object.keys(this.snps).length,
      writable: false,
      configurable: true,
    });
    return this.length;
  }

  get nocalls() {
    const result = [];

    for (const snp of Object.keys(this.snps)) {
      if (this.snps[snp].genotype === '??') {
        result.push(snp);
      }
    }

    Object.defineProperty(this, 'nocalls', {
      value: result,
      writable: false,
      configurable: true,
    });
    return result;
  }
}
