const { spawn } = require('child_process');

console.log('Starting Vite Dev Server...');
const _vite = spawn('npx.cmd', ['vite'], { cwd: __dirname, stdio: 'inherit', shell: true });

setTimeout(() => {
  console.log('Starting Localtunnel Public Bridge...');
  const _tunnel = spawn('npx.cmd', ['localtunnel', '--port', '5173'], { cwd: __dirname, stdio: 'inherit', shell: true });
}, 2000);

