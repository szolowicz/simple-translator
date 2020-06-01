<template>
  <div>
    <div class="language">
      <div>
        <select v-model="translateFrom">
          <option :value="null" disabled>{{ t('languageSelect') }}</option>
          <option v-for="(option, index) in languageOptions" :key="index" :value="option">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div>
        <select v-model="translateTo">
          <option :value="null" disabled>{{ t('languageSelect') }}</option>
          <option v-for="(option, index) in languageOptions" :key="index" :value="option">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import selectableLanguages from '../assets/others/languages.json';

import en from '@/assets/languages/english.json';
import pl from '@/assets/languages/polish.json';
import de from '@/assets/languages/german.json';
import ru from '@/assets/languages/russian.json';

export default {
  setup(props, { emit }) {
    const languages = reactive({
      languageOptions: selectableLanguages,
      translateFrom: null,
      translateTo: null
    });

    watch(
      () => languages.translateFrom,
      value => {
        if (value) emit('onLangFromSelect', value);
      }
    );

    watch(
      () => languages.translateTo,
      value => {
        if (value) emit('onLangToSelect', value);
      }
    );

    const { t } = useI18n({
      inheritLocale: true,
      messages: {
        en,
        pl,
        de,
        ru
      }
    });

    return { t, ...toRefs(languages) };
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.language {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  gap: 1px 20px;
  margin-top: 20px;
  justify-items: center;
}

select {
  height: 35px;
  border: 0.15em solid $white;
  border-radius: 0.12em;
  font-weight: 300;
  color: $white;
  outline: none;
  background: none;
  font-size: 0.9em;

  option {
    background: $licorice;
  }
}
</style>
