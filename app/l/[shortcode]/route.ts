import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/data/links';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    const notFoundUrl = new URL('/link-not-found', _request.url);
    notFoundUrl.searchParams.set('code', shortcode);
    return NextResponse.redirect(notFoundUrl, { status: 302 });
  }

  if (link.isPrivate) {
    const { userId } = await auth();
    if (!userId || userId !== link.userId) {
      const notFoundUrl = new URL('/link-not-found', _request.url);
      notFoundUrl.searchParams.set('code', shortcode);
      return NextResponse.redirect(notFoundUrl, { status: 302 });
    }
  }

  return NextResponse.redirect(link.url, { status: 302 });
}
