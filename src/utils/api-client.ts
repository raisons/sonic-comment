// @ts-ignore
import { HaloRestAPIClient } from "@halo-dev/rest-api-client"
import { ContentApiClient } from "@/content-api"

const apiUrl = import.meta.env.VITE_API_URL;

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: apiUrl,
});

const apiClient = new ContentApiClient(haloRestApiClient);

export { apiClient };
