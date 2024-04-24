import askUser from 'ask-user';

askUser(process.argv[2]).then(answer => !answer && process.exit(1));