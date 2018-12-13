const request = require('request');
const cheerio = require('cheerio');
const { App } = require('jovo-framework');
const es = require('./i18n/es-ES');
const us = require('./i18n/en-US');

const end = 'https://www.elnuevodiario.com.ni';

// language resources
const languageResources = {
  'es-ES': es,
  'en-US': us,
};

// application config
const config = {
  i18n: {
    resources: languageResources,
  },
  logging: false,
};

const app = new App(config);
app.setLanguageResources(languageResources);

app.setHandler({
  LAUNCH() {
    this.toIntent('LaunchIntent');
  },

  LaunchIntent() {
    const speech = this.speechBuilder();
    const self = this;

    // make http request
    request(end, (_, __, body) => {
      const $ = cheerio.load(body);
      let count = 0;
      $('#highlight-pager a').each((index, element) => {
        count += 1;
        const title = $(element).text();
        speech
          .addText(`${self.t('NUMBER')} ${count}`)
          .addBreak('300ms')
          .addText(title)
          .addBreak('300ms');
      });
      self.tell(speech);
    });
  },
});

module.exports.app = app;
