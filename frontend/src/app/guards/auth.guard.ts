import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function AuthGuard(router: Router): CanActivateFn {
  return () => {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  };
}
