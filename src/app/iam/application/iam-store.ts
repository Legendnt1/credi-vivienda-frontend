import {computed, Injectable, Signal, signal} from '@angular/core';
import {User} from '@iam/domain/model/user.entity';
import {IamApi} from '@iam/infrastructure/iam-api';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Role} from '@iam/domain/model/role.entity';
import {Setting} from '@iam/domain/model/setting.entity';

/**
 * IAM Store to manage users and roles state.
 */
@Injectable({
  providedIn: 'root'
})
export class IamStore {
  /**
   * Users signal.
   * @private
   */
  private readonly usersSignal = signal<User[]>([]);
  /**
   * Users readonly signal.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Roles signal.
   * @private
   */
  private readonly rolesSignal = signal<Role[]>([]);

  /**
   * Roles readonly signal.
   */
  readonly roles = this.rolesSignal.asReadonly();

  /**
   * Settings signal.
   * @private
   */
  private readonly settingsSignal = signal<Setting[]>([]);

  /**
   * Settings readonly signal.
   */
  readonly settings = this.settingsSignal.asReadonly();

  /**
   * Loading signal.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Loading readonly signal.
   */
  readonly loading = this.loadingSignal.asReadonly();
  /**
   * Error signal.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Error readonly signal.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * User count computed signal.
   */
  readonly userCount = computed(() => this.users().length);

  /**
   * Role count computed signal.
   */
  readonly roleCount = computed(() => this.roles().length);

  /**
   * Setting count computed signal.
   */
  readonly settingCount = computed(() => this.settings().length);

  /**
   * Session user signal.
   * @private
   */
  private readonly sessionUserSignal = signal<User | null>(null);

  /**
   * Session user readonly signal.
   */
  readonly sessionUser = this.sessionUserSignal.asReadonly();

  /**
   * Is authenticated computed signal.
   */
  readonly isAuthenticated = computed(() => !!this.sessionUser());

  /**
   * Role ID computed signal.
   */
  readonly roleId = computed(() => this.sessionUser()?.role_id ?? '');

  /**
   * Session user ID computed signal.
   */
  readonly sessionUserId = computed(() => this.sessionUser()?.id ?? 0);

  // Registration Flow

  /**
   * Register user signal.
   * @private
   */
  private readonly registerUserSignal = signal<User | null>(null);

  /**
   * Register role signal.
   * @private
   */
  private readonly registerRoleSignal = signal<string | null>(null);

  /**
   * Register user readonly signal.
   */
  readonly registerUser = this.registerUserSignal.asReadonly();

  /**
   * Register role readonly signal.
   */
  readonly registerRole = this.registerRoleSignal.asReadonly();

  /**
   * Constructor of the IAM Store.
   * @param iamApi - The IAM API service.
   */
  constructor(private iamApi: IamApi) {
    this.loadUsers();
    this.loadRoles();
    this.loadSettings();
    this.restoreSessionFromStorage();
  }

  /**
   * Logs in a user with the given email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   */
  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const tryFromMemory = () => {
      const user = this.users().find(u =>
        u.email === email && u.password === password);
      if (!user) {
        this.errorSignal.set('Correo electrónico o contraseña incorrectos');
        this.loadingSignal.set(false);
        return;
      }

      if (!password || password.length < 1) {
        this.errorSignal.set('La contraseña no puede estar vacía');
        this.loadingSignal.set(false);
        return;
      }

      const storedPassword = user.password ?? '';
      if (storedPassword !== password) {
        this.errorSignal.set('Correo electrónico o contraseña incorrectos');
        this.loadingSignal.set(false);
        return;
      }

      this.sessionUserSignal.set(user);
      this.saveSessionToStorage();
      console.log(`Usuario ${user.username} ha iniciado sesión correctamente.`);
      this.loadingSignal.set(false);
    };

