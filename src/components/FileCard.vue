<template>
  <v-card class="blue lighten-2 mb-3">
    <v-card-title>
      <div class="headline ellipsis-x">{{ file.name }}</div>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-chip
        class="green white--text"
        v-tooltip:top="{ html: `${file.length} SNPs` }"
      >
        <v-avatar v-if="icon" class="white">
          <img :src="icon" :alt="provider">
        </v-avatar>
        {{ provider }}
      </v-chip>
      <v-chip>
        {{ sex }}
      </v-chip>
      <v-chip>
        {{ callrate }}% call rate
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.native="browseFile">Explore</v-btn>
      <v-spacer></v-spacer>
      <v-btn flat icon @click.native.stop="renameFile"><v-icon>mode_edit</v-icon></v-btn>
      <v-btn flat icon @click.native.stop="exportFile"><v-icon>save</v-icon></v-btn>
      <v-btn flat icon @click.native.stop="tinkerFile"><v-icon>code</v-icon></v-btn>
      <v-btn flat icon class="red--text" @click.native="removeFile"><v-icon>delete</v-icon></v-btn>
    </v-card-actions>
    <export-file-dialog ref="exportDialog"></export-file-dialog>
    <rename-file-dialog ref="renameDialog"></rename-file-dialog>
    <api-tutorial-dialog ref="apiTutorialDialog"></api-tutorial-dialog>
  </v-card>
</template>
<script>
import ExportFileDialog from '@/components/ExportFileDialog';
import RenameFileDialog from '@/components/RenameFileDialog';
import ApiTutorialDialog from '@/components/ApiTutorialDialog';
import Genosets from '@/snappy/Genosets';
import Utils from '@/snappy/Utils';

export default {
  props: ['file'],
  computed: {
    callrate() {
      const perc = 100 * (1 - (this.file.nocalls.length / this.file.length));
      return perc.toFixed(2).toString();
    },
    provider() {
      return Utils.guessProvider(this.file);
    },
    icon() {
      return Utils.getLogo(this.provider);
    },
  },
  components: {
    'export-file-dialog': ExportFileDialog,
    'rename-file-dialog': RenameFileDialog,
    'api-tutorial-dialog': ApiTutorialDialog,
  },
  asyncComputed: {
    async sex() {
      const gs261 = await Genosets.get('gs261');
      const gs144 = await Genosets.get('gs144');
      const gs145 = await Genosets.get('gs145');

      if (gs261.match(this.file)) {
        return 'Did you mix multiple people together?';
      } else if (gs144.match(this.file)) {
        return 'Male';
      } else if (gs145.match(this.file)) {
        return 'Female';
      }
      return 'Unknown sex';
    },
  },
  methods: {
    browseFile() {
      this.$router.push(`/browse/${this.file.id}`);
    },
    renameFile() {
      this.$refs.renameDialog.open(this.file);
    },
    exportFile() {
      this.$refs.exportDialog.open(this.file);
    },
    removeFile() {
      this.$store.commit('removeFile', this.file.id);
    },
    tinkerFile() {
      window.file = this.file;
      this.$refs.apiTutorialDialog.open();
    },
  },
};
</script>
