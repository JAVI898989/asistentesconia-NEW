# Firestore Indexes for Referral System

## Required Composite Indexes

### 1. referrals Collection

Create the following composite index for the `referrals` collection:

**Collection ID:** `referrals`

**Fields to index:**
1. `referrerUserId` (Ascending)
2. `status` (Ascending)  
3. `createdAtMs` (Descending)

**Query scopes:** Collection

This index supports the following queries:
- Get all referrals for a specific user ordered by date
- Filter referrals by status and user
- Admin dashboard queries for referral analytics

### 2. referral_codes Collection

Create the following composite index for the `referral_codes` collection:

**Collection ID:** `referral_codes`

**Fields to index:**
1. `status` (Ascending)
2. `createdAtMs` (Descending)

**Query scopes:** Collection

This index supports the following queries:
- Get all active referral codes
- List referral codes by creation date

### 3. users Collection (for referral queries)

Create the following composite index for the `users` collection:

**Collection ID:** `users`

**Fields to index:**
1. `role` (Ascending)
2. `referralsCount` (Descending)

**Query scopes:** Collection

This index supports the following queries:
- Get top referrers by role
- Leaderboard queries for referral analytics

## Single Field Indexes

Make sure the following single field indexes exist:

### referrals Collection
- `stripeSessionId` (Ascending) - for idempotency checks
- `referrerUserId` (Ascending) - for user-specific queries
- `status` (Ascending) - for status filtering
- `createdAtMs` (Descending) - for date sorting

### referral_codes Collection  
- `ownerUserId` (Ascending) - for user's referral codes
- `status` (Ascending) - for active code filtering

### users Collection
- `referralCode` (Ascending) - for quick lookups
- `referredByCode` (Ascending) - for referral chain analysis
- `referralsCount` (Descending) - for ranking queries
- `referralsRevenue` (Descending) - for revenue ranking

## Firestore Console Setup

1. Go to Firebase Console > Firestore Database > Indexes
2. Click "Create Index"
3. Fill in the fields as specified above for each index
4. Click "Create"

## Alternative: Automatic Index Creation

The indexes will be automatically created when you first run queries that require them. Firebase will show error messages with direct links to create the required indexes.

## CLI Command (if using Firebase CLI)

```bash
# Add to firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "referrals",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "referrerUserId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status", 
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtMs",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "referral_codes",
      "queryScope": "COLLECTION", 
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtMs",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "role",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "referralsCount",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

Deploy with:
```bash
firebase deploy --only firestore:indexes
```

## Security Rules

Add these rules to your `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow read access to referral info for validation
      allow read: if request.auth != null && 
                     resource.data.keys().hasAny(['referralCode', 'role']);
    }
    
    // Referral codes are publicly readable for validation
    match /referral_codes/{codeId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
    
    // Referrals are read-only for users, write-only for server
    match /referrals/{referralId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.referrerUserId ||
                      request.auth.uid == resource.data.buyerUserId);
      allow write: if false; // Only server/webhook can write
    }
  }
}
```
