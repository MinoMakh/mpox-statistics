import { Component, OnInit, Query } from '@angular/core';
import { clearAppScopedEarlyEventContract } from '@angular/core/primitives/event-dispatch';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  ngOnInit(): void {
    // Header scrolling animation
    const header = document.getElementById('header')!;
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      let currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollTop = currentScroll <=0 ? 0 : currentScroll;
    });

    // Burger menu
    const hamMenu = document.querySelector('.ham-menu')!;

    const offScreenMenu = document.querySelector('.off-screen-menu')!;

    hamMenu.addEventListener('click', () => {
      hamMenu.classList.toggle('active');
      offScreenMenu.classList.toggle('active');
    })
  }

}
