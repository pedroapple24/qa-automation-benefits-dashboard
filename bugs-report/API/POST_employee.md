## BUG-001: Client-provided `id` silently ignored and replaced 
in POST /api/Employees
**Severity:** Medium  
**Type:** API — Silent Field Override / API Contract Violation  
**Environment:** Prod | Postman | 2026-03-21  
### Description
When creating a new employee via POST /api/Employees, the client can 
submit an `id` field in the request body. The API silently discards 
the submitted value, generates a new UUID, and returns 200 OK as if 
the submitted `id` was accepted. The client receives no warning, error, 
or indication that their value was ignored. The Swagger schema does not 
mark `id` as `readOnly`, making this behavior undocumented and misleading.
### Steps to Reproduce
1. Open Postman and create a new POST request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Add Header → Key: `Authorization` / Value: `Basic <token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "salary": 50
}
```
5. Click Send
6. Observe the `id` in the response body
7. Compare submitted `id` vs returned `id`
### Expected Result
Either:
- The API accepts and uses the submitted `id` as the record identifier
- OR the API rejects the submitted `id` with a clear validation error
- OR the Swagger schema marks `id` as `readOnly` to signal 
  it is server-generated
### Actual Result
```json
{
  "id": "7cf61612-2dcf-4991-9f6e-117a0526cb51"  ← different from submitted
}
```
The submitted `id` `077c4ea6-5ee4-4794-9095-1c96ffa855eb` was silently 
discarded and replaced with a server-generated UUID, with no error or 
warning returned.

### Impact
- **Client confusion:** Any system storing the submitted `id` for 
  future reference will have an invalid reference
- **Contract violation:** Swagger does not mark `id` as `readOnly` — 
  clients have no way to know their value will be ignored
- **Silent failure:** 200 OK response implies full acceptance — 
  the client cannot detect the override without comparing every field
### Recommendation
1. Mark `id` as `readOnly` in the Swagger schema to signal 
   it is server-generated
2. If client-provided IDs are not supported, return a 400 Bad Request 
   if `id` is included in the request body
3. Document the behavior clearly in the API contract
### Evidence
```
curl --location 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}'

RESPONSE 200OK
{
    ...
    "id": "7cf61612-2dcf-4991-9f6e-117a0526cb51",
    ...
}
```

## BUG-002: Client-provided `username` silently ignored and replaced in POST /api/Employees
**Severity:** Medium  
**Type:** API — Silent Field Override / Security  
**Environment:** Prod | Postman | 2026-03-21  
### Description
When creating a new employee via POST /api/Employees, the client can 
submit a `username` field in the request body. The API silently discards 
the submitted value and replaces it with the authenticated user's username. 
The response returns 200 OK with no indication that the submitted value 
was ignored. The Swagger schema does not mark `username` as `readOnly`, 
making this undocumented behavior that violates the API contract.
### Steps to Reproduce
1. Open Postman and create a new POST request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Add Header → Key: `Authorization` / Value: `Basic <token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "dependants": 4
}
```
5. Click Send
6. Compare submitted `username` vs returned `username`
### Expected Result
Either:
- The submitted `username` is accepted and stored as provided
- OR the API returns a 400 Bad Request if `username` cannot 
  be client-specified
- OR the Swagger schema marks `username` as `readOnly`
### Actual Result
```json
{
  "username": "TestUser930"  ← authenticated user's username, 
                                not submitted value "Murillo"
}
```
The submitted `username` "Murillo" was silently replaced with 
the authenticated account username "TestUser930" with no error 
or warning.
### Impact
- **Security concern:** Username is tied to authenticated session — 
  accepting it as a writable field suggests a potential 
  privilege escalation vector
- **Contract violation:** Swagger marks `username` as required 
  and writable but the submitted value is always ignored
- **Client confusion:** Clients submitting a username believe 
  it was accepted when it was silently discarded
### Recommendation
1. Mark `username` as `readOnly` in the Swagger schema
2. Remove `username` from the required fields list if it 
   is always server-assigned
3. If client cannot specify username, return 400 Bad Request 
   when it is included in the request
### Evidence
```
curl --location 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}'

RESPONSE 200OK
{
    ...
    "username": "TestUser930",
    ...
}
```

