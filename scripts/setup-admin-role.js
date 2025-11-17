#!/usr/bin/env node

/**
 * Admin Role Setup Script
 * 
 * This script sets up admin roles for specified users via:
 * 1. Firebase custom claims (preferred)
 * 2. Firestore users collection (fallback)
 * 
 * Usage:
 * node scripts/setup-admin-role.js [email|uid]
 * 
 * Examples:
 * node scripts/setup-admin-role.js javier@cursosgratis.ai
 * node scripts/setup-admin-role.js user123uid
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp({
    // You would normally load credentials from environment
    // credential: cert(require('./path/to/service-account-key.json')),
    // For now, use default credentials
  });
}

const auth = getAuth();
const db = getFirestore();

async function setupAdminRole(identifier) {
  try {
    console.log(`🔧 Setting up admin role for: ${identifier}`);
    
    let user;
    
    // Determine if identifier is email or UID
    if (identifier.includes('@')) {
      // Email
      try {
        user = await auth.getUserByEmail(identifier);
      } catch (error) {
        console.error(`❌ User not found with email: ${identifier}`);
        return false;
      }
    } else {
      // UID
      try {
        user = await auth.getUser(identifier);
      } catch (error) {
        console.error(`❌ User not found with UID: ${identifier}`);
        return false;
      }
    }
    
    console.log(`👤 Found user: ${user.email} (${user.uid})`);
    
    // Method 1: Set custom claims (preferred)
    try {
      await auth.setCustomUserClaims(user.uid, {
        role: 'admin',
        roles: ['admin'],
        isAdmin: true,
        adminSince: new Date().toISOString()
      });
      console.log(`✅ Custom claims set for ${user.email}`);
    } catch (error) {
      console.error(`⚠️ Failed to set custom claims:`, error.message);
    }
    
    // Method 2: Set Firestore role (fallback)
    try {
      const userRef = db.collection('users').doc(user.uid);
      
      // Check if user document exists
      const userDoc = await userRef.get();
      const existingData = userDoc.exists ? userDoc.data() : {};
      
      await userRef.set({
        ...existingData,
        uid: user.uid,
        email: user.email,
        role: 'admin',
        roles: ['admin'],
        isAdmin: true,
        adminSince: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log(`✅ Firestore role set for ${user.email}`);
    } catch (error) {
      console.error(`⚠️ Failed to set Firestore role:`, error.message);
    }
    
    // Method 3: Force token refresh (for immediate effect)
    try {
      // Revoke existing tokens to force refresh
      await auth.revokeRefreshTokens(user.uid);
      console.log(`🔄 Tokens revoked - user will need to refresh for immediate effect`);
    } catch (error) {
      console.warn(`⚠️ Could not revoke tokens:`, error.message);
    }
    
    console.log(`🎉 Admin role setup completed for ${user.email}`);
    console.log(`📋 User should:`);
    console.log(`   1. Sign out and sign back in`);
    console.log(`   2. Or call user.getIdToken(true) to force refresh`);
    console.log(`   3. Check for admin access in the app`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error setting up admin role:`, error);
    return false;
  }
}

async function verifyAdminRole(identifier) {
  try {
    console.log(`🔍 Verifying admin role for: ${identifier}`);
    
    let user;
    
    if (identifier.includes('@')) {
      user = await auth.getUserByEmail(identifier);
    } else {
      user = await auth.getUser(identifier);
    }
    
    console.log(`👤 User: ${user.email} (${user.uid})`);
    
    // Check custom claims
    const claims = user.customClaims || {};
    console.log(`🔑 Custom claims:`, claims);
    
    // Check Firestore
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log(`📄 Firestore data:`, {
        role: userData.role,
        roles: userData.roles,
        isAdmin: userData.isAdmin
      });
    } else {
      console.log(`📄 No Firestore document found`);
    }
    
    // Determine admin status
    const isAdminByClaims = claims.role === 'admin' || 
                           (claims.roles && claims.roles.includes('admin'));
    const isAdminByFirestore = userDoc.exists && 
                              (userDoc.data().role === 'admin' || 
                               (userDoc.data().roles && userDoc.data().roles.includes('admin')));
    
    console.log(`🎯 Admin status:`, {
      byClaims: isAdminByClaims,
      byFirestore: isAdminByFirestore,
      overall: isAdminByClaims || isAdminByFirestore
    });
    
    return isAdminByClaims || isAdminByFirestore;
    
  } catch (error) {
    console.error(`❌ Error verifying admin role:`, error);
    return false;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const identifier = args[1];
  
  if (!command) {
    console.log(`
📖 Admin Role Setup Script

Usage:
  node scripts/setup-admin-role.js setup <email|uid>     - Set up admin role
  node scripts/setup-admin-role.js verify <email|uid>    - Verify admin role
  node scripts/setup-admin-role.js list                  - List all admin users

Examples:
  node scripts/setup-admin-role.js setup javier@cursosgratis.ai
  node scripts/setup-admin-role.js verify user123uid
  node scripts/setup-admin-role.js list
    `);
    process.exit(0);
  }
  
  switch (command) {
    case 'setup':
      if (!identifier) {
        console.error('❌ Please provide email or UID');
        process.exit(1);
      }
      await setupAdminRole(identifier);
      break;
      
    case 'verify':
      if (!identifier) {
        console.error('❌ Please provide email or UID');
        process.exit(1);
      }
      await verifyAdminRole(identifier);
      break;
      
    case 'list':
      console.log('📋 Listing admin users...');
      // This would query Firestore for users with admin role
      const adminUsers = await db.collection('users')
        .where('role', '==', 'admin')
        .get();
      
      if (adminUsers.empty) {
        console.log('👤 No admin users found in Firestore');
      } else {
        adminUsers.forEach(doc => {
          const data = doc.data();
          console.log(`👑 ${data.email} (${doc.id}) - ${data.adminSince || 'unknown date'}`);
        });
      }
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
  
  process.exit(0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run main function
main().catch(console.error);
