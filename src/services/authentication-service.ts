import { Service } from './service';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user-mod';
import { UserStatus } from '../config/types';
import * as bcrypt from 'bcryptjs';

/**
 * JWT signatures types.
 */
export enum JwtSignTypes {
  REGISTRATION = 'registration',
  AUTHENTICATION = 'authentication',
  FORGOTTEN_PASSWORD = 'forgotten-password',
  CHANGE_EMAIL = 'change-email',
  CHANGE_USERNAME = 'change-username',
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
  async checkAuthUser(usernameOrEmail: string, password: string) {
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

  /**
   * Generates forgotten password registration token.
   * @param email User's email.
   */
  generateForgottenPasswordToken(email: string) {
    if (!email) {
      return null;
    }
    return jwt.sign({ email }, process.env.JWT_SECRET, {
      subject: JwtSignTypes.FORGOTTEN_PASSWORD,
      expiresIn: '2d',
    });
  }

  /**
   * Parses forgotten password token.
   * @param token Forgotten password token.
   */
  parseForgottenPasswordToken(token: string) {
    try {
      const { email } = jwt.verify(token, process.env.JWT_SECRET, {
        subject: JwtSignTypes.FORGOTTEN_PASSWORD,
      }) as any;

      if (email) {
        return {
          email: email as string,
        };
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('There was an error while parsing forgotten password token: ', error);
      return null;
    }
  }

  /**
   * Generates change email token.
   * @param id User's ID.
   * @param email User's new email.
   */
  generateChangeEmailToken(id: string, email: string) {
    if (!id || !email) {
      return null;
    }
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
      subject: JwtSignTypes.CHANGE_EMAIL,
      expiresIn: '2d',
    });
  }

  /**
   * Parses change email token.
   * @param token Change email token.
   */
  parseChangeEmailToken(token: string) {
    try {
      const { id, email } = jwt.verify(token, process.env.JWT_SECRET, {
        subject: JwtSignTypes.CHANGE_EMAIL,
      }) as any;

      if (id && email) {
        return {
          id: id as string,
          email: email as string,
        };
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('There was an error while parsing change email token: ', error);
      return null;
    }
  }

  /**
   * Generates change username token.
   * @param id User's ID.
   * @param username User's new username.
   */
  generateChangeUsernameToken(id: string, username: string) {
    if (!id || !username) {
      return null;
    }
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
      subject: JwtSignTypes.CHANGE_USERNAME,
      expiresIn: '2d',
    });
  }

  /**
   * Parses change username token.
   * @param token Change username token.
   */
  parseChangeUsernameToken(token: string) {
    try {
      const { id, username } = jwt.verify(token, process.env.JWT_SECRET, {
        subject: JwtSignTypes.CHANGE_USERNAME,
      }) as any;

      if (id && username) {
        return {
          id: id as string,
          username: username as string,
        };
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('There was an error while parsing change username token: ', error);
      return null;
    }
  }
}
