import Application from '../application';

export default (app: Application) => {
  app
    .command('db:sync')
    .auth()
    .action(async (...cliArgs) => {
      const [opts] = cliArgs;
      console.log('db sync...');
      const force = false;
      await app.db.sync({
        force,
        alter: {
          drop: force,
        },
      });
    });
};
