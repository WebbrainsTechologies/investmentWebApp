import { handleError, handleResponse, api } from "./apiServices";

export const getTeamData = (token, id) =>
  api(token)
    .get(`/api/myteamapi/myteamapi/usermyteamData/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getSponsorData = (token, id) =>
  api(token)
    .get(`/api/myteamapi/myteamapi/getusersponsor/${id}`)
    .then(handleResponse)
    .catch(handleError);
