let a = 0
let min = 0
let max = 128
let ever 
let t = 0
while(true){
    ever = (min + max) / 2
    t=t+1
    if(a > ever){
        min = ever
    } else if(a < ever){
        max = ever
    }
    if(a == ever){
        break
    }
}
console.log(t)