/* eslint-disable max-len */

import ApplicationStore from "../utils/ApplicationStore";

const successCaseCode = [200, 201];

// Token refresh state management
let isRefreshing = false;
let failedRequests = [];

const _handleTokenRefresh = async () => {
  const storedData = ApplicationStore().getStorage("userDetails") || {};
  const currentToken = storedData.accessToken;

  try {
    const refreshResponse = await fetch('http://localhost:8000/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      credentials: 'include'
    });

    if (refreshResponse.ok) {
      const newTokenData = await refreshResponse.json();
      
      // Update stored token in both ApplicationStore and sessionStorage
      const updatedUserDetails = {
        ...storedData,
        accessToken: newTokenData.access_token
      };
      ApplicationStore().setStorage('userDetails', updatedUserDetails);
      sessionStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));

      // Retry all failed requests
      failedRequests.forEach(callback => callback());
      failedRequests = [];

      return newTokenData.access_token;
    } else {
      // ❌ Refresh failed but DON'T logout
      console.warn('Token refresh failed, but user stays logged in');
      return null;
    }
  } catch (error) {
    // ❌ Refresh error but DON'T logout
    console.warn('Token refresh error, but user stays logged in:', error);
    return null;
  } finally {
    isRefreshing = false;
  }
};

const _logoutUser = () => {
  // This is ONLY called when user manually logs out
  sessionStorage.removeItem('userDetails');
  ApplicationStore().clearStorage();
  window.dispatchEvent(new Event('auth-logout'));
};

const _fetchServiceWithRetry = (PATH, serviceMethod, data, successCallback, errorCallBack, retryCount = 0) => {
  const storedData = ApplicationStore().getStorage("userDetails") || {};
  let accessToken = storedData.accessToken || "";
  const userDetails = storedData.userDetails || {};
  const { id, email, userRole, username } = userDetails;

  const END_POINT = "http://localhost:8000/api/v1/";
  const isFormData = data instanceof FormData;

  const headers = isFormData
    ? undefined
    : {
        "Content-Type": "application/json",
        authorization: accessToken ? `Bearer ${accessToken}` : "",
        ...(id && { userId: id }),
        ...(email && { userEmail: email }),
        ...(userRole && { userRole }),
        ...(username && { username }),
      };

  const requestOptions = {
    method: serviceMethod,
    headers,
    body:
      serviceMethod === "GET" || serviceMethod === "DELETE"
        ? undefined
        : isFormData
        ? data
        : JSON.stringify(data),
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  return fetch(END_POINT + PATH, requestOptions)
    .then(async (response) => {
      // Handle token expiry (401 Unauthorized) - BACKGROUND REFRESH ONLY
      if (response.status === 401 && accessToken) {
        if (isRefreshing) {
          // Wait for ongoing refresh to complete
          return new Promise((resolve) => {
            failedRequests.push(() => {
              resolve(_fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, retryCount));
            });
          });
        }

        isRefreshing = true;
        
        try {
          const newToken = await _handleTokenRefresh();
          if (newToken) {
            // ✅ RETRY: Original request with new token
            return _fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, retryCount);
          } else if (retryCount < 2) {
            // ✅ RETRY: Even if refresh failed, retry the original request (might work with old token)
            console.log(`Retrying API call (${retryCount + 1}/2)`);
            return _fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, retryCount + 1);
          } else {
            // ❌ Max retries reached, but DON'T logout
            errorCallBack(401, "Please try again");
          }
        } catch (error) {
          if (retryCount < 2) {
            // ✅ RETRY: Even on error, retry the original request
            console.log(`Retrying API call after error (${retryCount + 1}/2)`);
            return _fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, retryCount + 1);
          } else {
            // ❌ Max retries reached, but DON'T logout
            errorCallBack(401, "Please try again");
          }
        }
        return;
      }

      // Handle other error status codes with retry
      if (response.status >= 500 && retryCount < 2) {
        // ✅ RETRY: Server errors (500, 502, etc.)
        console.log(`Retrying API call for server error (${retryCount + 1}/2)`);
        setTimeout(() => {
          return _fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }

      const dataResponse = await response.json();

      // SUCCESS for 200 and 201
      if (successCaseCode.includes(response.status)) {
        successCallback({ status: response.status, data: dataResponse });
      } else {
        errorCallBack(response.status, dataResponse.message || "Unknown error");
      }
    })
    .catch((error) => {
      // Network errors - retry
      if (retryCount < 2) {
        // ✅ RETRY: Network errors
        console.log(`Retrying API call for network error (${retryCount + 1}/2)`);
        setTimeout(() => {
          return _fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        // ❌ Max retries reached
        console.error("Fetch failed after retries:", error);
        errorCallBack(500, "Network or unexpected error");
      }
    });
};

// Main fetch service with retry capability
const _fetchService = (PATH, serviceMethod, data, successCallback, errorCallBack) => {
  return _fetchServiceWithRetry(PATH, serviceMethod, data, successCallback, errorCallBack, 0);
};

export const LoginService = (data) => {
  const END_POINT = "http://localhost:8000/api/v1/auth/login";
  const SERVICE_METHOD = "POST";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return fetch(END_POINT, {
    method: SERVICE_METHOD,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers,
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
};

export const LogoutService = (successCallback, errorCallBack) =>
  _fetchService("auth/logout", "POST", {}, successCallback, errorCallBack);

export const RegisterService = (data, successCallback, errorCallBack) =>
  _fetchService("auth/register", "POST", data, successCallback, errorCallBack);

export const GoogleService = (data, successCallback, errorCallBack) =>
  _fetchService("auth/google/login", "GET", data, successCallback, errorCallBack);

export const RefreshTokenService = (successCallback, errorCallBack) =>
  _fetchService("auth/refresh", "POST", {}, successCallback, errorCallBack);