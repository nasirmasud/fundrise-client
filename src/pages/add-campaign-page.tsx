import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"
import toast from "react-hot-toast"

const categories = [
  "Technology",
  "Education",
  "Environment",
  "Creative",
  "Health",
  "Community",
]

export default function AddCampaignPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [category, setCategory] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [minContribution, setMinContribution] = useState("")
  const [deadline, setDeadline] = useState("")
  const [rewardInfo, setRewardInfo] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string
      story: string
      category: string
      fundingGoal: number
      minContribution: number
      deadline: string
      rewardInfo?: string
      imageURL?: string
    }) => api.post("/api/campaigns", data),
    onSuccess: () => {
      toast.success("Campaign created successfully")
      navigate("/dashboard/my-campaigns")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create campaign")
    },
  })

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    )

    const data = await res.json()
    if (!data.success) throw new Error("Image upload failed")
    return data.data.url
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title || !story || !category || !fundingGoal || !minContribution || !deadline) {
      toast.error("Please fill in all required fields")
      return
    }

    if (Number(fundingGoal) <= 0 || Number(minContribution) <= 0) {
      toast.error("Funding goal and minimum contribution must be positive")
      return
    }

    if (new Date(deadline) <= new Date()) {
      toast.error("Deadline must be in the future")
      return
    }

    setUploading(true)
    let imageURL = ""

    try {
      if (imageFile) {
        imageURL = await uploadToImgBB(imageFile)
      }

      await createMutation.mutateAsync({
        title,
        story,
        category,
        fundingGoal: Number(fundingGoal),
        minContribution: Number(minContribution),
        deadline,
        rewardInfo: rewardInfo || undefined,
        imageURL: imageURL || undefined,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create campaign")
    } finally {
      setUploading(false)
    }
  }

  const isSubmitting = createMutation.isPending || uploading

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Add New Campaign</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="Enter campaign title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Story */}
            <div className="space-y-2">
              <label htmlFor="story" className="text-sm font-medium">
                Story <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="story"
                placeholder="Tell your story..."
                rows={6}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Funding Goal & Min Contribution */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fundingGoal" className="text-sm font-medium">
                  Funding Goal (credits) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fundingGoal"
                  type="number"
                  min="1"
                  placeholder="1000"
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="minContribution" className="text-sm font-medium">
                  Min Contribution (credits) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="minContribution"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={minContribution}
                  onChange={(e) => setMinContribution(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">
                Deadline <span className="text-red-500">*</span>
              </label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            {/* Reward Info */}
            <div className="space-y-2">
              <label htmlFor="rewardInfo" className="text-sm font-medium">
                Reward Info <span className="text-text-muted dark:text-text-muted-dark">(optional)</span>
              </label>
              <Textarea
                id="rewardInfo"
                placeholder="Describe rewards for backers..."
                rows={3}
                value={rewardInfo}
                onChange={(e) => setRewardInfo(e.target.value)}
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cover Image <span className="text-text-muted dark:text-text-muted-dark">(optional)</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-border-subtle dark:border-border-subtle-dark rounded-lg cursor-pointer hover:border-brand-green transition-colors">
                  <Upload className="h-5 w-5 text-text-muted dark:text-text-muted-dark" />
                  <span className="text-sm text-text-muted dark:text-text-muted-dark">
                    {imageFile ? imageFile.name : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
