import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    given_name: {
      required: true,
      mutable: true,
    },
    family_name: {
      required: true,
      mutable: true,
    },
    birthdate: {
      required: true,
      mutable: false,
    },
    'custom:nationalId': {
      required: true,
      mutable: false,
    },
  },
});
