<template>
  <div>
    <div v-if="loaded">
      <v-text-field
        label="Search"
        v-model="search"
        append-icon="search"
      ></v-text-field>
      <v-data-table
        :search="search"
        :pagination.sync="paginationSync"
        :headers="headers"
        :items="items"
      >
        <template slot="items" scope="props">
          <td><a :href="url(props.item.name)">{{ props.item.name }}</a></td>
          <td>{{ props.item.m }}</td>
          <td>{{ props.item.r }}</td>
          <td>{{ props.item.s }}</td>
        </template>
      </v-data-table>
    </div>
    <div v-else class="loading">
      <v-progress-circular
        :size="70"
        class="orange--text"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>
<script>
import has from 'lodash/has';
import Utils from '@/snappy/Utils';
import Analyzer from '@/snappy/Analyzer';

export default {
  props: ['file'],
  data() {
    return {
      loaded: false,
      items: [],
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Magnitude',
          value: 'm',
          align: 'left',
        },
        {
          text: 'Repute',
          value: 'r',
          align: 'left',
        },
        {
          text: 'Summary',
          value: 's',
          align: 'left',
        },
      ],
      paginationSync: {
        rowsPerPage: 10,
        sortBy: 'm',
        descending: true,
      },
    };
  },
  computed: {
    url() {
      return page => `https://www.snpedia.com/index.php/${page}`;
    },
  },
  created() {
    if (!this.file) {
      this.loaded = true;
      this.items = [
        {
          name: '404',
          s: 'Hmm. There is no file to analyze.',
        },
      ];
      return;
    }

    this.loaded = false;
    this.items = [];

    Analyzer.analyze(this.file).then((data) => {
      const result = [];
      data.map((d) => {
        const entry = Object.assign(
          {
            name: '',
            m: 1,
            r: '',
            s: '',
          },
          d,
        );
        if (has(entry, 'o')) {
          entry.name += `(${entry.o})`;
        } else if (has(entry, 'g')) {
          const formatted = Utils.formatGenotype(entry.g);
          entry.name += `(${formatted})`;
        }
        return result.push(entry);
      });
      this.items = result;
      this.loaded = true;
    });
  },
};
</script>
<style lang="scss" scoped>
.loading {
  text-align: center;
}
</style>
