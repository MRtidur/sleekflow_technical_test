export const usersForLogin = {
    valid: {email: 'sleekflowinterview@gmail.com', password: 'Abcde123#'},
    invalidEmail: {email: 'wrong@email.com', password: 'Abcde123#'},
    invalidPassword: {email: 'sleekflowinterview@gmail.com', password: 'wrongpass'}
}


// fixtures/users.ts
export const usersForSignup = {
  valid: {
    email: 'validuser@example.com',
    username: 'validuser',
    password: 'Valid123!' // satisfies 3+ conditions
  },
  registered: {
    email: 'sleekflowinterview@gmail.com'
  },
  invalidEmailEmpty: {
    email: '',
    username: 'testuser',
    password: 'Valid123!'
  },
  invalidEmailFormat: {
    email: 'invalidemail',
    username: 'testuser',
    password: 'Valid123!'
  },
  invalidEmailDomain: {
    email: 'pollan35063@aminating.com',
    username: 'testuser',
    password: 'Valid123!'
  },
  invalidUsernameEmpty: {
    email: 'test@example.com',
    username: '',
    password: 'Valid123!'
  },
  invalidPasswordEmpty: {
    email: 'test@example.com',
    username: 'testuser',
    password: ''
  },
  invalidPasswordTooShort: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'Ab1!' // <8 chars
  },
  invalidPasswordTooWeak: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'abcdefgh' // 8 chars but only lowercase (fails 3-of-4)
  }
};
