<template>
  <a href="#" @click.prevent="toggle">{{ text }}</a>
</template>
<script>
export default {
  props: ['value'],
  computed: {
    text() {
      return this.value ? 'Less' : 'More';
    },
  },
  methods: {
    toggle() {
      this.value = !this.value;
      this.$emit('input', this.value);
    },
  },
};
</script>
