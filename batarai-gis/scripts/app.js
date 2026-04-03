const {spawn} = require('node:child_process');

//const data_to_pass_in = ['2026','01','20','10','12'];

const data_to_pass_in = ["202512150000","202512152359"]

console.log('Data sent', data_to_pass_in);

const python_process = spawn('python',['scripts/get_json_geodata.py',data_to_pass_in]);

python_process.stdout.on('data', (data) => {
    console.log(data.toString());
})

python_process.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});