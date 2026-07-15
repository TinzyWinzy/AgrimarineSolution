# Data Model

## Firestore Collections

### users
User accounts for staff and administrators.
- Fields: email, displayName, phone, role (staff|administrator), active, photoURL

### farmers
Registered farmer profiles.
- Fields: farmerId, fullName, phone, altPhone, email, farmName, province, district, town, address, latitude, longitude, farmingMethod, speciesFarmed, estimatedCapacity, registrationDate, source, tags, status, notes, totalVerifiedKg, totalPayments

### fishSubmissions
Fish collection requests from farmers.
- Fields: referenceNumber, farmerName, farmerPhone, species, estimatedKg, averageFishGrams, estimatedValue, pricingRuleSnapshot (immutable), images, status, statusHistory, collectionSchedule, assignedTeam, internalNotes, consent fields, syncedAt

### pricingRules
Per-species pricing configuration.
- Fields: species, pricePerKg, minAverageFishGrams, minTotalKg, maxTotalKg, effectiveDate, expirationDate, status, version

### serviceEnquiries
Customer quote/service requests.
- Fields: customerName, phone, email, service, description, budgetRange, status

### products
Demonstration products for supply ordering.
- Fields: name, category, description, price, unit, inStock

### supplyRequests
Customer supply orders.
- Fields: customerName, phone, items[], collectionOrDelivery, status

### trainingBookings
Training registration.
- Fields: name, phone, topic, preferredDate, venue, experienceLevel, status

### notifications
In-app notifications.
- Fields: type, title, message, relatedId, read, userId

### counters
Sequential reference number counters.
- Fields: currentValue

### activityLogs
Audit trail.
- Fields: action, entityType, entityId, userId, userName

## IndexedDB Stores

- pendingFishSubmissions — Offline submission queue
- imageBlobs — Binary image data stored locally
- cachedFarmers / cachedSubmissions / cachedCollections — Read cache for offline staff access
- cachedPricingRules — Offline pricing rule cache
- cachedTracking — Public tracking result cache
- syncMetadata — Sync timing and status
