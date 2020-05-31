<template>
  <div id="app">
    <Translator />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import Translator from './components/Translator';

export default {
  name: 'App',
  components: {
    Translator
  },
  setup() {
    const { locale } = useI18n();

    onMounted(() => {
      let browserLanguage = navigator.languages
        ? navigator.languages[0]
        : navigator.language || navigator.userLanguage;
      const accepted = ['en', 'pl', 'de', 'ru'];
      const language = accepted.includes(browserLanguage) ? browserLanguage : 'en';

      locale.value = language;
    });
  }
};
</script>

<style lang="scss">
@import './assets/scss/variables';

body {
  font-family: roboto, arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  background-color: $licorice;
  color: $white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>
