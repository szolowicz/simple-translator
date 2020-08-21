<template>
  <div>
    <a
      href="https://github.com/Lumm1t/simple-translator"
      class="github-corner"
      aria-label="View source on GitHub"
      target="_BLANK"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="fill:#fff; color:#151513; position: absolute; top: 0; border: 0; right: 0;"
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;"
          class="octo-arm"
        />
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        />
      </svg>
    </a>

    <h1 class="logo animate__animated animate__pulse">
      Simple
      <br />translator
    </h1>

    <Languages
      @on-lang-from-select="updatePairFrom"
      @on-lang-to-select="updatePairTo"
    />

    <div class="translator">
      <div>
        <textarea
          @keyup="translate"
          autofocus
          :placeholder="t('textToTranslate')"
          v-model="textToTranslate"
          id="to-translate"
        ></textarea>

        <div class="buttons">
          <a class="button" href="#" @click.prevent="copyToTranslate">
            <span>{{ t('copyButton') }}</span>
          </a>

          <a class="button" href="#" @click.prevent="resetToTranslate">
            <span>{{ t('resetButton') }}</span>
          </a>
        </div>
      </div>

      <div>
        <div class="translated" v-if="textToTranslate && translation">
          {{ translation }}
        </div>
        <div class="translated waiting" v-else>{{ t('translatedText') }}</div>

        <div class="buttons">
          <a
            class="button copyTranslated"
            href="#"
            @click.prevent="copyTranslated"
          >
            <span>{{ t('copyButton') }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import Languages from './Languages';
import axios from 'axios';

import en from '@/assets/languages/english.json';
import pl from '@/assets/languages/polish.json';
import de from '@/assets/languages/german.json';
import ru from '@/assets/languages/russian.json';

const API_LINK = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';

export default {
  components: {
    Languages
  },

  setup() {
    const translator = reactive({
      textToTranslate: '',
      translation: '',
      languageFrom: null,
      languageTo: null
    });

    function translate() {
      if (!translator.textToTranslate) return;

      if (!(translator.languageFrom && translator.languageTo)) return;

      const data = {
        lang: `${translator.languageFrom}-${translator.languageTo}`,
        key: process.env.VUE_APP_API_KEY,
        text: translator.textToTranslate
      };

      const searchParams = new URLSearchParams(data);

      axios(`${API_LINK}${searchParams}`).then(response => {
        translator.translation = response.data.text[0];
      });
    }

    function updatePairFrom(index) {
      translator.languageFrom = index.value;
      translate();
    }

    function updatePairTo(index) {
      translator.languageTo = index.value;
      translate();
    }

    // TO-DO: Use dependency
    function copyToTranslate() {
      const toTranslate = document.getElementById('to-translate');

      toTranslate.select();
      toTranslate.setSelectionRange(0, 99999);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }

    function copyTranslated() {
      if (!translator.translation) return;

      const translated = document.getElementsByClassName('translated');
      const range = document.createRange();

      range.selectNode(translated[0]);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }

    function resetToTranslate() {
      translator.textToTranslate = '';
    }

    const { t } = useI18n({
      inheritLocale: true,
      messages: {
        en,
        pl,
        de,
        ru
      }
    });

    return {
      t,
      ...toRefs(translator),
      translate,
      updatePairFrom,
      updatePairTo,
      copyToTranslate,
      copyTranslated,
      resetToTranslate
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
@import url(//fonts.googleapis.com/css?family=Pacifico);

.logo {
  text-align: center;
  font-family: 'Pacifico', cursive;
  font-size: 3em;
  line-height: 1.2;
  font-weight: 100;
  padding-bottom: 20px;
}

.translator {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  gap: 1px 20px;
  margin-top: 20px;
}

textarea,
.translated {
  font-family: Arial, Helvetica, Verdana, sans-serif;
  font-size: 24px;
  width: 30vw;
  height: 30vh;
  border: 1px solid $light-gray;
  background-color: #0b0b0b;
  color: $white;
  align-self: center;
  padding: 10px;
}

textarea {
  outline: none;
  resize: none;
}

.translated {
  overflow-wrap: break-word;
  overflow-y: auto;
}

.waiting {
  color: #878787 !important;
}

.buttons {
  margin-top: 2px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  max-width: 90vw;
}

.button {
  margin: 0 0.4em 0.4em 0;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: roboto, sans-serif;
  font-weight: 300;
  color: $white;
  text-align: center;
  transition: all 0.2s;
  outline: none;
  padding: 0.25em 1.2em;
  border: 0.13em solid $white;

  &:hover {
    color: #000;
    background: $white;
  }
}

.copyTranslated {
  margin-top: 4px;
}

.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}

@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }

  20%,
  60% {
    transform: rotate(-25deg);
  }

  40%,
  80% {
    transform: rotate(10deg);
  }
}

@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }

  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

@media (max-width: 768px) {
  .translator {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
    gap: 15px 0px;
  }

  textarea,
  .translated {
    width: 80vw;
  }
}

@media (max-width: 600px) {
  textarea,
  .translated {
    width: 100vw;
  }
}
</style>
