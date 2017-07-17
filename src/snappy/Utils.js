import Gql from 'gql';
import clone from 'lodash/clone';
import has from 'lodash/has';
import GsCriteriaParser from '@/snappy/gs-criteria.pegjs';

export default class Utils {
  static parseGenosetCriteria(criteria, genosets = {}, dependencyResolver = () => {}) {
    // Map criteria syntax to gql
    const logicMap = {
      and: 'and',
      or: 'or',
      atleast: 'atLeast',
      not: 'none',
    };
    const recurse = (c) => {
      if (typeof c === 'number' || typeof c === 'string') {
        return c;
      } else if (c.type === 'FunctionCall') {
        if (has(logicMap, c.name)) {
          // Logic function
          const mapped = logicMap[c.name];
          const args = [];
          for (const arg of c.args) {
            args.push(recurse(arg));
          }

          if (mapped === 'atLeast') {
            return Gql[mapped](args[0], args.slice(1));
          }

          return Gql[mapped](args);
        } else if (c.name.startsWith('gs')) {
          // Genoset
          if (has(genosets, c.name)) {
            return genosets[c.name];
          }
          const genoset = dependencyResolver(c.name);
          if (typeof genoset !== 'function') {
            throw new Error(`Depedency genoset not available: ${c.name}`);
          }
          return genoset;
        }

        // SNP
        if (c.args.length !== 1) {
          throw new Error('SNP functions can only have one argument');
        }

        const arg = c.args[0];
        if (typeof arg === 'string') {
          // At least one allele
          return Gql.has(c.name, arg);
        } else if (arg.type === 'Genotype') {
          // Both alleles match
          const genotype = arg.allele1 + arg.allele2;
          if (genotype === '--') {
            // HACK
            return () => false;
          }
          return Gql.exact(c.name, genotype.replace(new RegExp('D', 'g'), '-'));
        }
      }

      return null;
    };

    const parsed = GsCriteriaParser.parse(criteria);
    return recurse(parsed);
  }

  static mergeData(a, b, resolver) {
    return new Promise((resolve) => {
      const result = clone(a);

      // Default resolver: Always use b
      if (resolver === undefined) {
        // eslint-disable-next-line no-param-reassign
        resolver = (snp, ga, gb) => gb;
      }

      for (const snp of Object.keys(b)) {
        if (b[snp].genotype !== '??') {
          // Resolve conflicts
          if (
            has(a, snp) &&
            a[snp].genotype !== '??' &&
            a[snp].genotype !== b[snp].genotype
          ) {
            result[snp] = resolver(snp, a[snp], b[snp]);
          } else {
            // Both agree or a[snp] is no-call: Use b
            result[snp] = b[snp];
          }
        } else if (!has(a, snp)) {
          // a doesn't have this no-call
          result[snp] = b[snp];
        }
      }

      resolve(result);
    });
  }

  static flipAlleles(genotype) {
    return genotype.replace(/[ATCG]/g, m => (
      {
        A: 'T',
        T: 'A',
        C: 'G',
        G: 'C',
      }[m]
    ));
  }

  static guessProvider(file) {
    switch (file.length) {
      // 23andMe
      // TODO: Handle partial downloads
      case 598897: return '23andMe v4';
      case 991624: return '23andMe v3';
      case 579751: return '23andMe v2';

      // AncestryDNA
      case 668942: return 'AncestryDNA v2';
      case 701478: return 'AncestryDNA v1';

      // Others
      default: return 'Unknown';
    }
  }

  static getLogo(provider) {
    // Breaking some rules for style...
    /* eslint-disable global-require */
    const logoMap = {
      '23andMe': require('@/assets/icons/23andme.png'),
      AncestryDNA: require('@/assets/icons/ancestry.png'),
    };
    /* eslint-enable global-require */

    for (const keyword of Object.keys(logoMap)) {
      if (provider.indexOf(keyword) !== -1) {
        return logoMap[keyword];
      }
    }
    return null;
  }

  static formatGenotype(genotype) {
    return `${genotype[0]};${genotype[1]}`;
  }
}
