import { NextRequest, NextResponse } from 'next/server';

import { createMagentoClient, getMagentoGraphqlEndpoint } from '@/lib/magento/client';
import { StoreConfigDocument } from '@/lib/magento/graphql';

const DEFAULT_STORE_CODE = process.env.MAGENTO_DEFAULT_STORE || 'default';

export async function GET(request: NextRequest) {
  const storeCode = request.nextUrl.searchParams.get('store') || DEFAULT_STORE_CODE;

  try {
    const client = createMagentoClient({ storeCode });
    const data = await client.request(StoreConfigDocument);

    return NextResponse.json({
      ok: true,
      storeCode,
      backend: getMagentoGraphqlEndpoint(),
      storeConfig: data.storeConfig,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
