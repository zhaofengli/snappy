<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-toolbar class="teal" dark>
        <v-toolbar-title>
          Export file
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-select
          required
          hide-details
          return-object
          label="Output format"
          :items="formats"
          v-model="format"
          item-text="name"
          item-value="id"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat="flat"
          :disabled="!format"
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
      format: null,
      formats: [
        {
          id: 'csv',
          extension: 'csv',
          mime: 'text/csv',
          name: 'CSV',
        },
        {
          id: 'json',
          extension: 'json',
          mime: 'application/json',
          name: 'JSON',
        },
        {
          id: 'snplist',
          extension: 'txt',
          mime: 'text/plain',
          name: 'List of SNPs (TXT)',
        },
      ],
    };
  },
  methods: {
    open(file) {
      this.dialog = true;
      this.file = file;
    },
    exportFile() {
      const filename = `${this.file.name}.${this.format.extension}`;
      const result = this.file.serialize(this.format.id);

      download(result, filename, this.format.mime);
    },
    done() {
      this.dialog = false;
    },
  },
};
</script>
