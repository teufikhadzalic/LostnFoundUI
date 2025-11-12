// Core domain types
export enum UserRole {
  STUDENT = "student",
  OFFICER = "officer",
  ADMIN = "admin",
}

export enum ItemStatus {
  LOST = "lost",
  FOUND = "found",
  CLAIMED = "claimed",
  RESOLVED = "resolved",
}

export enum ClaimStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export enum NotificationType {
  CLAIM_RECEIVED = "claim_received",
  CLAIM_APPROVED = "claim_approved",
  CLAIM_REJECTED = "claim_rejected",
  COMMENT_ADDED = "comment_added",
  ITEM_FOUND = "item_found",
  VERIFICATION_NEEDED = "verification_needed",
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  faculty: string
  avatarUrl?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
  stats?: {
    itemsPosted: number
    itemsFound: number
    successRate: number
  }
}

export interface Item {
  id: string
  userId: string
  title: string
  description: string
  status: ItemStatus
  category: string
  location: string
  faculty: string
  imageUrls: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  claimedBy?: string
  claims?: Claim[]
  comments?: Comment[]
}

export interface Claim {
  id: string
  itemId: string
  claimerId: string
  status: ClaimStatus
  reason: string
  evidence: {
    photoWithItem?: string
    npmCard?: string
    description?: string
  }
  verifiedBy?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  itemId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedItemId?: string
  relatedClaimId?: string
  read: boolean
  createdAt: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}
