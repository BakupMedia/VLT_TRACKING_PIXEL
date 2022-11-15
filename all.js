class Helpers {
    constructor() {
        this.triggerCustomEvent = function (eventName, detail = {}) {
            let ev = new CustomEvent(eventName, detail);
            return document.dispatchEvent(ev);
        };
        this.logError = function (message) {
            return console.log(` %c ERROR: ${message} `, 'background:#c00; color:#000; font-weight:900;');
        };
        this.logSuccess = function (message) {
            console.log(` %c ${message} `, 'background:#1eff00; color:#000;');
        };
        this.appendScript = function (url, position = 'head', callback) {
            let elem = document.createElement('script');
            elem.async = true;
            elem.setAttribute('src', url);
            elem.addEventListener('load', callback);


            if (position === 'head') {
                document.head.appendChild(elem);
            }
        };
        this.gtag = function () {
            dataLayer.push(arguments);
        };
        this.apiRequest = async function (url, options = {}) {
            let res = await fetch(url, options).then((data) => {
                console.log(data);
            });
        };
    }
}
const helper = new Helpers()




class GA4 {
    constructor(id) {
        this.id = id;

        const sendEvent = (name, properties = {}) => {
            helper.gtag('event', name, properties);
        };

        this.init = function () {
            var measurementID = this.id;
            if (!measurementID)
                return helper.logError('Missing Google Analytics ID');

            helper.appendScript(`https://www.googletagmanager.com/gtag/js?id=${this.id}`);
            helper.gtag('js', new Date());
            helper.gtag('config', measurementID);
            helper.triggerCustomEvent('google_analytics_loaded');

            document.addEventListener('lead_submitted', function (ev) {
                sendEvent('lead', ev.detail);
            });
        };



    }
}

class GA {
    constructor(id) {
        this.id = id;
        this.init = function () {
            var ConversionID = this.id;
            if (!ConversionID)
                return helper.logError('Missing Google Ads ID');

            document.addEventListener('google_analytics_loaded', function () {
                helper.gtag('config', ConversionID);
            });
        };
    }
}

class FB {
    constructor(id) {
        this.id = id;
    }
}

class API {
    constructor() {
        this.sendLead = function () {
            helper.apiRequest('https://api.voolt.com/api/Leads', {
                method: 'POST',
                body: JSON.stringify({
                    hash: '87958f12-f617-4c4b-84d8-43809c06edc7',
                    email: 'rklnans@knafmasf.com'
                })
            });
        };
    }
}

class VLT {
    constructor(properties) {
        this.properties = properties;

        var api = new API();
        var googleAnalytics = new GA4(this.properties.GA4.measurementID);
        var googleAds = new GA(this.properties.GA.conversionID);
        var leadFormID = this.properties.leadFormID;


        function addListeners() {
            document.addEventListener('DOMContentLoaded', function () {
                try {
                    document.getElementById(leadFormID).addEventListener('submit', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();

                        //TODO disable form on submit 
                        document.getElementById(leadFormID).querySelector('button').setAttribute('disabled', 'disabled');

                        api.sendLead();

                        helper.triggerCustomEvent('lead_submitted', {
                            email: 'tasfasfg@adasd.com'
                        });


                    });
                } catch (e) {
                    helper.logError('Invalid Lead Form ID');
                }
            });
        }

        this.init = function () {
            window.dataLayer = window.dataLayer || [];
            googleAds.init();
            googleAnalytics.init();


            addListeners();


        };
    }
}


















