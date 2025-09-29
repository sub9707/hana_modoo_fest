import { getPoolStatus } from "@/lib/mysql/connection"
import { NextResponse } from "next/server"

export async function GET() {
  const status = getPoolStatus()

  
  return NextResponse.json(status)
}