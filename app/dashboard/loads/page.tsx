import pb from "@/lib/pocketbase"
import LoadsClient from "./LoadsClient"

// Function to fetch loads from PocketBase
async function getLoads() {
  try {
    const records = await pb.collection('loads').getList(1, 50, {
      sort: '-created',
    })
    return records.items
  } catch (error) {
    console.error("Error fetching loads:", error)
    throw new Error("Failed to fetch loads")
  }
}

export default async function LoadsPage() {
  const loads = await getLoads()

  return <LoadsClient initialLoads={loads} />
}