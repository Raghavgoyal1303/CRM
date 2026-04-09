# Tricity Verified CRM — External Lead Ingestion Protocol

This document provides the technical specification for third-party systems (IVR, Lead Aggregators, Call Centers) to push lead data into the Tricity Verified CRM.

---

## 🛠️ AUTHENTICATION

All requests must include your unique **API Key** in the request headers. You can generate this key in the **Tricity Verified Dashboard** under the **Developer API** tab.

**Required Header:**
`X-API-Key: YOUR_TV_LIVE_KEY_HERE`

---

## 🛰️ ENDPOINT

**Target URL:**
`POST https://api.tricityverified.com/api/webhook/ivr`

---

## 📦 DATA PAYLOAD (JSON)

Submit lead details in a standard JSON body.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `phone` | String | **Yes** | Phone number (Format: E.164 suggested) |
| `name` | String | No | Full name of the lead |
| `source` | String | No | Source identifier (e.g., 'main_ivr', 'facebook_ad') |
| `notes` | String | No | Any initial context or call notes |

### Sample Payload:
```json
{
  "phone": "9000000000",
  "name": "Jane Smith",
  "source": "ivr_missed_call",
  "notes": "Interested in Premium Package"
}
```

---

## 📡 RESPONSE CODES

| Code | Meaning | Action |
| :--- | :--- | :--- |
| `201 Created` | Success | Lead successfully ingested into Dashboard |
| `401 Unauthorized` | Invalid Key | Check your `X-API-Key` header |
| `403 Forbidden` | Denied | Ensure key has `leads:create` permissions |
| `400 Bad Request` | Missing Data | Ensure `phone` is provided |
| `500 Server Error` | Backend Failure | Contact Tricity Verified Admin |

---

## 🏗️ LOGGING & AUDIT

Every request made with your API Key is logged in the **API Request Logs** in your Tricity Verified Dashboard for security and volume audits.
