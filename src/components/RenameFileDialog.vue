<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-toolbar class="teal" dark>
        <v-toolbar-title>
          Rename file
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          name="Name"
          v-model="name"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat="flat"
          @click.native="done"
        >Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      file: null,
      name: '',
    };
  },
  methods: {
    open(file) {
      this.dialog = true;
      this.file = file;
      this.name = file.name;
    },
    done() {
      this.file.name = this.name;
      this.dialog = false;
    },
  },
};
</script>
