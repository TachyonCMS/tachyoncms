<template>
  <q-page class="flex flex-center">
    <q-card flat>
      <q-card-section class="text-center justify-center">
        <div class="text-h3 col-12">What's up?</div>
        <div class="text-h2 col-12">Izzup!</div>
        <div class="text-center justify-center">
          Izzup provides hosting for Flows created using
          <a href="https://www.tachyoncms.org/">TachyonCMS</a>.
        </div>
        <div class="text-center justify-center">
          Visit <a href="https://www.tachyoncms.org/">www.tachyoncms.org</a> to
          access the free editor.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>

<style scoped>
a:link {
  color: black;
}

/* visited link */
a:visited {
  color: black;
}

/* mouse over link */
a:hover {
  color: darkgray;
}

/* selected link */
a:active {
  color: black;
}
</style>
