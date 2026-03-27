# 🧪 Multi-Tenancy Testing Guide

## 🎯 Test Scenarios

### 1. Super Admin Access Test
**Login:** superadmin@demo.com / demo123

**Expected Results:**
- ✅ Homepage shows "Super Admin Dashboard"
- ✅ Can see ALL homes (Sunshine, Golden Years, Peaceful Haven)
- ✅ Can see ALL residents (7 residents across all homes)
- ✅ Can see ALL donations (3 donations across all homes)
- ✅ Can see ALL visits (3 visits across all homes)
- ✅ Can create new homes
- ✅ Admin Dashboard link visible

### 2. Admin A Access Test (Data Isolation)
**Login:** admin.a@demo.com / demo123

**Expected Results:**
- ✅ Homepage shows "Admin Dashboard"
- ✅ Can see ONLY Sunshine Home residents (Demo Resident 1, 2, 3)
- ✅ CANNOT see Golden Years or Peaceful Haven residents
- ✅ Can see ONLY Sunshine Home donations ($100)
- ✅ CANNOT see other homes' donations
- ✅ Can create residents only for Sunshine Home
- ✅ New residents automatically assigned to Sunshine Home

### 3. Admin B Access Test (Data Isolation)
**Login:** admin.b@demo.com / demo123

**Expected Results:**
- ✅ Homepage shows "Admin Dashboard"
- ✅ Can see ONLY Golden Years Home residents (Demo Resident 4, 5)
- ✅ CANNOT see Sunshine or Peaceful Haven residents
- ✅ Can see ONLY Golden Years Home donations ($250)
- ✅ CANNOT see other homes' donations
- ✅ Can create residents only for Golden Years Home

### 4. Volunteer X Multi-Home Selection Test
**Login:** volunteer.x@demo.com / demo123

**Expected Results:**
- ✅ Homepage shows "Volunteer Dashboard"
- ✅ Home selector dropdown shows: "Sunshine Senior Home" and "Golden Years Care"
- ✅ Default shows "Select Home" message
- ✅ Selecting "Sunshine Home" shows only Demo Resident 1, 2, 3
- ✅ Selecting "Golden Years Home" shows only Demo Resident 4, 5
- ✅ CANNOT see Peaceful Haven residents (not assigned)
- ✅ Can schedule visits only for selected home
- ✅ Visit scheduling saves with correct homeId

### 5. Volunteer Y Single-Home Test
**Login:** volunteer.y@demo.com / demo123

**Expected Results:**
- ✅ Homepage shows "Volunteer Dashboard"
- ✅ NO home selector dropdown (only one home assigned)
- ✅ Can see only Peaceful Haven residents (Demo Resident 6, 7)
- ✅ CANNOT see other homes' residents
- ✅ Can schedule visits only for Peaceful Haven
- ✅ Visit scheduling saves with Peaceful Haven homeId

## 🔧 How to Run Tests

### 1. Seed Demo Data
```bash
cd c:\Users\Shardul\OneDrive\ドキュメント\oldage
node seed-multi-tenant.js
```

### 2. Start Server
```bash
npm start
```

### 3. Browser Testing
1. **Clear browser cache**: Ctrl+Shift+R
2. **Test each scenario** above
3. **Check Network tab** for API calls
4. **Check Console** for debug logs

### 4. MongoDB Compass Verification
1. **Connect to your database**
2. **Check users collection** - Verify roles and homeId arrays
3. **Check homes collection** - Verify 3 demo homes
4. **Check residents collection** - Verify homeId references
5. **Check donations collection** - Verify homeId references
6. **Check visits collection** - Verify homeId references

## 🎭 Expected API Behavior

### Residents API (/api/residents)
- **Super Admin:** `GET /api/residents` → Returns all 7 residents
- **Admin A:** `GET /api/residents` → Returns only 3 Sunshine residents
- **Admin B:** `GET /api/residents` → Returns only 2 Golden Years residents
- **Volunteer X:** `GET /api/residents` with `x-selected-home: sunshineId` → Returns 3 Sunshine residents
- **Volunteer X:** `GET /api/residents` with `x-selected-home: goldenYearsId` → Returns 2 Golden Years residents

### Donations API (/api/donations)
- **Super Admin:** Returns all 3 donations
- **Admin A:** Returns only 1 Sunshine donation ($100)
- **Volunteer X:** Returns donations based on selected home

### Visits API (/api/visits)
- **Super Admin:** Returns all 3 visits
- **Admin A:** Returns only visits for Sunshine Home
- **Volunteer X:** Returns visits based on selected home

## 🎯 Success Criteria

✅ **Data Isolation:** Admins cannot see other admins' data
✅ **Role Separation:** Each role sees appropriate interface
✅ **Home Selection:** Volunteers can switch between assigned homes
✅ **Super Admin Control:** Can manage all homes and users
✅ **Clean URLs:** No complex parameters, simple REST API
✅ **No Cross-Access:** Volunteer X cannot see Peaceful Haven data

## 🚨 Common Issues & Solutions

### Issue: "Admin sees all residents"
**Cause:** Role filtering not working
**Check:** Server logs show `req.user.role` and `req.homeIds`
**Fix:** Verify auth middleware is properly attached

### Issue: "Volunteer dropdown not working"
**Cause:** Frontend JavaScript not loading
**Check:** Browser console for errors, network tab for 404s
**Fix:** Clear cache, verify app.js version

### Issue: "Visit scheduling fails"
**Cause:** homeId not properly assigned
**Check:** Request payload in Network tab
**Fix:** Verify selected home is being sent in header

---

## 🎉 Ready for Viva Demo!

This complete multi-tenant system demonstrates:
- **Simple role-based access control**
- **Data isolation between homes**
- **Volunteer home selection**
- **Super admin central management**
- **Clean, maintainable codebase**

Perfect for academic presentation! 🎓
