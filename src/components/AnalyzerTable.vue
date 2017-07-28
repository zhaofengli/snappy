<template>
  <div>
    <div v-if="loaded">
      <v-text-field
        label="Search"
        v-model="search"
        append-icon="search"
      ></v-text-field>
      <v-data-table
        class="data"
        :search="search"
        :pagination.sync="paginationSync"
        :headers="headers"
        :items="items"
      >
        <template slot="headers" scope="props">
          <tr style="display: none;"></tr>
        </template>
        <template slot="items" scope="props">
          <tr>
            <analyzer-card class="ma-2" :value="props.item" :options="options"></analyzer-card>
          </tr>
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
import AnalyzerCard from '@/components/AnalyzerCard';

export default {
  props: ['file', 'options'],
  data() {
    return {
      loaded: false,
      items: [],
      search: '',
      headers: [
        {
          text: 'Label',
          value: 'label',
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
  created() {
    if (!this.file) {
      this.loaded = true;
      this.items = [
        {
          label: 'rs1234(A;C)',
          name: 'rs1234',
          m: 1.5,
          r: 'Good',
          s: 'Hmm. There is no file to analyze. As a result, this is displayed as an example.',
        },
        {
          label: 'rs4988235(C;C)',
          name: 'rs4988235',
          m: 2.5,
          r: 'Bad',
          s: 'Hmm. There is no file to analyze. As a result, this is displayed as an example.',
        },
      ];
      return;
    }

    this.loaded = false;
    this.items = [];

    Analyzer.analyze(this.file, this.options).then((data) => {
      const result = [];
      data.map((d) => {
        const entry = Object.assign(
          {
            label: '',
            name: '',
            m: 1,
            r: '',
            s: '',
          },
          d,
        );
        entry.label = entry.name;
        if (has(entry, 'o')) {
          entry.label += `(${entry.o})`;
        } else if (has(entry, 'g')) {
          const formatted = Utils.formatGenotype(entry.g);
          entry.label += `(${formatted})`;
        }
        return result.push(entry);
      });
      this.items = result;
      this.loaded = true;
    });
  },
  components: {
    'analyzer-card': AnalyzerCard,
  },
};
</script>
<style lang="scss" scoped>
.loading {
  text-align: center;
}
.data {
  tr {
    border-bottom: none !important;
  }
}
</style>