    if (!this.userCount()) {
      this.iamApi.getUsers().pipe(retry(2), takeUntilDestroyed()).subscribe({
        next: users => {
          this.usersSignal.set(users);
          tryFromMemory();
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Error al cargar los usuarios. Por favor, intenta nuevamente.'));
          this.loadingSignal.set(false);
        }
      });
    } else {
      tryFromMemory();
    }
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    const username = this.sessionUser()?.username ?? 'unknown';
    this.sessionUserSignal.set(null);
    this.clearSessionStorage();
    console.log(`User ${username} has logged out.`);
  }

  /**
   * Checks if the given user ID matches the current session user ID.
   * @param userId - The ID of the user to check.
   * @returns True if the IDs match, false otherwise.
   */
  isCurrentUser(userId: number | null | undefined): boolean {
    const currentUserId = this.sessionUserId();
    if (!currentUserId || !userId) {
      return false;
    }
    return String(userId) === String(currentUserId);
  }

  /**
   * Restores the user session from local storage.
   * @private
   */
  private restoreSessionFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn('LocalStorage is not available.');
      return;
    }

    try {
      const sessionData = localStorage.getItem('credi-vivienda-session');
      if (!sessionData) {
        console.log('No session data found in localStorage.');
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(sessionData);
      } catch (parseError) {
        console.error('Failed to parse session data:', parseError);
        this.clearSessionStorage();
        return;
      }

      console.log('Parsed sessionData:', parsed);

      // Check if parsed data has the expected structure
      if (!parsed || typeof parsed !== 'object') {
        console.warn('Parsed data is not an object:', parsed);
        this.clearSessionStorage();
        return;
      }

      const { user: userData } = parsed;
      console.log('userData extracted:', userData);

      if (!userData || typeof userData !== 'object') {
        console.warn('No valid user data in session object:', userData);
        this.clearSessionStorage();
        return;
      }

      // Validate all required user data fields with detailed logging
      const validations = {
        hasValidId: typeof userData.id === 'number',
        hasValidUsername: typeof userData.username === 'string' && userData.username.length > 0,
        hasValidEmail: typeof userData.email === 'string' && userData.email.length > 0,
        hasValidRoleId: typeof userData.role_id === 'number'
      };

      console.log('Validation results:', validations);

      if (!validations.hasValidId || !validations.hasValidUsername ||
          !validations.hasValidEmail || !validations.hasValidRoleId) {
        console.warn('Invalid user data in session storage - Validation failed:', validations);
        console.warn('User data:', userData);
        this.clearSessionStorage();
        return;
      }

      console.log('User data is valid, creating User instance...');

      try {
        const user = new User({
          id: userData.id,
          username: userData.username,
          password: userData.password || '',
          enabled: userData.enabled ?? true,
          email: userData.email,
          address: userData.address || '',
          registration_date: userData.registration_date || new Date().toISOString(),
          name: userData.name || '',
          last_name: userData.last_name || '',
          dni: userData.dni || '',
          income: Number(userData.income) || 0,
          savings: Number(userData.savings) || 0,
          has_bond: userData.has_bond ?? false,
          has_home: userData.has_home ?? false,
          role_id: userData.role_id
        });
        this.sessionUserSignal.set(user);
        console.log('Session restored from localStorage for user:', user.username);
      } catch (userCreationError) {
        console.error('Error creating User instance:', userCreationError);
        this.clearSessionStorage();
      }
    } catch (error) {
      console.error('Unexpected error restoring session from localStorage:', error);
      this.clearSessionStorage();
    }
  }

  /**
   * Saves the current user session to local storage.
   */
  saveSessionToStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn('LocalStorage is not available.');
      return;
    }

    try {
      const user = this.sessionUser();

      if (user) {
        // Serialize user with public properties (getters) - ensure correct types
        const userPlainObject = {
          id: Number(user.id),
          username: String(user.username),
          password: String(user.password),
          enabled: Boolean(user.enabled),
          email: String(user.email),
          address: String(user.address || ''),
          registration_date: String(user.registration_date),
          name: String(user.name || ''),
          last_name: String(user.last_name || ''),
          dni: String(user.dni || ''),
          income: Number(user.income),
          savings: Number(user.savings),
          has_bond: Boolean(user.has_bond),
          has_home: Boolean(user.has_home),
          role_id: Number(user.role_id)
        };

        const sessionData = { user: userPlainObject, timestamp: Date.now() };
        localStorage.setItem('credi-vivienda-session', JSON.stringify(sessionData));
        console.log('Session saved to localStorage:', userPlainObject);
      }
    } catch (error) {
      console.error("Error saving session to localStorage:", error);
    }
  }

  /**
   * Clears the user session from local storage.
   * @private
   */
  private clearSessionStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn('LocalStorage is not available.');
      return;
    }

    try {
      localStorage.removeItem('credi-vivienda-session');
      console.log('Session data removed from local storage (corrupted or invalid data).');
      console.log('Please login again to create a new session.');
    } catch (error) {
      console.error('Error deleting session from localStorage:', error);
    }
  }

  /**
   * Gets a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns A signal of the user or undefined if not found.
   */
  getUserById(id: number | null | undefined): Signal<User | undefined> {
    return computed(() => id ? this.users().find(u => u.id === id) : undefined);
  }

  /**
   * Adds a new user.
   * @param user - The user to add.
   */
  addUser(user: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createUser(user).pipe().subscribe({
      next: (createdUser) => {
        this.usersSignal.set([...this.users(), createdUser]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at create new user'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Updates an existing user.
   * @param updatedUser - The user with updated information.
   */
  updateUser(updatedUser: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateUser(updatedUser).pipe(retry(2)).subscribe({
      next: user => {
        this.usersSignal.update(users =>
          users.map(u => u.id === user.id ? user : u))
        if (this.sessionUser()?.id === user.id) {
          this.sessionUserSignal.set(user);
          this.saveSessionToStorage();
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at update user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   */
  deleteUser(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteUser(id).pipe(retry(2)).subscribe({
      next: () => {
        this.usersSignal.update(users => users.filter(u => u.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at delete user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets a role by ID.
   * @param id - The ID of the role to retrieve.
   * @returns A signal of the role or undefined if not found.
   */
  getRoleById(id: number | null | undefined): Signal<Role | undefined> {
    return computed(() => id ? this.roles().find(r => r.id === id) : undefined);
  }

  /**
   * Adds a new role.
   * @param role - The role to add.
   */
  addRole(role: Role): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createRole(role).pipe(retry(2)).subscribe({
      next: (createdRole) => {
        this.rolesSignal.set([...this.roles(), createdRole]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at create new role'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Updates an existing role.
   * @param updatedRole - The role with updated information.
   */
  updateRol(updatedRole: Role): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateRole(updatedRole).pipe(retry(2)).subscribe({
      next: role => {
        this.rolesSignal.update(roles =>
          roles.map(r => r.id === role.id ? role : r))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at update role'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a role by ID.
   * @param id - The ID of the role to delete.
   */
  deleteRol(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteRol(id).pipe(retry(2)).subscribe({
      next: () => {
        this.rolesSignal.update(roles => roles.filter(r => r.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at delete role'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets a setting by ID.
   * @param id - The ID of the setting to retrieve.
   * @returns A signal of the setting or undefined if not found.
   */
  getSettingById(id: number | null | undefined): Signal<Setting | undefined> {
    return computed(() => id ? this.settings().find(s => s.id === id) : undefined);
  }

  /**
   * Gets a setting by user ID.
   * @param userId - The ID of the user.
   * @returns A signal of the setting or undefined if not found.
   */
  getSettingByUserId(userId: number | null | undefined): Signal<Setting | undefined> {
    return computed(() => userId ? this.settings().find(s => s.user_id === userId) : undefined);
  }

  /**
   * Gets the current session user's setting.
   * @returns A signal of the setting or undefined if not found.
   */
  getCurrentUserSetting(): Signal<Setting | undefined> {
    return computed(() => {
      const userId = this.sessionUserId();
      return userId ? this.settings().find(s => s.user_id === userId) : undefined;
    });
  }

  /**
   * Adds a new setting.
   * @param setting - The setting to add.
   */
  addSetting(setting: Setting): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createSetting(setting).pipe().subscribe({
      next: (createdSetting) => {
        this.settingsSignal.set([...this.settings(), createdSetting]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at create new setting'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Updates an existing setting.
   * @param updatedSetting - The setting with updated information.
   */
  updateSetting(updatedSetting: Setting): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateSetting(updatedSetting).pipe(retry(2)).subscribe({
      next: setting => {
        this.settingsSignal.update(settings =>
          settings.map(s => s.id === setting.id ? setting : s))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at update setting'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a setting by ID.
   * @param id - The ID of the setting to delete.
   */
  deleteSetting(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteSetting(id).pipe(retry(2)).subscribe({
      next: () => {
        this.settingsSignal.update(settings => settings.filter(s => s.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at delete setting'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads users from the API.
   * @private
   */
  private loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUsers().pipe(retry(2)).subscribe({
      next: users => {
        console.log('Users loaded:', users);
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at load users'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads roles from the API.
   * @private
   */
  private loadRoles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getRoles().pipe(retry(2)).subscribe({
      next: roles => {
        console.log('Roles loaded:', roles);
        this.rolesSignal.set(roles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at load roles'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads settings from the API.
   * @private
   */
  private loadSettings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getSettings().pipe(retry(2)).subscribe({
      next: settings => {
        console.log('Settings loaded:', settings);
        this.settingsSignal.set(settings);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error at load settings'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Format error messages.
   * @param error - The error object.
   * @param fallback - The fallback message.
   * @returns The formatted error message.
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Recurso no econtrado') ? `${fallback}: No econtrado` : error.message;
    }
    return fallback;
  }
}
