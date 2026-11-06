import "server-only";
import { apiPost } from "./client";
import type { ContactPayload, CreatedResponse } from "./types";

/**
 * Envoie un message (`POST /contact`, corps imbriqué). Lève `ApiConfigError`
 * ou `ApiError` ; en 400, `error.body.fields` porte les erreurs par champ
 * (« contact.email »), à ramener sous le bon champ avec `mapContactApiFields`.
 */
export function postContact(payload: ContactPayload): Promise<CreatedResponse> {
  return apiPost<CreatedResponse>("/contact", payload);
}
