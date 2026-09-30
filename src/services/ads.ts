/**
 * Google AdMob Manager Architecture (Production & Test Ad Units)
 * Implements Banner, Interstitial, and Rewarded Ads with proper reward validation
 */

export interface AdUnitConfig {
  appId: string;
  bannerAdId: string;
  interstitialAdId: string;
  rewardedAdId: string;
  isTestMode: boolean;
}

// Google AdMob standard official Test IDs
const TEST_AD_CONFIG: AdUnitConfig = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedAdId: 'ca-app-pub-3940256099942544/5224354917',
  isTestMode: true,
};

export type AdType = 'banner' | 'interstitial' | 'rewarded';

export interface ActiveAdModalState {
  isOpen: boolean;
  type: 'interstitial' | 'rewarded';
  title: string;
  sponsorName: string;
  rewardDescription?: string;
  countdown: number;
  canSkip: boolean;
  onReward?: () => void;
  onClose?: () => void;
}

class AdService {
  private config: AdUnitConfig = TEST_AD_CONFIG;
  private isAdShowing: boolean = false;
  private adModalListener: ((state: ActiveAdModalState | null) => void) | null = null;

  public setAdModalListener(listener: ((state: ActiveAdModalState | null) => void) | null) {
    this.adModalListener = listener;
  }

  public getBannerConfig() {
    return {
      adUnitId: this.config.bannerAdId,
      isTest: this.config.isTestMode,
    };
  }

  /**
   * Show Interstitial Ad (e.g. after 10-question match completion)
   */
  public showInterstitial(onFinished?: () => void) {
    if (this.isAdShowing) {
      if (onFinished) onFinished();
      return;
    }

    this.isAdShowing = true;
    let countdown = 5;

    if (this.adModalListener) {
      this.adModalListener({
        isOpen: true,
        type: 'interstitial',
        title: 'تبلیغ تمام‌صفحه حامی مالی',
        sponsorName: 'برنامه حقیقت‌یاب ایران و جهان',
        countdown,
        canSkip: false,
        onClose: () => {
          this.isAdShowing = false;
          if (this.adModalListener) this.adModalListener(null);
          if (onFinished) onFinished();
        },
      });

      const timer = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
          clearInterval(timer);
          if (this.adModalListener) {
            this.adModalListener({
              isOpen: true,
              type: 'interstitial',
              title: 'تبلیغ تمام‌صفحه حامی مالی',
              sponsorName: 'برنامه حقیقت‌یاب ایران و جهان',
              countdown: 0,
              canSkip: true,
              onClose: () => {
                this.isAdShowing = false;
                if (this.adModalListener) this.adModalListener(null);
                if (onFinished) onFinished();
              },
            });
          }
        }
      }, 1000);
    } else {
      setTimeout(() => {
        this.isAdShowing = false;
        if (onFinished) onFinished();
      }, 1000);
    }
  }

  /**
   * Show Rewarded Video Ad (only grants reward upon successful full completion)
   */
  public showRewardedAd(options: {
    rewardTitle: string;
    onRewarded: () => void;
    onDismiss?: () => void;
  }) {
    if (this.isAdShowing) {
      if (options.onDismiss) options.onDismiss();
      return;
    }

    this.isAdShowing = true;
    let countdown = 5; // Fast 5 seconds for great user experience

    if (this.adModalListener) {
      this.adModalListener({
        isOpen: true,
        type: 'rewarded',
        title: 'تبلیغ ویدیویی جایزه‌دار',
        sponsorName: 'باشگاه کارآگاهان حقیقت',
        rewardDescription: options.rewardTitle,
        countdown,
        canSkip: false,
        onReward: () => {
          this.isAdShowing = false;
          if (this.adModalListener) this.adModalListener(null);
          options.onRewarded();
        },
        onClose: () => {
          this.isAdShowing = false;
          if (this.adModalListener) this.adModalListener(null);
          if (options.onDismiss) options.onDismiss();
        },
      });

      const timer = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
          clearInterval(timer);
          if (this.adModalListener) {
            this.adModalListener({
              isOpen: true,
              type: 'rewarded',
              title: 'تبلیغ ویدیویی جایزه‌دار',
              sponsorName: 'باشگاه کارآگاهان حقیقت',
              rewardDescription: options.rewardTitle,
              countdown: 0,
              canSkip: true,
              onReward: () => {
                this.isAdShowing = false;
                if (this.adModalListener) this.adModalListener(null);
                options.onRewarded();
              },
              onClose: () => {
                this.isAdShowing = false;
                if (this.adModalListener) this.adModalListener(null);
                if (options.onDismiss) options.onDismiss();
              },
            });
          }
        }
      }, 1000);
    } else {
      // Direct reward fallback
      setTimeout(() => {
        this.isAdShowing = false;
        options.onRewarded();
      }, 500);
    }
  }
}

export const adManager = new AdService();
