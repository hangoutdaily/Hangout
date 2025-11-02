"use client"

import { MapPin, Calendar, Users, Clock, Heart, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type EventCardProps = {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  attendees: number
  maxAttendees: number
  category: string
  price?: number
  priceType?: "free" | "split" | "paid"
  creator: {
    name: string
    avatar: string
  }
  attendeeAvatars: string[]
  isLiked?: boolean
  onLike?: () => void
  onJoin?: () => void
}

export default function EventCard({
  id,
  title,
  description,
  location,
  date,
  time,
  attendees,
  maxAttendees,
  category,
  price = 0,
  priceType = "free",
  creator,
  attendeeAvatars,
  isLiked = false,
  onLike,
  onJoin,
}: EventCardProps) {
  const formatPrice = () => {
    if (priceType === "free") return "Free"
    if (priceType === "split") return "Split"
    return `$${price}`
  }

  return (
    <Link href={`/events/${id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300 group-hover:scale-[1.01] cursor-pointer">
        {/* Header with category and like */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-900 flex-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span>{time}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              onLike?.()
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-auto flex-shrink-0"
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-gray-600"}`}
            />
          </button>
        </div>

        {/* Title and description */}
        <div className="px-5 pt-2 pb-3">
          <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1 group-hover:text-gray-800 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{description}</p>
        </div>

        {/* Event details - location and attendees count */}
        <div className="px-5 py-3 space-y-2.5 border-b border-gray-100">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
              <MapPin className="h-4 w-4 text-gray-700" />
            </div>
            <span className="text-gray-700 truncate">{location}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
              <Users className="h-4 w-4 text-gray-700" />
            </div>
            <span className="text-gray-700 font-medium">8 People</span>
          </div>
        </div>

        {/* Footer with host and CTA */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <Image
                src={creator.avatar || "/placeholder.svg"}
                alt={creator.name}
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{creator.name}</p>
              <p className="text-xs text-gray-500">Host</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              onJoin?.()
            }}
            className="bg-black text-white px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Request to Join
          </button>
        </div>

        <div className="px-5 py-3 flex items-center gap-2">
          <Zap className="h-3 w-3 text-gray-600" />
          <span className="text-xs text-gray-600">{category}</span>
        </div>
      </div>
    </Link>
  )
}
