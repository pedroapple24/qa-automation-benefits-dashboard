## BUG-UI-Dash-001: favicon.ico returns 403 Forbidden
**Severity:** Low  
**Type:** UI — Missing Asset / HTTP Error  
**Environment:** Prod | Chrome | 2026-03-22  
### Description
The application fails to load its favicon, returning a 
403 Forbidden error for favicon.ico. This means the browser 
tab shows no icon for the application. While low severity 
visually, a 403 on a static asset indicates a server 
misconfiguration — the file either exists but has incorrect 
permissions, or the path is protected unintentionally.
### Steps to Reproduce
1. Log into the Benefits Dashboard
2. Open Chrome DevTools → Network tab
3. Reload the page
4. Filter by "Other" or search for "favicon"
5. Observe favicon.ico returns 403 Forbidden
### Expected Result
favicon.ico should return 200 OK and display the 
Paylocity icon in the browser tab.
### Actual Result
- favicon.ico → **403 Forbidden**
- Browser tab shows no application icon
- 0.3 KB response, 182ms — server is responding 
  but denying access
### Impact
- **Unprofessional appearance:** No icon in browser tab 
  or bookmarks
- **Server misconfiguration:** 403 suggests incorrect 
  file permissions on a public static asset
- **Console noise:** Every page load generates a 
  403 error in the network log
### Recommendation
1. Verify favicon.ico file permissions on the server
2. Ensure the /Prod path is not blocking static assets
3. Confirm the favicon exists at the correct path
### Evidence
![DevTools Network tab showing favicon.ico returning 
403 Forbidden](screenshots/BUG-UI-Dash-001.png)

## BUG-UI-Dash-002: 28 dependents accepted and displayed without any validation warning in the UI
**Severity:** High  
**Type:** UI — Input Validation / Business Rule Violation  
**Environment:** Prod | Chrome | 2026-03-22  
### Description
The dashboard displays an employee record with 28 dependents 
— an unrealistic value that should never be accepted by either 
the UI or the API. The business rules define a maximum of 32 
dependents per the Swagger schema, but no UI-level validation 
warns the employer that this value is suspicious or unrealistic. 
For a payroll system, an incorrect dependents count directly 
impacts benefit cost calculations.
### Steps to Reproduce
1. Log into the Benefits Dashboard
2. Click Add Employee or Edit on an existing record
3. Enter 28 in the Dependents field
4. Click Add/Save
5. Observe the record is saved and displayed with 28 dependents
### Expected Result
The UI should warn or block unrealistic dependent values:
- Display a warning for values above a reasonable threshold 
  (e.g. more than 10 dependents)
- Or enforce a lower maximum than the API's schema limit of 32
### Actual Result
Employee "Pedro Fernando" displays 28 dependents with:
```
Salary:        52000.00
Gross Pay:     2000.00
Benefits Cost: 576.92   ← $1000 + (28 × $500) = $15,000/year ÷ 26
Net Pay:       1423.08
```
No validation warning was shown during data entry.
The record was saved and displayed without any indication 
this value is potentially erroneous.
### Impact
- **Financial impact:** 28 dependents costs $15,000/year 
  in benefits — an employer could unknowingly be charged 
  this amount due to a data entry error
- **No sanity check:** The UI provides no feedback that 
  this value is unusual or potentially incorrect
- **Data quality:** Unrealistic values pollute the 
  employee records
### Recommendation
1. Add UI-level validation warning for dependents 
   above a reasonable threshold (e.g. > 10)
2. Consider lowering the maximum from 32 to a more 
   realistic business value
3. Display a confirmation dialog for high dependent 
   counts before saving
### Evidence
![Dashboard showing Pedro Fernando with 28 dependents 
and benefits cost of 576.92](screenshots/BUG-UI-Dash-002.png)

