import path from 'path';
import fs from 'fs';

const configPath = path.resolve(__dirname, '../global.config.json');

class Config {
  private content: {
    [key: string]: string;
  };

  constructor() {
    if (fs.existsSync(configPath)) {
      const strContent: string = fs.readFileSync(configPath, 'utf8');
      this.content = JSON.parse(strContent);
    } else {
      this.content = {};
      fs.writeFileSync(configPath, JSON.stringify(this.content), {
        flag: 'w'
      });
    }
  }

  update(key: string, val: string) {
    this.content[key] = val;
    fs.writeFileSync(configPath, JSON.stringify(this.content), {
      flag: 'w'
    });
  }

  fetch(key: string): string {
    return this.content[key];
  }
}

export default new Config();
