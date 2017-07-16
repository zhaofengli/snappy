import has from 'lodash/has';
import clone from 'lodash/clone';
import Utils from '@/snappy/Utils';
import GenosetData from '#/genosets.json';

const queries = {};

class Genosets {
  static getRawQuery(genoset) {
    if (has(queries, genoset)) {
      return queries[genoset];
    }
    if (has(GenosetData, genoset)) {
      if (!has(GenosetData[genoset], 'c')) {
        return null;
      }
      const query = Utils.parseGenosetCriteria(
        GenosetData[genoset].c,
        queries,
        Genosets.getRawQuery,
      );
      queries[genoset] = query;
      return query;
    }

    return null;
  }

  static getQuery(genoset) {
    return (file) => {
      const query = this.getRawQuery(genoset);

      if (typeof query === 'function') {
        return query(file.normalizedSnps);
      }

      return null;
    };
  }

  static getGenoset(genoset) {
    const r = clone(GenosetData[genoset]);
    r.name = genoset;
    r.match = this.getQuery(genoset);
    return r;
  }
}

Genosets[Symbol.iterator] = function* iterator() {
  for (const genoset of Object.keys(GenosetData)) {
    yield this.getGenoset(genoset);
  }
};

if (typeof Proxy === 'undefined') {
  for (const name of Object.keys(GenosetData)) {
    Object.defineProperty(Genosets, name, {
      // eslint-disable-next-line no-loop-func
      get: () => Genosets.getGenoset(name),
    });
  }
} else {
  // eslint-disable-next-line no-class-assign
  Genosets = new Proxy(Genosets, {
    get: (target, name) => {
      if (name in target) {
        return target[name];
      }
      return Genosets.getGenoset(name);
    },
  });
}

export default Genosets;
