## BUG-001: PUT /api/Employees accepts custom `salary` value and uses it in calculations, violating business rules
**Severity:** Critical  
**Type:** API — Business Rule Violation / Calculation Error  
**Environment:** Prod | Postman | 2026-03-21  
### Description
The PUT /api/Employees endpoint accepts any client-submitted `salary` 
value and uses it to recalculate `gross`, `benefitsCost`, and `net`. 
This directly violates the core business rule that states all employees 
are paid a fixed $2,000 per paycheck. By accepting salary as a writable 
field in PUT, an employer can manipulate payroll calculations by 
submitting any arbitrary salary value — with the system silently 
accepting and recalculating accordingly.
### Steps to Reproduce
1. Open Postman and create a new PUT request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Go to Headers tab and add:
   - Key: `Authorization`
   - Value: `Basic <your_token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Amaya",
  "lastName": "Castillo",
  "username": "string",
  "id": "0a260243-14e8-4259-845c-4cbac8923cde",
  "dependants": 0,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50000.00
}
```
5. Click Send
6. Observe `gross`, `benefitsCost`, and `net` in the response
7. Compare against business rule: gross should always be $2,000
### Expected Result
Per business rules, `gross` should always be fixed at $2,000 
regardless of any submitted salary value:
```
gross        = $2,000 (fixed — always)
benefitsCost = $1,000 ÷ 26 = $38.46 (0 dependants)
net          = $2,000 − $38.46 = $1,961.54
```
### Actual Result
The submitted salary of $50,000 was accepted and used to 
recalculate gross, producing wrong values across the board:
```json
{
  "salary": 50000,
  "gross": 1923.0769,       ← 50000 ÷ 26 = 1923.07... WRONG
  "benefitsCost": 38.46154, ← based on wrong gross
  "net": 1884.6154          ← 1923.0769 − 38.46154 WRONG
}
```
### Root Cause
The PUT endpoint derives `gross` from the submitted `salary`:
```
gross = salary ÷ 26
      = 50000  ÷ 26
      = 1923.0769  ← should always be $2,000
```
Business rules define a fixed $2,000 per paycheck — 
salary should never influence gross calculations.
### Impact
- **Financial manipulation:** Any user can submit an arbitrary 
  salary to alter their payroll deduction calculations
- **Business rule violation:** The fixed $2,000 per paycheck 
  rule is completely bypassed via PUT
- **Payroll inaccuracy:** `gross` and `net` are now wrong 
  for any employee updated via PUT with a custom salary
- **Endpoint inconsistency:** POST overrides salary to $52,000, 
  PUT accepts any value — same field, opposite behavior
- **Employer impact:** Benefit cost deductions will be 
  incorrectly calculated for all affected employees
### Recommendation
1. Mark `salary` as `readOnly` in the Swagger schema for 
   both POST and PUT
2. Hardcode `gross` to $2,000 at the calculation layer — 
   it should never be derived from a client-submitted salary
3. Make salary handling consistent across POST and PUT:
   - Either always override to $52,000
   - Or remove it from the writable schema entirely
4. Add server-side validation rejecting any salary value 
   other than the business-defined $52,000
### Evidence
```
curl --location --request PUT 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Amaya",
  "lastName": "Castillo",
  "username": "string",
  "id": "0a260243-14e8-4259-845c-4cbac8923cde",
  "dependants": 0,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50000.789
}'

RESPONSE 200OK
{
    ...
    "salary": 50000.79,
    ...
}
```

## BUG-002: Literal placeholder value "string" accepted as valid `username` in PUT /api/Employees
**Severity:** Medium  
**Type:** API — Input Validation / Data Quality  
**Environment:** Prod | Postman | 2026-03-21  
### Description
The PUT /api/Employees endpoint accepts the literal text "string" 
as a valid `username` value, returning 200 OK. The word "string" 
is a well-known auto-generated placeholder value produced by Swagger 
UI and API tools when a user clicks "Try it out" without filling in 
the actual field. Accepting this value indicates the API has no 
meaningful content validation for the `username` field — any 
non-empty text is treated as valid regardless of semantic meaning.
### Steps to Reproduce
1. Open Postman and create a new PUT request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Go to Headers tab and add:
   - Key: `Authorization`
   - Value: `Basic <your_token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Amaya",
  "lastName": "Castillo",
  "username": "string",
  "id": "0a260243-14e8-4259-845c-4cbac8923cde",
  "dependants": 0
}
```
5. Click Send
6. Observe that "string" is accepted without validation error
### Expected Result
The API should reject obviously invalid placeholder values 
and return 400 Bad Request, or at minimum enforce a pattern 
validation on `username` to ensure it contains meaningful content:
```json
{
  "error": "username contains invalid value"
}
```
### Actual Result
```json
{
  "username": "TestUser930",  ← silently replaced 
  "id": "0a260243-14e8-4259-845c-4cbac8923cde",
  "firstName": "Amaya",
  "lastName": "Castillo"
}
```
The value "string" was accepted with 200 OK and then silently 
replaced by the authenticated username — again masking 
the validation failure.
### Impact
- **No content validation:** The API accepts any non-empty 
  string regardless of content or meaning
- **Swagger tool vulnerability:** Developers testing via 
  Swagger UI who forget to fill in fields will create 
  records with placeholder data
