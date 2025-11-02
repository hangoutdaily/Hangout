"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Users, DollarSign, Tag, Upload, ArrowLeft } from "lucide-react";
import EventCard from "@/components/ui/EventCard";
import Link from "next/link";

const categories = [
  "Technology", "Food & Drink", "Music", "Sports", "Education", 
  "Art & Culture", "Health & Wellness", "Business", "Gaming", "Other"
];

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    maxAttendees: 10,
    priceType: "free" as "free" | "split" | "paid",
    price: 0,
    category: "Technology",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const attendeeAvatars = [
    "https://i.pravatar.cc/40?img=2",
    "https://i.pravatar.cc/40?img=3",
    "https://i.pravatar.cc/40?img=4",
  ];

  const previewProps = useMemo(() => ({
    id: "preview",
    title: form.title || "Your Event Title",
    description: form.description || "Write a short, catchy description so people know what to expect.",
    location: form.location || "Location",
    date: form.date || "Date",
    time: form.time || "Time",
    attendees: 0,
    maxAttendees: form.maxAttendees,
    category: form.category,
    price: form.price,
    priceType: form.priceType,
    creator: { name: "You", avatar: "https://i.pravatar.cc/40?img=1" },
    attendeeAvatars,
  }), [form]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.title.trim()) newErrors.title = "Title is required";
      if (!form.description.trim()) newErrors.description = "Description is required";
      if (!form.category.trim()) newErrors.category = "Category is required";
    }
    if (step === 2) {
      if (!form.date) newErrors.date = "Date is required";
      if (!form.time) newErrors.time = "Time is required";
      if (!form.location.trim()) newErrors.location = "Location is required";
      if (!form.maxAttendees || form.maxAttendees < 1) newErrors.maxAttendees = "Capacity must be at least 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;
    const newId = Date.now().toString();
    console.log("Submitting event", { id: newId, ...form });
    router.push(`/events/${newId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground hover:text-accent transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </Link>
            <div className="text-sm text-muted">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div> */}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Hangout</h1>
          <p className="text-muted">Share your passion and meet lovely people.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="w-full bg-surface rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
                      <p className="text-muted">Tell us about your hangout</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-3 bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                      placeholder="e.g., Sunday Brunch and Gossips"
                      required
                    />
                    {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-3 h-32 resize-none bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                      placeholder="Describe what people can expect from this hangout..."
                      required
                    />
                    <p className="text-xs text-muted mt-1">Be specific about what will happen and what attendees should bring</p>
                    {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">When & Where</h2>
                      <p className="text-muted">Set the date, time, and location</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full border border-border rounded-lg pl-10 pr-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                          required
                        />
                      {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Time *</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                        <input
                          type="time"
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full border border-border rounded-lg pl-10 pr-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                          required
                        />
                      {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full border border-border rounded-lg pl-10 pr-4 py-3 bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                        placeholder="e.g., Tech Hub, 123 Main St, City"
                        required
                      />
                      {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Maximum Attendees *</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={form.maxAttendees}
                        onChange={(e) => setForm({ ...form, maxAttendees: Number(e.target.value) })}
                        className="w-full border border-border rounded-lg pl-10 pr-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                        required
                      />
                      {errors.maxAttendees && <p className="mt-1 text-xs text-destructive">{errors.maxAttendees}</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
                      <p className="text-muted">Set how much attendees should pay</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Price Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "free", label: "Free", desc: "No cost" },
                          { value: "split", label: "Split Cost", desc: "Share expenses" },
                          { value: "paid", label: "Paid", desc: "Set a price" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setForm({ ...form, priceType: option.value as any, price: option.value === "free" ? 0 : form.price })}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              form.priceType === option.value
                                ? "border-accent bg-accent/5 text-accent"
                                : "border-border hover:border-accent/50"
                            }`}
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted">{option.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.priceType === "paid" && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Price per person</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                            className="w-full border border-border rounded-lg pl-10 pr-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    )}

                    {form.priceType === "split" && (
                      <div className="p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted">
                          Attendees will split the total cost equally. You can specify the total budget in the event description.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md"
                  >
                    Create Event
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-card-bg border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Live Preview</h3>
              <div className="transform scale-90 origin-top">
                <EventCard {...previewProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
