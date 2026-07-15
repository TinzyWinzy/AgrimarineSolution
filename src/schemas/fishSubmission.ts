import { z } from 'zod/v4'

export const fishSubmissionSchema = z.object({
  farmerName: z.string().min(1, 'Full name is required'),
  farmerPhone: z.string().min(8, 'Valid phone number required').regex(/^\+?[\d\s\-()]{8,20}$/, 'Invalid phone format'),
  farmerAltPhone: z.string().optional(),
  farmerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  farmName: z.string().optional(),
  preferredContact: z.enum(['Phone call', 'SMS', 'WhatsApp', 'Email']),
  isExistingFarmer: z.boolean(),

  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  town: z.string().min(1, 'Town is required'),
  farmVillage: z.string().min(1, 'Farm or village name is required'),
  physicalAddress: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  accessNotes: z.string().optional(),

  species: z.enum(['Nile tilapia', 'Catfish', 'Other']),
  estimatedKg: z.number().min(1, 'Weight must be at least 1 kg'),
  averageFishGrams: z.number().min(1, 'Average fish weight is required'),
  estimatedCount: z.number().optional(),
  harvestDate: z.string().min(1, 'Harvest date is required'),
  fishCondition: z.enum(['Live', 'Fresh', 'Frozen']),
  farmingMethod: z.enum(['Pond', 'Dam', 'Tank', 'Cage', 'Other']),
  feedUsed: z.string().optional(),
  notes: z.string().optional(),

  images: z.array(z.object({
    id: z.string(),
    category: z.string(),
    fileName: z.string(),
    storageUrl: z.string().optional(),
    localBlobId: z.string().optional(),
  })),

  preferredDate: z.string().min(1, 'Preferred date is required'),
  alternativeDate: z.string().optional(),
  preferredTime: z.enum(['Morning', 'Afternoon', 'Flexible']),
  canDeliver: z.boolean(),
  requiresRefrigeration: z.boolean(),
  urgency: z.enum(['Low', 'Normal', 'Urgent']),
  collectionInstructions: z.string().optional(),

  consentAccurate: z.literal(true, { message: 'You must confirm the information is accurate' }),
  consentVerified: z.literal(true, { message: 'You must acknowledge weight verification' }),
  consentEstimate: z.literal(true, { message: 'You must acknowledge this is an estimate' }),
  consentReview: z.literal(true, { message: 'You must acknowledge review is required' }),
})

export type FishSubmissionFormData = z.infer<typeof fishSubmissionSchema>
