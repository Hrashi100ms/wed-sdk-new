import { HMSLocalTrack } from '../media/tracks';
import { HMSVideoTrackSettings, HMSAudioTrackSettings } from '../media/settings';

// For AV track, we could get a normal track(true), empty track(empty) or no track at all(false)
export type IFetchTrackOptions = boolean | 'empty';
export interface IFetchAVTrackOptions {
  audio: IFetchTrackOptions;
  video: IFetchTrackOptions;
}

export default interface ITransport {
  join(authToken: string, peerId: string, customData: Object, initEndpoint?: string): Promise<void>;

  leave(): Promise<void>;

  publish(tracks: Array<HMSLocalTrack>): Promise<void>;

  unpublish(tracks: Array<HMSLocalTrack>): Promise<void>;

  getLocalScreen(
    videoSettings: HMSVideoTrackSettings,
    audioSettings: HMSAudioTrackSettings,
    onStop: () => void,
  ): Promise<Array<HMSLocalTrack>>;
}
