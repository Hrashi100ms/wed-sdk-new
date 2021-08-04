import { RunningAverage } from '../../utils/math';
import VideoPluginsAnalyticsFactory from '../../analytics/VideoPluginsAnalyticsFactory';
import analyticsEventsService from '../../analytics/AnalyticsEventsService';
import HMSLogger from '../../utils/logger';
import { ErrorFactory, HMSAction } from '../../error/ErrorFactory';
import { HMSException } from '../../error/HMSException';

const TAG = 'VideoPluginsAnalytics';

export class VideoPluginsAnalytics {
  private readonly initTime: Record<string, number>;
  private readonly addedTimestamps: Record<string, number>;
  private readonly preProcessingAvgs: RunningAverage;
  private readonly processingAvgs: Record<string, RunningAverage>;
  private readonly pluginAdded: Record<string, boolean>;

  constructor() {
    this.initTime = {};
    this.preProcessingAvgs = new RunningAverage();
    this.addedTimestamps = {};
    this.processingAvgs = {};
    this.pluginAdded = {};
  }

  added(name: string) {
    this.pluginAdded[name] = true;
    this.addedTimestamps[name] = Date.now();
    this.initTime[name] = 0;
    this.processingAvgs[name] = new RunningAverage();
  }

  removed(name: string) {
    //send stats
    if (this.pluginAdded[name]) {
      const stats = {
        pluginName: name,
        // duration in seconds
        duration: Math.floor((Date.now() - this.addedTimestamps[name]) / 1000),
        loadTime: this.initTime[name],
        avgPreProcessingTime: this.preProcessingAvgs.getAvg(), //Do we need this in stat not plugin specific
        avgProcessingTime: this.processingAvgs[name]?.getAvg(),
      };
      //send stats
      analyticsEventsService.queue(VideoPluginsAnalyticsFactory.stats(stats)).flush();
      //clean the plugin details
      this.clean(name);
    }
  }

  failure(name: string, error: HMSException) {
    // send failure event
    if (this.pluginAdded[name]) {
      analyticsEventsService.queue(VideoPluginsAnalyticsFactory.failure(name, error)).flush();
      //clean the plugin details
      this.clean(name);
    }
  }

  async initWithTime<T>(name: string, initFn: () => Promise<T>) {
    if (this.initTime[name]) {
      HMSLogger.i(TAG, `Plugin Already loaded ${name}, time it took: ${this.initTime[name]}`);
      return;
    }
    let time: number | undefined = undefined;
    try {
      time = await this.timeInMs(initFn);
      HMSLogger.i(TAG, `Time taken for Plugin ${name} initialization : ${time}`);
    } catch (err) {
      //Failed during initialization of plugin(model loading etc...)
      err = ErrorFactory.VideoPluginErrors.InitFailed(
        HMSAction.VIDEO_PLUGINS,
        'failed during initialization of plugin',
      );
      HMSLogger.e(TAG, err);
      this.failure(name, err);
      throw err;
    }
    if (time) {
      this.initTime[name] = time;
    }
  }

  async preProcessWithTime<T>(preProcessFn: () => Promise<T>) {
    //TODO: check if it is required to maintain and shall we handle preprocess failures
    const time = await this.timeInMs(preProcessFn);
    this.preProcessingAvgs.add(time);
  }

  async processWithTime<T>(name: string, processFn: () => Promise<T>) {
    let time: number | undefined = undefined;
    try {
      time = await this.timeInMs(processFn);
    } catch (err) {
      //Failed during processing of plugin
      err = ErrorFactory.VideoPluginErrors.ProcessingFailed(
        HMSAction.VIDEO_PLUGINS,
        'Failed during processing of plugin',
      );
      HMSLogger.e(TAG, err);
      this.failure(name, err);
      throw err;
    }
    if (time) {
      this.processingAvgs[name]?.add(time);
    }
  }

  private async timeInMs<T>(fn: () => Promise<T>): Promise<number> {
    const start = Date.now();
    await fn();
    return Math.floor(Date.now() - start);
  }

  private clean(name: string) {
    delete this.addedTimestamps[name];
    delete this.initTime[name];
    delete this.processingAvgs[name];
    delete this.pluginAdded[name];
  }
}
