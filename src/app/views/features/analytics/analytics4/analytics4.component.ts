import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '../../../../app.context';

@Component({
    selector: 'app-analytics4',
    templateUrl: 'analytics4.component.html',
    styleUrls: ['analytics4.component.scss']
})

export class Analytics4Component implements OnInit {

    constructor(private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
    }
}
