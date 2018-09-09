import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather';
  displayed = '';
  forecast = ''; 
  detail = '';
  isOpen = false
  umbrella = 'Open My Umbrella'; 
  codes = ['Rain', 'Showers'];
  constructor(private http: HttpClient) {}
  
  // Matching 
  nameHave = ""
  nameNeed = ""
  startHave = "" 
  endHave = ""
  startNeed = "" 
  endNeed = ""
  info = [] 

  // index assignments 
  name = 0 
  start = 1 
  end = 2
  role = 3

  matchy = 'Looking For A Match'
  
onClickButt() 
{
  this.displayed = ''
  this.detail = '' 

  var input = (<HTMLInputElement>document.getElementById("textbox")).value
  const yahoorl = 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition.text%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'
  const suffix = '%2C%20tx%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'

  var json= this.http.get(yahoorl+input+suffix).pipe(map(res => JSON.stringify(res))).subscribe(x => this.display(x))
}

display(thing)
{
  this.forecast = JSON.parse(thing).query.results.channel.item.condition.text
  this.displayed = 'Your forecast for today is '
  this.displayed += this.forecast.toLowerCase()
  this.displayed += ". " 
  if (this.codes.filter(x => x === this.forecast).length > 0)
  { 
    // it's raining 
    this.detail += "Yes, you should bring an umbrella!"
  }
  else {
    this.detail += "Not today!"
  }
}

// Close My Umbrella button 
umbrellaClose() 
{
  this.nameHave =(<HTMLInputElement>document.getElementById("nameHave")).value
  this.startHave = (<HTMLInputElement>document.getElementById("startHave")).value
  this.endHave = (<HTMLInputElement>document.getElementById("endHave")).value
  var person = [this.nameHave, this.startHave, this.endHave, "have"]
   
  this.umbrella = "Close My Umbrella"
  this.isOpen = false
  var person = [this.nameHave, this.startHave, this.endHave, "have"]
  while (this.info.indexOf(person) != -1)
  {
    this.info[this.info.indexOf(person)] = ["","","","deleted"]
  }
  
  this.matchy = this.checkForMatch() 
}

// Open My Umbrella 
umbrellaOpen() 
{
  this.nameHave =(<HTMLInputElement>document.getElementById("nameHave")).value
  this.startHave = (<HTMLInputElement>document.getElementById("startHave")).value
  this.endHave = (<HTMLInputElement>document.getElementById("endHave")).value
  var person = [this.nameHave, this.startHave, this.endHave, "have"]
  if (this.notAlreadyAdded(this.nameHave))
  {
    this.info.push(person)
    this.matchy = this.checkForMatch() 
  }  
}

// Find An Umbrella button 
giveMe() 
{
  this.nameNeed =(<HTMLInputElement>document.getElementById("nameNeed")).value
  this.startNeed = (<HTMLInputElement>document.getElementById("startNeed")).value
  this.endNeed = (<HTMLInputElement>document.getElementById("endNeed")).value
  var personInNeed = [this.nameNeed, this.startNeed, this.endNeed, "need"]
  if (this.notAlreadyAdded(this.nameNeed))
  {
    this.info.push(personInNeed)
    this.matchy = this.checkForMatch() 
  }  
}

// call this each time a button is pressed, and it will give you a result string to display on the screen
 checkForMatch() {
  var infoLen = this.info.length;
  if(infoLen < 2) {
      return "No matches right now."
  }
  else {
      for(var i=0; i < infoLen; i++) {
          var person1 = this.info[i];
          for(var j=i+1; j < infoLen; j++) {
              var person2 = this.info[j];
              if(this.areCompatible(person1, person2)) {
                  var needs, has;
                  if(person1[this.role] === "need"){
                      needs = person1;
                      has = person2;
                  }
                  else {
                      needs = person2;
                      has = person1;
                  }
                  this.info.splice(i, 1);
                  this.info.splice(j, 1);
                  return has[this.name] + " has agreed to share their umbrella with " + needs[this.name] + "!"
              }
          }
      }
      
      
  }
}


areCompatible(p1, p2) {
  if(p1[this.name] == "" || p2[this.name] == "") return false
  return (p1[this.start] == p2[this.start]) && (p1[this.end] == p2[this.end]) && (p1[this.role] != p2[this.role])
}

notAlreadyAdded(name) {
  for(var i=0; i<this.info.length; i++) {
      if(this.info[i][this.name] == name) {
        return false;
      }
  }
  return true;
}

}


