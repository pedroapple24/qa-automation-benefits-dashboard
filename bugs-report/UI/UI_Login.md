## BUG-UI-001: Dashboard accessible without authentication — no session validation on /Prod/Benefits
**Severity:** Critical  
**Type:** UI — Authentication / Session Management / 
Security Misconfiguration  
**Environment:** Prod | Chrome | 2026-03-21  
### Description
The Benefits Dashboard page at /Prod/Benefits is directly accessible 
without an active authenticated session. After logging out or when 
no session exists, a user can navigate directly to the dashboard URL 
and access the full application — including the employee table and 
Add Employee functionality — without being redirected to the login 
page. This completely bypasses the authentication layer and exposes 
sensitive payroll data to unauthenticated users.
### Steps to Reproduce
1. Log into the application normally
2. Complete your session and log out OR wait for session to expire
3. Navigate directly to:
   https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Benefits
4. Observe the dashboard loads without redirecting to login
### Expected Result
Any attempt to access /Prod/Benefits without an active 
authenticated session should immediately redirect to the 
login page:
```
https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login
```
The dashboard and all its functionality should be completely 
inaccessible to unauthenticated users.
### Actual Result
The dashboard loads successfully without authentication:
- Full dashboard UI is visible including table headers
- `Id`, `Last Name`, `First Name`, `Dependents`, `Salary`, 
  `Gross Pay`, `Benefits Cost`, `Net Pay`, `Actions` 
  columns all visible
- **Add Employee button is visible and functional**
- Add Employee modal opens with First Name, Last Name 
  and Dependents fields fully accessible
- No redirect to login page occurs
- No authentication error is displayed
### Impact
- **Session management failure:** Logging out provides 
  no real security — the dashboard remains accessible
- **No defense in depth:** The only security layer 
  is the login form — bypassing it grants full access
### Recommendation
1. Implement server-side session validation on every 
   request to protected routes:
```
if (!session.isAuthenticated()) {
  redirect("/Prod/Account/Login")
}
```
2. Never rely solely on client-side routing for 
   authentication — validate server-side on every request
3. Invalidate session tokens completely on logout
4. Implement session expiry with automatic redirect 
   to login page
5. Return 401 Unauthorized for any unauthenticated 
   request to protected resources
6. Add authentication middleware to ALL protected 
   routes — not just the initial page load

### Evidence
![Login page at /Prod/Account/Login showing 
authentication form](screenshots/BUG-UI-001.png)
![Dashboard at /Prod/Benefits loading successfully 
without authentication — full table and Add Employee 
button visible](screenshots/BUG-UI-001.1.png)
![Add Employee modal fully accessible without 
authentication](screenshots/BUG-UI-001.2.png)