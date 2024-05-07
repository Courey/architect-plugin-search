import { exec } from 'child_process';

function checkProcessStatus(pid) {
  return new Promise((resolve, reject) => {
    exec(`ps -p ${pid}`, (error, stdout, stderr) => {
      if (error) {
        resolve({ pid, running: false });
      } else {
        const processRunning = stdout.includes(pid.toString());
        resolve({ pid, running: processRunning });
      }
    });
  });
}

async function monitorProcess(pid, container) {
  try {
    const status = await checkProcessStatus(pid);
    if (!status.running){
      exec(`docker kill --signal SIGINT ${container}`)
      process.exit(0)
    }
  } catch (error) {
    console.error('Error checking process status:', error);
  }
}

const pidInput = process.argv[2];
const containerName = process.argv[3]

const intervalId = setInterval(() => {
  monitorProcess(parseInt(pidInput), containerName);
}, 30000);

// Leaving this in for development for now so I don't get zombies
setTimeout(() => {
  clearInterval(intervalId);
}, 300000);