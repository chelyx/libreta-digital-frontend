import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') required!: string | string[];

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef, private auth: AuthService) {}

  ngOnInit() {
    const roles = Array.isArray(this.required) ? this.required : [this.required];
    if (this.auth.hasRole(...(roles as any))) this.vcr.createEmbeddedView(this.tpl);
    else this.vcr.clear();
  }
}
