## BUG-UI-ADD-001: Clicking Add with empty fields triggers 405 Method Not Allowed instead of showing validation errors
**Severity:** High  
**Type:** UI — Input Validation / Error Handling  
**Environment:** Prod | Chrome | 2026-03-22  
### Description
When the user clicks the Add button in the Add Employee modal 
without filling in any fields, the UI immediately fires a POST 
request to the API with empty values instead of validating the 
form first. The API returns 405 Method Not Allowed and the UI 
shows no feedback whatsoever — no validation messages, no error 
notification, no indication that required fields are missing. 
The modal simply stays open with empty fields as if nothing happened.
Client-side validation should prevent the API call entirely when 
required fields are empty — the form should never be submitted 
until all required fields contain valid data.
### Steps to Reproduce
1. Log into the Benefits Dashboard
2. Click Add Employee button
3. Leave ALL fields empty:
   - First Name: ← empty
   - Last Name:  ← empty
   - Dependents: ← empty
4. Click Add
5. Observe the UI behavior
6. Open DevTools → Network tab → click on employees request
7. Observe the request details
### Expected Result
The form should validate all fields before making any API call:
- First Name field highlighted in red with message:
  "First Name is required"
- Last Name field highlighted in red with message:
  "Last Name is required"  
- Dependents field highlighted in red with message:
  "Dependents is required"
- Add button remains disabled or no API call is made
- Zero network requests fired
### Actual Result
Network tab shows the following request was fired:
```
Request URL:    https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com
                /Prod/api/employees
Request Method: POST
Status Code:    405 Method Not Allowed
Allow:          GET  ← server only allows GET on this path
Remote Address: 3.161.20.64:443
Via:            1.1 CloudFront
X-Cache:        Error from CloudFront
```
UI response to the 405 error:
- No error message displayed to the user
- No field validation highlights shown
- Modal remains open with empty fields
- User has no indication anything went wrong
### Additional Finding From Response Headers
The `Allow: GET` header in the 405 response reveals that 
the request was routed to the wrong endpoint — the URL 
`/Prod/api/employees` (lowercase) only allows GET, while 
the correct POST endpoint is `/Prod/api/Employees` (uppercase E). 
This suggests a **URL case sensitivity bug** — the UI is 
sending POST requests to the wrong cased URL path when 
fields are empty.
### Impact
- **No validation feedback:** Users have no idea which 
  fields are required or what went wrong
- **Unnecessary API calls:** Empty form submissions reach 
  the server — client-side validation should prevent this
- **Wrong URL routing:** The 405 exposes a case sensitivity 
  issue in the endpoint URL (`employees` vs `Employees`)
- **Silent failure:** The 405 error is completely invisible 
  to the user — they may keep clicking Add with no result
- **Poor UX:** Standard web forms always validate required 
  fields before submission — this is a basic UX expectation
- **CloudFront error:** The `X-Cache: Error from CloudFront` 
  header indicates this error is being caught at the CDN 
  layer — not even reaching the application server
### Root Cause Analysis
Two compounding issues:
```
Issue 1 — No client-side validation:
  Form submits immediately on Add click
  without checking if required fields are filled

Issue 2 — URL case sensitivity:
  Empty submission routes to: /Prod/api/employees  ← lowercase
  Correct endpoint is:        /Prod/api/Employees  ← uppercase E
  CloudFront returns 405 because lowercase path 
  only has GET configured
```
### Recommendation
1. Add client-side validation triggered on Add click:
```javascript
if (!firstName || firstName.trim() === '') {
  showFieldError('firstName', 'First Name is required')
  return
}
if (!lastName || lastName.trim() === '') {
  showFieldError('lastName', 'Last Name is required')
  return  
}
if (dependents === '' || dependents === null) {
  showFieldError('dependents', 'Dependents is required')
  return
}
// Only fire API call if all validations pass
```
2. Fix the URL case sensitivity — ensure all POST 
   requests use `/Prod/api/Employees` not `/Prod/api/employees`
3. Display inline field-level error messages in red 
   below each required field
