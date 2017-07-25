<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$mq.below(600)"
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card>
      <v-toolbar class="teal" dark>
        <v-btn dark icon @click.native="close" v-if="state !== 'processing'">
          <v-icon>close</v-icon>
        </v-btn>
        <v-icon dark v-else>hourglass_empty</v-icon>
        <v-toolbar-title>Import file</v-toolbar-title>
      </v-toolbar>
      <v-progress-linear
        class="progress"
        v-model="progress"
        :active="state !== 'idle'"
        :indeterminate="state === 'processing'"
        :secondary="state === 'downloading'"
        :success="state === 'done'"
        :error="state === 'error'"
      ></v-progress-linear>
      <v-card-text class="card-body">
        <p>
          <h6><v-icon>insert_drive_file</v-icon> Choose a file</h6>

          Choose a file downloaded from 23andMe, AncestryDNA or FamilyTreeDNA.
        </p>
        <p>
          The file will be processed on your computer and won't be uploaded.
        </p>
        <p>
          <v-btn
            primary
            :loading="state === 'processing' || state === 'downloading'"
            @click.native="showPicker"
          >
            Choose file
          </v-btn>
        </p>
        <v-divider></v-divider>
        <p>
          <h6><v-icon>account_circle</v-icon> Use a sample</h6>

          Haven't tested? Try a sample file from 23andMe.
        </p>
        <p>
          <v-btn
            primary
            :loading="state === 'processing' || state === 'downloading'"
            @click.native="importSample"
          >
            Download sample file
          </v-btn>
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import PromiseFileReader from 'promise-file-reader';
import FileDialog from 'file-dialog/file-dialog.min';
import Axios from 'axios';
import uuidv1 from 'uuid/v1';
import File from '@/snappy/File';
import FileParser from '@/workers/FileParser';

// eslint-disable-next-line import/no-webpack-loader-syntax
import SampleFileUrl from 'file-loader!@/assets/samples/genome_Lilly_Mendel_Mom__v4_Full.txt';

export default {
  data() {
    return {
      dialog: false,
      state: 'idle',
      worker: null,
      progress: 0,
      count: 0,
    };
  },
  methods: {
    open() {
      this.worker = new FileParser();
      this.worker.onmessage = (event) => {
        if (event.data.state === 'error') {
          this.state = 'error';
        } else {
          const file = new File(uuidv1(), event.data.snps);
          file.name = event.data.name;
          this.$store.commit('addFile', file);
          this.count = file.length;
          this.state = 'done';
        }
      };
      this.worker.onerror = () => {
        this.state = 'error';
        this.worker.terminate();
      };

      this.state = 'idle';
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.worker.terminate();
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
      this.state = 'downloading';
      Axios.get(SampleFileUrl, {
        onDownloadProgress: (e) => {
          this.progress = 100 * (e.loaded / e.total);
        },
      })
      .then((response) => {
        this.loadFile(response.data, 'Lilly Mendel');
      })
      .catch(() => {
        this.state = 'error';
      });
    },
    loadFile(raw, name) {
      this.state = 'processing';
      this.worker.postMessage({ raw, name });
    },
  },
};
</script>
<style lang="scss" scoped>
.progress {
  margin: 0;
}
.card-body {
  padding-top: 0;
}
</style>
