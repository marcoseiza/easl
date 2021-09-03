import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConnection = async (): Promise<Connection | null> => {
  let retries = 5;

  while (retries) {
    try {
      const config = await getConnectionOptions(process.env.NODE_ENV);
      const secureConfig = {
        ...config,
        name: "default",
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      };
      return createConnection(secureConfig);
    } catch (err) {
      console.error(err);
      retries--;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  return null;
}