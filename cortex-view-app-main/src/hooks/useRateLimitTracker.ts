import { useEffect, useState } from "react";

interface UseRateLimitTrackerProps {
  isActive: boolean;
}

interface RateLimitState {
  isRetrying: boolean;
  retryCount: number;
  maxRetries: number;
  lastError: string | null;
}

/**
 * Custom hook to track Gemini API rate limit status
 * @param isActive Whether to actively listen for events
 * @returns Current rate limit state
 */
export function useRateLimitTracker({
  isActive = true,
}: UseRateLimitTrackerProps): RateLimitState {
  const [state, setState] = useState<RateLimitState>({
    isRetrying: false,
    retryCount: 0,
    maxRetries: 3,
    lastError: null,
  });

  useEffect(() => {
    if (!isActive) return;

    const handleRetry = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        const { attempt, maxRetries, error } = event.detail;

        setState({
          isRetrying: true,
          retryCount: attempt,
          maxRetries,
          lastError: error,
        });
      }
    };

    // Reset state when stopping retries
    const handleRetryComplete = () => {
      setState({
        isRetrying: false,
        retryCount: 0,
        maxRetries: 3,
        lastError: null,
      });
    };

    // Listen for gemini-retry events
    window.addEventListener("gemini-retry", handleRetry);

    // Listen for gemini-retry-complete events
    window.addEventListener("gemini-retry-complete", handleRetryComplete);

    return () => {
      window.removeEventListener("gemini-retry", handleRetry);
      window.removeEventListener("gemini-retry-complete", handleRetryComplete);
    };
  }, [isActive]);

  return state;
}
