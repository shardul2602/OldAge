# Community Forum Testing Guide

## 🧪 Test Scenarios

### 1. Super Admin Testing
**Login:** `superadmin@demo.com / demo123`

**Expected Results:**
- ✅ Can see all homes in forum dropdown
- ✅ Can create posts for any home
- ✅ Can view posts from all homes
- ✅ Can delete any post
- ✅ Can comment on any post
- ✅ Can delete any comment

**Test Steps:**
1. Login as Super Admin
2. Go to Forum page
3. Verify dropdown shows all 8 homes
4. Select "Sunshine Senior Home"
5. Click "Create New Post"
6. Create post with title: "Super Admin Test Post"
7. Verify post appears in list
8. Click "Read More" to view post
9. Add comment: "Super Admin comment"
10. Verify comment appears
11. Go back and delete the post

### 2. Admin Testing
**Login:** `admin.a@demo.com / demo123`

**Expected Results:**
- ✅ Can only see Sunshine Senior Home (no dropdown)
- ✅ Can create posts only for Sunshine Home
- ✅ Can view posts only from Sunshine Home
- ✅ Can delete posts from Sunshine Home only
- ✅ Cannot access posts from other homes
- ✅ Can comment on Sunshine Home posts

**Test Steps:**
1. Login as Admin A
2. Go to Forum page
3. Verify only Sunshine Home posts are shown
4. Create post: "Admin Test Post"
5. Verify post appears
6. Try to access Golden Years posts (should fail)
7. Delete the test post

### 3. Volunteer Testing
**Login:** `volunteer.x@demo.com / demo123`

**Expected Results:**
- ✅ Must select home from dropdown first
- ✅ Dropdown shows only assigned homes (Sunshine + Golden Years)
- ✅ Can view posts only from selected home
- ✅ Can create posts for selected home
- ✅ Can comment on posts from selected home
- ✅ Cannot see posts from unselected homes

**Test Steps:**
1. Login as Volunteer X
2. Go to Forum page
3. Verify dropdown appears with Sunshine + Golden Years
4. Select "Sunshine Senior Home"
5. Verify only Sunshine posts appear
6. Create post: "Volunteer Test Post"
7. Add comment to the post
8. Switch to "Golden Years Care"
9. Verify different posts appear (Sunshine post not visible)
10. Switch back to Sunshine and verify post reappears

### 4. Comment System Testing
**Test for all user types:**

**Expected Results:**
- ✅ Users can comment on posts they can view
- ✅ Comments appear immediately
- ✅ Users can delete their own comments
- ✅ Admins can delete comments from their home
- ✅ Super Admins can delete any comment

**Test Steps:**
1. Create a test post as Super Admin
2. Login as Volunteer X
3. Add comment: "Volunteer comment"
4. Verify comment appears
5. Try to delete own comment (should work)
6. Login as Admin A
7. Add comment: "Admin comment"
8. Try to delete Super Admin's comment (should work for home posts)
9. Login as Super Admin
10. Delete all test comments and posts

### 5. Data Isolation Testing
**Verify multi-tenancy works:**

**Expected Results:**
- ✅ Admin A cannot see Golden Years posts
- ✅ Admin B cannot see Sunshine posts
- ✅ Volunteer X cannot see Peaceful Haven posts
- ✅ Cross-home access is properly blocked

**Test Steps:**
1. Create posts in different homes as Super Admin
2. Login as Admin A - verify only Sunshine posts
3. Login as Admin B - verify only Golden Years posts
4. Login as Volunteer X - verify only assigned homes
5. Try direct URL access to restricted posts (should fail)

## 🔍 Browser Testing Checklist

### Frontend Functionality
- [ ] Forum page loads without errors
- [ ] Home dropdown works for volunteers
- [ ] Create post form validates inputs
- [ ] Post creation shows success message
- [ ] Post list updates automatically
- [ ] Comment form works correctly
- [ ] Delete confirmations work
- [ ] Navigation between pages works
- [ ] Role-based content displays correctly

### Backend Functionality
- [ ] API endpoints respond correctly
- [ ] Authentication headers work
- [ ] Role validation works
- [ ] Data filtering works
- [ ] Error handling works
- [ ] Database operations work

### Multi-Tenancy Verification
- [ ] Admins see only their home data
- [ ] Volunteers see only selected home data
- [ ] Super Admin sees all data
- [ ] Cross-home access is blocked
- [ ] Home assignment works correctly

## 🐛 Common Issues & Solutions

### Issue: "Forum shows no posts"
**Cause:** User not assigned to any homes
**Check:** User's homeId array in database
**Fix:** Assign user to appropriate homes

### Issue: "Cannot create post"
**Cause:** Missing home selection or permissions
**Check:** User role and home assignment
**Fix:** Ensure proper role-based access

### Issue: "Comments not appearing"
**Cause:** API call failing or permissions issue
**Check:** Browser console for errors
**Fix:** Verify user can access the post

### Issue: "Delete not working"
**Cause:** Insufficient permissions
**Check:** User role and post ownership
**Fix:** Verify role-based deletion rules

## 🎉 Success Criteria

All tests pass when:
1. ✅ Super Admin can manage all forum content
2. ✅ Admins can manage only their home content
3. ✅ Volunteers can participate in assigned homes only
4. ✅ Comments work for all user types
5. ✅ Data isolation is maintained
6. ✅ No cross-home access violations
7. ✅ Frontend works smoothly without errors
8. ✅ Backend APIs respond correctly

## 📱 Mobile Testing

Test on mobile browsers:
- [ ] Forum page responsive layout
- [ ] Forms work on mobile
- [ ] Dropdown selection works
- [ ] Commenting works on mobile
- [ ] Navigation works on mobile

---

## 🚀 Ready for Viva Demo!

The Community Forum Module demonstrates:
- **Multi-tenancy with role-based access**
- **Secure data isolation between homes**
- **Real-time communication features**
- **Clean, maintainable code structure**
- **Simple, intuitive user interface**

Perfect for academic presentation! 🎓
