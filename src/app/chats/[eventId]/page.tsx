'use client';

import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Users, Archive, Loader2, ImageIcon } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { getChatMessages } from '@/api/chat';
import { useSocket } from '@/providers/SocketProvider';
import { AuthContext } from '@/context/AuthContext';
import { ChatMessage } from '@/types';

function formatMessageDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMM d');
}

function formatMessageTime(dateStr: string) {
  return format(new Date(dateStr), 'h:mm a');
}

// Group messages by date
function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let currentDate = '';

  for (const msg of messages) {
    const msgDate = formatMessageDate(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({ date: msgDate, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }
  return groups;
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.eventId);
  const { socket } = useSocket();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState('Chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasScrolledRef = useRef(false);

  const myProfileId = user?.profile?.id;

  // Fetch initial messages
  const { isLoading } = useQuery({
    queryKey: ['chatMessages', eventId],
    queryFn: async () => {
      const res = await getChatMessages(eventId);
      const data = res.data;
      setMessages(data.messages || []);
      setNextCursor(data.nextCursor);
      setIsArchived(data.roomStatus === 'ARCHIVED');
      if (data.eventTitle) setEventTitle(data.eventTitle);
      return data;
    },
    enabled: !!user && !!eventId,
  });

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !hasScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView();
      hasScrolledRef.current = true;
    }
  }, [isLoading, messages.length]);

  // Socket: join room and listen for real-time events
  useEffect(() => {
    if (!socket || !eventId) return;

    socket.emit('join_room', eventId);

    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // Auto-scroll to bottom on new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    };

    const handleRoomArchived = (data: { eventId: number }) => {
      if (data.eventId === eventId) {
        setIsArchived(true);
        queryClient.invalidateQueries({ queryKey: ['myChats'] });
      }
    };

    const handleRemovedFromChat = (data: { eventId: number }) => {
      if (data.eventId === eventId) {
        router.push('/chats');
      }
    };

    const handleMemberAdded = () => {
      // Could refresh member list — for now just invalidate chats
      queryClient.invalidateQueries({ queryKey: ['myChats'] });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('room_archived', handleRoomArchived);
    socket.on('removed_from_chat', handleRemovedFromChat);
    socket.on('member_added', handleMemberAdded);
    socket.on('member_removed', handleMemberAdded);

    return () => {
      socket.emit('leave_room', eventId);
      socket.off('new_message', handleNewMessage);
      socket.off('room_archived', handleRoomArchived);
      socket.off('removed_from_chat', handleRemovedFromChat);
      socket.off('member_added', handleMemberAdded);
      socket.off('member_removed', handleMemberAdded);
    };
  }, [socket, eventId, queryClient, router]);

  // Send message
  const handleSend = useCallback(() => {
    if (!newMessage.trim() || !socket || isSending || isArchived) return;

    setIsSending(true);
    socket.emit('send_message', {
      eventId,
      content: newMessage.trim(),
    });
    setNewMessage('');
    setIsSending(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [newMessage, socket, isSending, isArchived, eventId]);

  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Load more (scroll to top to load earlier messages)
  const loadMore = async () => {
    if (loadingMore || !nextCursor) return;
    setLoadingMore(true);

    try {
      const container = messagesContainerRef.current;
      const prevHeight = container?.scrollHeight || 0;

      const res = await getChatMessages(eventId, nextCursor);
      const data = res.data;
      setMessages((prev) => [...(data.messages || []), ...prev]);
      setNextCursor(data.nextCursor);

      // Maintain scroll position
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - prevHeight;
        }
      });
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll: load more when scrolling to top
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || loadingMore || !nextCursor) return;

    if (container.scrollTop < 80) {
      loadMore();
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header — flex-shrink-0 keeps it pinned above the scroll area */}
      <div className="flex-shrink-0 bg-background/80 backdrop-blur-xl border-b border-border/40 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.push('/chats')}
            className="p-2 -ml-2 rounded-xl hover:bg-surface active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold truncate max-w-[220px]">{eventTitle}</h1>
            <div className="flex items-center gap-1.5">
              {isArchived ? (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Archive className="w-3 h-3" />
                  Read-only
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Group Chat
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Archived Banner */}
      {isArchived && (
        <div className="flex-shrink-0 bg-surface border-b border-border/40">
          <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-2">
            <Archive className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              This hangout has ended. Chat is read-only.
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Load More Indicator */}
          {loadingMore && (
            <div className="flex justify-center py-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {nextCursor && !loadingMore && (
            <button
              onClick={loadMore}
              className="w-full text-center text-xs text-muted-foreground py-2 hover:text-foreground transition-colors"
            >
              Load earlier messages
            </button>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium mb-1">No messages yet</p>
              <p className="text-xs text-muted-foreground">Be the first to break the ice! 🧊</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messageGroups.map((group) => (
                <div key={group.date}>
                  {/* Date Separator */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-border/50" />
                    <span className="text-[11px] font-medium text-muted-foreground/70 px-2">
                      {group.date}
                    </span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>

                  {group.messages.map((msg, idx) => {
                    const isMe = msg.senderId === myProfileId;
                    const showAvatar =
                      !isMe && (idx === 0 || group.messages[idx - 1]?.senderId !== msg.senderId);

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Avatar */}
                        {!isMe && (
                          <div className="w-7 mr-2 flex-shrink-0">
                            {showAvatar ? (
                              msg.sender.selfie ? (
                                <img
                                  src={msg.sender.selfie}
                                  alt={msg.sender.name || ''}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center">
                                  <span className="text-[11px] font-semibold text-muted-foreground">
                                    {(msg.sender.name || '?')[0]?.toUpperCase()}
                                  </span>
                                </div>
                              )
                            ) : null}
                          </div>
                        )}

                        <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                          {/* Sender Name */}
                          {showAvatar && !isMe && (
                            <p className="text-[11px] font-medium text-muted-foreground mb-0.5 ml-1">
                              {msg.sender.name || 'Unknown'}
                            </p>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`
                              px-3.5 py-2 rounded-2xl text-sm leading-relaxed
                              ${
                                isMe
                                  ? 'bg-foreground text-background rounded-br-md'
                                  : 'bg-surface text-foreground rounded-bl-md'
                              }
                            `}
                          >
                            {msg.content}
                            <span
                              className={`text-[10px] ml-2 inline-block align-bottom ${
                                isMe ? 'text-background/50' : 'text-muted-foreground/50'
                              }`}
                            >
                              {formatMessageTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </AnimatePresence>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Improved Input Bar */}
      {!isArchived && (
        <div className="flex-shrink-0 border-t border-border/40 bg-background">
          <div className="max-w-lg mx-auto px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
            <div
              className="flex items-end gap-2 bg-surface rounded-2xl border border-border/60 px-3 py-1.5
              focus-within:border-foreground/20 focus-within:ring-2 focus-within:ring-foreground/5 transition-all"
            >
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 bg-transparent resize-none text-sm leading-relaxed py-1.5
                  placeholder:text-muted-foreground/50 focus:outline-none max-h-[120px]
                  scrollbar-thin scrollbar-thumb-border"
              />
              <motion.button
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
                whileTap={{ scale: 0.9 }}
                className={`
                  flex-shrink-0 p-2 rounded-xl mb-0.5 transition-all duration-200
                  ${
                    newMessage.trim()
                      ? 'bg-foreground text-background shadow-sm hover:opacity-90'
                      : 'bg-transparent text-muted-foreground/40'
                  }
                `}
              >
                <Send className="w-[18px] h-[18px]" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
