export interface FirestoreRecord {
  id: string
  createdAt: number
  updatedAt: number
  createdBy?: string
  updatedBy?: string
  version: number
  isDemo?: boolean
}

export interface User extends FirestoreRecord {
  email: string
  displayName: string
  phone?: string
  role: 'staff' | 'administrator'
  active: boolean
  photoURL?: string
}

export interface Farmer extends FirestoreRecord {
  farmerId: string
  fullName: string
  phone: string
  altPhone?: string
  email?: string
  farmName?: string
  province: string
  district: string
  town: string
  address?: string
  latitude?: number
  longitude?: number
  farmingMethod?: string
  speciesFarmed?: string
  estimatedCapacity?: number
  registrationDate: number
  source?: string
  tags?: string[]
  status: 'active' | 'inactive' | 'blocked'
  notes?: string
  totalVerifiedKg?: number
  totalPayments?: number
}

export type FishSpecies = 'Nile tilapia' | 'Catfish' | 'Other'
export type FarmingMethod = 'Pond' | 'Dam' | 'Tank' | 'Cage' | 'Other'
export type FishCondition = 'Live' | 'Fresh' | 'Frozen'
export type SubmissionUrgency = 'Low' | 'Normal' | 'Urgent'
export type PreferredContact = 'Phone call' | 'SMS' | 'WhatsApp' | 'Email'

export type SubmissionStatus =
  | 'New'
  | 'Under review'
  | 'More information required'
  | 'Approved'
  | 'Collection scheduled'
  | 'Team assigned'
  | 'In transit'
  | 'Arrived'
  | 'Weight verified'
  | 'Collected'
  | 'Payment pending'
  | 'Paid'
  | 'Declined'
  | 'Cancelled'

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'requiresAttention'

export interface FishSubmission extends FirestoreRecord {
  referenceNumber?: string
  localId?: string
  idempotencyKey?: string

  farmerName: string
  farmerPhone: string
  farmerAltPhone?: string
  farmerEmail?: string
  farmName?: string
  preferredContact: PreferredContact
  isExistingFarmer: boolean

  province: string
  district: string
  town: string
  farmVillage: string
  physicalAddress?: string
  latitude?: number
  longitude?: number
  accessNotes?: string

  species: FishSpecies
  estimatedKg: number
  averageFishGrams: number
  estimatedCount?: number
  harvestDate: string
  fishCondition: FishCondition
  farmingMethod: FarmingMethod
  feedUsed?: string
  notes?: string

  images: FishImage[]
  imageUrls: string[]

  preferredDate: string
  alternativeDate?: string
  preferredTime: 'Morning' | 'Afternoon' | 'Flexible'
  canDeliver: boolean
  requiresRefrigeration: boolean
  urgency: SubmissionUrgency
  collectionInstructions?: string

  pricingRuleSnapshot?: PricingRuleSnapshot
  estimatedValue: number
  verifiedWeightKg?: number
  finalPricePerKg?: number
  finalValue?: number

  status: SubmissionStatus
  statusHistory: StatusEntry[]
  collectionSchedule?: CollectionScheduleRef
  assignedTeam?: string[]
  internalNotes?: InternalNote[]

  consentAccurate: boolean
  consentVerified: boolean
  consentEstimate: boolean
  consentReview: boolean

  syncedAt?: number
  sourceDeviceId?: string
}

export interface FishImage {
  id: string
  category: string
  fileName: string
  storageUrl?: string
  localBlobId?: string
}

export interface PricingRule extends FirestoreRecord {
  species: FishSpecies
  pricePerKg: number
  minAverageFishGrams: number
  minTotalKg?: number
  maxTotalKg?: number
  effectiveDate: number
  expirationDate?: number
  status: 'active' | 'inactive' | 'expired'
  notes?: string
  version: number
}

export interface PricingRuleSnapshot {
  ruleId: string
  species: FishSpecies
  pricePerKg: number
  minAverageFishGrams: number
  version: number
  estimatedValue: number
}

export interface StatusEntry {
  status: SubmissionStatus
  timestamp: number
  changedBy?: string
  comment?: string
}

export interface CollectionScheduleRef {
  scheduledDate: string
  scheduledTime: string
  teamId?: string
}

export interface InternalNote {
  id: string
  text: string
  createdBy: string
  createdAt: number
}

export interface ServiceEnquiry extends FirestoreRecord {
  referenceNumber?: string
  customerName: string
  phone: string
  email?: string
  location: string
  service: string
  description: string
  budgetRange?: string
  preferredStartDate?: string
  siteSize?: string
  existingOperation?: string
  imageUrls: string[]
  preferredContact: PreferredContact
  status: EnquiryStatus
  assignedTo?: string
  estimatedValue?: number
  quotedValue?: number
  followUpDate?: number
  internalNotes?: InternalNote[]
  statusHistory: StatusEntry[]
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Assessment required' | 'Preparing quotation' | 'Quotation sent' | 'Negotiation' | 'Approved' | 'Lost' | 'Completed'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string
  price: number
  unit: string
  imageUrl?: string
  inStock: boolean
  isDemo: boolean
}

export type ProductCategory = 'Fingerlings' | 'Fish feed' | 'Medication' | 'Dam liners' | 'Water reservoirs' | 'Cage equipment' | 'Pond accessories' | 'Water testing supplies'

export interface SupplyRequest extends FirestoreRecord {
  referenceNumber?: string
  customerName: string
  phone: string
  email?: string
  location: string
  items: SupplyItem[]
  collectionOrDelivery: 'Collection' | 'Delivery enquiry'
  notes?: string
  status: SupplyStatus
  statusHistory: StatusEntry[]
  internalNotes?: InternalNote[]
}

export interface SupplyItem {
  productId: string
  productName: string
  quantity: number
  unit: string
}

export type SupplyStatus = 'New' | 'Confirming stock' | 'Quoted' | 'Confirmed' | 'Preparing' | 'Ready' | 'Collected' | 'Delivered' | 'Cancelled'

export interface TrainingBooking extends FirestoreRecord {
  referenceNumber?: string
  name: string
  phone: string
  email?: string
  location: string
  isOrganisation: boolean
  organisationName?: string
  participantCount: number
  topic: string
  preferredDate: string
  venue: 'On-site' | 'Agrimarine venue'
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  notes?: string
  status: TrainingStatus
  statusHistory: StatusEntry[]
  internalNotes?: InternalNote[]
}

export type TrainingStatus = 'New' | 'Contacted' | 'Date proposed' | 'Confirmed' | 'Completed' | 'Cancelled'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  relatedId?: string
  relatedType?: string
  read: boolean
  createdAt: number
  userId: string
}

export type NotificationType = 'submission_new' | 'submission_synced' | 'enquiry_new' | 'supply_new' | 'training_new' | 'collection_approved' | 'collection_scheduled' | 'followup_due' | 'payment_pending' | 'sync_failed' | 'conflict_needs_attention'

export interface ActivityLog extends FirestoreRecord {
  action: string
  entityType: string
  entityId: string
  details?: string
  userId: string
  userName: string
}

export interface SyncQueueItem {
  localId: string
  operationType: 'fishSubmission' | 'imageUpload' | 'statusUpdate' | 'collectionUpdate' | 'noteAdd'
  payload: unknown
  relatedEntityId?: string
  idempotencyKey?: string
  createdAt: number
  updatedAt: number
  retryCount: number
  lastError?: string
  syncStatus: SyncStatus
}

export interface SyncMetadata {
  lastSyncTime?: number
  pendingCount: number
  failedCount: number
}

export type CollectionStatus = SubmissionStatus
