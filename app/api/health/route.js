import { NextResponse } from 'next/server';

import { createMagentoClient } from '@/lib/magento/client';
import { STORE_CONFIG_QUERY } from '@/lib/magento/queries';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeCode = searchParams.get('store') || process.env.MAGENTO_DEFAULT_STORE || 'default';

    const client = createMagentoClient({ storeCode });
    const data = await client.request(STORE_CONFIG_QUERY);

    return NextResponse.json({
      ok: true,
      storeCode,
      backend: process.env.MAGENTO_BACKEND_URL,
      storeConfig: data.storeConfig
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
