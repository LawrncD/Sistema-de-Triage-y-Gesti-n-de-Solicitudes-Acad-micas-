import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    constructor(public router: Router) {}
}
