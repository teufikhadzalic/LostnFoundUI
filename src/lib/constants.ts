// Application constants
export const FACULTIES = [
  "Teknik",
  "Hukum",
  "Kedokteran",
  "Ekonomi dan Bisnis",
  "Ilmu Pengetahuan Budaya",
  "Ilmu Administrasi",
  "Psikologi",
]

export const CATEGORIES = ["Elektronik", "Dokumen", "Tas & Dompet", "Kunci", "Pakaian", "Alat Tulis", "Lainnya"]

export const LOCATIONS = [
  "Perpustakaan Pusat",
  "Auditorium",
  "Kantin",
  "Parkiran",
  "Ruang Kelas",
  "Laboratorium",
  "Masjid",
]

export const TAGS = ["Urgent", "Verified", "New", "Popular", "Trending"]

export const NOTIFICATION_COLORS: Record<string, string> = {
  claim_received: "bg-blue-50",
  claim_approved: "bg-green-50",
  claim_rejected: "bg-red-50",
  comment_added: "bg-purple-50",
  item_found: "bg-yellow-50",
  verification_needed: "bg-orange-50",
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  ITEMS: {
    LIST: "/items",
    CREATE: "/items",
    GET: (id: string) => `/items/${id}`,
    UPDATE: (id: string) => `/items/${id}`,
    DELETE: (id: string) => `/items/${id}`,
  },
  CLAIMS: {
    LIST: "/claims",
    CREATE: "/claims",
    GET: (id: string) => `/claims/${id}`,
    VERIFY: (id: string) => `/claims/${id}/verify`,
  },
  COMMENTS: {
    LIST: (itemId: string) => `/items/${itemId}/comments`,
    CREATE: (itemId: string) => `/items/${itemId}/comments`,
    DELETE: (id: string) => `/comments/${id}`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
}