## BUG-003: Client-provided `salary` silently ignored and replaced in POST /api/Employees
**Severity:** Medium  
**Type:** API — Silent Field Override / Business Rule Violation  
**Environment:** Prod | Postman | 2026-03-21  
### Description
When creating a new employee via POST /api/Employees, the client can 
submit a `salary` field in the request body. The API silently discards 
the submitted value and returns the hardcoded value of 52000. No error 
or warning is returned. The Swagger schema defines `salary` as a writable 
float, explicitly suggesting clients can set this value — yet it is 
always overridden server-side with no documentation of this behavior.
### Steps to Reproduce
1. Open Postman and create a new POST request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Add Header → Key: `Authorization` / Value: `Basic <token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Jose",
  "lastName": "Lopez",
  "username": "TestUser930",
  "dependants": 4,
  "salary": 50
}
```
5. Click Send
### Expected Result
Either:
- The submitted `salary` value is accepted and stored
- OR the API returns a 400 Bad Request if salary is not 
  client-configurable
- OR the Swagger schema marks `salary` as `readOnly` to signal 
  it is always hardcoded
### Actual Result
```json
{
  "salary": 52000  ← hardcoded value, submitted value 50 was discarded
}
```
The submitted value 50 was silently replaced with 52000 — the 
hardcoded annual salary derived from business rules ($2,000 × 26).
### Impact
- **Misleading contract:** Swagger defines salary as a writable float — 
  clients have no indication it is actually hardcoded
- **Silent data loss:** Any system expecting the submitted salary 
  to be stored will silently receive wrong data
- **Business rule exposure:** The hardcoded 52000 reveals the 
  internal business rule calculation in the response
### Recommendation
1. Mark `salary` as `readOnly` in the Swagger schema
2. Remove it from the request body schema entirely if it 
   is always derived from business rules
3. Document that salary is always calculated as gross × 26
### Evidence
```
curl --location 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}'

RESPONSE 200OK
{
    ...
    "salary": 52000,
    ...
}
```

## BUG-004: Past `expiration` date accepted without validation in POST /api/Employees
**Severity:** Medium  
**Type:** API — Input Validation / Data Integrity  
**Environment:** Prod | Postman | 2026-03-21  
### Description
The POST /api/Employees endpoint accepts and stores an `expiration` 
date from the past (1993) without any validation error. If `expiration` 
represents a TTL or record lifecycle marker, accepting past dates could 
immediately invalidate records upon creation or produce unpredictable 
system behavior. The API returns 200 OK with the past date stored as 
submitted, with no warning or rejection.
### Steps to Reproduce
1. Open Postman and create a new POST request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Add Header → Key: `Authorization` / Value: `Basic <token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Jose",
  "lastName": "Lopez",
  "username": "TestUser930",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z"
}
```
5. Click Send
6. Observe `expiration` in the response body
7. Confirm the past date was accepted and stored
### Expected Result
The API should reject past expiration dates with a 400 Bad Request:
```json
{
  "error": "expiration must be a future date"
}
```
### Actual Result
```json
{
  "expiration": "1993-04-26T08:36:44.858Z"  ← past date stored as-is
}
```
The 1993 date was accepted and stored with no validation error.
### Impact
- **Data integrity risk:** Records with past expiration dates may 
  be immediately treated as expired by the system
- **No input boundary enforcement:** Any date — past, future, 
  or extreme — is accepted without validation
- **Unpredictable behavior:** If expiration drives any automated 
  process (TTL, cleanup jobs), past dates could trigger 
  immediate unintended actions
### Recommendation
1. Add server-side validation rejecting past expiration dates
2. If `expiration` is always server-managed (TTL), remove it 
   from the writable request schema entirely
3. Return a clear 400 Bad Request with descriptive error message 
   when an invalid date is submitted
### Evidence
```
curl --location 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}'

RESPONSE 200OK
{
    ...
    "expiration": "1993-04-26T08:36:44.858Z",
    ...
}
```

## BUG-005: Single character `lastName` accepted without validation in POST /api/Employees
**Severity:** Low  
**Type:** API — Input Validation / Data Quality  
**Environment:** Prod | Postman | 2026-03-21  
### Description
The POST /api/Employees endpoint accepts a single character as a valid 
`lastName` value. The Swagger schema defines `minLength: 0` for lastName, 
meaning even an empty string would pass validation. For a payroll system 
handling real employee data, name fields should enforce a meaningful 
minimum length to ensure data quality and prevent nonsensical records.
### Steps to Reproduce
1. Open Postman and create a new POST request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Add Header → Key: `Authorization` / Value: `Basic <token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Jose",
  "lastName": "M",
  "username": "TestUser930",
  "dependants": 4
}
```
5. Click Send
6. Observe that "M" is accepted as a valid lastName
### Expected Result
The API should reject lastName values below a meaningful minimum 
length (suggested: 2 characters) with a 400 Bad Request:
```json
{
  "error": "lastName must be at least 2 characters"
}
```
### Actual Result
```json
{
  "lastName": "M"  ← single character accepted as valid lastName
}
```
### Additional Validation Gaps Found
Based on Swagger schema `minLength: 0`:
| Field | Current minLength | Suggested minLength |
|-------|------------------|---------------------|
| firstName | 0 | 2 |
| lastName | 0 | 2 |
| username | 0 | 2 |

