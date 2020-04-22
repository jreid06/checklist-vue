<template>
  <div class="d-flex align-items-center" :style="{ height: '100vh' }">
    <div class="app-home p-2 flex-grow-1">
      <h1 class="display-3">Checklist Calendar App</h1>
      <h4>Download &amp; add to your home screen</h4>
      <div class="d-flex justify-content-center mt-5">
        <router-link :to="{ name: 'Calendar' }" class="btn btn-light mr-4">
          Calendar
        </router-link>
      </div>
      <div class="app-home--image m-auto">
        <img alt="Vue logo" class="img-fluid" src="./../assets/3327590.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HomeView extends Vue {}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/Media.scss";

$black: #2c3e50;
$white: #fff;
$white-grey: #f2f2f2;

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
