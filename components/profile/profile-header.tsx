"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Calendar, Mail, Phone } from "lucide-react"
import { useUserStore } from "@/stores/userStore"

// Mock user data


export function ProfileHeader() {
  const { user } = useUserStore();
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.profile_url || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="text-lg">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
              <Badge className="bg-accent text-accent-foreground w-fit">{user?.membershipTier} Member</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{user?.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{user?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {user?.created_at}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-2">
              <div>
                <div className="text-2xl font-bold text-foreground">{user?.orders?.length}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">₹{user?.totalSpent?.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Button variant="outline" className="bg-transparent">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
