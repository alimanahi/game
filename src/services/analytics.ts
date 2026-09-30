/**
 * Firebase Analytics & Crashlytics Event Logger Architecture
 */

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
  timestamp: string;
}

class AnalyticsService {
  private eventsLog: AnalyticsEvent[] = [];

  public logEvent(name: string, params?: Record<string, string | number | boolean>) {
    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: new Date().toISOString(),
    };
    this.eventsLog.push(event);

    // Keep log reasonable in memory
    if (this.eventsLog.length > 200) {
      this.eventsLog.shift();
    }
  }

  public recordNonFatalError(error: Error | string, context?: Record<string, unknown>) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    this.logEvent('crashlytics_non_fatal', {
      error: errorMsg,
      context: JSON.stringify(context || {}),
    });
  }

  public getRecentLogs(): AnalyticsEvent[] {
    return [...this.eventsLog];
  }
}

export const analytics = new AnalyticsService();
