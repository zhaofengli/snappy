import AnalyzerWorker from '@/workers/Analyzer';

export default class Analyzer {
  static analyze(file, options) {
    return new Promise((resolve, reject) => {
      const worker = new AnalyzerWorker();
      worker.onmessage = (event) => {
        worker.terminate();
        if (event.data.state === 'done') {
          return resolve(JSON.parse(event.data.results));
        }
        return reject(Error(event.data.error));
      };
      worker.postMessage({
        snps: file.snps,
        options,
      });
    });
  }
}