### Recommendation
1. Add a pattern validation for `username` rejecting 
   known placeholder values ("string", "test", "foo")
2. Enforce meaningful minimum length and character rules
### Evidence
```
curl --location --request PUT 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic ' \
--data '{
  "firstName": "Amaya",
  "lastName": "Castillo",
  "username": "string",
  "id": "0a260243-14e8-4259-845c-4cbac8923cde",
  "dependants": 0,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50000.789
}'

RESPONSE 200OK
{
    ...
    "username": "TestUser930",
    ...
}
```

## BUG-PUT-003: PUT /api/Employees creates a new employee record instead of updating the existing one
**Severity:** Critical  
**Type:** API — Wrong HTTP Method Behavior / Data Integrity  
**Environment:** Prod | Postman | 2026-03-21  
### Description
The PUT /api/Employees endpoint is supposed to update an existing 
employee record identified by the submitted `id`. Instead, it 
behaves identically to POST — creating a brand new employee record 
with a server-generated UUID on every call, completely ignoring 
the submitted `id`. This means:
1. The submitted `id` is silently discarded and replaced
2. A new record is created on every PUT call
3. The original employee record is never updated
4. Repeated PUT calls keep creating duplicate records
This is a fundamental violation of HTTP semantics. PUT must be 
idempotent — calling it multiple times with the same payload 
should always result in the same state. Instead, each call 
creates a new employee, directly contradicting this principle 
and the entire purpose of the endpoint.
### Steps to Reproduce
1. Open Postman and create a new PUT request
2. Set URL to: https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees
3. Go to Headers tab and add:
   - Key: `Authorization`
   - Value: `Basic <your_token>`
4. Set Body to raw JSON:
```json
{
  "firstName": "Amaya",
  "lastName": "Castillo",
  "username": "string",
  "id": "33260243-14e8-4259-845c-4cbac8930330",
  "dependants": 5,
  "expiration": "1993-04-26T08:36:44.858Z",
  "salary": 50000.789
}
```
5. Click Send — note the returned `id`
6. Click Send again with the exact same payload
7. Compare the `id` values in both responses
8. Run GET /api/Employees and observe how many new 
   records were created
### Expected Result
PUT should update the existing employee record matching 
the submitted `id` and return the updated record:
```json
{
  "id": "33260243-14e8-4259-845c-4cbac8930330",  ← same id preserved
  "firstName": "Amaya",
  "lastName": "Castillo",
  "dependants": 5,
  "salary": 52000,
  "gross": 2000,
  "benefitsCost": 192.31,
  "net": 1807.69
}
```
Calling PUT multiple times with the same payload should 
always produce the same result — no new records created.
### Actual Result
Each PUT call creates a brand new employee record with 
a different server-generated UUID:
**First call:**
```json
{
  "id": "e1466996-ff3f-4131-a2d7-d4c2173b3dd9",  ← new UUID
  "firstName": "Amaya",
  "lastName": "Castillo",
  "dependants": 5,
  "salary": 50000.79,
  "gross": 1923.1073,
  "benefitsCost": 134.61539,
  "net": 1788.492
}
```
**Second call — identical payload:**
```json
{
  "id": "bd2ba666-00ad-4ac4-8c1d-ae188564d8d6",  ← different new UUID
  "firstName": "Amaya",
  "lastName": "Castillo",
  "dependants": 5,
  "salary": 50000.79,
  "gross": 1923.1073,
  "benefitsCost": 134.61539,
  "net": 1788.492
}
```
The submitted `id` `33260243-14e8-4259-845c-4cbac8930330` 
was silently discarded in both calls. Two new records were 
created instead of one update.
### Root Cause Analysis
The PUT endpoint appears to share the same implementation 
as POST — it generates a new UUID server-side and inserts 
a new record regardless of whether an `id` was submitted. 
The `id` field in the request body is never used to look 
up an existing record.
```
Expected PUT flow:
1. Receive request with id
2. Look up existing record by id
3. If found → update record → return updated record
4. If not found → return 404 Not Found

Actual PUT flow:
1. Receive request
2. Generate new UUID          ← same as POST
3. Insert new record          ← same as POST
4. Return new record          ← same as POST
```
### Impact
- **Data explosion:** Every PUT call creates a new record — 
  an employer editing an employee repeatedly will generate 
  dozens of duplicate records
- **Update never works:** The original employee record is 
  never modified — any intended update is silently lost
- **Payroll duplication:** Each new record generates 
  independent benefit cost deductions — directly causing 
  incorrect payroll calculations
### Recommendation
1. Fix PUT to perform an UPDATE operation, not INSERT:
```
lookup employee by submitted id
if not found → return 404 Not Found
if found → update fields → return updated record
```
2. The `id` field must be used as the lookup key — 
   never overridden on PUT
3. Add integration tests verifying PUT idempotency:
   - Call PUT twice with same payload
   - Verify only one record exists after both calls
   - Verify the returned `id` matches the submitted `id`
4. Audit the codebase — POST and PUT likely share 
   the same handler incorrectly
### Evidence
![First PUT request showing submitted id 33260243 
returned as new id e1466996](screenshots/Bug-PUT-003.png)
![Second identical PUT request returning yet another 
new id bd2ba666 — confirming PUT creates records 
instead of updating](screenshots/bug-put-003.1.png)
