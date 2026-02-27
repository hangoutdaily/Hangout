'use client';

import Link from 'next/link';
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { Users, Calendar, Archive, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatRoomCard } from '@/types';

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

function formatMessageTime(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

interface ChatCardProps {
  chat: ChatRoomCard;
  index: number;
}

export default function ChatCard({ chat, index }: ChatCardProps) {
  const isArchived = chat.roomStatus === 'ARCHIVED' || chat.isRemoved;
  const eventDate = formatEventDate(chat.eventDatetime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={isArchived && chat.isRemoved ? '#' : `/chats/${chat.eventId}`}>
        <div
          className={`
            group relative overflow-hidden rounded-2xl border border-border/60
            bg-card-bg transition-all duration-300
            ${isArchived ? 'opacity-75' : 'hover:shadow-lg hover:border-border hover:-translate-y-0.5'}
          `}
        >
          {/* Event Image Header */}
          <div className="relative h-32 overflow-hidden bg-surface">
            {chat.eventPhoto ? (
              <img
                src={chat.eventPhoto}
                alt={chat.eventTitle}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isArchived ? 'grayscale-[40%]' : 'group-hover:scale-105'
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              </div>
            )}

            {/* Status Badge */}
            {isArchived && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                <Archive className="w-3 h-3 text-white/80" />
                <span className="text-[11px] font-medium text-white/90">
                  {chat.isRemoved
                    ? 'Removed'
                    : chat.eventStatus === 'CANCELLED'
                      ? 'Cancelled'
                      : 'Completed'}
                </span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Event Title on Image */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-semibold text-base line-clamp-1 drop-shadow-sm">
                {chat.eventTitle}
              </h3>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3.5">
            {/* Meta Row */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{eventDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{chat.memberCount}</span>
              </div>
            </div>

            {/* Last Message */}
            {chat.lastMessage ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground line-clamp-1 flex-1 mr-2">
                  <span className="font-medium text-foreground/80">
                    {chat.lastMessage.senderName || 'Someone'}:
                  </span>{' '}
                  {chat.lastMessage.content}
                </p>
                <span className="text-[11px] text-muted-foreground/70 flex-shrink-0">
                  {formatMessageTime(chat.lastMessage.createdAt)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No messages yet — say hi! 👋
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
