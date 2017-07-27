import has from 'lodash/has';
import Genotypes from '@/snappy/Genotypes';

export default class Snps {
  static async get(snp) {
    const SnpData = await import(/* webpackChunkName: "snps" */ '#/snps.json');

    if (!has(SnpData, snp)) {
      throw Error(`No info for ${snp}`);
    }

    const result = SnpData[snp];
    result.getGenotype = genotype => Genotypes.get(snp, genotype);

    return result;
  }
}
