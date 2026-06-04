import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await prisma.socialIntegration.findMany({
      where: { userId: session.user.id as string },
      select: {
        id: true,
        platform: true,
        accountUsername: true,
        accountProfile: true,
        isConnected: true,
        publishedReels: true,
      },
    });

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error('Fetch accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
