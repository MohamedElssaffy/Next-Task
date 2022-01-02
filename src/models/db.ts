import mongoose from 'mongoose';

const url = process.env.DB_URL;

mongoose
  .connect(url as string)
  .then((result) =>
    console.log(`DB is running on host: ${result.connection.host}`)
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
