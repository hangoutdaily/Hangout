"use client"

import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select"
import { Textarea } from "@/components/ui/shadcn/textarea"

interface Screen1Props {
  data: any
  onChange: (data: any) => void
}

export function Screen1({ data, onChange }: Screen1Props) {
  const handleChange = (field: string, value: string | string[]) => {
    onChange({ ...data, [field]: value })
  }

  const handleLanguageToggle = (lang: string) => {
    const languages = data.languages.includes(lang)
      ? data.languages.filter((l: string) => l !== lang)
      : [...data.languages, lang]
    handleChange("languages", languages)
  }

  const languageOptions = ["English", "Spanish", "French", "German", "Mandarin", "Hindi", "Japanese"]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">Let's start with the basics</h1>
        <p className="text-base text-muted-foreground font-normal">We need few details so your profile doesn’t look like an NPC.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full name
          </Label>
          <Input
            id="fullName"
            placeholder="Your name"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors h-12 text-base"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-foreground">
              Age
            </Label>
            <Select value={data.age} onValueChange={(value) => handleChange("age", value)}>
              <SelectTrigger className="w-full bg-background border-border text-foreground focus:border-foreground transition-colors h-12 text-base">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => 18 + i).map((age) => (
                  <SelectItem key={age} value={String(age)}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-foreground">
              Gender
            </Label>
            <Select value={data.gender} onValueChange={(value) => handleChange("gender", value)}>
              <SelectTrigger className="w-full bg-background border-border text-foreground focus:border-foreground transition-colors h-12 text-base">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone number
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors h-12 text-base"
            />
          </div>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label htmlFor="education" className="text-sm font-medium text-foreground">
            Education
          </Label>
          <Select value={data.education} onValueChange={(value) => handleChange("education", value)}>
            <SelectTrigger className="w-full bg-background border-border text-foreground focus:border-foreground transition-colors h-12 text-base">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">Ph.D.</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Life Engagement */}
        <div className="space-y-2">
          <Label htmlFor="lifeEngagement" className="text-sm font-medium text-foreground">
            What are you currently engaged with in life?
          </Label>
          <Textarea
            id="lifeEngagement"
            placeholder="Studies, work, startup, travel..."
            value={data.lifeEngagement}
            onChange={(e) => handleChange("lifeEngagement", e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors resize-none text-base"
            rows={3}
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm font-medium text-foreground">
            Where are you based?
          </Label>
          <Input
            id="area"
            placeholder="City or region"
            value={data.area}
            onChange={(e) => handleChange("area", e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors h-12 text-base"
          />
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Languages you speak</Label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageToggle(lang)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  data.languages.includes(lang)
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background border-border text-foreground hover:border-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
