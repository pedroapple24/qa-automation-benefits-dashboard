## BUG-UI-EDIT-001: Edit Employee modal does not validate empty fields — fires PUT request returning 405 instead of showing validation errors
**Severity:** High  
**Type:** UI — Input Validation / Error Handling / 
Wrong Modal Title  
**Environment:** Prod | Chrome | 2026-03-22  
### Description
When editing an employee record, clearing all fields and 
clicking Update fires a PUT request immediately with empty 
values instead of validating the form first. The API returns 
405 Method Not Allowed and the UI shows absolutely no feedback 
— no validation messages, no error notification, no indication 
of what went wrong. The modal simply resets to empty fields 
as if nothing happened.
Additionally, this screenshot reveals two extra bugs:
1. The Edit modal title reads **"Add Employee"** instead 
   of "Edit Employee" — wrong modal title
2. The PUT request is sent to `/Prod/api/employees` 
   (lowercase) instead of `/Prod/api/Employees` 
### Steps to Reproduce
1. Log into the Benefits Dashboard
2. Click the Edit action on any employee — e.g. Pedro Ramos Lopez
3. Observe the modal opens with existing data pre-filled:
   - First Name: Pedro
   - Last Name: Ramos Lopez
   - Dependents: 10
4. Clear ALL fields completely:
   - First Name: ← delete all text
   - Last Name:  ← delete all text
   - Dependents: ← delete all text
5. Click Update
6. Observe UI behavior
7. Open DevTools → Network tab → click on employees request
### Expected Result
The form should validate all fields before making 
any API call and display inline validation errors:
```
First Name: "First Name is required"
Last Name:  "Last Name is required"
Dependents: "Dependents is required"
```
- No API call should be fired
- Update button should be disabled until 
  all required fields contain valid data
- User should be able to correct the fields 
  and resubmit
### Actual Result
**UI behavior:**
- No validation messages shown
- No error feedback to the user
- Modal fields reset/remain empty
- No indication anything went wrong
**Network tab shows:**
```
Request URL:    https://wmxrwq14uc.execute-api.us-east-1
                .amazonaws.com/Prod/api/employees  ← lowercase
Request Method: PUT
Status Code:    405 Method Not Allowed
Allow:          GET  ← only GET allowed on this path
Remote Address: 3.161.20.72:443
Via:            CloudFront
X-Cache:        Error from CloudFront
Content-Length: 0
```
### Additional Bug Found In Same Screenshot
**Wrong modal title:**
```
Modal title shows: "Add Employee"  ← wrong
Expected title:    "Edit Employee" ← correct
```
The Edit and Add flows share the same modal component 
but the title is never updated when opened in edit mode — 
confusing the user about which action they are performing.
### Impact
- **No validation feedback:** User clears required 
  fields and receives zero indication of what went wrong
- **Silent data loss:** The update silently fails — 
  the user may believe their edit was saved when it 
  was not
- **Wrong URL:** PUT fires to lowercase `/employees` 
  which CloudFront routes to GET-only — the correct 
  edit endpoint `/Employees` is never reached
- **Wrong modal title:** "Add Employee" shown during 
  edit creates user confusion — is this creating a 
  new record or editing an existing one?
- **No disabled state:** Update button is always 
  clickable regardless of form validity
- **Systemic:** Both Add and Edit modals share the 
  same broken validation and URL patterns
### Recommendation
1. Add client-side validation before any API call:
```javascript
function validateEmployeeForm() {
  const errors = []
  if (!firstName?.trim()) 
    errors.push('First Name is required')
  if (!lastName?.trim()) 
    errors.push('Last Name is required')
  if (dependents === '' || dependents === null) 
    errors.push('Dependents is required')
  return errors
}
// On Update click:
const errors = validateEmployeeForm()
if (errors.length > 0) {
  showInlineErrors(errors)
  return  // never reach the API call
}
```
### Evidence
![Edit modal opened with data pre-filled — Pedro 
Ramos Lopez 10 dependents — title incorrectly 
shows Add Employee](screenshots/BUG-UI-EDIT-001.png)
![Edit modal with all fields cleared — no validation 
errors shown](screenshots/BUG-UI-EDIT-001.1.png)