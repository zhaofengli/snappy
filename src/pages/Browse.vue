<template>
  <v-container fluid>
    {{ message }}
    <analyzer-table :file="file">
    </analyzer-table>
  </v-container>
</template>
<script>
import AnalyzerTable from '@/components/AnalyzerTable';

export default {
  data() {
    return {
      file: null,
      message: '',
    };
  },
  created() {
    const file = this.$store.getters.getFile(this.$route.params.fileId);
    if (typeof file === 'undefined') {
      this.file = null;
    } else {
      this.file = file;
    }
  },
  components: {
    'analyzer-table': AnalyzerTable,
  },
  methods: {
    search() {
      this.message = this.keywords.length;
    },
  },
};
</script>
