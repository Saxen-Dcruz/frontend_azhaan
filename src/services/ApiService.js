/* eslint-disable max-len */

import ApplicationStore from "../utils/ApplicationStore";

const successCaseCode = [200, 201];

const _fetchService = (PATH, serviceMethod, data, successCallback, errorCallBack) => {
  const storedData = ApplicationStore().getStorage("userDetails") || {};
  const accessToken = storedData.accessToken || "";
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
      const dataResponse = await response.json();

      // SUCCESS for 200 and 201
      if (successCaseCode.includes(response.status)) {
        successCallback({ status: response.status, data: dataResponse });
      } else {
        errorCallBack(response.status, dataResponse.message || "Unknown error");
      }
    })
    .catch((error) => {
      console.error("Fetch failed:", error);
      errorCallBack(500, "Network or unexpected error");
    });
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
  _fetchService("logout", "POST", {}, successCallback, errorCallBack);

export const RegisterService = (data, successCallback, errorCallBack) =>
  _fetchService("auth/register", "POST", data, successCallback, errorCallBack);

export const GoogleService = (data, successCallback, errorCallBack) =>
  _fetchService("auth/google/login", "GET", data, successCallback, errorCallBack);

