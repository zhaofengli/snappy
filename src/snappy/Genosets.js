import has from 'lodash/has';
import Utils from '@/snappy/Utils';

const queries = {};

export default class Genosets {
  static getRawQuery(data, genoset) {
    if (has(queries, genoset)) {
      return queries[genoset];
    }
    if (has(data, genoset)) {
      if (!has(data[genoset], 'c')) {
        return null;
      }
      const query = Utils.parseGenosetCriteria(
        data[genoset].c,
        queries,
        gs => Genosets.getRawQuery(data, gs),
      );
      queries[genoset] = query;
      return query;
    }

    return null;
  }

  static getQuery(data, genoset) {
    return (file) => {
      const query = this.getRawQuery(data, genoset);

      if (typeof query === 'function') {
        return query(file.normalizedSnps);
      }

      return null;
    };
  }

  static async get(genoset) {
    const GenosetData = await import(/* webpackChunkName: "genosets" */ '#/genosets.json');
    const result = Object.assign({}, GenosetData[genoset]);
    result.name = genoset;
    result.match = Genosets.getQuery(GenosetData, genoset);
    return result;
  }

  static async getSupportedGenosets() {
    const GenosetData = await import(/* webpackChunkName: "genosets" */ '#/genosets.json');
    return Object.keys(GenosetData);
  }
}
