<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-toolbar class="teal" dark>
        <v-toolbar-title>Merge files</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          Choose multiple files to merge. Make sure that they are from the same person.
        </p>

        <p>
          <v-select
            label="Files to merge"
            v-bind:items="files"
            v-model="selected"
            item-text="name"
            item-value="id"
            multiple
          ></v-select>

          <v-btn @click.native="merge">Merge</v-btn>

          <div v-if="state === 'processing'">
            <v-icon class="teal--text">hourglass_empty</v-icon>
            Processing
          </div>
          <div v-else-if="state === 'done'">
            <v-icon class="green--text">done</v-icon>
            Imported {{ count }} SNPs
          </div>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat="flat"
          v-if="state !== 'processing'"
          @click.native="dialog = false"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Utils from '@/snappy/Utils';
import File from '@/snappy/File';
import uuidv1 from 'uuid/v1';

export default {
  data() {
    return {
      dialog: false,
      state: 'idle',
      count: 0,
      selected: [],
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
  },
  methods: {
    open() {
      this.dialog = true;
      this.state = 'idle';
      this.selected = [];
    },
    merge() {
      this.state = 'processing';

      let snps = {};
      let currentId = '';

      const recurse = () => {
        currentId = this.selected.shift();
        Utils.mergeData(snps, this.$store.getters.getFile(currentId).snps).then((result) => {
          snps = result;

          if (this.selected.length) {
            recurse();
          } else {
            const file = new File(uuidv1(), snps);
            file.name = 'Merged';
            this.$store.commit('addFile', file);
            this.count = file.length;
            this.state = 'done';
          }
        });
      };

      setTimeout(() => recurse(), 0);
    },
  },
};
</script>
