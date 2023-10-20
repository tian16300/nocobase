import http from 'http';
import url from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

abstract class BaseClient<Client> {
  private createdDBs: Set<string> = new Set();
  protected _client: Client | null = null;

  abstract _createDB(name: string): Promise<void>;
  abstract _createConnection(): Promise<Client>;
  abstract _removeDB(name: string): Promise<void>;

  async createDB(name: string) {
    if (this.createdDBs.has(name)) {
      return;
    }

    if (!this._client) {
      this._client = await this._createConnection();
    }

    await this._createDB(name);
    this.createdDBs.add(name);
  }

  async releaseAll() {
    if (!this._client) {
      return;
    }

    const dbNames = Array.from(this.createdDBs);

    for (const name of dbNames) {
      console.log(`Removing database: ${name}`);
      await this._removeDB(name);
      this.createdDBs.delete(name);
    }
  }
}

class PostgresClient extends BaseClient<typeof pg.Client> {
  async _removeDB(name: string): Promise<void> {
    await this._client.query(`DROP DATABASE IF EXISTS ${name}`);
  }

  async _createDB(name: string): Promise<void> {
    await this._client.query(`DROP DATABASE IF EXISTS ${name}`);
    await this._client.query(`CREATE DATABASE ${name};`);
  }

  async _createConnection(): Promise<typeof pg.Client> {
    const client = new pg.Client({
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      user: process.env['DB_USER'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
    });

    await client.connect();
    return client;
  }
}

class MySQLClient extends BaseClient<any> {
  async _removeDB(name: string): Promise<void> {
    await this._client.query(`DROP DATABASE IF EXISTS ${name}`);
  }

  async _createDB(name: string): Promise<void> {
    await this._client.query(`CREATE DATABASE IF NOT EXISTS ${name}`);
  }

  async _createConnection(): Promise<mysql.Connection> {
    const connection = await mysql.createConnection({
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      user: process.env['DB_USER'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
    });

    return connection;
  }
}

const client = {
  postgres: () => {
    return new PostgresClient();
  },
  mysql: () => {
    return new MySQLClient();
  },
};

const dialect = process.env['DB_DIALECT'];

if (!client[dialect]) {
  throw new Error(`Unknown dialect: ${dialect}`);
}

const dbClient = client[dialect]();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  if (trimmedPath === 'acquire') {
    const via = parsedUrl.query.via as string;
    const name = parsedUrl.query.name as string | undefined;

    dbClient
      .createDB(name)
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
      })
      .catch((error) => {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error }));
      });
  } else if (trimmedPath === 'release') {
    dbClient
      .releaseAll()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
      })
      .catch((error) => {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error }));
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

server.listen(23450, '127.0.0.1', () => {
  console.log('Server is running at http://127.0.0.1:23450/');
});
