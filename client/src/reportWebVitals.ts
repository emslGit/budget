import { ReportCallback } from 'web-vitals';

const webVitals = require('web-vitals');

const reportWebVitals = (onPerfEntry?: ReportCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    webVitals.then(({ getCLS, getFID, getFCP, getLCP, getTTFB }: any) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
