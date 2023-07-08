const axios = require("axios");

export const deliveringApi = (token) =>
  axios.get(`${process.env.API_URL}/shop/delivering/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const productsApi = (sellerId, token) =>
  axios.get(`${process.env.API_URL}/shop/${sellerId}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const acceptDeliApi = (orderItemId, token) =>
  axios.put(
    `${process.env.API_URL}/shop/${orderItemId}/status`,
    {
      status: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const declineDeliApi = (orderItemId, token) =>
  axios.put(
    `${process.env.API_URL}/shop/${orderItemId}/status`,
    {
      status: 2,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
