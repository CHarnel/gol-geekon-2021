
var myArgs = process.argv.slice(2);
var accurateInterval = require('accurate-interval');
let delay = ms => new Promise(r => setTimeout(r, ms));
var serviceUUIDs = ["03b80e5a-ede8-4b33-a751-6ce34ec4c700"]; // default: [] => all
const timeout = ms => new Promise(res => setTimeout(res, ms))
const noble = require('@abandonware/noble');

const LED_NUMBER = 5
const LED_INTENSITY = 120
const ledData = [0x80, 0x80, 0x90, LED_NUMBER, LED_INTENSITY];

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    await noble.startScanningAsync(serviceUUIDs, false);
  }
});

let args = myArgs[0].split(',')

let devices = args.map(x=>('saber_'+x))

console.log('myArgs: ', devices);

let devicesAdded = []

noble.on('discover', async (peripheral) => {
  console.log(`${peripheral.advertisement.localName}`)
  if (devices.includes(peripheral.advertisement.localName)) {
    let channel = 144 + new Number(peripheral.advertisement.localName .split('_')[1]) - 1
    midiData[2] = channel

    devicesAdded.push({
      name: peripheral.advertisement.localName, 
      channel: channel,
      peripheral: peripheral,
      characteristics: undefined,
      midiData: Uint8Array.from([...ledData])
    })
  }

  if (devicesAdded.length === devices.length) {
    console.log('all devices are here');
    console.log('stop scanning');
    await noble.stopScanningAsync();

    for (device in devicesAdded) {
      console.log('conectig');
      await devicesAdded[device].peripheral.connectAsync();
      console.log(device.name + ' conected');
      const {characteristics} = await devicesAdded[device].peripheral.discoverAllServicesAndCharacteristicsAsync();
      devicesAdded[device].characteristics = characteristics
      console.log(characteristics);
    }

    for (device of devicesAdded) {
      await device.characteristics[0].write( device.midiData , false, (error)=>{
        if (error){
          console.error(error)
        }
      })
      await delay(1000)
    }

    setTimeout(() => {
      process.exit(0)  
    }, 500);
    
  }
  
  setTimeout(() => {
    process.exit(0)  
  }, 60000)

})