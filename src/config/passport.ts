import passport from 'passport';
import PassportFacebookToken from 'passport-facebook-token';
import { User } from '../models/user-model';
import { UserStatus, UserRoles } from './user';
import { ObjectId } from 'bson';

/**
 * Registers Facebook passport.js auth strategy.
 */
export async function registerFacebookAuth() {
  passport.use(new PassportFacebookToken({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    profileFields: ['id', 'name', 'emails'],
  },
  async (accessToken, refreshToken, profile, response) => {
    try {
      const user = await User.findOne({ fbId: profile.id });
      if (user) {
        return response(null, user);
      } else {
        /* Connect existing user with Facebook account by ID. */
        if (profile.emails && profile.emails[0]) {
          const existingUser = await User.findOne({ email: profile.emails[0].value });
          if (existingUser) {
            await existingUser.update({ fbId: profile.id });
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
          fbId: profile.id
        });

        await newUser.save();
        return response(null, newUser);
      }
    } catch (error) {
      return response(error);
    }
  }));
}
