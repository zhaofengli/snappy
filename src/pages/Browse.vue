<template>
  <v-layout row wrap>
    <v-flex class="pa-2" xs12 sm8 offset-sm2 md6 offset-md3>
      <analyzer-wizard v-if="state === 'wizard'" @submit="submitWizard" class="elevation-0"></analyzer-wizard>
    </v-flex>
    <v-flex class="pa-1" xs12 md8 offset-md2>
      <analyzer-table v-if="state === 'table'" :file="file" :options="options">
      </analyzer-table>
    </v-flex>
  </v-layout>
</template>
<script>
import AnalyzerTable from '@/components/AnalyzerTable';
import AnalyzerWizard from '@/components/AnalyzerWizard';

export default {
  data() {
    return {
      state: 'wizard',
      file: null,
      options: {},
    };
  },
  created() {
    if (typeof this.suppliedFile === 'undefined') {
      // Show demo data
      this.state = 'table';
      this.file = null;
    } else {
      // Show wizard
      this.state = 'wizard';
    }
  },
  computed: {
    suppliedFile() {
      return this.$store.getters.getFile(this.$route.params.fileId);
    },
  },
  methods: {
    submitWizard(options) {
      this.options = options;
      this.file = this.suppliedFile;
      this.state = 'table';
    },
  },
  components: {
    'analyzer-table': AnalyzerTable,
    'analyzer-wizard': AnalyzerWizard,
  },
};
</script>
