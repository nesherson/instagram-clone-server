import app from './app';
import constants from './constants';

function start() {
  try {
    console.log(`Server is running on port: ${constants.PORT}`);
    app.listen(constants.PORT);
  } catch (error) {
    console.log('Unable to start the server.');
    process.exit(1);
  }
}

start();
