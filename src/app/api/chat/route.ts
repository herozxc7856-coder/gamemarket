// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/chat - получить диалоги пользователя
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { id: userId }
        }
      },
      include: {
        participants: {
          select: { id: true, name: true, avatar: true, verified: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST /api/chat - создать новый диалог или отправить сообщение
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      senderId, 
      receiverId, 
      content, 
      conversationId,
      productId 
    } = body;

    if (!senderId || !content) {
      return NextResponse.json({ error: 'senderId and content required' }, { status: 400 });
    }

    let convId = conversationId;

    // Если нет диалога — создаём новый
    if (!convId && receiverId) {
      const existing = await db.conversation.findFirst({
        where: {
          participants: {
            every: {
              id: { in: [senderId, receiverId] }
            }
          }
        }
      });

      if (existing) {
        convId = existing.id;
      } else {
        const newConv = await db.conversation.create({
          data: {
            participants: {
              connect: [{ id: senderId }, { id: receiverId }]
            }
          }
        });
        convId = newConv.id;
      }
    }

    if (!convId) {
      return NextResponse.json({ error: 'Could not create conversation' }, { status: 500 });
    }

    // Создаём сообщение
    const message = await db.message.create({
      data: {
        content,
        conversationId: convId,
        senderId,
        receiverId: receiverId || null,
        read: false
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Обновляем время диалога
    await db.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// GET /api/chat/[id] - получить сообщения диалога
export async function GET_MESSAGES(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: conversationId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Проверка доступа к диалогу
    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: { select: { id: true } }
      }
    });

    if (!conv || !conv.participants.some(p => p.id === userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true, verified: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Пометить прочитанными
    await db.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        read: false
      },
      data: { read: true }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