### Impact
- **Data quality:** Meaningless single-character or empty names 
  can be stored in the system
- **Payroll accuracy:** Incorrect employee names in a payroll 
  system could cause legal and compliance issues
- **Downstream issues:** Reports, documents, and payroll outputs 
  generated from this data will contain invalid names
### Recommendation
1. Update `minLength` to 2 for `firstName`, `lastName`, and `username`
2. Add server-side validation returning 400 Bad Request 
   for values below minimum length
3. Consider adding a pattern validation to reject purely 
   numeric names (e.g. "123") and special characters
### Evidence
```
curl --location 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}'

RESPONSE 200OK
{
    ...
    "lastName": "M",
    ...
}
```

## BUG-006: Duplicate employee records created on repeated POST /api/Employees with identical data
**Severity:** High  
**Type:** API — Data Integrity  
**Environment:** Prod | Postman | 2026-03-21
### Description
The POST /api/Employees endpoint creates a new employee record every 
time it is called, even when the exact same payload is submitted 
multiple times. There is no duplicate detection, no idempotency key 
support, and no conflict response. Each call generates a new UUID and 
stores a completely independent record, allowing an employer to 
accidentally create multiple identical employees — each of which would 
generate separate payroll deductions.
In a payroll system, duplicate employee records are a critical data 
integrity issue — they directly result in incorrect benefit cost 
calculations and potentially double deductions.
### Steps to Reproduce
1. Open Postman and create a new POST request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Add Header → Key: `Authorization` / Value: `Basic <token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}
```
5. Click Send — note the returned `id`
6. Click Send again with the exact same payload
7. Compare the `id` values in both responses
### Expected Result
On the second identical request, the API should either:
- Return **409 Conflict** indicating a duplicate record exists
- Return the existing record without creating a new one
- Require a unique business key (e.g. firstName + lastName 
  combination) to prevent duplicates
### Actual Result
Two separate employee records were created with different IDs:
**First call:**
```json
{
  "id": "4718161e-c043-4b2d-ae4a-26b1b593211a",
  "firstName": "Jose",
  "lastName": "M",
  "dependants": 4
}
```
**Second call — identical payload:**
```json
{
  "id": "41b9ef33-57c4-49e5-be08-66fe187634ed",
  "firstName": "Jose",
  "lastName": "M",
  "dependants": 4
}
```
Both returned **200 OK** with no conflict warning.
### Impact
- **Payroll financial impact:** Each duplicate employee record 
  generates separate benefit cost deductions — an employer could 
  be charged twice for the same employee
- **Data integrity:** The system has no mechanism to detect or 
  prevent duplicate employees
- **No idempotency:** Retrying a failed request (common in 
  network issues) will always create duplicate records
- **Audit failure:** Duplicate records make payroll auditing 
  unreliable and compliance reporting inaccurate
- **Compounding with BUG-005:** Since `id` is server-generated 
  and silently overridden, clients cannot even detect the 
  duplicate by comparing IDs

### Recommendation
1. Implement duplicate detection based on business key fields 
   (e.g. `firstName` + `lastName` combination per account)
2. Return **409 Conflict** with a descriptive message when 
   a duplicate is detected:
```json
{
  "error": "An employee with this name already exists"
}
```
3. Consider implementing idempotency keys in request headers 
   to safely support request retries
4. Add a unique constraint at the data layer to enforce 
   deduplication at the source

### Evidence
```
curl --location 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Jose",
  "lastName": "M",
  "username": "Murillo",
  "id": "077c4ea6-5ee4-4794-9095-1c96ffa855eb",
  "dependants": 4,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50
}'

RESPONSE 200OK
{
    "partitionKey": "TestUser930",
    "sortKey": "7cf61612-2dcf-4991-9f6e-117a0526cb51",
    "username": "TestUser930",
    "id": "7cf61612-2dcf-4991-9f6e-117a0526cb51",
    "firstName": "Jose",
    "lastName": "M",
    "dependants": 4,
    "expiration": "1993-04-26T08:36:44.858Z",
    "salary": 52000,
    "gross": 2000,
    "benefitsCost": 115.38462,
    "net": 1884.6154
}
```

