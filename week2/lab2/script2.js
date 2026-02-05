function msg() {
    document.write("You clicked the button!");
}
function msg2() {
    document.write("Not that button!")
}
function change() {
    document.getElementById("my_text").innerHTML = "You clicked me";
}
var name = "Khrystyna";  // string type
var age = 19;  //Number type
var student = true; // Boolean type: Notice all lowercase true
document.write('Name: ' + name + '<br>');  // + is used for string concatentation
document.write('Age: ' + age + '<br>');  // Try using + with another number and see what happens!
document.write('Is student? ' + student + '<br>');

var year = 2;

function getYear() {
    switch (year) {
        case 1:
          document.write("You are in year 1")
          break;
        case 2:
            document.write("You are in year 2")
            break;
        case 3:
            document.write("You are in year 3")
            break;
        default:
            document.write("Not year")
      }
}
function loop() {
    for (var i = 1; i <= 20; i++) {
        document.write(i + '<br>')
      }
}