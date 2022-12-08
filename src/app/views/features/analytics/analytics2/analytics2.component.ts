import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '../../../../app.context';

@Component({
    selector: 'app-analytics2',
    templateUrl: 'analytics2.component.html',
    styleUrls: ['analytics2.component.scss']
})

export class Analytics2Component implements OnInit {

    constructor(private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
    }
}
