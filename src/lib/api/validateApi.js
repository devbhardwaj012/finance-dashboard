import { flattenJson } from "./flattenJson";

export async function validateApi(url) {
  if (!url || !url.startsWith("http")) {
    return {
      ok: false,
      error: {
        type: "INVALID_URL",
        message: "Please enter a valid API URL",
      },
    };
  }

  try {
    const res = await fetch(url);

    // Network-level errors
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return authError("Unauthorized request. API key missing or invalid.");
      }

      if (res.status === 429) {
        return rateLimitError();
      }

      return {
        ok: false,
        error: {
          type: "HTTP_ERROR",
          message: `Request failed with status ${res.status}`,
        },
      };
    }

    const json = await res.json();

    /* ===============================
       Alpha Vantage specific handling
       =============================== */
    if (json["Note"]) {
      return rateLimitError(
        "API rate limit exceeded. Please wait or use a premium API key."
      );
    }

    if (json["Error Message"]) {
      return {
        ok: false,
        error: {
          type: "INVALID_REQUEST",
          message: json["Error Message"],
        },
      };
    }

    if (json["Information"]) {
      return {
        ok: false,
        error: {
          type: "PREMIUM_REQUIRED",
          message: json["Information"],
        },
      };
    }

    /* ===============================
       Coinbase style errors
       =============================== */
    if (json?.errors?.length) {
      return {
        ok: false,
        error: {
          type: "API_ERROR",
          message: json.errors[0].message,
        },
      };
    }

    /* ===============================
       Success
       =============================== */
    const flattened = flattenJson(json);

    return {
      ok: true,
      fields: Object.keys(flattened),
      raw: json,
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        type: "NETWORK_ERROR",
        message:
          "Unable to reach API. Possible CORS issue or network failure.",
      },
    };
  }
}

/* ===============================
   Helper errors
   =============================== */
function rateLimitError(
  message = "Rate limit exceeded. Please slow down or upgrade your plan."
) {
  return {
    ok: false,
    error: {
      type: "RATE_LIMIT",
      message,
    },
  };
}

function authError(message) {
  return {
    ok: false,
    error: {
      type: "AUTH_ERROR",
      message,
    },
  };
}
