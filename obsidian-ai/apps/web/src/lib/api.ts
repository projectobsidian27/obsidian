// API client for Obsidian backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async sendMagicLink(email: string) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyToken(token: string) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async connectCRM(crmType: string, redirectUri: string) {
    return this.request('/auth/crm/connect', {
      method: 'POST',
      body: JSON.stringify({ crm_type: crmType, redirect_uri: redirectUri }),
    });
  }

  // Scan endpoints
  async runScan(crmType: string, accessToken: string, tenantId: string) {
    return this.request('/scan/run', {
      method: 'POST',
      body: JSON.stringify({
        crm_type: crmType,
        access_token: accessToken,
        tenant_id: tenantId,
      }),
    });
  }

  async getScanResults(scanId: string) {
    return this.request(`/scan/${scanId}/results`);
  }

  async getScanStatus(scanId: string) {
    return this.request(`/scan/${scanId}/status`);
  }

  // Enforce endpoints
  async previewEnforcement(scanId: string, crmType: string) {
    return this.request('/enforce/preview', {
      method: 'POST',
      body: JSON.stringify({ scan_id: scanId, crm_type: crmType }),
    });
  }

  async commitEnforcement(
    scanId: string,
    crmType: string,
    accessToken: string,
    taskIds: string[]
  ) {
    return this.request('/enforce/commit', {
      method: 'POST',
      body: JSON.stringify({
        scan_id: scanId,
        crm_type: crmType,
        access_token: accessToken,
        task_ids: taskIds,
      }),
    });
  }

  async getEnforcementStatus(auditLogId: string) {
    return this.request(`/enforce/status/${auditLogId}`);
  }

  // Health check
  async health() {
    return this.request('/health');
  }
}

export const api = new ApiClient();
