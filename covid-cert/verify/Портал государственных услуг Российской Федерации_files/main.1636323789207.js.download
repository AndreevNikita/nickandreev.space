(function () {
  window.APP = {
    lang: 'ru',
    toogleLang: function () {
      this.lang = this.lang === 'en' ? 'ru' : 'en';
      var queryParams = new URLSearchParams(window.location.search);
      queryParams.set("lang", this.lang);
      window.history.replaceState(null, null, "?" + queryParams.toString());
      this.init();
    },
    getValue: function (cert, fieldName) {
      if (this.lang === 'ru') {
        if (cert) {
          return cert[fieldName];
        } else {
          return this[fieldName];
        }
      } else {
        if (cert) {
          return cert['en' + fieldName] || cert[fieldName];
        } else {
          return this['en' + fieldName] || this[fieldName];
        }
      }
    },
    setContainerImage: function (cert) {
      var cls = '';
      var self = this;
      switch (cert.type) {
        case 'TEMPORARY_CERT':
          if (cert.status === 'OK') {
            cls = '';
            self.certStatusName = 'Действителен';
            self.encertStatusName = 'Valid';
          } else if (cert.status === 'CANCELED') {
            cls = 'invalid';
            self.certStatusName = 'Аннулирован';
            self.encertStatusName = 'Cancelled';
          } else if (cert.status === 'EXPIRED') {
            cls = 'invalid';
            self.certStatusName = 'Срок истёк ' + cert.expiredAt;
            self.encertStatusName = 'Expired ' + cert.expiredAt;
          } else if (cert.status === "404") {
            cls = 'invalid';
            self.certStatusName = 'Не найден';
            self.encertStatusName = 'Not found';
          } else {
            cls = 'invalid';
            self.certStatusName = 'Не действителен';
            self.encertStatusName = 'Invalid';
          }
          break;
        case 'VACCINE_CERT':
          if (cert.status === '1') {
            cls = '';
            self.certStatusName = 'Действителен';
            self.encertStatusName = 'Valid';
          } else if (cert.status === "404") {
            cls = 'invalid';
            self.certStatusName = 'Не найден';
            self.encertStatusName = 'Not found';
          } else {
            cls = 'invalid';
            self.certStatusName = 'Не действителен';
            self.encertStatusName = 'Invalid';
          }
          break;
        case 'COVID_TEST':
          if (cert.status === "404") {
            cls = 'invalid';
            self.certStatusName = 'Не найден';
            self.encertStatusName = 'Not found';
          } else if (cert.status !== '0' && cert.status !== '3' && cert.expired !== '1') {
            if (cert.status && cert.status.toLocaleLowerCase() !== 'отрицательный') {
              cls = 'invalid';
              self.encertStatusName = 'Positive';
            } else {
              cls = '';
              self.encertStatusName = 'Negative';
            }
            self.certStatusName = cert.status;
          } else if (cert.status === '3' || cert.expired === '1') {
            cls = 'invalid';
            self.certStatusName = 'Срок истёк ' + cert.expiredAt;
            self.encertStatusName = 'Expired ' + cert.expiredAt;
          } else {
            cls = 'invalid';
            self.certStatusName = 'Не действителен';
            self.encertStatusName = 'Invalid';
          }
          break;
        case 'ILLNESS_FACT':
          if (cert.status === '1') {
            cls = '';
            self.certStatusName = 'Переболел';
            self.encertStatusName = 'Recovered';
          } else if (cert.status === '3' && cert.expiredAt) {
            cls = 'invalid';
            self.certStatusName = 'Срок истёк ' + cert.expiredAt;
            self.encertStatusName = 'Expired ' + cert.expiredAt;
          } else if (cert.status === "404") {
            cls = 'invalid';
            self.certStatusName = 'Не найдено';
            self.encertStatusName = 'Not found';
          } else {
            cls = 'invalid';
            self.certStatusName = 'Не действителен';
            self.encertStatusName = 'Invalid';
          }
          break;
        default:
          cls = 'invalid';
          self.certStatusName = 'Не найден';
          self.encertStatusName = 'Not found';
      }

      // всё хорошо и требуется показать qr код
      if (cert.status !== '404' &&
        cert.status !== '3' &&
        cert.status !== 'EXPIRED' &&
        cert.expired !== '1' &&
        self.isShowQRCode) {
        cls = 'hide';

        var imgElement = document.createElement('img');
        var qrContainerElement = document.querySelector('.qr-container');
        qrContainerElement.innerHTML = '';
        imgElement.setAttribute('src', 'data:image/jpeg;charset=utf-8;base64, ' + cert.qr)
        qrContainerElement.appendChild(imgElement);
        qrContainerElement.classList.remove('hide');

        var qrNumberElement = document.querySelector('.qr-number');
        qrNumberElement.classList.remove('hide');

        qrNumberElement.innerHTML = '№ ' + cert.unrzFull.replace(/^(.{4})(.{4})(.{4})(.*)$/, '$1 $2 $3 $4');

        document.querySelector('.button.close').classList.toggle('hide');
        const buttonDownload = document.querySelector('.button.download');

        buttonDownload.classList.remove('hide');
        buttonDownload.innerHTML = self.lang === 'ru' ? 'Версия для печати' : 'Print version';
        buttonDownload.setAttribute('href', cert.pdfUrl);
      }
      return cls;
    },
    filterAttrs: function (cert, targetNames, engVersion) {
      return cert.attrs.filter(function (attr) {
        return targetNames.indexOf(attr.type) !== -1 && (attr.value || engVersion && attr.envalue);
      });
    },
    completeDates: function (attrsDates, cert) {
      var dates = [];
      var hasResultDate = attrsDates.some(item => item.title === 'Дата результата');
      var hasValidUntil = attrsDates.some(item => item.title === 'Действует до');
      var invalidStatus = +(cert.status) === 3 || cert.status === 'CANCELED' || cert.status === 'EXPIRED';
      var isExpired = cert.expired === '1';
      for (var i = 0; i < attrsDates.length; i++) {
        var item = attrsDates[i];
        if (item.title === 'Дата взятия анализа' && hasResultDate ||
          item.title === 'Действует до' && (invalidStatus || isExpired)) {
          continue;
        }
        dates.push(attrsDates[i]);
      }
      if (!hasValidUntil && cert.expiredAt && !invalidStatus) {
        dates.push({
          type: "date",
          title: "Действует до",
          entitle: "Valid until",
          envalue: cert.expiredAt,
          value: cert.expiredAt,
          order: 1
        });
      }
      return dates;
    },
    showDates: function (attrsDates, status) {
      var datesContainer = document.querySelector('.person-data-dates');
      datesContainer.innerHTML = '';
      var self = this;
      if (attrsDates && attrsDates.length) {
        for (var i = 0; i < attrsDates.length; i++) {
          datesContainer.innerHTML += self.datesHtmlSnippet(self.getValue(attrsDates[i], 'title'), self.getValue(attrsDates[i], 'value'));
        }
      } else {
        datesContainer.classList.add('hide');
      }
    },
    datesHtmlSnippet(title, value) {
      return `
                <div class="mb-4 person-data-wrap align-items-center">
                  <div class="person-date mr-12">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0625 7.1875C12.4077 7.1875 12.6875 6.90768 12.6875 6.5625C12.6875 6.21732 12.4077 5.9375 12.0625 5.9375C11.7173 5.9375 11.4375 6.21732 11.4375 6.5625C11.4375 6.90768 11.7173 7.1875 12.0625 7.1875Z" fill="#66727F"/>
                      <path d="M13.5 1.25H12.6875V0.625C12.6875 0.279813 12.4077 0 12.0625 0C11.7173 0 11.4375 0.279813 11.4375 0.625V1.25H8.59375V0.625C8.59375 0.279813 8.31394 0 7.96875 0C7.62356 0 7.34375 0.279813 7.34375 0.625V1.25H4.53125V0.625C4.53125 0.279813 4.25144 0 3.90625 0C3.56106 0 3.28125 0.279813 3.28125 0.625V1.25H2.5C1.1215 1.25 0 2.3715 0 3.75V13.5C0 14.8785 1.1215 16 2.5 16H7.28125C7.62644 16 7.90625 15.7202 7.90625 15.375C7.90625 15.0298 7.62644 14.75 7.28125 14.75H2.5C1.81075 14.75 1.25 14.1892 1.25 13.5V3.75C1.25 3.06075 1.81075 2.5 2.5 2.5H3.28125V3.125C3.28125 3.47019 3.56106 3.75 3.90625 3.75C4.25144 3.75 4.53125 3.47019 4.53125 3.125V2.5H7.34375V3.125C7.34375 3.47019 7.62356 3.75 7.96875 3.75C8.31394 3.75 8.59375 3.47019 8.59375 3.125V2.5H11.4375V3.125C11.4375 3.47019 11.7173 3.75 12.0625 3.75C12.4077 3.75 12.6875 3.47019 12.6875 3.125V2.5H13.5C14.1892 2.5 14.75 3.06075 14.75 3.75V7.3125C14.75 7.65769 15.0298 7.9375 15.375 7.9375C15.7202 7.9375 16 7.65769 16 7.3125V3.75C16 2.3715 14.8785 1.25 13.5 1.25Z" fill="#66727F"/>
                      <path d="M12.2188 8.4375C10.1337 8.4375 8.4375 10.1337 8.4375 12.2188C8.4375 14.3038 10.1337 16 12.2188 16C14.3038 16 16 14.3038 16 12.2188C16 10.1337 14.3038 8.4375 12.2188 8.4375ZM12.2188 14.75C10.823 14.75 9.6875 13.6145 9.6875 12.2188C9.6875 10.823 10.823 9.6875 12.2188 9.6875C13.6145 9.6875 14.75 10.823 14.75 12.2188C14.75 13.6145 13.6145 14.75 12.2188 14.75Z" fill="#66727F"/>
                      <path d="M13.125 11.5938H12.8438V10.9375C12.8438 10.5923 12.5639 10.3125 12.2188 10.3125C11.8736 10.3125 11.5938 10.5923 11.5938 10.9375V12.2188C11.5938 12.5639 11.8736 12.8438 12.2188 12.8438H13.125C13.4702 12.8438 13.75 12.5639 13.75 12.2188C13.75 11.8736 13.4702 11.5938 13.125 11.5938Z" fill="#66727F"/>
                      <path d="M9.34375 7.1875C9.68893 7.1875 9.96875 6.90768 9.96875 6.5625C9.96875 6.21732 9.68893 5.9375 9.34375 5.9375C8.99857 5.9375 8.71875 6.21732 8.71875 6.5625C8.71875 6.90768 8.99857 7.1875 9.34375 7.1875Z" fill="#66727F"/>
                      <path d="M6.625 9.90625C6.97018 9.90625 7.25 9.62643 7.25 9.28125C7.25 8.93607 6.97018 8.65625 6.625 8.65625C6.27982 8.65625 6 8.93607 6 9.28125C6 9.62643 6.27982 9.90625 6.625 9.90625Z" fill="#66727F"/>
                      <path d="M3.90625 7.1875C4.25143 7.1875 4.53125 6.90768 4.53125 6.5625C4.53125 6.21732 4.25143 5.9375 3.90625 5.9375C3.56107 5.9375 3.28125 6.21732 3.28125 6.5625C3.28125 6.90768 3.56107 7.1875 3.90625 7.1875Z" fill="#66727F"/>
                      <path d="M3.90625 9.90625C4.25143 9.90625 4.53125 9.62643 4.53125 9.28125C4.53125 8.93607 4.25143 8.65625 3.90625 8.65625C3.56107 8.65625 3.28125 8.93607 3.28125 9.28125C3.28125 9.62643 3.56107 9.90625 3.90625 9.90625Z" fill="#66727F"/>
                      <path d="M3.90625 12.625C4.25143 12.625 4.53125 12.3452 4.53125 12C4.53125 11.6548 4.25143 11.375 3.90625 11.375C3.56107 11.375 3.28125 11.6548 3.28125 12C3.28125 12.3452 3.56107 12.625 3.90625 12.625Z" fill="#66727F"/>
                      <path d="M6.625 12.625C6.97018 12.625 7.25 12.3452 7.25 12C7.25 11.6548 6.97018 11.375 6.625 11.375C6.27982 11.375 6 11.6548 6 12C6 12.3452 6.27982 12.625 6.625 12.625Z" fill="#66727F"/>
                      <path d="M6.625 7.1875C6.97018 7.1875 7.25 6.90768 7.25 6.5625C7.25 6.21732 6.97018 5.9375 6.625 5.9375C6.27982 5.9375 6 6.21732 6 6.5625C6 6.90768 6.27982 7.1875 6.625 7.1875Z" fill="#66727F"/>
                    </svg>
                 </div>
                  <div class="small-text gray mr-4">${title}: </div>
                  <div class="small-text gray">${value}</div>
                </div>
            `;
    },
    showAttrs: function (attrs) {
      var attrsContainer = document.querySelector('.person-data-attrs');
      attrsContainer.innerHTML = '';
      var self = this;
      if (attrs && attrs.length) {
        for (i = 0; i < attrs.length; i++) {
          var attrWrapCls = 'mb-4 person-data-wrap attr-wrap';
          var attrTitleCls = 'small-text mb-4 mr-4 attr-title';
          var attrValueCls = 'attrValue';
          if (attrs[i].type === 'enPassport' && self.lang === 'ru') {
            attrWrapCls = `mb-4 person-data-wrap attr-wrap hide`;
          }
          if (attrs[i].type === 'fio') {
            attrTitleCls = 'small-text mb-4 mr-4 attr-title hide';
            attrValueCls = 'attrValue title-h6 bold text-center';
          } else {
            attrValueCls = 'attrValue small-text gray';
          }
          attrsContainer.innerHTML += `<div class="${attrWrapCls}"><div class="${attrTitleCls}">${self.getValue(attrs[i], "title")}: </div><div class="${attrValueCls}">${self.getValue(attrs[i], "value")}</div></div>`;
        }
      } else {
        attrsContainer.classList.add('hide');
      }
    },
    getParam: function (paramName) {
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      return urlParams.get(paramName)
    },
    fadeOutEffect(elem) {
      const fadeEffect = setInterval(() => {
        if (elem && !elem.style.opacity) {
          elem.style.opacity = '1';
        }
        if (elem && parseFloat(elem.style.opacity) > 0) {
          elem.style.opacity = (parseFloat(elem.style.opacity) - 0.5) + '';
        } else if (elem) {
          clearInterval(fadeEffect);
          elem.parentNode.removeChild(elem);
        }
      }, 10);
    },
    init: function () {
      document.body.classList.add('loading');
      var self = this;
      var unrz = window.location.pathname.split("/").filter((segment) => !!segment).pop();
      var isStatusPage = window.location.pathname.includes('/status/')
      var statusCheckUrl = self.config.covidCertUrl + 'cert/status/';
      var url = (isStatusPage ? statusCheckUrl : self.config.covidCertCheckUrl) + unrz;
      var lang = this.getParam('lang');
      this.lang = lang || 'ru';
      var ck = this.getParam('ck');
      // признак, что требуется отображать qr код
      this.isShowQRCode = this.getParam('qr') === 'true';
      if (lang || ck) {
        var params = lang ? `lang=${lang}` : '';
        if (params && ck) {
          params += `&ck=${ck}`
        } else if (ck) {
          params += `ck=${ck}`
        }
        url += `?${params}`;
      }
      var isTemp = unrz.startsWith('4');

      function showData(data) {
        var cert = data;
        self.cert = cert;

        document.body.classList.remove('loading');
        self.fadeOutEffect(document.getElementById('start-app-loader'));

        var unrz = document.querySelector('.unrz');
        var num = document.querySelector('.num-symbol');


        if (cert.attrs) {
          var dates = self.completeDates(self.filterAttrs(cert, ['date']), cert);
          self.showDates(dates);
          self.showAttrs(self.filterAttrs(cert, ['passport', 'enPassport', 'birthDate', 'fio'], self.lang === 'en'));
        }

        var statusContainerCls = self.setContainerImage(cert);
        if (statusContainerCls) {
          document.querySelector('.status-container').classList.add(statusContainerCls);
        }

        if (cert.unrzFull) {
          unrz.innerHTML = cert.unrzFull.replace(/^(.{4})(.{4})(.{4})(.*)$/, '$1 $2 $3 $4');
        } else {
          unrz.classList.add('hide');
          num.classList.add('hide');
        }

        self.setAdditionalInfo(cert);

        self.setText(cert);
      }

      if (!self.cert) {
        fetch(url, {
          method: 'GET',
          credentials: "include",
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data && data.items && data.items.length) {
            showData(data.items[0]);
          } else {
            showData(self.emptyState(isTemp));
          }
        }, function () {
          document.body.classList.remove('loading');
          showData(self.emptyState(isTemp));
        });
      } else {
        showData(self.cert);
      }

    },
    getConfig: function () {
      return window.APP_HELPERS.getCovidAppConfig().then((function (config) {
        this.config = config;
        return true;
      }).bind(this));
    },
    emptyState: function (isTemp) {
      if (isTemp) {
        return {
          title: 'Временный сертификат о вакцинации COVID-19',
          entitle: 'COVID-19 temporary vaccination certificate',
          invalid: 'Не найден',
          eninvalid: 'Not found',
          attrs: []
        }
      }
      return {
        title: 'Сертификат COVID-19',
        entitle: 'Certificate of COVID-19',
        invalid: 'Не найден',
        eninvalid: 'Not found',
        attrs: []
      }
    },
    setText: function (cert) {
      var langImage = document.querySelector('.lang-image');
      document.querySelector('.main-title').innerHTML = this.getValue(cert, 'title');
      document.querySelector('.button').innerHTML = this.lang === 'ru' ? 'Закрыть' : 'Close';
      document.querySelector('.lang').innerHTML = this.lang === 'ru' ? 'RUS' : 'ENG';
      langImage.classList.remove('ru', 'en');
      langImage.classList.toggle(this.lang);
      // временные и спец серты только на русском, убираем кнопку
      if (cert.unrzFull && cert.unrzFull.startsWith('4') && document.querySelector('.translate-button')) {
        document.querySelector('.translate-button').classList.toggle('hide');
      }

      if (cert.invalid) {
        var notFound = document.querySelector('.not-found');
        notFound.classList.remove('hide');
        notFound.innerHTML = this.getValue(cert, 'invalid');
      } else {
        var certName = document.querySelector('.cert-name');
        certName.classList.remove('hide');
        certName.innerHTML = this.getValue('', 'certStatusName')
      }
    },
    setAdditionalInfo: function (cert) {
      var additionalInfoElement = document.querySelector('.additional-info');
      if (cert.expired === '1' && cert.type === 'COVID_TEST') {
        var label = this.lang === 'ru' ? 'Результат' : 'Result';
        var isNegative = (cert.status + '').toLowerCase() === 'отрицательный';
        var value = (this.lang === 'ru' ? (isNegative ? 'отрицательный' : 'положительный') : (isNegative ? 'negative' : 'positive'));
        additionalInfoElement.innerHTML = label + ': ' + value;
        return;
      }
      if (additionalInfoElement) {
        additionalInfoElement.remove();
      }

    }
  }
  APP.getConfig().then(function () {
    APP.init();
  })
})();
