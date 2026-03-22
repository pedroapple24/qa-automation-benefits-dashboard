## /api/Employees:id

## BUG-001: DELETE /api/Employees/{id} returns 200 OK with empty body when employee does not exist
**Severity:** High  
**Type:** API — Error Handling / Incorrect HTTP Status Code  
**Environment:** Prod | Postman | 2026-03-21  
### Description
The DELETE /api/Employees/{id} endpoint returns 200 OK with an empty 
response body when attempting to delete an employee that does not exist 
— either because it was never created or because it was already 
successfully deleted. This creates two critical problems:
1. **Non-existent resource:** Deleting a UUID that never existed 
   returns 200 OK instead of 404 Not Found
2. **Idempotency misuse:** Deleting the same employee twice returns 
   200 OK both times — the second call silently succeeds even though 
   nothing was deleted
The client has no way to distinguish between a successful delete and 
a delete that did nothing. This is particularly dangerous in a payroll 
system where confirming deletion of an employee record is a critical 
operation.
### Steps to Reproduce
1. Open Postman and create a new DELETE request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees/{id}
3. Go to Headers tab and add:
   - Key: `Authorization`
   - Value: `Basic <your_token>`
1. Perform a valid DELETE on an existing employee ID
2. Confirm first deletion returns 200 OK 
3. Send the exact same DELETE request again
4. Observe second call also returns 200 OK with empty body
   despite the record no longer existing
### Expected Result
```json
HTTP 404 Not Found
{
  "status": 404,
  "error": "Not Found",
  "message": "Employee with id 0bb7fda8-985f-4b64-b129-e1b258b3f723 was not found and could not be deleted"
}
```
### Actual Result
- Status: **200 OK**
- Response body: **completely empty**
### Impact
- **Silent no-op:** Clients calling DELETE on a non-existent 
  or already-deleted record receive a success signal — 
  they have no way to know nothing happened
### Recommendation
1. Check resource existence before attempting deletion:
```
if (!existsInDB(id)) return 404 Not Found
delete(id)
return 200 OK with confirmation message
```
2. Never return an empty body on 200 OK — always include 
   a confirmation message:
```json
{
  "message": "Employee successfully deleted",
  "id": "0bb7fda8-985f-4b64-b129-e1b258b3f723"
}
```
### Evidence
![DELETE request with non-existent UUID returning 
200 OK](screenshots/bug-Delete-016.png)
