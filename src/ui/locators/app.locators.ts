// ─── Login ────────────────────────────────────────────────────────────────────
class LoginLocators {
  private _usernameInput = 'xpath=//input[@id="Username"]';
  private _passwordInput = 'xpath=//input[@id="Password"]';
  private _loginButton = 'xpath=//button[@type="submit" and text()="Log In"]';
  private _validationSummary = 'xpath=//span[text()="There were one or more problems that prevented you from logging in:"]';
  private _usernameRequiredError = 'xpath=//li[text()="The Username field is required."]';
  private _passwordRequiredError = 'xpath=//li[text()="The Password field is required."]';

  get usernameInput() { return this._usernameInput; }
  set usernameInput(value: string) { this._usernameInput = value; }

  get passwordInput() { return this._passwordInput; }
  set passwordInput(value: string) { this._passwordInput = value; }

  get loginButton() { return this._loginButton; }
  set loginButton(value: string) { this._loginButton = value; }

  get validationSummary() { return this._validationSummary; }
  set validationSummary(value: string) { this._validationSummary = value; }

  get usernameRequiredError() { return this._usernameRequiredError; }
  set usernameRequiredError(value: string) { this._usernameRequiredError = value; }

  get passwordRequiredError() { return this._passwordRequiredError; }
  set passwordRequiredError(value: string) { this._passwordRequiredError = value; }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
class DashboardLocators {
  private _dashboardTitle = 'xpath=//a[text()="Paylocity Benefits Dashboard"]';
  private _addEmployeeButton = 'xpath=//button[@id="add"]';
  private _colId = 'xpath=//th[text()="Id"]';
  private _colLastName = 'xpath=//th[text()="Last Name"]';
  private _colFirstName = 'xpath=//th[text()="First Name"]';
  private _colDependents = 'xpath=//th[text()="Dependents"]';
  private _colSalary = 'xpath=//th[text()="Salary"]';
  private _colGrossPay = 'xpath=//th[text()="Gross Pay"]';
  private _colBenefitsCost = 'xpath=//th[text()="Benefits Cost"]';
  private _colNetPay = 'xpath=//th[text()="Net Pay"]';
  private _colActions = 'xpath=//th[text()="Actions"]';

  get dashboardTitle() { return this._dashboardTitle; }
  set dashboardTitle(value: string) { this._dashboardTitle = value; }

  get addEmployeeButton() { return this._addEmployeeButton; }
  set addEmployeeButton(value: string) { this._addEmployeeButton = value; }

  get colId() { return this._colId; }
  set colId(value: string) { this._colId = value; }

  get colLastName() { return this._colLastName; }
  set colLastName(value: string) { this._colLastName = value; }

  get colFirstName() { return this._colFirstName; }
  set colFirstName(value: string) { this._colFirstName = value; }

  get colDependents() { return this._colDependents; }
  set colDependents(value: string) { this._colDependents = value; }

  get colSalary() { return this._colSalary; }
  set colSalary(value: string) { this._colSalary = value; }

  get colGrossPay() { return this._colGrossPay; }
  set colGrossPay(value: string) { this._colGrossPay = value; }

  get colBenefitsCost() { return this._colBenefitsCost; }
  set colBenefitsCost(value: string) { this._colBenefitsCost = value; }

  get colNetPay() { return this._colNetPay; }
  set colNetPay(value: string) { this._colNetPay = value; }

  get colActions() { return this._colActions; }
  set colActions(value: string) { this._colActions = value; }
}

// ─── Add Employee Modal ───────────────────────────────────────────────────────
class AddEmployeeLocators {
  private _modalTitle = 'xpath=//div[@id="employeeModal"]//h5[@class="modal-title"]';
  private _firstNameInput = 'xpath=//input[@id="firstName"]';
  private _lastNameInput = 'xpath=//input[@id="lastName"]';
  private _dependantsInput = 'xpath=//input[@id="dependants"]';
  private _addButton = 'xpath=//button[@id="addEmployee"]';
  private _cancelButton = 'xpath=//div[@id="employeeModal"]//button[@data-dismiss="modal" and text()="Cancel"]';

  get modalTitle() { return this._modalTitle; }
  set modalTitle(value: string) { this._modalTitle = value; }

  get firstNameInput() { return this._firstNameInput; }
  set firstNameInput(value: string) { this._firstNameInput = value; }

  get lastNameInput() { return this._lastNameInput; }
  set lastNameInput(value: string) { this._lastNameInput = value; }

  get dependantsInput() { return this._dependantsInput; }
  set dependantsInput(value: string) { this._dependantsInput = value; }

  get addButton() { return this._addButton; }
  set addButton(value: string) { this._addButton = value; }

  get cancelButton() { return this._cancelButton; }
  set cancelButton(value: string) { this._cancelButton = value; }
}

// ─── Edit Employee Modal ──────────────────────────────────────────────────────
class EditEmployeeLocators {
  private _editButton = 'xpath=.//i[@class="fas fa-edit"]';
  private _modalFirstName = 'xpath=//button[@id="updateEmployee"]/ancestor::div[contains(@class,"modal-content")]//input[@id="firstName"]';
  private _modalLastName = 'xpath=//button[@id="updateEmployee"]/ancestor::div[contains(@class,"modal-content")]//input[@id="lastName"]';
  private _modalDependants = 'xpath=//button[@id="updateEmployee"]/ancestor::div[contains(@class,"modal-content")]//input[@id="dependants"]';
  private _updateButton = 'xpath=//button[@id="updateEmployee"]';

  get editButton() { return this._editButton; }
  set editButton(value: string) { this._editButton = value; }

  get modalFirstName() { return this._modalFirstName; }
  set modalFirstName(value: string) { this._modalFirstName = value; }

  get modalLastName() { return this._modalLastName; }
  set modalLastName(value: string) { this._modalLastName = value; }

  get modalDependants() { return this._modalDependants; }
  set modalDependants(value: string) { this._modalDependants = value; }

  get updateButton() { return this._updateButton; }
  set updateButton(value: string) { this._updateButton = value; }
}

// ─── Delete Employee Modal ────────────────────────────────────────────────────
class DeleteEmployeeLocators {
  private _deleteButton = 'xpath=.//i[@class="fas fa-times"]';
  private _confirmDeleteButton = 'xpath=//button[@id="deleteEmployee"]';

  get deleteButton() { return this._deleteButton; }
  set deleteButton(value: string) { this._deleteButton = value; }

  get confirmDeleteButton() { return this._confirmDeleteButton; }
  set confirmDeleteButton(value: string) { this._confirmDeleteButton = value; }
}

// ─── Exports ──────────────────────────────────────────────────────────────────
export const loginLocators = new LoginLocators();
export const dashboardLocators = new DashboardLocators();
export const addEmployeeLocators = new AddEmployeeLocators();
export const editEmployeeLocators = new EditEmployeeLocators();
export const deleteEmployeeLocators = new DeleteEmployeeLocators();
