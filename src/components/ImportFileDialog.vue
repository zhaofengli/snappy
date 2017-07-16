<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-toolbar class="teal" dark>
        <v-btn dark icon @click.native="dialog = false" v-if="state !== 'processing'">
          <v-icon>close</v-icon>
        </v-btn>
        <v-icon dark v-else>hourglass_empty</v-icon>
        <v-toolbar-title>Import file</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          Choose a file downloaded from 23andMe, AncestryDNA or FamilyTreeDNA.
        </p>
        <p>
          The file will be processed on your computer and won't be uploaded.
        </p>

        <p>
          <v-btn @click.native="showPicker" light>Choose file</v-btn>

          <div v-if="state === 'processing'">
            <v-icon class="teal--text">hourglass_empty</v-icon>
            Processing
          </div>
          <div v-else-if="state === 'done'">
            <v-icon class="green--text">done</v-icon>
            Imported {{ count }} SNPs
          </div>
          <div v-else-if="state === 'error'">
            <v-icon class="red--text">error</v-icon>
            Could not process raw data
          </div>
        </p>
        <v-divider></v-divider>
        <p>
          Haven't tested? Try a sample file from 23andMe.
          <v-btn @click.native="importSample" light>Download sample file</v-btn>
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import PromiseFileReader from 'promise-file-reader';
import FileDialog from 'file-dialog/file-dialog.min';
import Dna2Json from 'dna2json';
import Axios from 'axios';
import uuidv1 from 'uuid/v1';
import File from '@/snappy/File';

// eslint-disable-next-line import/no-webpack-loader-syntax
import SampleFileUrl from 'file-loader!@/assets/samples/genome_Lilly_Mendel_Mom__v4_Full.txt';

export default {
  data() {
    return {
      dialog: false,
      state: 'idle',
      count: 0,
    };
  },
  methods: {
    open() {
      this.dialog = true;
      this.state = 'idle';
    },
    showPicker() {
      FileDialog().then((list) => {
        if (!list.length) this.state = 'idle';

        const ofile = list[0];
        PromiseFileReader.readAsText(ofile).then((raw) => {
          this.loadFile(raw, ofile.name);
        });
      });
    },
    importSample() {
      Axios.get(SampleFileUrl)
        .then((response) => {
          this.loadFile(response.data, 'Lilly Mendel');
        });
    },
    loadFile(raw, name) {
      this.state = 'processing';
      setTimeout(() => {
        Dna2Json.parse(raw, (err, snps) => {
          if (err) this.state = 'error';
          else {
            const file = new File(uuidv1(), snps);
            file.name = name;
            this.$store.commit('addFile', file);
            this.count = file.length;
            this.state = 'done';
          }
        });
      }, 0);
    },
  },
};
</script>
