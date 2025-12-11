import inquirer from 'inquirer';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { availableServices, serviceTemplates } from './serviceConfig.js';

console.log('--- Генератор Docker Compose ---\n');

async function main() {
  // 1. Выбор сервисов
  const { selectedServices } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedServices',
      message: 'Выберите сервисы для добавления в проект:',
      choices: availableServices,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'Вы должны выбрать хотя бы один сервис.';
        }
        return true;
      },
    },
  ]);

  const composeData = {
    version: '3.8',
    services: {},
    volumes: {}
  };

  // 2. Настройка каждого выбранного сервиса
  for (const serviceKey of selectedServices) {
    console.log(`\n--- Настройка ${serviceKey.toUpperCase()} ---`);
    
    const template = serviceTemplates[serviceKey];
    let answers = {};

    if (template.questions && template.questions.length > 0) {
      answers = await inquirer.prompt(template.questions);
    }

    // Генерация конфига сервиса
    const serviceConfig = template.generate(answers);
    composeData.services[serviceKey] = serviceConfig;

    // Сбор volumes (если есть именованные тома)
    if (serviceConfig.volumes) {
      serviceConfig.volumes.forEach(vol => {
        // Проверяем, является ли том именованным (не путь)
        const volName = vol.split(':')[0];
        if (!volName.includes('/') && !volName.includes('.')) {
          composeData.volumes[volName] = {}; // driver: local по умолчанию
        }
      });
    }
  }

  // Очистка volumes, если объект пуст
  if (Object.keys(composeData.volumes).length === 0) {
    delete composeData.volumes;
  }

  // 3. Генерация YAML
  try {
    const yamlStr = yaml.dump(composeData, {
      indent: 2,
      lineWidth: -1, // Не переносить длинные строки
      noRefs: true   // Отключить ссылки YAML
    });

    const outputPath = path.join(process.cwd(), 'docker-compose.yml');
    
    fs.writeFileSync(outputPath, yamlStr, 'utf8');

    console.log('\n=======================================');
    console.log(`Успешно! Файл создан: ${outputPath}`);
    console.log('=======================================');
    console.log('Сгенерированное содержимое:\n');
    console.log(yamlStr);

  } catch (e) {
    console.error('Ошибка при генерации файла:', e);
  }
}

main();