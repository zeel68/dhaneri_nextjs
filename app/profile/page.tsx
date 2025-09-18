"use client"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { useUserStore } from "@/stores/userStore"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, fetchUserDetails, clearUser } = useUserStore();
  useEffect(() => {
    fetchDetails()
    // clearUser()
  }, [])
  const fetchDetails = async () => {
    fetchUserDetails();
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {user != null ?
          <>
            <ProfileHeader />
            <ProfileTabs />
          </> :
          <></>}

      </div>
    </div>
  )
}
