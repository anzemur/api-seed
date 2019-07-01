import { Service } from './service';
import * as jwt from 'jsonwebtoken';
import { User, UserModel } from '../models/user-model';
import { UserStatus } from '../config/user';
import * as bcrypt from 'bcryptjs';

/**
 * JWT signatures types.
 */
export enum JwtSignTypes {
  REGISTRATION = 'registration',
  AUTHENTICATION = 'authentication'
}

/**
 * Service for sending user authentication.
 */
export class AuthenticationService extends Service {

  constructor() {
    super(AuthenticationService.name);
  }

  /**
   * Checks if user can be authenticated.
   * @param usernameOrEmail Users username or email.
   * @param password Users password.
   */
  async  checkAuthUser(usernameOrEmail: string, password: string) {
    if (!usernameOrEmail || !password) {
      return null;
    }

    let user: any;
    try {
      user = await User.findOne({
        $or: [
          { username: usernameOrEmail, status  : UserStatus.ACTIVE },
          { email: usernameOrEmail, status  : UserStatus.ACTIVE }
        ]
      });
    } catch (error) {
      return null;
    }

    if (!user) {
      return null;
    }
    return {
      isAuthenticated: await this.comparePassword(user.password, password),
      user
    }; 
  }

  /**
   * Compares user's password with given one.
   * @param passwordHash Password hash to compare.
   * @param password Password to compare.
   */
  async comparePassword(passwordHash: string, password: string): Promise<boolean> {
    if (!passwordHash || !password) {
      return false;
    }
    return bcrypt.compare(password, passwordHash);
  }


  /**
   * Generates user's authentication token.
   * @param userId User's id.
   */
  generateAuthToken(userId: string) {
    if (!userId) {
      return null;
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      subject: JwtSignTypes.AUTHENTICATION,
      expiresIn: '1d',
    });
  }

  /**
   * Parses user's authentication token.
   * @param token Authentication token.
   */
  parseAuthToken(token: string) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET, {
        subject: JwtSignTypes.AUTHENTICATION,
      }) as any;

      return userId ? userId as string : null;
    } catch (error) {
      this.logger.error('There was an error while parsing authentication token: ', error);
      return null;
    }
  }

  /**
   * Generates new user registration token.
   * @param username User's username.
   * @param email User's email.
   * @param passwordHash User's hashed password.
   * @param firstName User's first name.
   * @param lastName User's last name.
   */
  generateRegistrationToken(username: string, email: string, passwordHash: string, firstName: string, lastName: string) {
    if (!username || !email || !passwordHash || !firstName || !lastName) {
      return null;
    }
    return jwt.sign({ username, email, passwordHash, firstName, lastName }, process.env.JWT_SECRET, {
      subject: JwtSignTypes.REGISTRATION,
      expiresIn: '2d',
    });
  }

  /**
   * Parses registration token.
   * @param token Registration token.
   */
  parseRegistrationToken(token: string) {
    try {
      const { username, email, passwordHash, firstName, lastName } = jwt.verify(token, process.env.JWT_SECRET, {
        subject: JwtSignTypes.REGISTRATION,
      }) as any;

      if (username && email && passwordHash && firstName && lastName) {
        return {
          username: username as string,
          email: email as string,
          passwordHash: passwordHash as string,
          firstName: firstName as string,
          lastName: lastName as string,
        };
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('There was an error while parsing registration token: ', error);
      return null;
    }
  }
}
