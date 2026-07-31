import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card as CampaignCard } from "@/components/ui/card"
import { Loader2, ArrowRight, MapPin, Users, TrendingUp, Shield, HandHeart, Rocket, Star, Quote } from "lucide-react"
import type { Campaign } from "@/pages/explore-page"

const heroSlides = [
  {
    heading: "Empower Creators",
    subtext: "Turn your boldest ideas into reality with the support of a community that believes in you.",
    cta: "Start a Campaign",
    ctaLink: "/register",
  },
  {
    heading: "Back What Matters",
    subtext: "Discover projects that inspire you and make a real impact with your contribution.",
    cta: "Explore Campaigns",
    ctaLink: "/explore",
  },
  {
    heading: "Build Together",
    subtext: "Join thousands of creators and backers shaping the future, one campaign at a time.",
    cta: "Join as Supporter",
    ctaLink: "/register",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Creator",
    quote: "FundRise helped me raise $5,000 for my community art project. The platform is intuitive and the support from backers was incredible.",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Marcus Johnson",
    role: "Supporter",
    quote: "I love discovering new campaigns every week. The contribution process is seamless and I always know exactly where my credits go.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "Priya Patel",
    role: "Creator",
    quote: "As a first-time creator, the guidance and tools on FundRise made launching my education campaign effortless.",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Alex Rivera",
    role: "Supporter",
    quote: "The transparency of seeing exactly how funds are used gives me confidence that my contributions make a real difference.",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
]

const howItWorks = [
  {
    icon: Rocket,
    title: "Discover",
    description: "Browse approved campaigns across categories and find projects that resonate with you.",
  },
  {
    icon: HandHeart,
    title: "Contribute",
    description: " pledge credits to support the campaigns you care about. Every contribution counts.",
  },
  {
    icon: TrendingUp,
    title: "Track",
    description: "Follow campaign progress in real time and see the impact of your support.",
  },
  {
    icon: Star,
    title: "See Impact",
    description: "Watch funded projects come to life and celebrate the results with the community.",
  },
]

const impactStats = [
  { label: "Active Campaigns", value: "120+", icon: Rocket },
  { label: "Total Raised", value: "50K+", icon: TrendingUp },
  { label: "Supporters", value: "3K+", icon: Users },
  { label: "Success Rate", value: "89%", icon: Shield },
]

const categories = [
  { name: "Technology", icon: Rocket, color: "text-blue-500 bg-blue-500/10" },
  { name: "Education", icon: Star, color: "text-green-500 bg-green-500/10" },
  { name: "Environment", icon: MapPin, color: "text-emerald-500 bg-emerald-500/10" },
  { name: "Creative", icon: Quote, color: "text-purple-500 bg-purple-500/10" },
  { name: "Health", icon: Shield, color: "text-red-500 bg-red-500/10" },
  { name: "Community", icon: Users, color: "text-orange-500 bg-orange-500/10" },
]

function TopFundedCampaigns() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["top-funded"],
    queryFn: () => api.get("/api/campaigns/top-funded"),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns?.map((c) => (
        <CampaignCard key={c._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
          {c.imageURL && (
            <div className="h-40 overflow-hidden">
              <img
                src={c.imageURL}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <CardContent className="p-5">
            <Badge variant="secondary" className="mb-2">
              {c.category}
            </Badge>
            <h3 className="font-heading text-lg font-semibold mb-1">{c.title}</h3>
            <p className="text-sm text-text-muted dark:text-text-muted-dark mb-3 line-clamp-2">
              {c.story}
            </p>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-brand-green font-medium">
                  {c.raisedAmount.toLocaleString()} credits
                </span>
                <span className="text-text-muted dark:text-text-muted-dark">
                  {c.fundingGoal.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-border-subtle dark:bg-border-subtle-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-green rounded-full"
                  style={{ width: `${Math.min(100, Math.round((c.raisedAmount / c.fundingGoal) * 100))}%` }}
                />
              </div>
            </div>
            <Link
              to={`/campaign/${c._id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
            >
              View Details <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </CampaignCard>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {heroSlides.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative h-[70vh] min-h-[400px] bg-gradient-to-br from-brand-green/90 to-brand-green/70 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                      {slide.heading}
                    </h1>
                    <p className="mt-4 text-lg text-white/90 max-w-2xl">
                      {slide.subtext}
                    </p>
                    <div className="mt-8">
                      <Link
                        to={slide.ctaLink}
                        className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-brand-green shadow-xs hover:bg-white/90 transition-colors"
                      >
                        {slide.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Top Funded Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold">Top Funded Campaigns</h2>
            <p className="text-text-muted dark:text-text-muted-dark mt-1">
              The most supported projects making a difference right now.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-brand-green hover:underline text-sm font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <TopFundedCampaigns />
      </section>

      {/* How It Works */}
      <section className="bg-bg-surface dark:bg-bg-surface-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-heading text-2xl font-bold text-center mb-8">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/explore?category=${cat.name}`}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border-subtle dark:border-border-subtle-dark hover:border-brand-green hover:bg-brand-green/5 transition-colors"
            >
              <div className={`p-3 rounded-full ${cat.color}`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Impact in Numbers */}
      <section className="bg-bg-surface dark:bg-bg-surface-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-center mb-12">
            Platform Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
                  <stat.icon className="h-6 w-6 text-brand-green" />
                </div>
                <div className="text-3xl font-bold text-brand-green">
                  {stat.value}
                </div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-heading text-2xl font-bold text-center mb-12">
          What People Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {t.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-primary dark:text-text-primary-dark italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}