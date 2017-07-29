import clone from 'lodash/clone';
import has from 'lodash/has';
import Utils from '@/snappy/Utils';

export default class File {
  constructor(id, snps) {
    this.id = id;
    this.snps = Object.freeze(snps);

    // Normalized SNPs
    this.normalizedSnps = {};
    const normalizedGetter = (target, snp) => {
      if (!has(this.snps, snp)) {
        return undefined;
      } else if (!Utils.isSnpOrientationMinus(snp)) {
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
