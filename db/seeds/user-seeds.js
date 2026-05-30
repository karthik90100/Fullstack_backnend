import { createUser } from '../../server/src/infra/db/users.js';

const seedAdmin = async () => {
  try {
    const user = await createUser(
      'karthik',
      'karthikkumar7011@gmail.com',
      'karthik123',
      1
    );

    console.log('Admin Created:', user);

  } catch (error) {
    console.error(error);
  }
};

seedAdmin();