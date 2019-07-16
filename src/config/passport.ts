import passport from 'passport';
import PassportFacebookToken from 'passport-facebook-token';
import { Strategy as PassportGoogleToken } from 'passport-google-token';
import { User } from '../models/user-model';
import { UserStatus, UserRoles } from './user';
import { ObjectId } from 'bson';
import { BadRequestError } from '../lib/errors';

/**
 * Registers Facebook passport.js auth strategy.
 */
export async function registerFacebookAuth() {
  passport.use(new PassportFacebookToken({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    profileFields: ['id', 'name', 'emails'],
  },
  async (accessToken, refreshToken, profile, response) => {
    try {
      const user = await User.findOne({ facebookId: profile.id });
      if (user) {
        return response(null, user);
      } else {
        /* Connect existing user with Facebook account by ID. */
        if (profile.emails && profile.emails[0]) {
          const existingUser = await User.findOne({ email: profile.emails[0].value });
          if (existingUser) {
            await existingUser.update({ facebookId: profile.id });
            return response(null, existingUser); 
          }
        }

        /* If user doesn't exists create new one. */
        const newUser = new User({
          username: `user${new ObjectId().toString()}`,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : 'none',
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          status: UserStatus.ACTIVE,
          roles: [ UserRoles.USER ],
          facebookId: profile.id
        });

        await newUser.save();
        return response(null, newUser);
      }
    } catch (error) {
      return response(error);
    }
  }));
}

/**
 * Registers Google passport.js auth strategy.
 */
export async function registerGoogleAuth() {
  passport.use(new PassportGoogleToken({
    clientID:   process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  async (accessToken: string, refreshToken: string, profile: any, response: (error: any, user?: any, info?: any) => void) => {

    /* Check if user has provided `access_token` with correct scopes. */
    if (!profile.id || 
        !profile.name || 
        !profile.name.familyName || 
        !profile.name.givenName || 
        !profile.emails || 
        !profile.emails[0] || 
        !profile.emails[0].value) {
      response(new BadRequestError('Invalid `access_token`. Please provide token with required scopes `profile` and `email`.'));
    }

    try {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        return response(null, user);
      } else {
        /* Connect existing user with Google account by ID. */
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
          await existingUser.update({ googleId: profile.id });
          return response(null, existingUser); 
        }

        /* If user doesn't exists create new one. */
        const newUser = new User({
          username: `user${new ObjectId().toString()}`,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          status: UserStatus.ACTIVE,
          roles: [ UserRoles.USER ],
          googleId: profile.id
        });

        await newUser.save();
        return response(null, newUser);
      }
    } catch (error) {
      return response(error);
    }
  }));
}
