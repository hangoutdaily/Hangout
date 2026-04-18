'use client';

import { useState, useContext, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Archive, Inbox } from 'lucide-react';
import { getMyChats } from '@/api/chat';
import ChatCard from '@/components/ui/ChatCard';
import { AuthContext } from '@/context/AuthContext';
import { ChatRoomCard } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/shadcn/button';
import { useSocket } from '@/providers/SocketProvider';

type Tab = 'active' | 'archived';

type MyChatsResponse = { active: ChatRoomCard[]; archived: ChatRoomCard[] };

function shouldArchiveChat(chat: ChatRoomCard) {
  const isEventDone = new Date(chat.eventDatetime) < new Date();

  return (
    chat.isRemoved ||
    chat.roomStatus === 'ARCHIVED' ||
    chat.eventStatus === 'COMPLETED' ||
    chat.eventStatus === 'CANCELLED' ||
    isEventDone
  );
}

function getChatSortTimestamp(chat: ChatRoomCard) {
  return new Date(chat.lastMessage?.createdAt || chat.eventDatetime).getTime();
}

export default function ChatsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['myChats'],
    queryFn: async () => {
      const res = await getMyChats();
      return res.data as { active: ChatRoomCard[]; archived: ChatRoomCard[] };
    },
    enabled: !!user,
  });

  const { active, archived } = useMemo(() => {
    const merged = [...(data?.active || []), ...(data?.archived || [])];
    const byEventId = new Map<number, ChatRoomCard>();

    // Deduplicate in case the API includes an event in both buckets.
    // Archived payload comes after active payload and takes precedence when duplicated.
    for (const chat of merged) {
      byEventId.set(chat.eventId, chat);
    }

    const dedupedChats = Array.from(byEventId.values()).sort(
      (a, b) => getChatSortTimestamp(b) - getChatSortTimestamp(a)
    );

    return {
      active: dedupedChats.filter((chat) => !shouldArchiveChat(chat)),
      archived: dedupedChats.filter((chat) => shouldArchiveChat(chat)),
    };
  }, [data?.active, data?.archived]);

  const currentList = activeTab === 'active' ? active : archived;

  useEffect(() => {
    if (!socket || !user) return;

    const patchChatCache = (eventId: number, updater: (chat: ChatRoomCard) => ChatRoomCard) => {
      queryClient.setQueryData<MyChatsResponse>(['myChats'], (current) => {
        if (!current) return current;

        const patch = (list: ChatRoomCard[]) =>
          list.map((chat) => (chat.eventId === eventId ? updater(chat) : chat));

        return {
          active: patch(current.active),
          archived: patch(current.archived),
        };
      });
    };

    const handleRoomArchived = (data: {
      eventId: number;
      eventStatus?: ChatRoomCard['eventStatus'];
    }) => {
      if (!Number.isFinite(data?.eventId)) return;

      patchChatCache(data.eventId, (chat) => ({
        ...chat,
        roomStatus: 'ARCHIVED',
        eventStatus: data.eventStatus || chat.eventStatus,
      }));
      queryClient.invalidateQueries({ queryKey: ['myChats'] });
    };

    const handleRemovedFromChat = (data: { eventId: number }) => {
      if (!Number.isFinite(data?.eventId)) return;

      patchChatCache(data.eventId, (chat) => ({
        ...chat,
        isRemoved: true,
        roomStatus: 'ARCHIVED',
      }));
      queryClient.invalidateQueries({ queryKey: ['myChats'] });
    };

    socket.on('room_archived', handleRoomArchived);
    socket.on('removed_from_chat', handleRemovedFromChat);

    return () => {
      socket.off('room_archived', handleRoomArchived);
      socket.off('removed_from_chat', handleRemovedFromChat);
    };
  }, [queryClient, socket, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Sign in to chat</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Log in to see your hangout group chats.
        </p>
        <Link href="/login" passHref legacyBehavior>
          <Button size="lg" variant="outline">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-0">
          {/* Tab Switcher */}
          <div className="flex gap-1 bg-surface rounded-xl p-1">
            {(['active', 'archived'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="chatTab"
                    className="absolute inset-0 bg-card-bg rounded-lg shadow-sm"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center justify-center gap-2 ${
                    activeTab === tab ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {tab === 'active' ? (
                    <Inbox className="w-4 h-4" />
                  ) : (
                    <Archive className="w-4 h-4" />
                  )}
                  {tab === 'active' ? 'Active' : 'Archived'}
                  {tab === 'active' && active.length > 0 && (
                    <span className="bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {active.length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-border/40 overflow-hidden"
              >
                <div className="h-32 bg-surface" />
                <div className="p-3.5 space-y-2.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-surface rounded" />
                    <div className="h-3 w-10 bg-surface rounded" />
                  </div>
                  <div className="h-3.5 w-3/4 bg-surface rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'active' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'active' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentList.length === 0 ? (
                <EmptyState tab={activeTab} />
              ) : (
                <div className="space-y-3">
                  {currentList.map((chat, index) => (
                    <ChatCard key={chat.eventId} chat={chat} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-5">
        {tab === 'active' ? (
          <MessageCircle className="w-7 h-7 text-muted-foreground/50" />
        ) : (
          <Archive className="w-7 h-7 text-muted-foreground/50" />
        )}
      </div>
      <h2 className="text-lg font-semibold mb-1.5">
        {tab === 'active' ? 'No active chats' : 'No archived chats'}
      </h2>
      <p className="text-sm text-muted-foreground max-w-[260px]">
        {tab === 'active'
          ? 'Join a hangout to start chatting with the group!'
          : 'Completed and cancelled hangout chats will appear here.'}
      </p>
      {tab === 'active' && (
        <Link href="/" className="mt-5">
          <Button variant="outline" size="sm">
            Browse Hangouts
          </Button>
        </Link>
      )}
    </div>
  );
}
