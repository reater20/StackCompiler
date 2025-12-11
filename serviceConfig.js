export const availableServices = [
  { name: 'Nginx (Web Server)', value: 'nginx' },
  { name: 'MySQL (Database)', value: 'mysql' },
  { name: 'PostgreSQL (Database)', value: 'postgres' },
  { name: 'Redis (Cache)', value: 'redis' },
  { name: 'phpMyAdmin (MySQL GUI)', value: 'phpmyadmin' },
  { name: 'MongoDB (NoSQL)', value: 'mongo' }
];

export const serviceTemplates = {
  nginx: {
    questions: [
      {
        type: 'input',
        name: 'port',
        message: 'Nginx: На каком хост-порту запустить?',
        default: '80',
      }
    ],
    generate: (answers) => ({
      image: 'nginx:latest',
      restart: 'always',
      ports: [`${answers.port}:80`],
      volumes: ['./nginx.conf:/etc/nginx/nginx.conf:ro']
    })
  },

  mysql: {
    questions: [
      {
        type: 'input',
        name: 'port',
        message: 'MySQL: Внешний порт?',
        default: '3306',
      },
      {
        type: 'password',
        name: 'root_password',
        message: 'MySQL: Root пароль?',
        default: 'root',
        mask: '*'
      },
      {
        type: 'input',
        name: 'database',
        message: 'MySQL: Имя базы данных?',
        default: 'app_db',
      }
    ],
    generate: (answers) => ({
      image: 'mysql:8.0',
      restart: 'always',
      ports: [`${answers.port}:3306`],
      environment: {
        MYSQL_ROOT_PASSWORD: answers.root_password,
        MYSQL_DATABASE: answers.database
      },
      volumes: ['db_data:/var/lib/mysql']
    })
  },

  postgres: {
    questions: [
      {
        type: 'input',
        name: 'port',
        message: 'PostgreSQL: Внешний порт?',
        default: '5432',
      },
      {
        type: 'input',
        name: 'user',
        message: 'PostgreSQL: Пользователь?',
        default: 'postgres',
      },
      {
        type: 'password',
        name: 'password',
        message: 'PostgreSQL: Пароль?',
        default: 'postgres',
        mask: '*'
      },
      {
        type: 'input',
        name: 'db',
        message: 'PostgreSQL: Имя базы?',
        default: 'app_db',
      }
    ],
    generate: (answers) => ({
      image: 'postgres:15-alpine',
      restart: 'always',
      ports: [`${answers.port}:5432`],
      environment: {
        POSTGRES_USER: answers.user,
        POSTGRES_PASSWORD: answers.password,
        POSTGRES_DB: answers.db
      },
      volumes: ['pg_data:/var/lib/postgresql/data']
    })
  },

  redis: {
    questions: [
      {
        type: 'input',
        name: 'port',
        message: 'Redis: Внешний порт?',
        default: '6379',
      }
    ],
    generate: (answers) => ({
      image: 'redis:alpine',
      restart: 'always',
      ports: [`${answers.port}:6379`],
      volumes: ['redis_data:/data']
    })
  },

  phpmyadmin: {
    questions: [
      {
        type: 'input',
        name: 'port',
        message: 'phpMyAdmin: Внешний порт?',
        default: '8080',
      }
    ],
    generate: (answers) => ({
      image: 'phpmyadmin/phpmyadmin',
      restart: 'always',
      ports: [`${answers.port}:80`],
      environment: {
        PMA_HOST: 'mysql', // Предполагаем, что сервис называется mysql
      },
      depends_on: ['mysql']
    })
  },

  mongo: {
    questions: [
      {
        type: 'input',
        name: 'port',
        message: 'MongoDB: Внешний порт?',
        default: '27017',
      },
      {
        type: 'input',
        name: 'user',
        message: 'MongoDB: Пользователь?',
        default: 'admin',
      },
      {
        type: 'password',
        name: 'password',
        message: 'MongoDB: Пароль?',
        default: 'secret',
        mask: '*'
      }
    ],
    generate: (answers) => ({
      image: 'mongo:latest',
      restart: 'always',
      ports: [`${answers.port}:27017`],
      environment: {
        MONGO_INITDB_ROOT_USERNAME: answers.user,
        MONGO_INITDB_ROOT_PASSWORD: answers.password
      },
      volumes: ['mongo_data:/data/db']
    })
  }
};