import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '../../../../app.context';

@Component({
    selector: 'app-analytics5',
    templateUrl: 'analytics5.component.html',
    styleUrls: ['analytics5.component.scss']
})

export class Analytics5Component implements OnInit {

    constructor(private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {
            route.params.subscribe(
                param => {
                    console.log(param?.domainId);
                }
            )
    }

    ngOnInit() {
    }
}
