import { UserStatus, UserRoles } from '../../config/types';
import { InternalServerError } from '../../lib/errors';
import { User } from '../../models/user-mod';
import * as bcrypt from 'bcryptjs';

/**
 * Adds seed admin data to database.
 */
export async function seedAdminData() {
  const admin = new User({
    username: 'admin',
    email: process.env.SEED_ADMIN_EMAIL,
    password: bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD || '', bcrypt.genSaltSync(10)),
    firstName: 'adminFirstName',
    lastName: 'adminLastName',
    status: UserStatus.ACTIVE,
    roles: [UserRoles.USER],
  });

  try {
    await admin.save();
    console.log('│ Added admin seed data.');
  } catch (error) {
    throw new InternalServerError('There was a problem while creating admin.', error);
  }
}
