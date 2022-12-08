import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '../../../../app.context';

@Component({
    selector: 'app-analytics1',
    templateUrl: 'analytics1.component.html',
    styleUrls: ['analytics1.component.scss']
})

export class Analytics1Component implements OnInit {

    constructor(private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
    }
}
