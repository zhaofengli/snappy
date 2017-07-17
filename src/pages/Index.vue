<template>
  <v-container fluid class="full orange darken-2 text-xs-center pt-5">
    <h2 class="white--text">Snappy</h2>
    <v-container fluid grid-list-lg class="text-xs-left">
      <v-layout row wrap>
        <v-flex xs12 md8 offset-md2 lg4 offset-lg4>
          <unsupported-browser-warning></unsupported-browser-warning>
        </v-flex>
        <v-flex xs12 md8 offset-md2 lg4 offset-lg4>
          <v-card>
            <v-card-text>
              <v-layout row wrap class="mb-3">
                <v-flex xs12>
                  Snappy helps you browse through and interpret raw genotype files from DNA tests. In particular, it can:
                </v-flex>
              </v-layout>
              <v-layout row wrap v-for="(feature, index) in features" :key="index">
                <v-flex xs2>
                  <v-icon large>{{ feature.icon }}</v-icon>
                </v-flex>
                <v-flex xs10 class="line-mid">
                  {{ feature.text }}
                </v-flex>
              </v-layout>
              <v-layout row wrap class="mt-3">
                <v-flex xs12>
                  This is a prototype, and many things don't work. Please contribute to <a href="https://github.com/zhaofengli/snappy">our GitHub repo</a>.
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- Imported files -->
        <v-flex xs12 md8 offset-md2 lg4 offset-lg4>
          <v-card v-for="(file, index) in files" :key="index" class="blue lighten-2 mb-3">
            <v-card-title>
              <div class="headline ellipsis-x">{{ file.name }}</div>
            </v-card-title>
            <v-card-text class="pt-0">
              <v-chip
                class="green white--text"
                v-tooltip:top="{ html: `${file.length} SNPs` }"
              >
                <v-avatar v-if="icon(provider(file))" class="white">
                  <img :src="icon(provider(file))" :alt="provider(file)">
                </v-avatar>
                {{ provider(file) }}
              </v-chip>
              <v-chip>
                {{ sex(file) }}
              </v-chip>
              <v-chip>
                {{ callrate(file) }}% call rate
              </v-chip>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click.native="browseFile(file)">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat icon @click.native.stop="renameFile(file)"><v-icon>mode_edit</v-icon></v-btn>
              <v-btn flat icon @click.native.stop="exportFile(file)"><v-icon>save</v-icon></v-btn>
              <v-btn flat icon @click.native.stop="tinkerFile(file)"><v-icon>code</v-icon></v-btn>
              <v-btn flat icon class="red--text" @click.native="removeFile(file.id)"><v-icon>delete</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-btn light @click.native="showPicker">
      <span v-if="files.length === 0">
        Get started
      </span>
      <span v-else>
        Import file
      </span>
    </v-btn>
    <v-btn light @click.native="showMerger" v-if="files.length >= 2">
      Merge files
    </v-btn>
    <import-file-dialog ref="importDialog"></import-file-dialog>
    <export-file-dialog ref="exportDialog"></export-file-dialog>
    <rename-file-dialog ref="renameDialog"></rename-file-dialog>
    <merge-files-dialog ref="mergeDialog"></merge-files-dialog>
    <api-tutorial-dialog ref="apiTutorialDialog"></api-tutorial-dialog>
  </v-container>
</template>

<script>
import UnsupportedBrowserWarning from '@/components/UnsupportedBrowserWarning';
import ImportFileDialog from '@/components/ImportFileDialog';
import ExportFileDialog from '@/components/ExportFileDialog';
import RenameFileDialog from '@/components/RenameFileDialog';
import MergeFilesDialog from '@/components/MergeFilesDialog';
import ApiTutorialDialog from '@/components/ApiTutorialDialog';
import Genosets from '@/snappy/Genosets';
import Utils from '@/snappy/Utils';

export default {
  data() {
    return {
      features: [
        {
          icon: 'search',
          text: 'Search through SNPs',
        },
        {
          icon: 'compare_arrows',
          text: 'Cross-reference genotypes against SNPedia',
        },
        {
          icon: 'call_merge',
          text: 'Combine multiple genotype files',
        },
      ],
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    callrate() {
      return (file) => {
        const perc = 100 * (1 - (file.nocalls.length / file.length));
        return perc.toFixed(2).toString();
      };
    },
    sex() {
      return (file) => {
        if (Genosets.gs261.match(file)) {
          return 'Did you mix multiple people together?';
        } else if (Genosets.gs144.match(file)) {
          return 'Male';
        } else if (Genosets.gs145.match(file)) {
          return 'Female';
        }
        return 'Unknown sex';
      };
    },
    provider() {
      return file => Utils.guessProvider(file);
    },
    icon() {
      return provider => Utils.getLogo(provider);
    },
  },
  components: {
    'unsupported-browser-warning': UnsupportedBrowserWarning,
    'import-file-dialog': ImportFileDialog,
    'export-file-dialog': ExportFileDialog,
    'rename-file-dialog': RenameFileDialog,
    'merge-files-dialog': MergeFilesDialog,
    'api-tutorial-dialog': ApiTutorialDialog,
  },
  created() {
  },
  methods: {
    showPicker() {
      this.$refs.importDialog.open();
    },
    showMerger() {
      this.$refs.mergeDialog.open();
    },
    browseFile(file) {
      this.$router.push(`/browse/${file.id}`);
    },
    renameFile(file) {
      this.$refs.renameDialog.open(file);
    },
    exportFile(file) {
      this.$refs.exportDialog.open(file);
    },
    removeFile(id) {
      this.$store.commit('removeFile', id);
    },
    tinkerFile(file) {
      window.file = file;
      this.$refs.apiTutorialDialog.open();
    },
  },
};
</script>

<style lang="scss" scoped>
pre {
  background-color: #ccc;
  margin: 5px 0;
  padding: 5px;
}
.full {
  position: absolute;
  top: 48px;
  width: 100%;
  min-height: 100%;
}
.line-mid {
  line-height: 35px;
}
.ellipsis-x {
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
