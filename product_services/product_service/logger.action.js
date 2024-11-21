import axios from "axios";

const history_serv =
  process.env.HISTORY_SERV_ADDR || "http://localhost:5500/api/history";

let isHistoryServiceAvailable = true;

export async function checkHistoryServiceAvailability() {
  try {
    const res = await axios.get(history_serv, { timeout: 1000 });
    isHistoryServiceAvailable = true;
    console.log(isHistoryServiceAvailable);
  } catch (e) {
    console.warn("History service is not available:", e.message || e); 
    isHistoryServiceAvailable = false;
  }
}

async function retryLogAction(actionData, retries = 5) {
  try {
    const response = await axios.post(history_serv, actionData, {
      timeout: 3000,
    });
    return response.data;
  } catch (e) {
    if (retries > 0) {
      console.warn(  
        `Logging failed. Retrying... Remaining attempts: ${retries}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return retryLogAction(actionData, retries - 1);
    } else {
      console.error(
        "Logging action failed after multiple attempts:",
        e.message || e
      );
      isHistoryServiceAvailable = false;
    }
  }
}

export async function logAction(
  actionType,
  productId,
  shopId = null,
  description = null
) {
  if (!isHistoryServiceAvailable) {
    console.warn("Skipping log action due to unavailable history service.");
    return;
  }

  const actionData = {
    actionType,
    productId,
    shopId: shopId ?? 0,
    description: description ?? "",
  };

  await retryLogAction(actionData);
} 
 