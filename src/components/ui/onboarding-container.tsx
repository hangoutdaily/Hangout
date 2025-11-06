"use client"

import { useState } from "react"
import { Screen1 } from "@/app/onboarding/components/screen-1"
import { Screen2 } from "@/app/onboarding/components/screen-2"
import { Screen3 } from "@/app/onboarding/components/screen-3"
import { ProgressBar } from "./progress-bar"
import { NavigationControls } from "./navigation-controls"

export function OnboardingContainer() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [formData, setFormData] = useState({
    // Screen 1
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    education: "",
    lifeEngagement: "",
    area: "",
    languages: [] as string[],

    // Screen 2
    bio: "",
    lookingFor: "",
    traits: [] as string[],
    interests: [] as string[],
    topPlaces: "",
    joyfulMoment: "",

    // Screen 3
    drinks: "",
    smoke: "",
    weed: "",
    photos: [] as string[],
    selfie: "",
    socialLinks: "",
  })

  const screens = [
    <Screen1 key="screen-1" data={formData} onChange={setFormData} />,
    <Screen2 key="screen-2" data={formData} onChange={setFormData} />,
    <Screen3 key="screen-3" data={formData} onChange={setFormData} />,
  ]

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    }
  }

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    // Handle submission here
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ProgressBar current={currentScreen + 1} total={screens.length} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">{screens[currentScreen]}</div>
      </div>

      <NavigationControls
        currentScreen={currentScreen}
        totalScreens={screens.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