4. Disable the Add button until all required fields 
   contain valid input
5. Never fire an API call when required fields are empty
### Evidence
![Add Employee modal with all fields empty — Add 
button clicked](screenshots/BUG-UI-ADD-001.png)

## BUG-UI-ADD-002: Single quote and special characters accepted as valid employee names in Add Employee form
**Severity:** High  
**Type:** UI — Input Validation / Data Quality / Security  
**Environment:** Prod | Chrome | 2026-03-22  
### Description
The Add Employee form accepts a single quote character `'` 
as a valid value for both First Name and Last Name fields 
with no validation error or warning. The record is silently 
saved to the database and displayed in the dashboard with 
`'` as the employee name. 
Beyond data quality concerns, accepting unvalidated special 
characters in name fields represents a potential injection 
attack vector. A payroll system must enforce strict name 
validation — accepting only alphabetic characters, spaces, 
hyphens, and apostrophes used in legitimate names (e.g. 
O'Brien) with proper sanitization.

### Steps to Reproduce
1. Log into the Benefits Dashboard
2. Click Add Employee
3. Enter the following:
   - First Name: `'`  ← single quote only
   - Last Name: `'`   ← single quote only
   - Dependents: `0`
4. Click Add
5. Close the modal
6. Observe the new record in the dashboard table
### Expected Result
The form should reject single character special-only inputs 
and display inline validation errors before any API call is made:
```
First Name: "Name must contain at least 2 alphabetic 
             characters. Special characters alone 
             are not valid."
Last Name:  "Name must contain at least 2 alphabetic 
             characters. Special characters alone 
             are not valid."
```
The Add button should not fire any API request until 
valid names are entered.
### Actual Result
- Single quote `'` was accepted as valid for both fields
- Network tab shows: **1 request, 438 B transferred** — 
  API call was made with no client-side validation
- Record was saved and displayed in the dashboard:
```
Id:            683b15ca-0532-419d-a1bc-4cf50345936d
Last Name:     '
First Name:    '
Dependents:    0
Salary:        52000.00
Gross Pay:     2000.00
Benefits Cost: 38.46
Net Pay:       1961.54
```
### Security Concern — Injection Risk
Single quotes are a standard vector for:
- **SQL injection:** `' OR '1'='1`
- **XSS attacks:** `'><script>alert(1)</script>`
- **NoSQL injection:** If DB queries use 
  unsanitized input

While the current implementation may not be directly 
vulnerable, accepting unvalidated special characters 
without sanitization is a security anti-pattern that 
must be addressed.

### Impact
- **Data quality:** Meaningless single-character special 
  inputs stored as employee names in a payroll system
- **Payroll documents:** Any generated payslip, report, 
  or official document would contain `'` as an 
  employee name
- **Security risk:** No input sanitization creates a 
  potential injection attack surface
- **No client-side validation:** Zero validation 
  exists on name field content
- **Systemic issue:** Every name field across both 
  Add and Edit forms shares this same vulnerability

### Recommendation
1. Add client-side validation pattern for all name fields:
```javascript
const namePattern = /^[a-zA-ZÀ-ÿ\s\'\-]{2,50}$/

function validateName(value, fieldName) {
  if (!value || value.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`
  }
  if (!namePattern.test(value)) {
    return `${fieldName} can only contain letters, 
            spaces, hyphens and apostrophes`
  }
  if (/^[^a-zA-ZÀ-ÿ]+$/.test(value)) {
    return `${fieldName} must contain at least 
            one alphabetic character`
  }
  return null
}
```
2. Validate on every keystroke AND on form submission
3. Display inline error messages below each field
4. Disable Add button until all validations pass
5. Add server-side sanitization as a second layer 
   of defense — never trust client-side alone
6. Audit the Edit Employee form for the same 
   missing validation

### Evidence
![Add Employee form showing single quote entered 
in both First Name and Last Name 
fields](screenshots/BUG-UI-ADD-002.png)
![Add Employee form showing single quote entered 
in both First Name and Last Name 
fields](screenshots/BUG-UI-ADD-002.1.png)

