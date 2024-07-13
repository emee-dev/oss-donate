"use client";
import axios from "axios";

async function getExchangeRate() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=celo-dollar&vs_currencies=ngn"
    );
    const data = response.data;
    return data["celo-dollar"].ngn;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

export async function convertCusdtoNaira(cusdAmount: number) {
  const rate = await getExchangeRate();
  return cusdAmount * rate;
}

export async function convertNairaToCusd(nairaAmount: number) {
  const rate = await getExchangeRate();
  return nairaAmount / rate;
}
