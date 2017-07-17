<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-toolbar class="teal" dark>
        <v-toolbar-title>
          Export file
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        The file will be saved in <a href="https://github.com/genomejs/dna2json">SNP-JSON format</a>.
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat="flat"
          @click.native="exportFile"
        >Export</v-btn>
        <v-btn
          flat="flat"
          @click.native="done"
        >Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import download from 'downloadjs';

export default {
  data() {
    return {
      dialog: false,
      file: null,
    };
  },
  methods: {
    open(file) {
      this.dialog = true;
      this.file = file;
    },
    exportFile() {
      const json = JSON.stringify(this.file.snps);
      download(json, 'snappy.json', 'application/json');
    },
    done() {
      this.dialog = false;
    },
  },
};
</script>
