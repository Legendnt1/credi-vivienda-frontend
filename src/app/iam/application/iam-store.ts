import {computed, Injectable, Signal, signal} from '@angular/core';
import {User} from '@iam/domain/model/user.entity';
import {IamApi} from '@iam/infrastructure/iam-api';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

/**
 * Store para manejar el estado de IAM (Identity and Access Management).
 */
@Injectable({
  providedIn: 'root'
})
export class IamStore {
  /**
   * Lista de usuarios.
   * @private
   */
  private readonly usersSignal = signal<User[]>([]);
  /**
   * Usuarios registrados.
   */
  readonly users = this.usersSignal.asReadonly();
  /**
   * Indica si se está cargando información.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Estado de carga.
   */
  readonly loading = this.loadingSignal.asReadonly();
  /**
   * Mensaje de error.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Mensaje de error.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Cantidad de usuarios registrados.
   */
  readonly userCount = computed(() => this.users().length);

  /**
   * Usuario de la sesión actual.
   * @private
   */
  private readonly sessionUserSignal = signal<User | null>(null);

  /**
   * Usuario de la sesión actual.
   */
  readonly sessionUser = this.sessionUserSignal.asReadonly();

  /**
   * Indica si el usuario está autenticado.
   */
  readonly isAuthenticated = computed(() => !!this.sessionUser());

  /**
   * Identificador del rol del usuario en sesión.
   */
  readonly rolId = computed(() => this.sessionUser()?.rol_id ?? '');

  /**
   * Identificador del usuario en sesión.
   */
  readonly sessionUserId = computed(() => this.sessionUser()?.id ?? 0);

  // Flujo de registro y autenticación

  /**
   * Usuario registrado.
   * @private
   */
  private readonly registerUserSignal = signal<User | null>(null);

  /**
   * Rol del usuario registrado.
   * @private
   */
  private readonly registerRoleSignal = signal<string | null>(null);

  /**
   * Usuario registrado.
   */
  readonly registerUser = this.registerUserSignal.asReadonly();

  /**
   * Rol del usuario registrado.
   */
  readonly registerRole = this.registerRoleSignal.asReadonly();

  constructor(private iamApi: IamApi) {
    this.loadUsers();
  }


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
   * Define el usuario de la sesión actual.
   * @param userId - ID del usuario.
   */
  isCurrentUser(userId: number | null | undefined): boolean {
    const currentUserId = this.sessionUserId();
    if (!currentUserId || !userId) {
      return false;
    }
    return String(userId) === String(currentUserId);
  }

  /**
   * Restaura la sesión del usuario desde el almacenamiento local.
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
            enable: rawUser._enable,
            email: rawUser._email,
            direccion: rawUser._direccion,
            fecha_registro: rawUser._fecha_registro,
            nombre: rawUser._nombre,
            apellido: rawUser._apellido,
            dni: rawUser._dni,
            ingreso: rawUser._ingreso,
            ahorro: rawUser._ahorro,
            vivienda: rawUser._vivienda,
            rol_id: rawUser._rol_id
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
   * Guarda la sesión del usuario en el almacenamiento local.
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
   * Obtiene un usuario por su ID.
   * @param id - ID del usuario.
   */
  getUserById(id: number | null | undefined): Signal<User | undefined> {
    return computed(() => id ? this.users().find(u => u.id === id) : undefined);
  }

  /**
   * Agrega un nuevo usuario.
   * @param user - Usuario a agregar.
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
   * Actualiza un usuario existente.
   * @param updatedUser - Usuario con los datos actualizados.
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
   * Elimina un usuario por su ID.
   * @param id - ID del usuario a eliminar.
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
   * Carga la lista de usuarios desde la API.
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
   * Formatea el mensaje de error.
   * @param error - Error recibido.
   * @param fallback - Mensaje de respaldo.
   * @returns Mensaje de error formateado.
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Recurso no econtrado') ? `${fallback}: No econtrado` : error.message;
    }
    return fallback;
  }
}
