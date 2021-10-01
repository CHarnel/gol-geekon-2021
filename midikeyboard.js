var easymidi = require('easymidi');

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

console.log('inputs', inputs);
var input = new easymidi.Input('APC Key 25');
var output = new easymidi.Output('APC Key 25');


// { channel: 0, note: 32, velocity: 127, _type: 'noteon' }
// { channel: 0, note: 24, velocity: 127, _type: 'noteon' }
// { channel: 0, note: 16, velocity: 127, _type: 'noteon' }
// { channel: 0, note: 8, velocity: 127, _type: 'noteon' }
// { channel: 0, note: 0, velocity: 127, _type: 'noteon' }


let users = {   
}
users[0] = {} 
for (let i=0; i < 8; i++) {
    // users[0][32+i] = `u${i+1}_flash`
    // users[0][24+i] = `u${i+1}_none`
    // users[0][16+i] = `u${i+1}_red`
    // users[0][8+i] = `u${i+1}_green`
    // users[0][0+i] = `u${i+1}_blue`
    users[0][0+(i*4)] = `u${i+1}_flash`
    // users[0][1+i] = `u${i+1}_none`
    users[0][1+(i*4)] = `u${i+1}_red`
    users[0][2+(i*4)] = `u${i+1}_green`
    users[0][3+(i*4)] = `u${i+1}_blue`
}
users[1] = {} 


for (let i=0; i < 4; i++) {
    users[1][48+(i*4)] = `u${i+1+8}_flash`
    users[1][49+(i*4)] = `u${i+1+8}_red`
    users[1][50+(i*4)] = `u${i+1+8}_green`
    users[1][51+(i*4)] = `u${i+1+8}_blue`
}

// users[1][48] = `u${9}_flash`
// users[1][49] = `u${9}_none`
// users[1][50] = `u${9}_red`
// users[1][51] = `u${9}_green`
// users[1][52] = `u${9}_blue`


let delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {

    
    for(let i=0; i < 10; i++) {
        output.send('noteon', {
            note: i * 4,
            velocity: 2,
            channel: 0
        });
        await(delay(1))


        output.send('noteon', {
            note: (i * 4) + 1,
            velocity: 3,
            channel: 0
        });
        await(delay(1))

        output.send('noteon', {
            note: (i * 4) + 2,
            velocity: 1,
            channel: 0
        });
        await(delay(1))

        // output.send('noteon', {
        //     note: i,
        //     velocity: 1,
        //     channel: 0
        // });
        // await(delay(100))

        // output.send('noteon', {
        //     note: i,
        //     velocity: 5,
        //     channel: 0
        // });
        await(delay(100))
        console.log(i);
    }
      
}

run()



input.on('noteon', function (msg) {
    
    if (msg.channel === 0) {
        console.log(users[new Number(msg.channel)][msg.note])
    
    } else 
    if (msg.channel === 1) {
        console.log(users[new Number(msg.channel)][msg.note])
    
    } else {
    }
    console.log(msg);

    // if (msg.channel === 0) {
    //     if (msg.note === 32) {
    //         console.log('user 1:', 'flash');
    //     } else 
    //     if (msg.note === 24) {
    //         console.log('user 1:', 'none');
    //     } else 
    //     if (msg.note === 16) {
    //         console.log('user 1:', 'red');
    //     } else 
    //     if (msg.note === 8) {
    //         console.log('user 1:', 'green');
    //     } else 
    //     if (msg.note === 0) {
    //         console.log('user 1:', 'blue');
    //     }  
    // }


    // 
  // do something with msg
});