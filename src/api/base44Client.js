import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "687a54d934c715d7b72f50ad", 
  requiresAuth: true // Ensure authentication is required for all operations
});
