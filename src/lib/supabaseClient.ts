import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://irfovbxdujtccvztsfyb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xt90hvWC0UH0u0g_qjTCvQ_j0RXWhBp';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
