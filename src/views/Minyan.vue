<template>
  <div>specific minyan goes here {{ minyanId }}</div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      minyanId: this.$route.params.minyanid,
    };
  },
};
</script>

<style></style>
