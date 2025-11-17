# 🚨 URGENT: Firestore Index Required for Referrals System

## ❌ **Error Detected:**
```
FirebaseError: [code=failed-precondition]: The query requires an index. 
You can create it here: https://console.firebase.google.com/v1/r/project/cursor-64188/firestore/indexes?create_composite=...
```

## ⚡ **IMMEDIATE FIX REQUIRED:**

### **Step 1: Create Index (CLICK THIS LINK)**
👉 **[CREATE INDEX NOW](https://console.firebase.google.com/v1/r/project/cursor-64188/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9jdXJzb3ItNjQxODgvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3JlZmVycmFscy9pbmRleGVzL18QARoSCg5yZWZlcnJlclVzZXJJZBABGg8KC2NyZWF0ZWRBdE1zEAIaDAoIX19uYW1lX18QAg)**

### **Step 2: Manual Creation (if link doesn't work)**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `cursor-64188`
3. Navigate to **Firestore Database** → **Indexes**
4. Click **"Create Index"**
5. Fill in these exact details:

**Collection ID:** `referrals`

**Fields to index:**
1. `referrerUserId` - **Ascending**
2. `createdAtMs` - **Descending**

**Query scope:** `Collection`

6. Click **"Create"**

### **What This Index Does:**
This index supports the query:
```typescript
query(
  collection(db, 'referrals'),
  where('referrerUserId', '==', userId),
  orderBy('createdAtMs', 'desc'),
  limit(50)
)
```

### **Index Creation Time:**
- Small datasets: **1-2 minutes**
- Large datasets: **up to 30 minutes**

## 🛠️ **TEMPORARY WORKAROUND:**

While the index is being created, I'm implementing a fallback to prevent the error:

### **Error Handling Added:**
- Graceful degradation when index is not ready
- Loading states during index creation
- Retry mechanism once index is available
