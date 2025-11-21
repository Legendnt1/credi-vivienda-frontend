import {computed, Injectable, Signal, signal} from '@angular/core';
import {User} from '@iam/domain/model/user.entity';
import {IamApi} from '@iam/infrastructure/iam-api';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Role} from '@iam/domain/model/role.entity';

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
        this.errorSignal.set('Correo o contraseña incorrectos');
        this.loadingSignal.set(false);
        return;
      }

      if (!password || password.length <1) {
        this.errorSignal.set('Contraseña inválida');
        this.loadingSignal.set(false);
        return;
      }

      const storedPassword = user.password ?? '';
      if (storedPassword !== password) {
        this.errorSignal.set('Correo o contraseña incorrectos');
        this.loadingSignal.set(false);
        return;
      }

      this.sessionUserSignal.set(user);
      this.saveSessionToStorage();
      console.log(`Usuario ${user.username} ha iniciado sesión.`);
      this.loadingSignal.set(false);
    };

    if (!this.userCount()) {
      this.iamApi.getUsers().pipe(retry(2), takeUntilDestroyed()).subscribe({
        next: users => {
          this.usersSignal.set(users);
          tryFromMemory();
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Error al cargar los usuarios'));
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
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const { user: rawUser } = parsed;
        const hasUserData = rawUser && typeof rawUser._id === 'number';
        if (hasUserData) {
          const user = new User({
            id: rawUser._id,
            username: rawUser._username,
            password: rawUser._password,
            enabled: rawUser._enabled,
            email: rawUser._email,
            address: rawUser._address,
            registration_date: rawUser._registration_date,
            name: rawUser._name,
            last_name: rawUser._last_name,
            dni: rawUser._dni,
            income: rawUser._income,
            savings: rawUser._savings,
            has_bond: rawUser._has_bond,
            role_id: rawUser._role_id
          });
          this.sessionUserSignal.set(user);
          console.log("Sesión de usuario: ", user.username);
        } else {
          console.error('Invalid user data in session storage.');
          this.clearSessionStorage();
          console.log('Sesión de usuario eliminada debido a datos inválidos.');
        }
      } else {
        console.log('No hay sesión de usuario en el almacenamiento local.');
      }
    } catch (error) {
      console.error('Error al restaurar la sesión desde el Localstorage', error);
      this.clearSessionStorage();
    }
  }

  /**
   * Saves the current user session to local storage.
   * @private
   */
  private saveSessionToStorage(): void {
    try {
      const user = this.sessionUser();

      if (user) {
        const sessionData = { user, timestamp: Date.now() };
        localStorage.setItem('credi-vivienda-session', JSON.stringify(sessionData));
        console.log('Sesión de usuario guardada en el almacenamiento local.');
      }
    } catch (error) {
      console.warn("Error al guardar la sesión en el Localstorage", error);
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
      console.log('Sesión de usuario eliminada del almacenamiento local.');
    } catch (error) {
      console.error('Error al eliminar la sessión desde el Localstorage', error);
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
    this.iamApi.createUser(user).pipe(retry(2)).subscribe({
      next: (createdUser) => {
        this.usersSignal.set([...this.users(), createdUser]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error al crear el usuario'));
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
          this.saveSessionToStorage(); // Actualiza la sesión en el almacenamiento
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al actualizar el usuario'));
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
        this.errorSignal.set(this.formatError(err, 'Error al eliminar el usuario'));
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
   * Loads users from the API.
   * @private
   */
  private loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUsers().pipe(takeUntilDestroyed()).subscribe({
      next: users => {
        console.log(users);
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al cargar los usuarios'));
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
    this.iamApi.getRoles().pipe(takeUntilDestroyed()).subscribe({
      next: roles => {
        console.log(roles);
        this.rolesSignal.set(roles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Error al cargar los roles'));
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
