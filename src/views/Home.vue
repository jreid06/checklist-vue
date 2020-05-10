<template>
  <div
    class="d-flex align-items-center position-relative"
    :style="{ height: '100vh' }"
  >
    <!-- <div class="position-absolute bg-home"></div> -->
    <div class="app-home p-2 flex-grow-1 mt-5 pt-5">
      <h1 class="display-2">Checklist Calendar App</h1>
      <h5>Add to your home screen</h5>
      <div class="d-flex justify-content-center">
        <v-btn :dark="isDarkMode">
          <router-link :to="{ name: 'Calendar' }">
            Calendar
          </router-link>
        </v-btn>
      </div>
      <div class="app-home--image m-auto">
        <img
          alt="Vue logo"
          class="img-fluid"
          src="./../assets/3327590-edit.png"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HomeView extends Vue {
  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/Media.scss";

$black: #2c3e50;
$white: #fff;
$white-grey: #f2f2f2;

.bg-home {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  z-index: 1;
  background: url(https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg);
}

.app-home {
  h1 {
    @include for-size(mobile) {
      font-size: 3.5rem;
    }

    @include for-size(mobile-landscape-max) {
      font-size: 2.5rem;
    }
  }

  &--image {
    max-width: 80%;

    @include for-size(mobile-landscape-max) {
      max-width: 35%;
    }

    @include for-size(tablet-portrait) {
      max-width: 50%;
    }

    @include for-size(desktop-xxl) {
      max-width: 35%;
    }
  }
}
</style>
