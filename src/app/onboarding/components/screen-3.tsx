"use client"

import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select"
import { Upload, Camera, Instagram, Twitter, Facebook, Linkedin } from "lucide-react"
import { useState } from "react"

interface Screen3Props {
  data: any
  onChange: (data: any) => void
}

export function Screen3({ data, onChange }: Screen3Props) {
  const [verificationMode, setVerificationMode] = useState(false)
  const [activeSocialLinks, setActiveSocialLinks] = useState<Record<string, boolean>>({
    instagram: !!data.socialLinks?.instagram,
    twitter: !!data.socialLinks?.twitter,
    facebook: !!data.socialLinks?.facebook,
    linkedin: !!data.socialLinks?.linkedin,
  })

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    onChange({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [platform]: value,
      },
    })
  }

  const toggleSocialLink = (platform: string) => {
    setActiveSocialLinks({
      ...activeSocialLinks,
      [platform]: !activeSocialLinks[platform],
    })
    if (!activeSocialLinks[platform]) {
      handleSocialLinkChange(platform, "")
    }
  }

  const lifestyleOptions = ["Yes", "No", "Occasionally", "Prefer not to say"]

  const socialPlatforms = [
    { id: "instagram", name: "Instagram", Icon: Instagram, placeholder: "@username" },
    { id: "twitter", name: "Twitter", Icon: Twitter, placeholder: "@handle" },
    { id: "facebook", name: "Facebook", Icon: Facebook, placeholder: "Profile URL" },
    { id: "linkedin", name: "LinkedIn", Icon: Linkedin, placeholder: "Profile URL" },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">Photos and final details</h1>
        <p className="text-base text-muted-foreground font-normal">
          Add photos and tell us about your lifestyle preferences
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Lifestyle Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Lifestyle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { field: "drinks", label: "Do you drink?" },
              { field: "smoke", label: "Do you smoke?" },
              { field: "weed", label: "Cannabis?" },
            ].map((item) => (
              <div key={item.field} className="space-y-2">
                <Label htmlFor={item.field} className="text-sm font-medium text-foreground">
                  {item.label}
                </Label>
                <Select value={data[item.field]} onValueChange={(value) => handleChange(item.field, value)}>
                  <SelectTrigger className="w-full bg-background border-border text-foreground focus:border-foreground transition-colors h-12 text-base">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {lifestyleOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium text-foreground">Add photos</Label>
            <span className="text-xs font-medium text-muted-foreground">{data.photos.length}/5</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload 3-5 clear photos. These help people get to know you better
          </p>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-foreground cursor-pointer transition-all flex items-center justify-center bg-secondary/30 hover:bg-secondary/50 group relative overflow-hidden"
              >
                <div className="text-center">
                  <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <p className="text-xs font-medium text-foreground">
                    {i === 0 ? "Main" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : "5"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selfie Verification */}
        <div className="space-y-4">
          <Label className="text-lg font-medium text-foreground">Verify your identity</Label>
          <p className="text-xs text-muted-foreground">
            Quick 30-second selfie verification. Verified profiles get more visibility
          </p>

          <button
            onClick={() => setVerificationMode(!verificationMode)}
            className={`w-full border-2 border-dashed rounded-lg p-8 md:p-10 flex flex-col items-center justify-center text-center transition-all group ${
              verificationMode ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground"
            }`}
          >
            <Camera
              className={`w-8 h-8 mx-auto mb-3 transition-colors ${
                verificationMode ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              }`}
            />
            <p className="font-medium text-foreground">{verificationMode ? "Camera Active" : "Verify with Selfie"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {verificationMode ? "Take a photo for verification" : "Click to start verification"}
            </p>
          </button>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-foreground">Social links (optional)</Label>
          <p className="text-xs text-muted-foreground">Add your social profiles to help people connect with you</p>

          {/* Social icons toggle bar */}
          <div className="flex gap-3 flex-wrap">
            {socialPlatforms.map(({ id, name, Icon }) => (
              <button
                key={id}
                onClick={() => toggleSocialLink(id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  activeSocialLinks[id]
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
                title={`Add ${name}`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Active social link inputs */}
          <div className="space-y-3">
            {socialPlatforms.map(
              ({ id, name, placeholder }) =>
                activeSocialLinks[id] && (
                  <div key={id} className="space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    <Label htmlFor={`social-${id}`} className="text-sm font-medium text-foreground">
                      {name}
                    </Label>
                    <Input
                      id={`social-${id}`}
                      placeholder={placeholder}
                      value={data.socialLinks?.[id] || ""}
                      onChange={(e) => handleSocialLinkChange(id, e.target.value)}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground transition-colors h-12 text-base"
                    />
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="border border-border rounded-lg p-4 bg-secondary/30 space-y-2">
          <p className="text-sm font-medium text-foreground">Complete profiles get more invitations</p>
          <p className="text-sm text-muted-foreground">
            Profiles with verified selfies and multiple photos receive up to 3x more hangout invitations
          </p>
        </div>
      </div>
    </div>
  )
}
