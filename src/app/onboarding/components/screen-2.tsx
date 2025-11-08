"use client"

import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { Textarea } from "@/components/ui/shadcn/textarea"
import {
  Mountain,
  Music,
  UtensilsCrossed,
  Camera,
  Film,
  Coffee,
  ShoppingBag,
  ChefHat,
  Play as Paw,
  Dumbbell,
  Moon,
  Building2,
  Footprints,
  Car,
  Waves,
  Frame,
} from "lucide-react"

interface Screen2Props {
  data: any
  onChange: (data: any) => void
  errors?: Record<string, string>
}

export function Screen2({ data, onChange, errors = {} }: Screen2Props) {
  const handleChange = (field: string, value: string | string[]) => {
    onChange({ ...data, [field]: value })
  }

  const handleTraitToggle = (trait: string) => {
    const traits = data.traits.includes(trait)
      ? data.traits.filter((t: string) => t !== trait)
      : data.traits.length < 3
        ? [...data.traits, trait]
        : data.traits

    handleChange("traits", traits)
  }

  const handleInterestToggle = (interest: string) => {
    const interests = data.interests.includes(interest)
      ? data.interests.filter((i: string) => i !== interest)
      : data.interests.length < 5
        ? [...data.interests, interest]
        : data.interests

    handleChange("interests", interests)
  }

  const traits = [
    "Empathetic",
    "Witty",
    "Curious",
    "Bold",
    "Chill",
    "Adventurous",
    "Philosophical",
    "Nerdy",
    "Deep Thinker",
    "Extrovert",
    "Ambivert",
    "Introvert",
    "Creative",
    "Spontaneous",
  ]

  const interestsWithIcons = [
    { name: "Outdoors", Icon: Mountain },
    { name: "Live Music", Icon: Music },
    { name: "Food Scenes", Icon: UtensilsCrossed },
    { name: "Photography", Icon: Camera },
    { name: "Films", Icon: Film },
    { name: "Coffee", Icon: Coffee },
    { name: "Shopping", Icon: ShoppingBag },
    { name: "Cooking", Icon: ChefHat },
    { name: "Animals", Icon: Paw },
    { name: "Fitness", Icon: Dumbbell },
    { name: "Nightlife", Icon: Moon },
    { name: "Local Culture", Icon: Building2 },
    { name: "Walking", Icon: Footprints },
    { name: "Cars", Icon: Car },
    { name: "Swimming", Icon: Waves },
    { name: "Art", Icon: Frame },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">Tell us about yourself</h1>
        <p className="text-base text-muted-foreground font-normal">
          We’re building your profile. Not a resume. Just the cool stuff.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Bio */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="bio" className="text-sm font-medium text-foreground">
              One-liner bio <span className="text-red-500">*</span>
            </Label>
            <span className="text-xs text-muted-foreground">{data.bio.length}/100</span>
          </div>
          <p className="text-xs text-muted-foreground">This is what appears first when people see your profile</p>
          <Input
            id="bio"
            placeholder="Coffee enthusiast, weekend hiker, book lover"
            maxLength={100}
            value={data.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className={`bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors h-12 text-base ${
              errors.bio ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
        </div>

        {/* What are you looking for */}
        <div className="space-y-3">
          <Label htmlFor="lookingFor" className="text-sm font-medium text-foreground">
            What are you looking for on Hangout? <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Be clear about your intent – new friends, adventure buddies, or something else
          </p>
          <Textarea
            id="lookingFor"
            placeholder="Looking for genuine connections and people to explore the city with..."
            value={data.lookingFor}
            onChange={(e) => handleChange("lookingFor", e.target.value)}
            className={`bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors resize-none text-base ${
              errors.lookingFor ? "border-red-500 focus:border-red-500" : ""
            }`}
            rows={4}
          />
          {errors.lookingFor && <p className="text-xs text-red-500">{errors.lookingFor}</p>}
        </div>

        {/* Traits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              Pick 3 traits that describe you <span className="text-red-500">*</span>
            </Label>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                data.traits.length === 3 ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              {data.traits.length}/3
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {traits.map((trait) => (
              <button
                key={trait}
                onClick={() => handleTraitToggle(trait)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border text-center ${
                  data.traits.includes(trait)
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background border-border text-foreground hover:border-foreground"
                }`}
              >
                {trait}
              </button>
            ))}
          </div>
          {errors.traits && <p className="text-xs text-red-500">{errors.traits}</p>}
        </div>

        {/* Interests - Now with icons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              What are you into? <span className="text-red-500">*</span>
            </Label>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                data.interests.length >= 3 ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              {data.interests.length}/5
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Pick some interests that you enjoy and want to show on your profile
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestsWithIcons.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => handleInterestToggle(name)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border flex items-center justify-start gap-2 ${
                  data.interests.includes(name)
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background border-border text-foreground hover:border-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{name}</span>
              </button>
            ))}
          </div>
          {errors.interests && <p className="text-xs text-red-500">{errors.interests}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="topSongs" className="text-sm font-medium text-foreground">
            Your favorite songs <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Share the songs that resonate with you most – it says a lot about your vibe
          </p>
          <Textarea
            id="topSongs"
            placeholder="Music that hits different at 2am…"
            value={data.topSongs}
            onChange={(e) => handleChange("topSongs", e.target.value)}
            className={`bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors resize-none text-base ${
              errors.topSongs ? "border-red-500 focus:border-red-500" : ""
            }`}
            rows={4}
          />
          {errors.topSongs && <p className="text-xs text-red-500">{errors.topSongs}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="topPlaces" className="text-sm font-medium text-foreground">
            Your favorite places <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Favorite restaurants, travel spots, or local hidden gems you love
          </p>
          <Textarea
            id="topPlaces"
            placeholder="Places that feel like home (even if they shouldn’t)…"
            value={data.topPlaces}
            onChange={(e) => handleChange("topPlaces", e.target.value)}
            className={`bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors resize-none text-base ${
              errors.topPlaces ? "border-red-500 focus:border-red-500" : ""
            }`}
            rows={4}
          />
          {errors.topPlaces && <p className="text-xs text-red-500">{errors.topPlaces}</p>}
        </div>

        {/* Joyful moment */}
        <div className="space-y-3">
          <Label htmlFor="joyfulMoment" className="text-sm font-medium text-foreground">
            What's your most joyful moment? <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Tell us about a time that still makes you smile – this helps people connect with you
          </p>
          <Textarea
            id="joyfulMoment"
            placeholder="Share a meaningful memory or experience..."
            value={data.joyfulMoment}
            onChange={(e) => handleChange("joyfulMoment", e.target.value)}
            className={`bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors resize-none text-base ${
              errors.joyfulMoment ? "border-red-500 focus:border-red-500" : ""
            }`}
            rows={4}
          />
          {errors.joyfulMoment && <p className="text-xs text-red-500">{errors.joyfulMoment}</p>}
        </div>
      </div>
    </div>
  )
}
